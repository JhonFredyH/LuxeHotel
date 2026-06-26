import deluxe from "../assets/imagenes/room/deluxe.jpg";
import deluxe_2 from "../assets/imagenes/room/deluxe_2.jpg";
import deluxe_3 from "../assets/imagenes/room/deluxe_3.jpeg";
import deluxe_4 from "../assets/imagenes/room/deluxe_4.jpeg";
import deluxe_5 from "../assets/imagenes/room/deluxe_5.jpeg";
import garden from "../assets/imagenes/room/garden.png";
import penthouse from "../assets/imagenes/room/pentHouse_1.jpg";
import grand from "../assets/imagenes/room/grand.jpg";
import single from "../assets/imagenes/room/single.jpg"
import double from "../assets/imagenes/room/double.jpg"
import family from "../assets/imagenes/room/family.png"
import grand_presidencial from "../assets/imagenes/room/grand_presidencial.jpg"
import presidential_penthouse from "../assets/imagenes/room/presidencial_suite.jpg"

export const premiumRooms = [
  {
    id: "deluxe-suite",
    name: "Deluxe Suite",
    description:
      "An elegant urban retreat featuring panoramic city views, premium furnishings, and smart-room technology designed for modern luxury comfort.",
    shortDescription:
      "A refined contemporary experience in the heart of the city. The Deluxe Suite blends modern design, state-of-the-art technology, and thoughtfully planned spaces to deliver absolute comfort. Ideal for travelers seeking sophistication, privacy, and an exclusive urban atmosphere.",
    price: 450,
    image: deluxe,
    images: [deluxe, deluxe_2, deluxe_3, deluxe_4, deluxe_5],
    size: 45,
    view: "City",
    floor: "15-20",
    rating: 4.6,
    reviews: 3847,
    amenities: [
      "balcony",
      "minibar",
      "smart-tv",
      "safe",
      "coffee",
      "climate",
      "wifi",
      "workspace",
      "lounge-access",
      "signature-bedding",
      "pillow-menu",
      "turndown-service"
    ],
    bedConfiguration: "1 King Bed + Sofa Bed",
    beds: { king: 1, sofaBed: 1 },
    capacity: { adults: 2, children: 1, maxGuests: 3, extraBed: true },
    cancellationPolicy: "Free cancellation up to 24 hours before arrival",
    checkIn: "15:00",
    checkOut: "12:00",
  },

  {
    id: "garden-view-terrace",
    name: "Garden View Terrace",
    description:
      "A tranquil luxury suite featuring a private terrace overlooking landscaped gardens, combining indoor elegance with outdoor relaxation and wellness-focused amenities.",
    shortDescription:
      "A tranquil escape within the city. The Garden View Terrace offers a unique connection to nature through its private terrace and relaxing green views. Designed for guests who value calmness, fresh air, and luxury in an exclusive natural setting.",
    price: 720,
    image: garden,
    images: [garden],
    size: 80,
    view: "Garden",
    floor: "1-3",
    rating: 4.8,
    reviews: 2156,
    amenities: [
      "balcony",
      "private-pool",
      "smart-tv",
      "sound-system",
      "minibar",
      "climate",
      "living-room",
      "coffee",
      "jacuzzi",
      "outdoor-seating",
      "wifi",
      "smart-lighting",
      "lounge-access",
      "signature-bedding",
      "turndown-service"
    ],
    beds: { king: 1 },
    capacity: { adults: 2, children: 2, maxGuests: 4, extraBed: true },
    checkIn: "14:00",
    checkOut: "12:00",
  },

  {
    id: "the-penthouse",
    name: "The Penthouse",
    description:
      "An iconic ultra-luxury residence featuring rooftop experiences, panoramic skyline views, and exclusive high-end hospitality designed for prestigious stays.",
    shortDescription:
      "The ultimate expression of luxury and exclusivity. The Penthouse redefines the hotel experience with expansive spaces, high-end architectural design, and premium amenities. Perfect for guests seeking privacy, prestige, and a truly extraordinary stay..",
    price: 1600,
    image: penthouse,
    images: [penthouse],
    size: 180,
    view: "Panoramic",
    floor: "Rooftop",
    rating: 4.9,
    reviews: 892,
    amenities: [
      "private-pool",
      "smart-tv",
      "bar",
      "kitchen",
      "dining-room",
      "balcony",
      "jacuzzi",
      "spa",
      "gym",
      "wardrobe",
      "wifi",
      "premium-minibar",
      "private-dining",
      "signature-bedding",
      "pillow-menu",
      "turndown-service",
      "butler-on-request"
    ],
    beds: { king: 2, sofaBed: 1 },
    capacity: { adults: 4, children: 2, maxGuests: 6, extraBed: true },
    checkIn: "12:00",
    checkOut: "14:00",
  },
];

export const compactRooms = [
  {
    id: "single-sanctuary",
    name: "Single Sanctuary",
    description:
      "A refined personal retreat offering smart design, premium bedding, and modern connectivity for independent urban travelers.",
    shortDescription:
      "An intimate and elegant space designed for independent travelers. Single Sanctuary offers smart comfort, modern functionality, and a cozy atmosphere perfect for relaxing after a day in the city.",
    price: 120,
    image: single,
    images: [single],
    size: 25,
    view: "City",
    floor: "8-12",
    rating: 4.3,
    reviews: 5621,
    amenities: [
      "smart-tv",
      "desk",
      "coffee",
      "minibar",
      "safe",
      "wifi",
      "climate",
      "signature-bedding"
    ],
    beds: { queen: 1 },
    capacity: { adults: 1, children: 1, maxGuests: 2, extraBed: false },
  },

  {
    id: "double-elegance",
    name: "Double Elegance",
    description:
      "A stylish and comfortable shared space featuring warm contemporary interiors, premium bedding, and curated comfort amenities.",
    shortDescription:
      "The perfect balance between comfort and sophistication. Double Elegance is designed for sharing special moments in a modern, warm, and functional environment, with details that elevate the hospitality experience.",
    price: 220,
    image: double,
    images: [double],
    size: 40,
    view: "Garden",
    floor: "5-10",
    rating: 4.5,
    reviews: 4293,
    amenities: [
      "smart-tv",
      "minibar",
      "balcony",
      "desk",
      "coffee",
      "safe",
      "pool-access",
      "wifi",
      "climate",
      "signature-bedding"
    ],
    beds: { king: 1 },
    capacity: { adults: 2, children: 1, maxGuests: 3, extraBed: true },
  },

  {
    id: "grand-panoramic-suite",
    name: "Grand Panoramic Suite",
    description:
      "A spacious premium suite with panoramic urban views, elegant interiors, and abundant natural light designed for elevated comfort.",
    shortDescription:
      "Spaciousness, natural light, and stunning urban views define the Grand Panoramic Suite. A space created for guests who want a premium experience with the perfect balance of luxury, comfort, and contemporary style.",
    price: 420,
    image: grand,
    images: [grand],
    size: 60,
    view: "Panoramic",
    floor: "18-22",
    rating: 4.7,
    reviews: 2847,
    amenities: [
      "smart-tv",
      "living-room",
      "minibar",
      "climate",
      "balcony",
      "desk",
      "coffee",
      "safe",
      "spa-access",
      "wifi",
      "signature-bedding",
      "turndown-service"
    ],
    beds: { king: 1, sofaBed: 1 },
    capacity: { adults: 2, children: 2, maxGuests: 4, extraBed: true },
  },

  {
    id: "family-hearth",
    name: "Family Hearth",
    description:
      "A spacious family luxury suite offering multi-zone living, entertainment amenities, and comfort-focused design for memorable shared stays.",
    shortDescription:
      "The ideal place to stay together as a family without compromising luxury. Family Hearth offers spacious layouts, smart functionality, and amenities designed for all ages, creating a warm and memorable environment.",
    price: 520,
    image: family,
    images: [family],
    size: 75,
    view: "City",
    floor: "4-8",
    rating: 4.6,
    reviews: 3156,
    amenities: [
      "smart-tv",
      "kitchen",
      "balcony",
      "dining-room",
      "laundry",
      "family-services",
      "games",
      "console",
      "wifi",
      "climate",
      "signature-bedding"
    ],
    beds: { king: 1, twin: 2 },
    capacity: { adults: 2, children: 3, maxGuests: 5, extraBed: true },
  },

  {
    id: "presidential-suite",
    name: "Presidential Suite",
    description:
      "A prestigious luxury residence offering grand living spaces, refined design, and elevated hospitality for distinguished guests.",
    shortDescription:
      "A symbol of prestige and distinction. The Presidential Suite combines exclusive design, grand spaces, and high-level services, creating an experience tailored for guests who expect the very best in luxury hospitality.",
    price: 1700,
    image: grand_presidencial,
    images: [grand_presidencial],
    size: 140,
    view: "City",
    floor: "20-25",
    rating: 4.8,
    reviews: 2100,
    amenities: [
      "smart-tv",
      "kitchen",
      "balcony",
      "dining-room",
      "laundry",
      "spa-access",
      "bar",
      "workspace",
      "wifi",
      "lounge-access",
      "signature-bedding",
      "turndown-service"
    ],
    beds: { king: 3, twin: 2 },
    capacity: { adults: 5, children: 3, maxGuests: 8, extraBed: true },
  },

  {
    id: "presidential-penthouse",
    name: "Presidential Penthouse",
    description:
      "The ultimate ultra-luxury urban residence offering unmatched privacy, private pool experiences, and elite personalized hospitality.",
    shortDescription:
      "A masterpiece of urban luxury. This space delivers total privacy, exceptional architectural design, and personalized experiences that redefine premium hospitality living..",
    price: 2400,
    image: presidential_penthouse,
    images: [presidential_penthouse],
    size: 175,
    view: "Panoramic",
    floor: "Rooftop",
    rating: 4.9,
    reviews: 2156,
    amenities: [
      "smart-tv",
      "kitchen",
      "balcony",
      "dining-room",
      "laundry",
      "private-pool",
      "spa",
      "bar",
      "gym",
      "wifi",
      "butler-service",
      "private-chef-optional",
      "private-transport-optional",
      "signature-bedding",
      "pillow-menu",
      "turndown-service"
    ],
    beds: { king: 3, twin: 2 },
    capacity: { adults: 5, children: 3, maxGuests: 8, extraBed: true },
  },
];

export const allRooms = [...premiumRooms, ...compactRooms];

export const getRoomTypeById = (id) =>
  allRooms.find((room) => room.id === id);


