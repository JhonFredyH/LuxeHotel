import { Sparkles, Dumbbell, UtensilsCrossed, Briefcase, Wifi, Car, Coffee, Heart } from 'lucide-react';
import spa from '../assets/imagenes/amenities/spa.jpg'
import gym from '../assets/imagenes/amenities/gmy.jpg'
import pool from '../assets/imagenes/amenities/pool.jpg'
import restaurant from '../assets/imagenes/amenities/restaurant.jpg'
import parking from '../assets/imagenes/amenities/parking.jpg'
import business from '../assets/imagenes/amenities/bussines.png'
import room_services from '../assets/imagenes/amenities/room_services.jpg'
import wifi from '../assets/imagenes/amenities/wifi.jpg'
import concierge from '../assets/imagenes/amenities/concierge.jpg'



export const amenities = [
     {
    id: 1,
    icon: Sparkles,
    title: 'Spa & Wellness',   
    description: 'Rejuvenate your body and mind with our luxury spa treatments and holistic wellness programs.',
    image: spa,
    color: 'from-[#5a8a95] to-[#4a7885]',
  },
  {
    id: 2,
    icon: Dumbbell,
    title: 'Fitness Center',
    description: 'State-of-the-art equipment and personal trainers to maintain your fitness routine.',
    image: gym,
    color: 'from-[#5a8a95] to-[#4a7885]',
  },
  {
    id: 3,
    icon: UtensilsCrossed,
    title: 'Restaurant & Bar',
    description: 'Michelin-starred cuisine and craft cocktails in an elegant atmosphere.',
    image: restaurant,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    icon: Briefcase,
    title: 'Business Center',
    description: 'Fully equipped workspace with high-speed internet and meeting facilities.',
    image: business,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 5,
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Complimentary high-speed internet access throughout the entire property.',
    image: wifi,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 6,
    icon: Car,
    title: 'Valet Parking',
    description: 'Convenient valet service and secure parking for all guests.',
    image: parking,
    color: 'from-gray-600 to-gray-800'
  },
  {
    id: 7,
    icon: Coffee,
    title: '24/7 Room Service',
    description: 'Gourmet dining delivered to your suite at any hour of the day.',
    image: room_services,
    color: 'from-amber-600 to-orange-600'
  },
  {
    id: 8,
    icon: Heart,
    title: 'Concierge Service',
    description: 'Personalized assistance to curate unforgettable experiences during your stay.',
    image: concierge,
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 9,
    icon: Heart,
    title: 'Rooftop Pool',
    description: 'Our heated infinity pool offers breathking panoramic views of the city skyline.',
    image: pool,
    color: 'from-rose-500 to-pink-500'
  }
]