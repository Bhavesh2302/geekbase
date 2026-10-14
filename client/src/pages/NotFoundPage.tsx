import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-6 shadow-glow-sm">
        <Compass className="w-8 h-8" />
      </div>

      <span className="text-sm font-semibold tracking-wider uppercase text-brand-400">
        404 Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
        Page Not Found
      </h1>
      <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-8">
        The page you are looking for doesn't exist or has been moved. Check the URL or return to your dashboard.
      </p>

      <Link to="/dashboard">
        <Button leftIcon={<Home className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
