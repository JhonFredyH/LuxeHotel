import HeroSection from "../components/HeroSection";
import BookingBar from "../components/BookingBar";
import AmenitySection from "../components/AmenitiesSection";
import RoomSection from "../components/RoomSection";
import Contact from "../pages/Contact";
import Footer from "../pages/Footer";
import { useRooms } from "../context/RoomContext";

const Hero = () => {
  const { rooms, loading, error } = useRooms();

  // Filtrar solo las 3 habitaciones premium específicas
  const premiumRooms = rooms.filter(room => 
    ['deluxe-suite', 'garden-view-terrace', 'the-penthouse'].includes(room.id)
  );

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-teal-700 font-semibold text-lg tracking-wide">LuxeHotel</p>
        <p className="text-gray-400 text-sm">Preparing your experience...</p>
        <p className="text-gray-300 text-xs mt-2">First load may take up to 30s</p>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* TOP / HOME */}
      <section id="top">
        <HeroSection />
      </section>

      {/* BOOKING */}
      <BookingBar />

      {/* AMENITIES */}
      <section id="Amenities">
        <AmenitySection />
      </section>

      {/* ROOMS */}
      <section id="rooms">
        <RoomSection premiumRooms={premiumRooms} />
      </section>

      {/* CONTACT */}
      <section id="contact">
        <Contact />
      </section>

      {/* FOOTER / ABOUT */}
      <footer id="footer">
        <Footer />
      </footer>
    </>
  );
};

export default Hero;