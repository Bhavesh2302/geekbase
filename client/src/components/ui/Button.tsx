import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700 shadow-glow-sm hover:shadow-glow focus-visible:ring-brand-500 border border-brand-500/30',
  secondary:
    'bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 focus-visible:ring-slate-500',
  outline:
    'bg-transparent text-slate-200 hover:bg-slate-800/60 active:bg-slate-800 border border-slate-700 hover:border-slate-600 focus-visible:ring-slate-500',
  ghost:
    'bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white active:bg-slate-850 focus-visible:ring-slate-500 border border-transparent',
  danger:
    'bg-rose-600/90 text-white hover:bg-rose-500 active:bg-rose-700 focus-visible:ring-rose-500 border border-rose-500/30 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5 h-8',
  md: 'text-sm px-4 py-2 rounded-lg gap-2 h-10',
  lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 h-12',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium transition-all duration-150 select-none
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
