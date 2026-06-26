import React, { useState } from 'react';
import { ChevronLeft, Check, ChevronRight, Calendar } from 'lucide-react';

const SanctuaryRoomImproved = () => {
  // Datos de ejemplo de la habitación
  const room = {
    name: "Ocean View Suite",
    category: "Premium",
    size: 65,
    view: "Ocean",
    beds: "1 King",
    capacity: 2,
    price: 450,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&h=800&fit=crop"
    ],
    amenities: [
      "King-size bed with premium linens",
      "Private balcony with ocean views",
      "Marble bathroom with rain shower",
      "Smart TV with streaming services",
      "Nespresso coffee machine",
      "Mini bar and wine fridge",
      "High-speed WiFi",
      "Work desk with ergonomic chair"
    ]
  };

  const [currentImage, setCurrentImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [children, setChildren] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const nights = calculateNights();
  const serviceFee = 50;
  const total = (room.price * nights) + serviceFee;

  return (
    <div className="min-h-screen bg-white" id='prueba'>
      {/* Navigation Section */}
      <div className="bg-gradient-to-b from-amber-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <button className="flex items-center gap-2 hover:text-gray-900 transition-colors group">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Rooms & Suites</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{room.name}</span>
          </nav>

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full mb-4">
                {room.category} Suite
              </div>
              <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-4">
                Your Personal <span className="font-semibold">Sanctuary</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Experience refined luxury in our {room.name}, a curated haven designed 
                for peace, comfort, and unforgettable moments by the sea.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-sm text-gray-500 mb-1 tracking-wide">LUXE BOUTIQUE</div>
              <div className="text-xs text-gray-400 tracking-wider">RESORT</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Image Gallery + Content (3/5) */}
          <div className="lg:col-span-3">
            {/* Image Slider */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
              <img 
                src={room.images[currentImage]} 
                alt={room.name}
                className="w-full h-[500px] object-cover"
              />
              
              {/* Navigation Arrows */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <ChevronRight className="w-6 h-6 text-gray-900" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2">
                {room.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentImage 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/75 w-2'
                    }`}
                  />
                ))}
              </div>
              
              {/* Counter */}
              <div className="absolute top-6 right-6 bg-gray-900/75 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white">
                {currentImage + 1} / {room.images.length}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                About Your <span className="font-semibold">{room.name}</span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Immerse yourself in refined elegance with our {room.name}. This
                thoughtfully designed <span className="font-semibold">{room.size}m²</span> space 
                combines contemporary luxury with timeless comfort, featuring premium furnishings 
                and state-of-the-art amenities.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Wake up to stunning <span className="font-semibold">{room.view.toLowerCase()} views</span> and 
                enjoy a sanctuary designed for relaxation and rejuvenation. Every detail
                has been carefully curated to ensure your stay is nothing short
                of extraordinary.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Whether you're celebrating a special occasion or simply seeking escape, 
                the {room.name} provides the perfect backdrop for creating lasting memories.
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Room Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form (2/5) */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <div className="bg-amber-50 rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
                {/* Header */}
                <div className="bg-white px-6 py-5 border-b border-amber-100">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-gray-600 text-sm uppercase tracking-wide">From</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-gray-900">${room.price}</span>
                      <span className="text-gray-600 ml-1">/ night</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Book Your Stay</h3>
                  
                  {/* Check-in / Check-out */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                        Check-in
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="dd/mm/aaaa"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                        Check-out
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="dd/mm/aaaa"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guests / Children */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                        Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                        Children
                      </label>
                      <select
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value={0}>0 Child</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                      </select>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-amber-200">
                    <div className="flex justify-between text-gray-700">
                      <span>{nights} night{nights > 1 ? 's' : ''}</span>
                      <span className="font-medium">${room.price * nights}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Service fee</span>
                      <span className="font-medium">${serviceFee}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-amber-200">
                      <span>Total</span>
                      <span className="text-teal-600">${total}</span>
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4">
                    RESERVE NOW
                  </button>

                  {/* Cancellation Policy */}
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                    <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Cancellation Policy</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Free cancellation for 12 hours. After that, cancel before for a partial refund.
                      </p>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Best rate guaranteed • Free cancellation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gray-50 border-y border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-light text-gray-900">{room.size}m²</div>
              <div className="text-sm text-gray-600 mt-1 uppercase tracking-wide">Suite Size</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900">{room.beds}</div>
              <div className="text-sm text-gray-600 mt-1 uppercase tracking-wide">Bedding</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900">{room.capacity}</div>
              <div className="text-sm text-gray-600 mt-1 uppercase tracking-wide">Max Guests</div>
            </div>
            <div>
              <div className="text-3xl font-light text-gray-900">{room.view}</div>
              <div className="text-sm text-gray-600 mt-1 uppercase tracking-wide">View</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exclusive Benefits */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💎</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Exclusive Guest Benefits</h4>
              <ul className="text-blue-800 space-y-2">
                <li>• Complimentary welcome amenities and daily breakfast</li>
                <li>• Priority access to spa and dining reservations</li>
                <li>• Late checkout subject to availability</li>
                <li>• 24/7 concierge and in-room dining service</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanctuaryRoomImproved;