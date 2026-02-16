import AmenitiesGrid from "./amenities/AmenitiesGrid";
import { useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";

const AmenitiesSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F4F1E8] min-h-screen py-2" id="amenities">
      <section className=" w-[90%] mx-auto " >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="text-left mt-10 ml-14 max-w-3xl">
          <h2
            id="amenities-heading"
            className="text-4xl md:text-5xl font-light text-[#1F2937] mb-4"
          >
            Our <span className="font-semibold">Amenities</span>
          </h2>
          <p className="text-[clamp(1rem,1.4vw,1.25rem)] text-[#374151] max-w-2xl mx-auto ">
            Experience the pinacle of luxury and conform with our curated
            selection of premium services designed to carterto your every need.
          </p>
          <div
            className="h-0.5 bg-gradient-to-r from-[#3F6F78] to-[#6F5E4B] mx-auto mt-6 "
            aria-hidden="true"
          />
          {/* Buton */}
          <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
            <button
              onClick={() => navigate("/rooms")}
              className="group relative pb-2 uppercase text-[#2C5F5D] font-semibold tracking-wider transition-all duration-300 hover:text-[#C9A961] flex  gap-3 "
            >
              Explore All Rooms <MoveRight />
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-[#C9A961] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <AmenitiesGrid />
        </div>
      </section>
    </div>
  );
};

export default AmenitiesSection;
