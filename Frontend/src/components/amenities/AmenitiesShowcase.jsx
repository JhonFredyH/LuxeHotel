import { amenities } from "../../data/AmenitiesData";
import { motion as Motion } from "framer-motion";

const AmenitiesShowcase = ({ limit }) => {
  const displayedAmenities = limit ? amenities.slice(0, limit) : amenities;

  return (
    <section className="py-12 bg-[#F4F1E8]">
      <div className="w-full mx-auto ">
        {displayedAmenities.map((amenity, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <Motion.div
              key={amenity.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-20"
            >
              <div
                className={`flex flex-col lg:flex-row ${
                  isReversed ? "lg:flex-row-reverse" : ""
                } items-center gap-16`}
              >
                {/* Image */}
                <div className="w-[500px]">
                  <div className="rounded-xl overflow-hidden shadow-xl">
                    <img
                      src={amenity.image}
                      alt={amenity.title}
                      className="h-[350px] object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 max-w-xl">
                  <p className="uppercase tracking-[0.2em] text-sm text-[#3F6F78] mb-4 font-semibold">
                    {amenity.subtitle}
                  </p>

                  <p className="uppercase tracking-[0.2em] text-sm text-[#3F6F78] mb-4 font-semibold">
                    {amenity.category}
                  </p>

                  <h3 className="text-4xl md:text-4xl font-serif font-light text-[#2E2E2E] mb-6 leading-tight">
                    {amenity.title}
                  </h3>

                  <p className="text-lg text-gray-500 leading-relaxed mb-8 text-justify">
                    {amenity.description}
                  </p>
                </div>
              </div>
            </Motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default AmenitiesShowcase;
