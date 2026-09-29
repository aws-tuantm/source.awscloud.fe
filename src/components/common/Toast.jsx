import React from 'react';
import { AlertTriangle, Shield, CheckCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs font-medium shadow-2xl border flex items-center gap-2.5 backdrop-blur-md transition ${
          toast.type === 'error'
            ? 'bg-red-950/90 text-red-200 border-red-800/80 shadow-red-950/50'
            : toast.type === 'info'
            ? 'bg-sky-950/90 text-sky-200 border-sky-800/80 shadow-sky-950/50'
            : 'bg-zinc-900/95 text-zinc-100 border-zinc-750 shadow-black/60'
        }`}
      >
        {toast.type === 'error' ? (
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
        ) : toast.type === 'info' ? (
          <Shield className="w-4 h-4 text-sky-400 shrink-0" />
        ) : (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <span className="flex-1 leading-snug">{toast.message}</span>
        <button
          onClick={onClose}
          className="cursor-pointer text-zinc-400 hover:text-white p-1 rounded transition shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
