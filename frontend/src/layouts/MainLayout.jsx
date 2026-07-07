import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const MainLayout = () => {
  return (
    <div className="bg-background text-on-background flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
