import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  isFullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  size = 'md',
  isFullScreen = false,
}) => {
  const spinnerSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = isFullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090d16]/90 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center py-16 px-4';

  return (
    <div className={containerClasses} role="status">
      <Loader2
        className={`${spinnerSizes[size]} text-brand-500 animate-spin mb-3`}
      />
      {message && (
        <p className="text-sm text-slate-400 font-medium tracking-wide">
          {message}
        </p>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
};
