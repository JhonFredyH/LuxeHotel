import AmenitiesGrid from "./amenities/AmenitiesGrid";

const AmenitiesSection = () => {
  return (
    <section
      id="Amenities"
      className=" bg-[#F4F1E8] flex flex-col items-center justify-center scroll-mt-14 mt-10 px-4"
      aria-labelledby="amenities-heading"
    >
      <div className="text-center mt-10 max-w-3xl">
        <h2
          id="amenities-heading"
          className="text-4xl md:text-5xl font-light text-[#1F2937] mb-4"
        >
          World-Class <span className="font-semibold">Amenities</span>
        </h2>

        <p
          className="text-[clamp(1rem,1.4vw,1.25rem)] text-[#374151] max-w-2xl mx-auto " >
          Every detail designed for your comfort and convenience
        </p>

        <div
          className="h-0.5 bg-gradient-to-r from-[#3F6F78] to-[#6F5E4B] mx-auto mt-6 "
          aria-hidden="true"
        />
      </div>

      {/* Grid */}
      <AmenitiesGrid />
    </section>
  );
};

export default AmenitiesSection;
