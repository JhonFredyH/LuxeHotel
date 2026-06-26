import React from "react";

const HeroSection = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <section
        className="relative h-[85vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 ">
          <h1 className="text-white font-light mb-6 leading-tight">
            <span className="block text-4xl md:text-5xl lg:text-6xl mb-2">
              A Sanctuary of
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-semibold">
              Refined Elegance
            </span>
          </h1>
          <p className="text-white/90 text-lg md:text-2xl max-w-2xl mb-8 leading-relaxed">
            Experience the art of slow living in the heart of the city, where
            every detail is curated for your comfort.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
