import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, type ToastType } from '../../store/toastStore';

const toastStyles: Record<
  ToastType,
  { bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  success: {
    bg: 'bg-slate-900/95',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
  },
  error: {
    bg: 'bg-slate-900/95',
    border: 'border-rose-500/40',
    text: 'text-rose-300',
    icon: <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />,
  },
  info: {
    bg: 'bg-slate-900/95',
    border: 'border-brand-500/40',
    text: 'text-brand-300',
    icon: <Info className="w-4 h-4 text-brand-400 shrink-0" />,
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];

        return (
          <div
            key={toast.id}
            role="alert"
            className={`
              pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border
              shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200
              ${style.bg} ${style.border}
            `}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {style.icon}
              <p className={`text-xs font-medium leading-relaxed ${style.text} truncate`}>
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
