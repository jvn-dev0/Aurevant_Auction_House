'use client';

import React from 'react';
import { useChronoBid } from '@/lib/context';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useChronoBid();

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 border shadow-tactile-hover flex items-start gap-3 transition-all duration-300 font-mono text-xs ${
              isError
                ? 'bg-red-50 border-red-300 text-red-900'
                : isWarning
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : isSuccess
                ? 'bg-paper border-lime ring-1 ring-lime/40 text-forest'
                : 'bg-paper border-stone-hairline text-forest'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isError && <AlertCircle className="w-4 h-4 text-red-600" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-lime-700" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-forest/70" />}
            </div>

            <div className="flex-1 leading-snug">
              {toast.message}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 p-0.5 text-forest/50 hover:text-forest"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
