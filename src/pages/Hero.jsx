// Hero.jsx
import HeroSection from "../components/HeroSection";
import BookingBar from "../components/BookingBar";
import AmenitySection from "../components/AmenitiesSection";
import RoomSection from "../components/RoomSection";
import { premiumRooms } from "../data/RoomData";
import Contact from "../pages/Contact";
import Footer from "../pages/Footer";

const Hero = () => {
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
