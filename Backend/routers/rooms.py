from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models.room import Room
from auth import get_current_user
import re

router = APIRouter(prefix="/rooms-admin", tags=["rooms-admin"])


def slug_to_title(slug: str) -> str:
    """presidential-penthouse → Presidential Penthouse"""
    return ' '.join(word.capitalize() for word in slug.split('-'))


def expand_rooms(rooms: list) -> list:
    """
    Expande cada tipo de habitación en N habitaciones físicas
    según su quantity, asignando números como 101, 102...
    """
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
        result = expand_rooms(rooms)

        if status and status != "All":
            result = [r for r in result if r["status"] == status.lower()]

        return {"data": result, "total": len(result)}
    except Exception as e:
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