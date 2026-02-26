from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import get_db
from models.room import Room, RoomUnit
from auth import get_current_user
import uuid
import re

router = APIRouter(prefix="/rooms-admin", tags=["rooms-admin"])


class RoomUnitStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class RoomUnitCreate(BaseModel):
    unit_number: str
    status: str = "available"
    notes: Optional[str] = None


def slug_to_title(slug: str) -> str:
    return ' '.join(word.capitalize() for word in slug.split('-'))


def expand_rooms(rooms: list) -> list:
    result = []
    floor_counters = {}

    for room in rooms:
        floor = room.floor or "1"
        floor_num_match = re.search(r'\d+', str(floor))
        floor_num = int(floor_num_match.group()) if floor_num_match else 1

        qty = room.quantity or 1
        for i in range(qty):
            key = floor_num
            floor_counters[key] = floor_counters.get(key, 0) + 1
            room_number = f"{floor_num}{floor_counters[key]:02d}"

            result.append({
                "id": f"{room.id}-{i+1}",
                "room_type_id": str(room.id),
                "number": room_number,
                "name": room.name,
                "slug": room.slug,
                "type": slug_to_title(room.slug),
                "status": room.status,
                "price_per_night": float(room.price_per_night),
                "floor": room.floor,
                "view_type": room.view_type,
                "max_guests": room.max_guests,
                "image_url": room.image_url,
                "amenities": [a.label for a in room.amenities],
                "size_m2": room.size_m2,
                "rating": float(room.rating) if room.rating else 0.0,
            })

    return result


def build_room_numbers(rooms: list) -> dict:
    floor_counters = {}
    room_numbers_by_type = {}

    for room in rooms:
        floor = room.floor or "1"
        floor_num_match = re.search(r'\d+', str(floor))
        floor_num = int(floor_num_match.group()) if floor_num_match else 1

        qty = room.quantity or 1
        numbers = []
        for _ in range(qty):
            key = floor_num
            floor_counters[key] = floor_counters.get(key, 0) + 1
            numbers.append(f"{floor_num}{floor_counters[key]:02d}")
        room_numbers_by_type[str(room.id)] = numbers

    return room_numbers_by_type


@router.get("")
def get_rooms(
    floor: str = Query(None),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        query = db.query(Room).filter(Room.is_active == True)

        if floor and floor != "All":
            query = query.filter(Room.floor == floor)

        rooms = query.order_by(Room.floor, Room.name).all()
        room_numbers_by_type = build_room_numbers(rooms)
        result = []

        for room in rooms:
            room_data = {
                "id": str(room.id),
                "room_type_id": str(room.id),
                "name": room.name,
                "slug": room.slug,
                "type": slug_to_title(room.slug),
                "status": room.status,
                "price_per_night": float(room.price_per_night),
                "floor": room.floor,
                "view_type": room.view_type,
                "max_guests": room.max_guests,
                "image_url": room.image_url,
                "amenities": [a.label for a in room.amenities],
                "size_m2": room.size_m2,
                "rating": float(room.rating) if room.rating else 0.0,
                "quantity": room.quantity or 1,
                "room_numbers": room_numbers_by_type.get(str(room.id), []),
            }
            result.append(room_data)

        if status and status != "All":
            result = [r for r in result if r["status"] == status.lower()]

        return {"data": result, "total": len(result)}
    except Exception:
        import traceback
        print("ERROR EN /rooms-admin:", traceback.format_exc())
        raise


@router.get("/stats")
def get_room_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    rooms = db.query(Room).filter(Room.is_active == True).all()
    expanded = expand_rooms(rooms)

    stats = {"available": 0, "occupied": 0, "maintenance": 0, "cleaning": 0, "total": 0}
    for r in expanded:
        s = r["status"]
        if s in stats:
            stats[s] += 1
        stats["total"] += 1

    return stats


@router.get("/floors")
def get_floors(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    floors = db.query(Room.floor).filter(
        Room.is_active == True,
        Room.floor != None
    ).distinct().order_by(Room.floor).all()

    return {"floors": ["All"] + [f[0] for f in floors if f[0]]}


@router.patch("/{room_type_id}/status")
def update_room_status(
    room_type_id: str,
    body: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    valid = {"available", "occupied", "maintenance", "cleaning"}
    new_status = body.get("status", "").lower()

    if new_status not in valid:
        raise HTTPException(status_code=400, detail=f"Status inválido. Opciones: {valid}")

    room = db.query(Room).filter(Room.id == room_type_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")

    room.status = new_status
    db.commit()
    db.refresh(room)
    return {"ok": True, "status": room.status}


@router.get("/{room_id}/units")
def get_room_units(
    room_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    units = (
        db.query(RoomUnit)
        .filter(RoomUnit.room_id == room_id)
        .order_by(RoomUnit.unit_number)
        .all()
    )
    return [
        {
            "id": str(u.id),
            "unit_number": u.unit_number,
            "status": u.status,
            "notes": u.notes,
            "last_cleaned_at": u.last_cleaned_at,
            "updated_at": u.updated_at,
        }
        for u in units
    ]


@router.post("/{room_id}/units", status_code=201)
def create_room_unit(
    room_id: uuid.UUID,
    body: RoomUnitCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    existing = db.query(RoomUnit).filter(
        RoomUnit.room_id == room_id,
        RoomUnit.unit_number == body.unit_number
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="Unit number already exists for this room type")

    unit = RoomUnit(
        room_id=room_id,
        unit_number=body.unit_number,
        status=body.status,
        notes=body.notes,
    )
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return {"id": str(unit.id), "unit_number": unit.unit_number, "status": unit.status}


@router.patch("/units/{unit_id}/status")
def update_unit_status(
    unit_id: uuid.UUID,
    body: RoomUnitStatusUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    valid = {"available", "occupied", "maintenance", "cleaning"}
    if body.status not in valid:
        raise HTTPException(status_code=422, detail=f"Status must be one of {valid}")

    unit = db.query(RoomUnit).filter(RoomUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    unit.status = body.status
    unit.updated_at = datetime.now()
    if body.notes is not None:
        unit.notes = body.notes
    if body.status == "available":
        unit.last_cleaned_at = datetime.now()

    db.commit()
    db.refresh(unit)
    return {"id": str(unit.id), "unit_number": unit.unit_number, "status": unit.status}


@router.delete("/units/{unit_id}", status_code=204)
def delete_room_unit(
    unit_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    unit = db.query(RoomUnit).filter(RoomUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    db.delete(unit)
    db.commit()
