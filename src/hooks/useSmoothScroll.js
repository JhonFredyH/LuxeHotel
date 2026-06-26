import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import scrollConfig from "../utils/scrollConfig";

export const useSmoothScroll = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasScrolledRef = useRef(false);

  const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, scrollConfig.reactScroll);
  };

  useEffect(() => {
    hasScrolledRef.current = false;

    const handleScroll = () => {
      if (hasScrolledRef.current) return;

      if (location.state?.scrollTo) {
        setTimeout(() => {
          scrollToSection(location.state.scrollTo);
          hasScrolledRef.current = true;
        }, 100);

        navigate(location.pathname, {
          replace: true,
          state: {},
        });
      } else if (location.hash) {
        const sectionId = location.hash.replace("#", "");
        setTimeout(() => {
          scrollToSection(sectionId);
          hasScrolledRef.current = true;
        }, 100);
      }
    };

    handleScroll();
  }, [location, navigate]);

  return { scrollToSection };
};

export default useSmoothScroll;
