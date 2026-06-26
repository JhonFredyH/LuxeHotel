// components/Navbar.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { NAV_ITEMS, BRAND_CONFIG } from "./navbarConfig";

const LoginButton = ({ className = "", onClick, textColor = "text-white" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 uppercase tracking-wider font-medium transition-all duration-300 hover:opacity-80 ${textColor} ${className}`}
  >
    <User size={34} className="hidden md:block" />
    <span className="md:hidden">Login</span>
  </button>
);

const NavLink = ({ item, textColor, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hoverColor =
    textColor === "text-white" ? "hover:text-white/70" : "hover:text-gray-600";

  const handleClick = (e) => {
    e.preventDefault();

    const isSamePage = location.pathname === "/";
    const isHashLink = item.href.includes("#");
    const isHomeLink = item.href === "/";

    if (isSamePage && isHomeLink) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      onClick?.();
      return;
    }

    if (isSamePage && isHashLink) {
      const id = item.href.split("#")[1];
      const el = document.getElementById(id);

      if (el) {
        const NAVBAR_HEIGHT = 80;
        const y =
          el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    } else {
      navigate(item.href);
    }

    onClick?.();
  };

  return (
    <a
      href={item.href}
      onClick={handleClick}
      className={`font-semibold transition-all duration-300 hover:scale-105 px-2 py-1 ${textColor} ${hoverColor}`}
    >
      {item.label}
    </a>
  );
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  const handleLoginClick = () => navigate("/login");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getTextColor = useCallback(() => {
    if (isScrolled) return "text-white";
    if (isHomePage) return "text-white";
    return "text-gray-800";
  }, [isScrolled, isHomePage]);

  const textColorClass = getTextColor();

  const navbarClasses = useMemo(() => {
    const base = "fixed top-0 left-0 w-full z-50 transition-all duration-500";
    return isScrolled
      ? `${base} bg-[#2C5F5D] backdrop-blur-md shadow-2xl py-6`
      : `${base} bg-transparent py-4 mt-3`;
  }, [isScrolled]);

  const mobileMenuBgClass = isScrolled ? "bg-[#2C5F5D]/95" : "bg-black/95";

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((p) => !p);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={navbarClasses}>
      <div className="flex justify-between items-center px-4 sm:px-8 lg:px-12 uppercase">
        <ul className="hidden lg:flex gap-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <NavLink item={item} textColor={textColorClass} />
            </li>
          ))}
        </ul>

        <button
          onClick={toggleMenu}
          className={`lg:hidden text-2xl transition-all p-2 ${textColorClass}`}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <a
            href={BRAND_CONFIG.href}
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname === "/") {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                return;
              }
              navigate("/");
            }}
            className={`font-semibold text-lg ${textColorClass}`}
          >
            {BRAND_CONFIG.name}
            <span className="block font-light text-sm text-center">
              {BRAND_CONFIG.tagline}
            </span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <LoginButton textColor={textColorClass} onClick={handleLoginClick} />
        </div>
      </div>

      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`backdrop-blur-md py-6 px-6 ${mobileMenuBgClass}`}>
          <ul className="flex flex-col items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="w-full text-center">
                <NavLink
                  item={item}
                  textColor="text-white"
                  onClick={closeMenu}
                />
              </li>
            ))}
            <li className="w-full flex justify-center mt-2">
              <LoginButton
                textColor="text-white"
                onClick={() => {
                  handleLoginClick();
                  closeMenu();
                }}
              />
            </li>
          </ul>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 -z-10"
          onClick={closeMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;
