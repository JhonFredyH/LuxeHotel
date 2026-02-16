// ScrollManager.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NAVBAR_HEIGHT = 80;

const ScrollManager = () => {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    if (state?.scrollTo) {
      const el = document.getElementById(state.scrollTo);
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      return;
    }

    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash, state]);

  return null;
};

export default ScrollManager;
