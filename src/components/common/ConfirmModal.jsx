import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  subtitle,
  children,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmVariant = 'danger', // 'danger' | 'primary' | 'success'
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-xl p-4 sm:p-5 space-y-3.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
              confirmVariant === 'danger'
                ? 'bg-red-500/10 text-red-400'
                : confirmVariant === 'success'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-blue-500/10 text-blue-400'
            }`}
          >
            {confirmVariant === 'danger' ? (
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-[11px] text-zinc-400">{subtitle}</p>}
          </div>
        </div>

        {children}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="cursor-pointer flex-1 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-2 rounded-md text-xs font-medium text-zinc-300 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`cursor-pointer flex-1 py-2 rounded-md text-xs font-bold transition shadow-sm active:scale-95 disabled:opacity-50 ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : confirmVariant === 'success'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50'
            }`}
          >
            {loading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
