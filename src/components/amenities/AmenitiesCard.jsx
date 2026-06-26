const AmenityCard = ({ icon, title, description, image }) => {
  const Icon = icon;

  return (
    <div
      className="
        group bg-[#FFFFFF] rounded-xl shadow-lg hover:shadow-2xl
        transition-all duration-300
        w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg mx-auto
      "
    >
      {/* Image */}
      <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="
            w-full h-full object-cover
            group-hover:scale-110 transition duration-500
            rounded-t-xl
          "
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex gap-3 sm:gap-3 items-center mb-3 sm:mb-4">
          <div
            className=" w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0 "
            aria-hidden="true"
          >
            <Icon className="text-[#6F5E4B] w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="font-semibold text-[#2C5F5D] group-hover:text-[#3F6F78] transition-colors  text-[clamp(1.125rem,1.7vw,2.0rem)] text-center ">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-[#1A1A1A] leading-relaxed font-semibold text-[clamp(0.875rem,1.1vw,1.5rem)]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AmenityCard;
