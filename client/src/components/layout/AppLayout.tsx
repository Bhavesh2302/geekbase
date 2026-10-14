import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area (Offset by sidebar width on large screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
