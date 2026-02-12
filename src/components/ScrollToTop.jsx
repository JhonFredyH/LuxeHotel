// components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NAVBAR_HEIGHT = 80;

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
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
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
