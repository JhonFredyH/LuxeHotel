from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date as date_type
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, EmailStr
from sqlalchemy import text

from database import SessionLocal
from models.user import User
from models.guest import Guest
from models.room import Room, RoomUnit
from models.reservation import Reservation, ReservationStatus
from routers import rooms


from schemas import (
    UserCreate, UserResponse, Token, LoginRequest,
    PaginatedUserResponse, GuestCreate, GuestResponse, PaginatedGuestResponse,
    RoomResponse, PaginatedRoomResponse, GuestRegister, GuestLogin,
    ReservationResponse, PaginatedReservationResponse  
)

from auth import hash_password, verify_password, create_access_token, get_current_user, require_admin
from utils.pagination import paginate

app = FastAPI(title="LuxeHotel API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Helper: sincronizar estado de room_unit ───────────────────
def sync_unit_status(db: Session, room_id, unit_number: Optional[str], new_status: str):
    """Busca la room_unit por room_id + unit_number y actualiza su status."""
    if not unit_number:
        return
    unit = (
        db.query(RoomUnit)
        .filter(RoomUnit.room_id == room_id, RoomUnit.unit_number == unit_number)
        .first()
    )
    if unit:
        unit.status = new_status
        from datetime import datetime
        unit.updated_at = datetime.now()


@app.get("/")
def read_root():
    return {"message": "LuxeHotel API - Hotel Management System", "version": "1.0.0"}


@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=Token)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role, "name": user.name}
    )
    return {"access_token": token, "token_type": "bearer"}


@app.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return {"message": "Perfil del usuario", "user": current_user}


@app.get("/users", response_model=PaginatedUserResponse)
def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if search:
        s = f"%{search}%"
        query = query.filter((User.name.ilike(s)) | (User.email.ilike(s)))
    query = query.order_by(User.created_at.desc())
    return paginate(query, page, limit)


@app.get("/rooms", response_model=PaginatedRoomResponse)
def get_rooms(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    is_active: Optional[bool] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    max_guests: Optional[int] = Query(None),
    view_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Room)
    if is_active is not None:
        query = query.filter(Room.is_active == is_active)
    if min_price is not None:
        query = query.filter(Room.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(Room.price_per_night <= max_price)
    if max_guests is not None:
        query = query.filter(Room.max_guests >= max_guests)
    if view_type:
        query = query.filter(Room.view_type.ilike(f"%{view_type}%"))
    query = query.order_by(Room.rating.desc(), Room.price_per_night.asc())
    result = paginate(query, page, limit)
    for room in result['data']:
        room.__dict__['amenities'] = [a.code for a in room.amenities]
    return result


# ============ SCHEMAS ============

class GuestReservationCreate(BaseModel):
    room_id: UUID
    room_number: Optional[str] = None
    check_in_date: date_type
    check_out_date: date_type
    adults: int
    children: int = 0
    special_requests: Optional[str] = None
    first_name: str
    last_name: str
    email: EmailStr
    phone: str

class ReservationConfirmation(BaseModel):
    reservation_id: UUID
    reference_number: str
    guest_name: str
    room_name: str
    check_in_date: date_type
    check_out_date: date_type
    nights: int
    total_amount: Decimal
    status: str
    message: str


# ============ HELPERS ============

def calculate_nights(check_in: date_type, check_out: date_type) -> int:
    return (check_out - check_in).days

def calculate_pricing(room_price: Decimal, nights: int) -> dict:
    subtotal    = Decimal(str(room_price)) * nights
    taxes       = subtotal * Decimal('0.10')
    service_fee = subtotal * Decimal('0.014')
    total       = subtotal + taxes + service_fee
    return {
        "subtotal":     round(subtotal, 2),
        "taxes":        round(taxes, 2),
        "service_fee":  round(service_fee, 2),
        "total_amount": round(total, 2),
    }

ROOM_NUMBER_TAG = "room_number::"

def build_special_requests(special_requests: Optional[str], room_number: Optional[str]) -> str:
    notes  = (special_requests or "").strip()
    number = (room_number or "").strip()
    if not number:
        return notes
    return f"{ROOM_NUMBER_TAG}{number}\n{notes}" if notes else f"{ROOM_NUMBER_TAG}{number}"

def split_special_requests(raw: Optional[str]) -> tuple[Optional[str], str]:
    raw = (raw or "").strip()
    if not raw:
        return None, ""
    lines = raw.splitlines()
    first = lines[0].strip()
    if first.lower().startswith(ROOM_NUMBER_TAG):
        room_number = first.split("::", 1)[1].strip() if "::" in first else ""
        notes       = "\n".join(lines[1:]).strip()
        return (room_number or None), notes
    return None, raw


# ============ RESERVATIONS ============

@app.post("/reservations", status_code=201)
def create_reservation_admin(
    reservation: GuestReservationCreate,
    db: Session = Depends(get_db)
):
    if reservation.check_out_date <= reservation.check_in_date:
        raise HTTPException(status_code=400, detail="Check-out must be after check-in")

    room = db.query(Room).filter(Room.id == reservation.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    guest = db.query(Guest).filter(Guest.email == reservation.email).first()
    if not guest:
        guest = Guest(
            first_name=reservation.first_name,
            last_name=reservation.last_name,
            email=reservation.email,
            phone=reservation.phone,
        )
        db.add(guest)
        db.flush()

    nights  = calculate_nights(reservation.check_in_date, reservation.check_out_date)
    pricing = calculate_pricing(room.price_per_night, nights)

    new_res = Reservation(
        guest_id=guest.id,
        room_id=reservation.room_id,
        check_in_date=reservation.check_in_date,
        check_out_date=reservation.check_out_date,
        adults=reservation.adults,
        children=reservation.children,
        status=ReservationStatus.confirmed,
        special_requests=build_special_requests(reservation.special_requests, reservation.room_number),
        subtotal=pricing["subtotal"],
        taxes=pricing["taxes"],
        service_fee=pricing["service_fee"],
        total_amount=pricing["total_amount"],
    )
    db.add(new_res)

    # ── Marcar la unidad como occupied ──────────────────────
    sync_unit_status(db, reservation.room_id, reservation.room_number, "occupied")

    db.commit()
    db.refresh(new_res)

    return {
        "id":             str(new_res.id),
        "guest_name":     f"{guest.first_name} {guest.last_name}",
        "room_name":      reservation.room_number or room.name,
        "check_in_date":  str(new_res.check_in_date),
        "check_out_date": str(new_res.check_out_date),
        "total_amount":   float(new_res.total_amount),
        "status":         new_res.status.value,
    }


@app.get("/reservations")
def get_reservations(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    from datetime import date
    today = date.today()
    query = db.query(Reservation)

    if status == "confirmed":
        query = query.filter(Reservation.status == ReservationStatus.confirmed)
    elif status == "pending":
        query = query.filter(Reservation.status == ReservationStatus.pending)
    elif status == "checked_in":
        query = query.filter(Reservation.check_in_date == today)
    elif status == "checked_out":
        query = query.filter(Reservation.check_out_date == today)
    elif status == "cancelled":
        query = query.filter(Reservation.status == ReservationStatus.cancelled)

    query  = query.order_by(Reservation.check_in_date.desc())
    result = paginate(query, page, limit)

    enriched = []
    for r in result["data"]:
        guest       = db.query(Guest).filter(Guest.id == r.guest_id).first()
        room        = db.query(Room).filter(Room.id == r.room_id).first()
        room_number, clean_notes = split_special_requests(r.special_requests)
        enriched.append({
            "id":               str(r.id),
            "guest_id":         str(r.guest_id),
            "room_id":          str(r.room_id),
            "guest_name":       f"{guest.first_name} {guest.last_name}" if guest else "—",
            "email":            guest.email if guest else "",
            "phone":            guest.phone if guest else "",
            "room_number":      room_number or (room.name if room else "—"),
            "room_type":        room.slug if room else "—",
            "check_in_date":    str(r.check_in_date),
            "check_out_date":   str(r.check_out_date),
            "status":           r.status.value,
            "total_price":      float(r.total_amount) if r.total_amount else 0,
            "adults":           r.adults,
            "children":         r.children,
            "special_requests": clean_notes,
        })

    return {"data": enriched, "total": result["total"], "page": result["page"], "limit": result["limit"]}


@app.put("/reservations/{reservation_id}")
def update_reservation(
    reservation_id: UUID,
    payload: dict,
    db: Session = Depends(get_db)
):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    current_room_number, current_notes = split_special_requests(reservation.special_requests)

    if "check_in_date" in payload:
        reservation.check_in_date = payload["check_in_date"]
    if "check_out_date" in payload:
        reservation.check_out_date = payload["check_out_date"]

    next_room_number = payload.get("room_number", current_room_number)
    next_notes       = payload.get("special_requests", current_notes)
    reservation.special_requests = build_special_requests(next_notes, next_room_number)

    db.commit()
    db.refresh(reservation)
    return {"message": "Reservation updated", "id": str(reservation.id)}


@app.post("/reservations/{reservation_id}/checkin")
def checkin_reservation(reservation_id: UUID, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if reservation.status not in [ReservationStatus.confirmed, ReservationStatus.pending]:
        raise HTTPException(status_code=400, detail=f"Cannot check-in: status is '{reservation.status.value}'")

    reservation.status = ReservationStatus.checked_in

    # ── Marcar unidad como occupied ──────────────────────────
    room_number, _ = split_special_requests(reservation.special_requests)
    sync_unit_status(db, reservation.room_id, room_number, "occupied")

    db.commit()
    return {"message": "Check-in successful", "status": reservation.status.value}


@app.post("/reservations/{reservation_id}/checkout")
def checkout_reservation(reservation_id: UUID, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if reservation.status != ReservationStatus.checked_in:
        raise HTTPException(status_code=400, detail=f"Cannot check-out: status is '{reservation.status.value}'")

    reservation.status = ReservationStatus.checked_out

    # ── Marcar unidad como cleaning (necesita limpieza tras checkout) ──
    room_number, _ = split_special_requests(reservation.special_requests)
    sync_unit_status(db, reservation.room_id, room_number, "cleaning")

    db.commit()
    return {"message": "Check-out successful", "status": reservation.status.value}


@app.post("/reservations/{reservation_id}/cancel")
def cancel_reservation(reservation_id: UUID, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    if reservation.status in [ReservationStatus.checked_out, ReservationStatus.cancelled]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel: status is '{reservation.status.value}'")

    reservation.status = ReservationStatus.cancelled

    # ── Liberar la unidad ────────────────────────────────────
    room_number, _ = split_special_requests(reservation.special_requests)
    sync_unit_status(db, reservation.room_id, room_number, "available")

    db.commit()
    return {"message": "Reservation cancelled", "status": reservation.status.value}


# ============ GUEST BOOKING (sin auth) ============

@app.post("/guest-booking", response_model=ReservationConfirmation)
def create_guest_reservation(reservation: GuestReservationCreate, db: Session = Depends(get_db)):
    if reservation.check_out_date <= reservation.check_in_date:
        raise HTTPException(status_code=400, detail="Check-out date must be after check-in date")

    room = db.query(Room).filter(Room.id == reservation.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    if not room.is_active:
        raise HTTPException(status_code=400, detail="This room is not available")

    total_guests = reservation.adults + reservation.children
    if total_guests > room.max_guests:
        raise HTTPException(status_code=400, detail=f"Maximum capacity is {room.max_guests} guests")

    guest = db.query(Guest).filter(Guest.email == reservation.email).first()
    if not guest:
        guest = Guest(
            first_name=reservation.first_name,
            last_name=reservation.last_name,
            email=reservation.email,
            phone=reservation.phone,
        )
        db.add(guest)
        db.flush()

    nights  = calculate_nights(reservation.check_in_date, reservation.check_out_date)
    pricing = calculate_pricing(room.price_per_night, nights)

    new_reservation = Reservation(
        guest_id=guest.id,
        room_id=reservation.room_id,
        check_in_date=reservation.check_in_date,
        check_out_date=reservation.check_out_date,
        adults=reservation.adults,
        children=reservation.children,
        status=ReservationStatus.pending,
        special_requests=build_special_requests(reservation.special_requests, reservation.room_number),
        subtotal=pricing['subtotal'],
        taxes=pricing['taxes'],
        service_fee=pricing['service_fee'],
        total_amount=pricing['total_amount'],
    )
    db.add(new_reservation)

    # ── Marcar unidad como occupied ──────────────────────────
    sync_unit_status(db, reservation.room_id, reservation.room_number, "occupied")

    db.commit()
    db.refresh(new_reservation)

    reference_number = f"LX-{new_reservation.id.hex[:8].upper()}"
    return ReservationConfirmation(
        reservation_id=new_reservation.id,
        reference_number=reference_number,
        guest_name=f"{guest.first_name} {guest.last_name}",
        room_name=room.name,
        check_in_date=new_reservation.check_in_date,
        check_out_date=new_reservation.check_out_date,
        nights=nights,
        total_amount=new_reservation.total_amount,
        status=new_reservation.status.value,
        message="Reservation created successfully! Check your email for confirmation.",
    )


# ============ GUESTS ============

@app.post("/guests", response_model=GuestResponse, status_code=201)
def create_guest(guest: GuestCreate, db: Session = Depends(get_db)):
    existing = db.query(Guest).filter(Guest.email == guest.email).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Ya existe un guest con el email '{guest.email}'")
    new_guest = Guest(
        first_name=guest.first_name, last_name=guest.last_name, email=guest.email,
        phone=guest.phone, document_type=guest.document_type, document_number=guest.document_number,
        date_of_birth=guest.date_of_birth, address=guest.address, city=guest.city,
        country=guest.country, notes=guest.notes,
    )
    db.add(new_guest)
    db.commit()
    db.refresh(new_guest)
    return new_guest


@app.get("/guests", response_model=PaginatedGuestResponse)
def get_guests(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Guest)
    if search:
        s = f"%{search}%"
        query = query.filter(Guest.first_name.ilike(s) | Guest.last_name.ilike(s) | Guest.email.ilike(s))
    query = query.order_by(Guest.created_at.desc())
    return paginate(query, page, limit)


@app.get("/guests/{guest_id}", response_model=GuestResponse)
def get_guest(guest_id: UUID, current_user: dict = Depends(require_admin), db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest no encontrado")
    return guest


@app.put("/guests/{guest_id}", response_model=GuestResponse)
def update_guest(guest_id: UUID, payload: GuestCreate, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest no encontrado")
    if payload.email != guest.email:
        dup = db.query(Guest).filter(Guest.email == payload.email).first()
        if dup:
            raise HTTPException(status_code=409, detail=f"El email '{payload.email}' ya está en uso")
    for field in ["first_name","last_name","email","phone","document_type","document_number","date_of_birth","address","city","country","notes"]:
        setattr(guest, field, getattr(payload, field))
    db.commit()
    db.refresh(guest)
    return guest


@app.delete("/guests/{guest_id}", status_code=204)
def delete_guest(guest_id: UUID, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest no encontrado")
    reservas = db.query(Reservation).filter(Reservation.guest_id == guest_id).count()
    if reservas > 0:
        raise HTTPException(status_code=409, detail=f"No se puede eliminar: el guest tiene {reservas} reserva(s)")
    db.delete(guest)
    db.commit()


@app.post("/guests/register", response_model=GuestResponse, status_code=201)
def register_guest(payload: GuestRegister, db: Session = Depends(get_db)):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    existing = db.query(Guest).filter(Guest.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Email '{payload.email}' is already registered")
    new_guest = Guest(
        first_name=payload.first_name, last_name=payload.last_name, email=payload.email,
        phone=payload.phone, document_type=payload.document_type, document_number=payload.document_number,
        date_of_birth=payload.date_of_birth, password_hash=hash_password(payload.password),
    )
    db.add(new_guest)
    db.commit()
    db.refresh(new_guest)
    return new_guest


@app.post("/guests/login", response_model=Token)
def login_guest(credentials: GuestLogin, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.email == credentials.email).first()
    if not guest or not guest.password_hash:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(credentials.password, guest.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(data={
        "sub": str(guest.id), "email": guest.email, "role": "guest",
        "name": f"{guest.first_name} {guest.last_name}",
    })
    return {"access_token": token, "token_type": "bearer"}


# ============ ROOMS REVIEWS ============

@app.get("/rooms/{room_id}/reviews")
def get_room_reviews(
    room_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    reviews = db.execute(text("""
        SELECT rev.id, rev.rating_overall, rev.rating_cleanliness, rev.rating_comfort,
               rev.rating_location, rev.rating_staff, rev.rating_value, rev.comment_title,
               rev.comment_text, rev.traveler_type, rev.would_recommend, rev.stay_date,
               rev.created_at,
               g.first_name || ' ' || SUBSTRING(g.last_name, 1, 1) || '.' AS guest_name
        FROM reviews rev
        JOIN guests g ON rev.guest_id = g.id
        WHERE rev.room_id = :room_id AND rev.verified = true
        ORDER BY rev.created_at DESC
        LIMIT :limit OFFSET :offset
    """), {"room_id": room_id, "limit": limit, "offset": (page - 1) * limit}).fetchall()

    total = db.execute(
        text("SELECT COUNT(*) FROM reviews WHERE room_id = :room_id AND verified = true"),
        {"room_id": room_id}
    ).scalar()

    return {"data": [dict(row._mapping) for row in reviews], "total": total, "page": page, "limit": limit}


# ============ DASHBOARD ============

@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    from datetime import date
    from sqlalchemy import func
    today = date.today()

    revenue_today = db.execute(text("""
        SELECT COALESCE(SUM(total_amount), 0) FROM reservations
        WHERE check_in_date = :today AND status NOT IN ('cancelled')
    """), {"today": today}).scalar() or 0

    total_rooms = db.execute(text("SELECT COUNT(*) FROM rooms WHERE is_active = true")).scalar() or 1
    occupied = db.execute(text("""
        SELECT COUNT(DISTINCT room_id) FROM reservations
        WHERE status IN ('confirmed', 'checked_in')
          AND check_in_date <= :today AND check_out_date > :today
    """), {"today": today}).scalar() or 0
    occupancy = round((occupied / total_rooms) * 100, 1)

    checkins_today = db.execute(text("""
        SELECT COUNT(*) FROM reservations
        WHERE check_in_date = :today AND status IN ('confirmed', 'pending', 'checked_in')
    """), {"today": today}).scalar() or 0

    active_guests = db.execute(text("""
        SELECT COUNT(*) FROM reservations
        WHERE status IN ('confirmed', 'checked_in')
          AND check_in_date <= :today AND check_out_date > :today
    """), {"today": today}).scalar() or 0

    return {
        "revenue":        float(revenue_today),
        "occupancy":      occupancy,
        "checkins_today": checkins_today,
        "active_guests":  active_guests,
    }


@app.get("/dashboard/revenue")
def get_dashboard_revenue(days: int = Query(30, ge=7, le=90), db: Session = Depends(get_db)):
    rows = db.execute(text("""
        SELECT check_in_date::date AS date, COALESCE(SUM(total_amount), 0) AS revenue
        FROM reservations
        WHERE status NOT IN ('cancelled')
          AND check_in_date >= CURRENT_DATE - INTERVAL ':days days'
        GROUP BY check_in_date::date
        ORDER BY check_in_date::date ASC
    """.replace(":days", str(days)))).fetchall()

    return {"data": [{"date": row[0].strftime("%b %d"), "revenue": float(row[1])} for row in rows]}
