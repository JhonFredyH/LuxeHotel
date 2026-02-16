from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime, date
from datetime import date as date_type
from typing import List, Optional
from models import UserRole
from decimal import Decimal
from uuid import UUID



class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.guest


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ============ PAGINATION SCHEMAS ============
class PaginationParams(BaseModel):
    page: int = 1
    limit: int = 20


class PaginatedUserResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    data: List[UserResponse]


# ============ GUEST SCHEMAS ============
class GuestCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    document_type: Optional[str] = None
    document_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    notes: Optional[str] = None


class GuestResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    phone: str
    document_type: Optional[str]
    document_number: Optional[str]
    date_of_birth: Optional[date]
    address: Optional[str]
    city: Optional[str]
    country: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedGuestResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    data: List[GuestResponse]


# ============ ROOM SCHEMAS ============
class RoomResponse(BaseModel):
    id: UUID
    slug: str
    name: str
    description: Optional[str]
    price_per_night: float
    size_m2: Optional[int]
    view_type: Optional[str]
    floor: Optional[str]
    max_adults: int
    max_children: int
    max_guests: int
    quantity: Optional[int]
    image_url: Optional[str]
    rating: Optional[Decimal] = Decimal('0.0')
    total_reviews: Optional[int] = 0
    amenities: Optional[List[str]] = []
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedRoomResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    data: List[RoomResponse]


# ============ RESERVATION SCHEMAS ============
class ReservationResponse(BaseModel):
    id: UUID
    guest_id: UUID
    room_id: UUID
    check_in_date: date
    check_out_date: date
    adults: int
    children: int
    status: str
    special_requests: Optional[str]
    subtotal: float
    taxes: float
    service_fee: float
    total_amount: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaginatedReservationResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    data: List[ReservationResponse]
    

# ============ SCHEMAS PARA RESERVAS ============

class GuestReservationCreate(BaseModel):
    # Datos de la habitación y fechas
    room_id: UUID
    check_in_date: date_type
    check_out_date: date_type
    adults: int
    children: int = 0
    special_requests: Optional[str] = None
    
    # Datos del huésped
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