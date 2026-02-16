import uuid
from datetime import datetime, time
from decimal import Decimal
from sqlalchemy import String, Text, Numeric, Integer, Time, Boolean, DateTime, Table, Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


# Tabla intermedia para la relación N:M entre rooms y amenities
room_amenity_map = Table(
    'room_amenity_map',
    Base.metadata,
    Column('room_id', UUID(as_uuid=True), ForeignKey('rooms.id', ondelete='CASCADE'), primary_key=True),
    Column('amenity_id', UUID(as_uuid=True), ForeignKey('room_amenities.id', ondelete='CASCADE'), primary_key=True)
)


class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    rating = Column(Numeric(2, 1), default=0.0)
    total_reviews = Column(Integer, default=0)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    price_per_night: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    size_m2: Mapped[int | None] = mapped_column(Integer)
    view_type: Mapped[str | None] = mapped_column(String(50))
    floor: Mapped[str | None] = mapped_column(String(30))
    max_adults: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    max_children: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    max_guests: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    quantity: Mapped[int | None] = mapped_column(Integer, default=1)
    image_url = Column(Text)
    check_in_time: Mapped[time | None] = mapped_column(Time)
    check_out_time: Mapped[time | None] = mapped_column(Time)
    cancellation_policy: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now()
    )

    # Relación con amenities
    amenities: Mapped[list["RoomAmenity"]] = relationship(
        "RoomAmenity",
        secondary=room_amenity_map,
        back_populates="rooms"
    )


class RoomAmenity(Base):
    __tablename__ = "room_amenities"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    label: Mapped[str] = mapped_column(String(100), nullable=False)

    # Relación con rooms
    rooms: Mapped[list["Room"]] = relationship(
        "Room",
        secondary=room_amenity_map,
        back_populates="amenities"
    )