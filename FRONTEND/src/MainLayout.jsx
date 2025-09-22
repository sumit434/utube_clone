import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar open={isSidebarOpen} />
      <div className={`flex-1 overflow-x-hidden transition-all duration-300 ml-0`}>
        <Navbar onToggle={toggleSidebar} />
        <main className="p-4 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
