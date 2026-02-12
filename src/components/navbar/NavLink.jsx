import { useLocation, useNavigate } from "react-router-dom";

const NavLink = ({ item, textColor = "text-gray-800", onClick }) => {
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

export default NavLink;
