import { useNavigate } from "react-router-dom";
import RoomCard from "./room/RoomCard";
import { MoveRight } from 'lucide-react';

const RoomSection = ({ premiumRooms }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F4F1E8] min-h-screen py-2" id="rooms">
      <section className=" w-[90%] mx-auto " >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl mt-4">
           <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
              Our <span className="font-semibold">Accommodations</span>
            </h2>
            <p className="text-[clamp(1rem,1.4vw,1.25rem)] text-[#374151] max-w-2xl mx-auto ">
              Choose from our curated selection of rooms, each offering a unique
              perspective of the city skyline.
            </p>
             <div
              className="w-60 h-0.5 bg-gradient-to-r from-[#3F6F78] to-[#6F5E4B] mt-6"
              aria-hidden="true"
            />
          </div>

          {/* Buton */}
          <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
            <button
              onClick={() => navigate("/rooms")}
              className="group relative pb-2 uppercase text-[#2C5F5D] font-semibold tracking-wider transition-all duration-300 hover:text-[#C9A961] flex  gap-3 "
            >
              Explore All Rooms  <MoveRight />
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#C9A961] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
        </div>

        {/* Cards Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-8 mt-8">
          {premiumRooms.map((room, index) => (
            <RoomCard key={index} room={room} variant="premium" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default RoomSection;
