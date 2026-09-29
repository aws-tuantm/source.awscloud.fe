import React from 'react';
import { Calendar, MapPin, Users, UserCheck, RefreshCw } from 'lucide-react';

export default function EventListTab({
  events = [],
  loading,
  onRefresh,
  onOpenRegister,
  onViewAttendees,
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">Danh sách sự kiện</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Khám phá và đăng ký tham gia các sự kiện Cloud nổi bật.</p>
        </div>
        <button
          onClick={onRefresh}
          className="cursor-pointer flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 transition shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
        </button>
      </div>

      {/* Events List or Skeletons */}
      {loading ? (
        <div className="space-y-2.5 sm:space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 animate-pulse"
            >
              <div className="w-full sm:w-32 h-32 sm:h-20 rounded-lg bg-zinc-800/70 shrink-0" />
              <div className="flex-1 min-w-0 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-4 bg-zinc-800/60 rounded-full w-14" />
                </div>
                <div className="h-3 bg-zinc-800/60 rounded w-3/4" />
                <div className="flex items-center gap-3 pt-1">
                  <div className="h-3 bg-zinc-800/50 rounded w-20" />
                  <div className="h-3 bg-zinc-800/50 rounded w-24" />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                <div className="h-7 flex-1 sm:w-20 bg-zinc-800 rounded-md" />
                <div className="h-7 flex-1 sm:w-24 bg-zinc-800/60 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 sm:p-12 text-center text-zinc-500 text-xs sm:text-sm">
          Chưa có sự kiện nào. Bấm tạo sự kiện mới ở mục Quản lý sự kiện.
        </div>
      ) : (
        <div className="space-y-2.5 sm:space-y-3">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 sm:p-4 hover:border-zinc-700 transition flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 group"
            >
              {/* Event Banner */}
              <div className="relative w-full sm:w-32 h-32 sm:h-22 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-800">
                <img
                  src={event.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="sm:hidden absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-sm text-zinc-300 font-medium border border-zinc-800">
                  AWS Cloud
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-1 w-full">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">{event.title}</h3>
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium shrink-0">
                    AWS Cloud
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 sm:line-clamp-1 leading-relaxed">{event.description}</p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-zinc-400 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>{new Date(event.start_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate max-w-[180px] sm:max-w-[200px]">{event.venue || 'Trực tuyến'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                <button
                  onClick={() => onOpenRegister(event)}
                  className="cursor-pointer flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 active:scale-95 text-white border border-blue-500/50 py-1.5 px-3.5 rounded-md text-xs font-medium transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-300" /> Đăng ký
                </button>
                <button
                  onClick={() => onViewAttendees(event.event_id)}
                  className="cursor-pointer flex-1 sm:flex-none border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-1.5 px-2.5 rounded-md text-xs font-medium transition flex items-center justify-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" /> Danh sách
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
