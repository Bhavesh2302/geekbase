import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { navigationItems } from './navigation';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, closeSidebar } = useUiStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800/80
          flex flex-col justify-between transition-transform duration-200 ease-in-out backdrop-blur-md
          lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand & Logo Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow-sm text-white">
              <Sparkles className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Geekbase
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  DSA
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">
                Mastery Platform
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={closeSidebar}
            className="lg:hidden text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-6 flex-1 overflow-y-auto space-y-1.5">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Main Navigation
          </p>
          <nav className="space-y-1" aria-label="Sidebar Navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
                    ${
                      isActive
                        ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        {user && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
