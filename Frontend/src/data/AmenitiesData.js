import {
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  Briefcase,
  Wifi,
  Car,
  Coffee,
  Heart,
} from "lucide-react";
import spa from "../assets/imagenes/amenities/spa.jpg";
import gym from "../assets/imagenes/amenities/gmy.jpg";
import pool from "../assets/imagenes/amenities/pool.jpg";
import restaurant from "../assets/imagenes/amenities/restaurant.jpg";
import parking from "../assets/imagenes/amenities/parking.jpg";
import business from "../assets/imagenes/amenities/bussines.png";
import room_services from "../assets/imagenes/amenities/room_services.jpg";
import wifi from "../assets/imagenes/amenities/wifi.jpg";
import concierge from "../assets/imagenes/amenities/concierge.jpg";

export const amenities = [
  {
    id: 1,
    icon: Sparkles,
    title: "Spa & Wellness",
    subtitle: "Serenity Spa Rituals",
    description:
      "Immerse yourself in a sanctuary of tranquility where ancient healing rituals meet modern luxury. From signature massages and revitalizing facials to personalized wellness journeys, our spa is designed to restore balance, calm the mind, and awaken the senses.",
    image: spa,
    color: "from-[#5a8a95] to-[#4a7885]",
  },
  
  {
    id: 2,
    icon: UtensilsCrossed,
    title: "Restaurant & Bar",
    subtitle: "The Art of Fine Dining",
    description:
      "Indulge in an extraordinary culinary journey crafted by world-class chefs. From refined gourmet dishes to handcrafted cocktails, every detail is thoughtfully curated to deliver an unforgettable fine dining experience.",
    image: restaurant,
    color: "from-green-500 to-emerald-500",
  },
   {
    id: 3,
    icon: Heart,
    title: "Rooftop Pool",
    subtitle:"Skyline Infinity Escape",
    description:
      "Unwind in our heated infinity rooftop pool overlooking breathtaking panoramic city views. Whether basking under the sun or enjoying an evening swim, this elevated oasis offers pure relaxation and sophistication.",
    image: pool,
    color: "from-rose-500 to-pink-500",
  },
  {
    id: 4,
    icon: Briefcase,
    title: "Business Center",
    description:
      "Designed for the modern executive, our fully equipped business center offers private meeting rooms, high-speed connectivity, and seamless services to ensure productivity in an elegant and discreet environment.",
    image: business,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 5,
    icon: Wifi,
    title: "High-Speed WiFi",
    subtitle: "connectivity",
    description:
      "Enjoy seamless connectivity throughout the entire property with ultra-fast, secure internet access—perfect for business meetings, streaming entertainment, or staying connected with loved ones around the world.",
    image: wifi,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: 6,
    icon: Car,
    title: "Valet Parking",
     subtitle: "concierge & travel",
    description:
      "Arrive with ease and depart in style. Our professional valet team provides secure, attentive parking services, ensuring convenience and peace of mind from the moment you step onto the property.",
    image: parking,
    color: "from-gray-600 to-gray-800",
  },
  {
    id: 7,
    icon: Coffee,
    title: "24/7 Room Service",
    description:
      "Savor exquisite cuisine in the comfort and privacy of your suite. Our round-the-clock room service offers a curated menu of gourmet selections prepared with the finest ingredients at any hour.",
    image: room_services,
    color: "from-amber-600 to-orange-600",
  },
  {
    id: 8,
    icon: Heart,
    title: "Concierge Service",
    description:
      "Our dedicated concierge team is at your service to curate bespoke experiences—from exclusive reservations and private tours to personalized recommendations—ensuring every moment of your stay is extraordinary.",
    image: concierge,
    color: "from-rose-500 to-pink-500",
  }, 
  {
    id: 9,
    icon: Dumbbell,
    title: "Fitness Center",
    subtitle: "High-Performance Gym",
    description:
      "Maintain your wellness routine in our state-of-the-art fitness center featuring premium equipment, private training sessions, and invigorating workout spaces designed to energize both body and mind.",
    image: gym,
    color: "from-[#5a8a95] to-[#4a7885]",
  },
];
