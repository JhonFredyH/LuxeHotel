import re
from datetime import datetime

from sqlalchemy.orm import Session

from models.room import Room, RoomUnit


def _extract_floor_start(floor_value: str | None) -> int:
    if not floor_value:
        return 1
    match = re.search(r"\d+", str(floor_value))
    return int(match.group()) if match else 1


def build_room_numbers_for_room(room: Room) -> list[str]:
    quantity = max(room.quantity or 1, 1)
    floor_start = _extract_floor_start(room.floor)
    return [f"{floor_start}{index:02d}" for index in range(1, quantity + 1)]


def ensure_room_units(db: Session, room: Room) -> list[RoomUnit]:
    desired_numbers = build_room_numbers_for_room(room)
    existing_units = (
        db.query(RoomUnit)
        .filter(RoomUnit.room_id == room.id)
        .order_by(RoomUnit.unit_number.asc())
        .all()
    )

    existing_by_number = {unit.unit_number: unit for unit in existing_units}
    changed = False

    for unit_number in desired_numbers:
        if unit_number not in existing_by_number:
            unit = RoomUnit(
                room_id=room.id,
                unit_number=unit_number,
                status="available",
            )
            db.add(unit)
            existing_units.append(unit)
            changed = True

    for unit in existing_units:
        if unit.unit_number not in desired_numbers:
            db.delete(unit)
            changed = True

    if changed:
        db.flush()
        existing_units = (
            db.query(RoomUnit)
            .filter(RoomUnit.room_id == room.id)
            .order_by(RoomUnit.unit_number.asc())
            .all()
        )

    return existing_units


def sync_all_room_units(db: Session, rooms: list[Room]) -> None:
    changed = False
    for room in rooms:
        before_count = db.query(RoomUnit.id).filter(RoomUnit.room_id == room.id).count()
        ensure_room_units(db, room)
        after_count = db.query(RoomUnit.id).filter(RoomUnit.room_id == room.id).count()
        if before_count != after_count:
            changed = True

    if changed:
        db.commit()


def refresh_room_status_from_units(room: Room, units: list[RoomUnit]) -> str:
    if not units:
        return room.status

    statuses = {unit.status for unit in units}
    if "occupied" in statuses:
        return "occupied"
    if "maintenance" in statuses:
        return "maintenance"
    if "cleaning" in statuses:
        return "cleaning"
    return "available"


def mark_unit_status(unit: RoomUnit, status: str) -> None:
    unit.status = status
    unit.updated_at = datetime.now()
    if status == "available":
        unit.last_cleaned_at = datetime.now()
