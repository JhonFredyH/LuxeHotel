// amenityIcons.js
// Mapeo de amenidades a componentes de Lucide React

import {
  Wifi,
  Tv,
  Coffee,
  Lock,
  Home,
  Waves,
  Heart,
  Wind,
  Sofa,
  Briefcase,
  Shirt,
  Utensils,
  Wine,
  Volume2,
  Gamepad2,
  Zap,
  RotateCcw,
  Sun,
  Smile,
  Shield,
  Snowflake,
  Sparkles,
  ClipboardList,
  Dumbbell,
} from "lucide-react";

// Mapeo de amenidades a componentes de Lucide
export const amenityIconsMap = {
  // Básicos
  "wifi": Wifi,
  "smart-tv": Tv,
  "minibar": Coffee,
  "coffee": Coffee,
  "safe": Lock,
  "balcony": Home,
  
  // Piscina y agua
  "private-pool": Waves,
  "pool": Waves,
  "jacuzzi": Heart,
  
  // Habitación
  "climate": Wind,
  "living-room": Sofa,
  "desk": Briefcase,
  "wardrobe": Shirt,
  
  // Cocina y comedor
  "kitchen": Utensils,
  "dining-room": Utensils,
  "bar": Wine,
  
  // Entretenimiento
  "sound-system": Volume2,
  "games": Gamepad2,
  "console": Gamepad2,
  
  // Bienestar y spa
  "spa": Sparkles,
  "gym": Dumbbell,
  
  // Servicios
  "laundry": RotateCcw,
  "outdoor-seating": Sun,
  "kids-club": Smile,
};

// Función para obtener el componente de icono correcto
export const getAmenityIcon = (amenity) => {
  const normalizedAmenity = amenity.toLowerCase().trim();
  
  // Búsqueda exacta primero
  if (amenityIconsMap[normalizedAmenity]) {
    return amenityIconsMap[normalizedAmenity];
  }
  
  // Búsqueda parcial si no hay coincidencia exacta
  for (const [key, IconComponent] of Object.entries(amenityIconsMap)) {
    if (normalizedAmenity.includes(key) || key.includes(normalizedAmenity)) {
      return IconComponent;
    }
  }
  
  // Icono por defecto (Shield)
  return Shield;
};

// Función para obtener el nombre legible de la amenidad
export const getAmenityLabel = (amenity) => {
  const labels = {
    "wifi": "WiFi",
    "smart-tv": "Smart TV",
    "minibar": "Mini Bar",
    "coffee": "Coffee Maker",
    "safe": "Safe",
    "balcony": "Balcony",
    "private-pool": "Private Pool",
    "pool": "Pool Access",
    "jacuzzi": "Jacuzzi",
    "climate": "Climate Control",
    "living-room": "Living Room",
    "desk": "Work Desk",
    "wardrobe": "Wardrobe",
    "kitchen": "Kitchen",
    "dining-room": "Dining Room",
    "bar": "Bar",
    "sound-system": "Sound System",
    "games": "Board Games",
    "console": "Game Console",
    "spa": "Spa Access",
    "gym": "Gym Access",
    "laundry": "Laundry",
    "outdoor-seating": "Outdoor Seating",
    "kids-club": "Kids Club",
  };
  
  const normalized = amenity.toLowerCase().trim();
  return labels[normalized] || amenity.charAt(0).toUpperCase() + amenity.slice(1).replace(/-/g, ' ');
};
