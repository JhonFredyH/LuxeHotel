export const scrollConfig = {
  navbarOffset: 100,

  reactScroll: {
    duration: 800,
    delay: 0,
    smooth: "easeInOutQuart",
    offset: -80,
    isDynamic: true,
  },

  framerMotion: {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" },
  },

  sections: {
    HOME: "home",
    BOOKING: "booking",
    AMENITIES: "amenities",
    ROOMS: "rooms",
    CONTACT: "contact",
  },
};

export default scrollConfig;
