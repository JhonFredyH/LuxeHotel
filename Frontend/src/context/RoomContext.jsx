import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const RoomContext = createContext();

// Cambiar de arrow function a function declaration
/* eslint-disable react-refresh/only-export-components */
export function useRooms() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRooms must be used within RoomProvider");
  }
  return context;
}

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/rooms");

      // Mapear datos del backend al formato del frontend
      const mappedRooms = response.data.data.map((room) => ({
        id: room.slug,
        uuid: room.id,
        name: room.name,
        description: room.description,
        price: room.price_per_night,
        size: room.size_m2,
        view: room.view_type,
        floor: room.floor,
        maxGuests: room.max_guests,
        maxAdults: room.max_adults,
        maxChildren: room.max_children,
        quantity: room.quantity,
        isActive: room.is_active,
        image: room.image_url || null,
        images: [],
        rating: parseFloat(room.rating) || 0,
        reviews: room.total_reviews || 0,
        amenities: room.amenities || [],
        beds: {},
        shortDescription: room.description,
        bedConfiguration: "",
        capacity: {
          adults: room.max_adults,
          children: room.max_children,
          maxGuests: room.max_guests,
          extraBed: true,
        },
        cancellationPolicy: "Free cancellation up to 24 hours before arrival",
        checkIn: "15:00",
        checkOut: "12:00",
      }));

      setRooms(mappedRooms);
      setError(null);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to load rooms");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const getRoomBySlug = (slug) => {
    return rooms.find((room) => room.id === slug);
  };

  const getRoomByUUID = (uuid) => {
    return rooms.find((room) => room.uuid === uuid);
  };

  const premiumRooms = rooms.filter((room) => room.price >= 400);
  const compactRooms = rooms.filter((room) => room.price < 400);

  return (
    <RoomContext.Provider
      value={{
        rooms,
        premiumRooms,
        compactRooms,
        loading,
        error,
        getRoomBySlug,
        getRoomByUUID,
        refreshRooms: fetchRooms,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
