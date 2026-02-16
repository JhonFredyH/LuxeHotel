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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-teal-700">Loading...</p>
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