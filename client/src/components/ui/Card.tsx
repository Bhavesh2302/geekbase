import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  isHoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm
        transition-all duration-200
        ${isHoverable ? 'hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`px-5 py-4 border-b border-slate-800/80 flex items-center justify-between gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3
      className={`text-base font-semibold text-slate-100 tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p className={`text-xs text-slate-400 mt-0.5 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`px-5 py-3.5 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs text-slate-400 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
