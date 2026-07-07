import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Topbar = () => {
  const location = useLocation();
  
  return (
    <header className="flex justify-between items-center w-full px-4 md:px-margin-desktop py-4 bg-surface-container-lowest dark:bg-surface-dim border-b border-outline-variant dark:border-outline shadow-sm z-10 shrink-0">
      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-4">
        <h1 className="font-headline-md text-headline-md font-black text-primary dark:text-primary-fixed-dim">Haupcar</h1>
        <div className="flex items-center gap-2">
          <Link 
            to="/dashboard" 
            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${location.pathname === '/dashboard' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/dashboard' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
          </Link>
          <Link 
            to="/cars" 
            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${location.pathname === '/cars' || location.pathname === '/' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname === '/cars' || location.pathname === '/' ? "'FILL' 1" : "'FILL' 0" }}>directions_car</span>
          </Link>
        </div>
      </div>

      <div className="hidden md:block w-64">
        {/* Placeholder for top bar alignment, can be used for global search later */}
      </div>
      <div className="flex items-center gap-sm">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-container border border-outline-variant flex justify-center items-center font-bold text-on-primary">
          A
        </div>
        <span className="font-label-md text-label-md text-on-surface hidden md:block">
          Achirawat Watthanavorapant
        </span>
      </div>
    </header>
  );
};

export default Topbar;
