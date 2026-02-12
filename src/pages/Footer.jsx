import { NAV_ITEMS, BRAND_CONFIG } from "../components/navbar/navbarConfig";
import NavLink from "../components/navbar/NavLink";
import CreativeWebDesign from "../components/CreativeWebDesign";
import { Send } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-100 py-8">
      {/* Brand Info */}
      <div className="mb-6 flex flex-col items-center px-4 text-center">
        <h1 className="font-bold text-gray-950 text-[clamp(0.95rem,1.4vw,1.2rem)]">
          {BRAND_CONFIG.name}
        </h1>
        <p className="tracking-[0.2em] text-gray-500 text-[clamp(0.62rem,1vw,0.8rem)]">
          {BRAND_CONFIG.tagline}
        </p>
      </div>

      {/* Navigation Links */}
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-4 sm:px-6 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-12">
        <ul className="grid grid-cols-3 gap-y-3 gap-x-4 text-center uppercase text-[clamp(0.72rem,0.95vw,1.86rem)] sm:grid-cols-3 lg:flex lg:flex-nowrap lg:justify-start lg:gap-x-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <NavLink item={item} textColor="text-gray-800" />
            </li>
          ))}
          <li className="text-gray-800 font-semibold">
           Privacy Policy
          </li>
        </ul>
        <form
          action=""
          className="flex w-full max-w-md items-center gap-2 sm:w-auto"
        >
          <input
            type="email"
            placeholder="Ingresa tu email"
            required
            className="w-full min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-[clamp(0.75rem,0.95vw,0.88rem)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2C5F5D] sm:w-72 sm:flex-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#2C5F5D] p-2 text-white transition-all duration-300 hover:scale-105 hover:bg-[#234a48]"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
      <CreativeWebDesign />
    </footer>
  );
};

export default Footer;
