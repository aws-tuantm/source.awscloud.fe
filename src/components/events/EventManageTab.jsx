import React from 'react';
import { Calendar, MapPin, Plus, Edit3, Trash2 } from 'lucide-react';

export default function EventManageTab({
  events = [],
  loading,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-zinc-800 pb-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">Quản lý sự kiện</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Thêm, sửa, xóa và tải ảnh bìa sự kiện trực tiếp lên AWS S3 (Tối đa 2MB).</p>
        </div>
        <button
          onClick={onOpenCreate}
          className="cursor-pointer flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white border border-blue-500/50 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition shadow-sm w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-white" /> Thêm sự kiện mới
        </button>
      </div>

      {/* Events Management List / Skeletons */}
      {loading ? (
        <div className="space-y-2.5 sm:space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-pulse"
            >
              <div className="w-full sm:w-28 h-24 sm:h-16 rounded-lg bg-zinc-800/70 shrink-0" />
              <div className="flex-1 min-w-0 space-y-2 w-full">
                <div className="h-4 bg-zinc-800 rounded w-1/4" />
                <div className="h-3 bg-zinc-800/50 rounded w-1/2" />
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <div className="h-7 flex-1 sm:w-14 bg-zinc-800 rounded-md" />
                <div className="h-7 flex-1 sm:w-14 bg-zinc-800/60 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 sm:p-12 text-center text-zinc-500 text-xs sm:text-sm">
          Chưa có sự kiện nào để quản lý.
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 sm:p-4 hover:border-zinc-700 transition flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <img
                src={event.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'}
                alt={event.title}
                className="w-full sm:w-28 h-28 sm:h-18 rounded-lg object-cover bg-zinc-800 shrink-0 border border-zinc-800"
              />

              <div className="flex-1 min-w-0 space-y-1 w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-white truncate">{event.title}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono shrink-0">
                    {event.event_id}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-zinc-500" /> {new Date(event.start_at).toLocaleDateString('vi-VN')}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-zinc-500" /> {event.venue || 'Chưa đặt'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                <button
                  onClick={() => onOpenEdit(event)}
                  className="cursor-pointer flex-1 sm:flex-none p-1.5 sm:p-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 rounded-md text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5 text-xs font-medium"
                  title="Chỉnh sửa sự kiện"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Sửa
                </button>
                <button
                  onClick={() => onOpenDelete(event)}
                  className="cursor-pointer flex-1 sm:flex-none p-1.5 sm:p-2 border border-red-950/60 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition flex items-center justify-center gap-1.5 text-xs font-medium"
                  title="Xóa sự kiện"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
