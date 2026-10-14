import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ShieldCheck } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { navigationItems } from './navigation';

export const Navbar: React.FC = () => {
  const { toggleSidebar } = useUiStore();
  const { user } = useAuthStore();
  const location = useLocation();

  // Find active navigation item title
  const activeNav = navigationItems.find((item) =>
    location.pathname.startsWith(item.path)
  );

  const pageTitle = activeNav ? activeNav.label : 'Geekbase';

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[#090d16]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800/80 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Platform /</span>
          <h1 className="text-base sm:text-lg font-semibold text-slate-100 tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: User Status & Session Pill */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="capitalize">{user.role}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="hidden md:inline font-mono text-[11px] text-slate-400">
              Authenticated Session
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
