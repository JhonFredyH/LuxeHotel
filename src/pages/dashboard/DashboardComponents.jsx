import React, { forwardRef } from 'react';
import { 
  LayoutDashboard, CalendarCheck, BedDouble, Users, 
  DollarSign, FileText, Settings, Menu, X, Sun, Moon,
  Maximize2, Bell, ChevronDown, User, LogOut
} from 'lucide-react';

import { BRAND_CONFIG } from "../../components/utils/dashboardConfig";


const iconMap = {
  LayoutDashboard, CalendarCheck, BedDouble, Users,
  DollarSign, FileText, Settings
};


export const EmptyContent = ({ activeTab, menuItems, theme }) => {
  const Icon = iconMap[menuItems.find(item => item.id === activeTab)?.icon] || LayoutDashboard;
  
  return (
    <div className={`rounded-2xl border-2 border-dashed ${theme.content} h-[420px] sm:h-[520px] lg:h-[600px] flex items-center justify-center backdrop-blur-sm transition-all duration-300`}>
      <div className="text-center">
        <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${theme.contentIcon} flex items-center justify-center`}>
          <Icon className="w-12 h-12" />
        </div>
        <p className={`text-lg font-light ${theme.contentText}`}>
          Área de contenido lista para implementar
        </p>
        <p className={`text-sm mt-2 ${theme.pageSub}`}>
          Sección: {menuItems.find(item => item.id === activeTab)?.label}
        </p>
      </div>
    </div>
  );
};


export const Sidebar = ({ 
  sidebarOpen, 
  activeTab, 
  onTabChange, 
  onToggle, 
  theme, 
  menuItems, 
  isMobile 
}) => (
  <aside className={`${
    sidebarOpen ? 'translate-x-0 lg:w-72' : '-translate-x-full lg:w-0'
  } fixed inset-y-0 left-0 z-40 w-72 lg:relative lg:inset-auto lg:translate-x-0 ${theme.sidebar} flex flex-col shadow-2xl transition-all duration-300 ease-out overflow-hidden`}>
    <div className="p-6 h-full flex flex-col">
      <div className="mb-12">
        <h1 className="font-bold text-gray-950 text-[clamp(0.9rem,1.5vw,1.1rem)]">
                      {BRAND_CONFIG.name}
                    </h1>
                    <p className="text-gray-500 tracking-widest text-[clamp(0.65rem,1vw,0.78rem)]">
                      {BRAND_CONFIG.tagline}
                    </p>
      </div>

      <nav className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (isMobile) onToggle();
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-lg shadow-emerald-900/50' 
                  : `${theme.sidebarItem} hover:translate-x-1`
              }`}
            >
              <Icon 
                className={`w-5 h-5 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'
                } transition-colors`}
              />
              <span className={`font-light tracking-wide ${
                isActive ? 'text-white font-normal' : theme.sidebarItemText
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className={`mb-4 sm:mb-12 md:mb-16 lg:mb-12 pt-6 border-t shrink-0 ${theme.sidebar.includes('950') ? 'border-slate-700/50' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <span className="text-sm font-medium text-white">AD</span>
          </div>
          <div className="flex-1">
            <p className={`text-sm font-normal ${theme.sidebarTitle}`}>Admin</p>
            <p className={`text-xs ${theme.sidebarSub}`}>Administrador</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
);


export const TopBar = forwardRef(({ 
  sidebarOpen, 
  onToggleSidebar, 
  darkMode, 
  onToggleTheme, 
  profileMenuOpen, 
  onToggleProfile, 
  onLogout, 
  theme, 
}, profileMenuRef) => (
  <div className={`${theme.topbar} border-b backdrop-blur-sm`}>
    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
      <button
        onClick={onToggleSidebar}
        className={`p-2 rounded-lg ${theme.control} transition-all duration-200 hover:scale-105`}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className={`pl-10 pr-4 py-2 rounded-3xl w-64 ${theme.search} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          />
          <svg className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
            darkMode ? 'text-slate-400' : 'text-slate-500'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          onClick={() => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen();
            else document.exitFullscreen();
          }}
          className={`hidden sm:inline-flex p-2 rounded-lg ${theme.control} transition-all duration-200 hover:scale-105`}
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        <button className={`p-2 rounded-lg relative ${theme.control} transition-all duration-200 hover:scale-105`}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg ${theme.control} transition-all duration-200 hover:scale-105`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div ref={profileMenuRef} className="relative flex items-center gap-3 ml-2">
          <button
            onClick={onToggleProfile}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-transparent hover:ring-emerald-400/40 transition-all duration-200"
          >
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
              alt="John Hidalgo" 
              className="w-full h-full object-cover"
            />
          </button>
          <div className={`${theme.pageText} hidden sm:block`}>
            <p className="text-sm font-medium">John Hidalgo</p>
            <button
              onClick={onToggleProfile}
              className={`text-xs flex items-center gap-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}
            >
              <span>Administrador</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {profileMenuOpen && (
            <div className={`absolute right-0 top-14 w-52 rounded-xl border shadow-2xl ${theme.dropdown} overflow-hidden transition-all duration-200`}>
              <button
                type="button"
                onClick={() => { onToggleProfile(); /* navegar a perfil */ }}
                className={`w-full px-4 py-3 text-sm flex items-center gap-2 ${theme.dropdownItem} transition-colors`}
              >
                <User className="w-4 h-4" />
                Mi perfil
              </button>
              <button
                type="button"
                onClick={() => { onToggleProfile(); /* navegar a configuración */ }}
                className={`w-full px-4 py-3 text-sm flex items-center gap-2 ${theme.dropdownItem} transition-colors`}
              >
                <Settings className="w-4 h-4" />
                Configuración
              </button>
              <button
                type="button"
                onClick={onLogout}
                className={`w-full px-4 py-3 text-sm flex items-center gap-2 text-red-500 ${darkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'} transition-colors`}
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
));
TopBar.displayName = 'TopBar';
