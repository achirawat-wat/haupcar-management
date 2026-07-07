import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className="hidden md:flex flex-col h-screen p-md gap-sm docked left-0 w-64 border-r border-outline-variant dark:border-outline bg-surface-container dark:bg-surface-dim z-20 shrink-0">
      <div className="mb-lg mt-2">
        <h1 className="font-headline-md text-headline-md font-black text-primary dark:text-primary-fixed-dim">Haupcar</h1>
      </div>
      <div className="flex-1 flex flex-col gap-sm overflow-y-auto">
        <Link 
          to="/cars" 
          className={`flex items-center gap-md px-md py-sm rounded-lg transition-all focus:ring-2 focus:ring-primary/20 ${
            location.pathname === '/cars' || location.pathname === '/' 
              ? 'bg-primary-container text-on-primary-container font-semibold' 
              : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/cars' || location.pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>directions_car</span>
          <span className="font-body-md text-body-md">Car Management</span>
        </Link>

        <Link 
          to="/dashboard" 
          className={`flex items-center gap-md px-md py-sm rounded-lg transition-all focus:ring-2 focus:ring-primary/20 ${
            location.pathname === '/dashboard' 
              ? 'bg-primary-container text-on-primary-container font-semibold' 
              : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/dashboard' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
          <span className="font-body-md text-body-md">Dashboard</span>
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
