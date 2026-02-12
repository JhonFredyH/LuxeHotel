import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./RoomSlider.css"; 

const RoomSlider = ({ images = [], price }) => {
  if (!images.length) {
    return (
      <div className="w-full h-full md:h-80 xl:h-96 rounded-2xl overflow-hidden " />
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={
          images.length > 1
            ? {
                delay: 4000,
                disableOnInteraction: false,
              }
            : false
        }
        loop={images.length > 1}
        slidesPerView={1}
        className="h-full room-slider"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Room image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Price Badge */}
      {price && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#5a8a95] px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-xl z-20">
          <p className="text-white uppercase tracking-wider text-[clamp(0.65rem,1.6vw,0.78rem)]">
            From
          </p>
          <p className="font-bold text-white leading-none text-[clamp(1.5rem,4vw,2rem)]">
            ${price}
          </p>
          <p className="text-white uppercase text-[clamp(0.65rem,1.6vw,0.78rem)]">
            Per Night
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomSlider;