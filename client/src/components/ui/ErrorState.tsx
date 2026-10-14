import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  statusCode?: number;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section.',
  statusCode,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`
        flex flex-col items-center justify-center text-center p-8 sm:p-12
        rounded-2xl border border-rose-500/20 bg-rose-950/10 backdrop-blur-sm
        ${className}
      `}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-sm">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h3 className="text-base font-semibold text-rose-200">
        {title} {statusCode ? `(${statusCode})` : ''}
      </h3>

      <p className="text-sm text-slate-400 max-w-sm mt-1.5 mb-5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
