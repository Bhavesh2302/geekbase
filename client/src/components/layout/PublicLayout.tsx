import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full py-6 px-6 sm:px-12 flex items-center justify-between border-b border-slate-800/40">
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow-sm text-white">
            <Sparkles className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            Geekbase
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/30">
              DSA Platform
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure Platform</span>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 px-6 text-center text-xs text-slate-500 border-t border-slate-800/40">
        <p>&copy; {new Date().getFullYear()} Geekbase. Built for Software Engineers & Students.</p>
      </footer>
    </div>
  );
};
