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
from models.room import Room
from models.reservation import Reservation, ReservationStatus

from schemas import (
    UserCreate, UserResponse, Token, LoginRequest,
    PaginatedUserResponse, GuestResponse, PaginatedGuestResponse,
    RoomResponse, PaginatedRoomResponse
)
from auth import hash_password, verify_password, create_access_token, get_current_user, require_admin
from utils.pagination import paginate

app = FastAPI(title="LuxeHotel API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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
    """Login endpoint - devuelve JWT token"""
    
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=401, 
            detail="Email o contraseña incorrectos"
        )

    token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "name": user.name
        }
    )

    return {"access_token": token, "token_type": "bearer"}


@app.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    """Endpoint protegido - cualquier usuario autenticado puede acceder"""
    return {
        "message": "Perfil del usuario",
        "user": current_user
    }


# ============ ENDPOINTS CON PAGINACIÓN Y FILTROS ============

@app.get("/users", response_model=PaginatedUserResponse)
def get_users(
    page: int = Query(1, ge=1, description="Número de página"),
    limit: int = Query(20, ge=1, le=100, description="Items por página"),
    role: Optional[str] = Query(None, description="Filtrar por rol (admin/guest)"),
    search: Optional[str] = Query(None, description="Buscar por nombre o email"),
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Listar usuarios con paginación y filtros (solo admin)"""
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.name.ilike(search_filter)) | 
            (User.email.ilike(search_filter))
        )
    
    query = query.order_by(User.created_at.desc())
    result = paginate(query, page, limit)
    
    return result

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
    """Listar habitaciones con amenities"""
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
    
    query = query.order_by(Room.price_per_night.asc())
    result = paginate(query, page, limit)
    
    # Convertir amenities objects a codes
    for room in result['data']:
        # Guardar los códigos en un atributo temporal
        amenity_codes = [amenity.code for amenity in room.amenities]
        # Limpiar la relación para evitar confusión en la respuesta
        room.__dict__['amenities'] = amenity_codes
    
    return result



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
    """Listar habitaciones con amenities, rating y reviews"""
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
    
    # Agregar amenities a cada room
    for room in result['data']:
        amenity_codes = db.execute(
            """
            SELECT ra.code 
            FROM room_amenities ra
            JOIN room_amenity_map ram ON ram.amenity_id = ra.id
            WHERE ram.room_id = :room_id
            """,
            {"room_id": room.id}
        ).fetchall()
        
        room.amenities = [code[0] for code in amenity_codes]
    
    return result


# ============ SCHEMAS PARA RESERVA DE INVITADOS ============

class GuestReservationCreate(BaseModel):
    room_id: UUID
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


# ============ FUNCIONES AUXILIARES ============

def calculate_nights(check_in: date_type, check_out: date_type) -> int:
    """Calcula el número de noches"""
    return (check_out - check_in).days


def calculate_pricing(room_price: Decimal, nights: int) -> dict:
    """Calcula precios con impuestos y servicios"""
    subtotal = Decimal(str(room_price)) * nights
    taxes = subtotal * Decimal('0.10')  # 10% impuestos
    service_fee = subtotal * Decimal('0.014')  # 1.4% servicio
    total = subtotal + taxes + service_fee
    
    return {
        "subtotal": round(subtotal, 2),
        "taxes": round(taxes, 2),
        "service_fee": round(service_fee, 2),
        "total_amount": round(total, 2)
    }


# ============ ENDPOINT PARA RESERVA DE INVITADOS (SIN AUTENTICACIÓN) ============

@app.post("/guest-booking", response_model=ReservationConfirmation)
def create_guest_reservation(
    reservation: GuestReservationCreate,
    db: Session = Depends(get_db)
):
    """
    Crear reservación para invitado SIN autenticación
    
    Este endpoint permite hacer reservas sin estar registrado.
    """
    
    # 1. Validar fechas
    if reservation.check_out_date <= reservation.check_in_date:
        raise HTTPException(
            status_code=400,
            detail="Check-out date must be after check-in date"
        )
    
    # 2. Verificar que la habitación existe
    room = db.query(Room).filter(Room.id == reservation.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if not room.is_active:
        raise HTTPException(status_code=400, detail="This room is not available")
    
    # 3. Verificar capacidad
    total_guests = reservation.adults + reservation.children
    if total_guests > room.max_guests:
        raise HTTPException(
            status_code=400,
            detail=f"This room has a maximum capacity of {room.max_guests} guests"
        )
    
    # 4. Crear o buscar guest por email
    guest = db.query(Guest).filter(Guest.email == reservation.email).first()
    
    if not guest:
        guest = Guest(
            first_name=reservation.first_name,
            last_name=reservation.last_name,
            email=reservation.email,
            phone=reservation.phone
        )
        db.add(guest)
        db.flush()
    
    # 5. Calcular precios
    nights = calculate_nights(reservation.check_in_date, reservation.check_out_date)
    pricing = calculate_pricing(room.price_per_night, nights)
    
    # 6. Crear reservación
    new_reservation = Reservation(
        guest_id=guest.id,
        room_id=reservation.room_id,
        check_in_date=reservation.check_in_date,
        check_out_date=reservation.check_out_date,
        adults=reservation.adults,
        children=reservation.children,
        status=ReservationStatus.pending,
        special_requests=reservation.special_requests,
        subtotal=pricing['subtotal'],
        taxes=pricing['taxes'],
        service_fee=pricing['service_fee'],
        total_amount=pricing['total_amount']
    )
    
    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)
    
    # 7. Generar número de referencia
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
        message="Reservation created successfully! Check your email for confirmation."
    )
    
@app.get("/rooms/{room_id}/reviews")
def get_room_reviews(
    room_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Obtener reviews de una habitación específica"""
    
    # Verificar que la habitación existe
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # ⭐ AGREGAR text() aquí
    reviews = db.execute(
        text("""
        SELECT 
            rev.id,
            rev.rating_overall,
            rev.rating_cleanliness,
            rev.rating_comfort,
            rev.rating_location,
            rev.rating_staff,
            rev.rating_value,
            rev.comment_title,
            rev.comment_text,
            rev.traveler_type,
            rev.would_recommend,
            rev.stay_date,
            rev.created_at,
            g.first_name || ' ' || SUBSTRING(g.last_name, 1, 1) || '.' AS guest_name
        FROM reviews rev
        JOIN guests g ON rev.guest_id = g.id
        WHERE rev.room_id = :room_id 
          AND rev.verified = true
        ORDER BY rev.created_at DESC
        LIMIT :limit OFFSET :offset
        """),
        {
            "room_id": room_id,
            "limit": limit,
            "offset": (page - 1) * limit
        }
    ).fetchall()
    
    # ⭐ AGREGAR text() aquí también
    total = db.execute(
        text("SELECT COUNT(*) FROM reviews WHERE room_id = :room_id AND verified = true"),
        {"room_id": room_id}
    ).scalar()
    
    return {
        "data": [dict(row._mapping) for row in reviews],
        "total": total,
        "page": page,
        "limit": limit
    }