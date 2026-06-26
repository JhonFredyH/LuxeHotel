import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, TopBar, EmptyContent } from "./DashboardComponents";
import { menuItems, getTheme } from "../../components/utils/dashboardConfig";
import ReservationsPage from './ReservationPage'; 

export default function DashBoardHome() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const profileMenuRef = useRef(null);
  const theme = getTheme(darkMode);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detectar vista móvil
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleMediaChange = (e) => {
      const mobile = e.matches;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Bloquear scroll en móvil cuando sidebar abierto
  useEffect(() => {
    if (isMobile && sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, sidebarOpen]);

  // Tecla Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setProfileMenuOpen(false);
        if (isMobile) setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    setProfileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className={`min-h-screen flex ${theme.app} relative`} id="dash">
      {isMobile && sidebarOpen && (
        <button
          aria-label="Cerrar menú lateral"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-[2px] lg:hidden transition-opacity duration-200"
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggle={() => setSidebarOpen(false)}
        theme={theme}
        menuItems={menuItems}
        isMobile={isMobile}
      />

      <main
        className={`flex-1 min-w-0 ${theme.main} transition-colors duration-300`}
      >
        <TopBar
          ref={profileMenuRef}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(!darkMode)}
          profileMenuOpen={profileMenuOpen}
          onToggleProfile={() => setProfileMenuOpen(!profileMenuOpen)}
          onLogout={handleLogout}
          theme={theme}
          isMobile={isMobile}
        />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className={`max-w-7xl mx-auto ${theme.pageText}`}>
           

            {activeTab === "reservas" ? (
              <ReservationsPage theme={theme} />
            ) : (
              <EmptyContent
                activeTab={activeTab}
                menuItems={menuItems}
                theme={theme}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
