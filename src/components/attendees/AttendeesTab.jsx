import React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import CustomSelect from '../CustomSelect';

export default function AttendeesTab({
  events = [],
  selectedEventId,
  onSelectEvent,
  attendees = [],
  attendeesLoading,
  attendeeFilter,
  setAttendeeFilter,
  stats,
  onRefresh,
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">Danh sách người tham gia</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Dữ liệu lưu trữ thời gian thực trên Amazon DynamoDB & S3.</p>
        </div>

        {/* Event Filter Selector */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <div className="flex-1 sm:w-72">
            <CustomSelect
              value={selectedEventId}
              onChange={onSelectEvent}
              options={events.map((ev) => ({
                value: ev.event_id,
                label: ev.title,
                subtext: `${new Date(ev.start_at).toLocaleDateString('vi-VN')} • ${ev.venue || 'Online'}`
              }))}
              placeholder="Chọn sự kiện để xem..."
            />
          </div>
          <button
            onClick={onRefresh}
            className="cursor-pointer p-2.5 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition shrink-0 shadow-sm"
            title="Làm mới danh sách"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 sm:p-4">
          <div className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider truncate">Tổng phản hồi</div>
          {attendeesLoading ? (
            <div className="h-5 sm:h-8 w-10 sm:w-12 bg-zinc-800 rounded animate-pulse mt-1" />
          ) : (
            <div className="text-base sm:text-2xl font-bold text-white mt-0.5">{stats.Yes + stats.No}</div>
          )}
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 sm:p-4">
          <div className="text-[10px] sm:text-xs font-medium text-emerald-400 uppercase tracking-wider truncate">Tham gia (Yes)</div>
          {attendeesLoading ? (
            <div className="h-5 sm:h-8 w-10 sm:w-12 bg-zinc-800 rounded animate-pulse mt-1" />
          ) : (
            <div className="text-base sm:text-2xl font-bold text-emerald-400 mt-0.5">{stats.Yes}</div>
          )}
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 sm:p-4">
          <div className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider truncate">Từ chối (No)</div>
          {attendeesLoading ? (
            <div className="h-5 sm:h-8 w-10 sm:w-12 bg-zinc-800 rounded animate-pulse mt-1" />
          ) : (
            <div className="text-base sm:text-2xl font-bold text-zinc-400 mt-0.5">{stats.No}</div>
          )}
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setAttendeeFilter('')}
          className={`cursor-pointer text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-medium whitespace-nowrap transition ${
            attendeeFilter === ''
              ? 'bg-blue-600 text-white font-medium shadow-sm border border-blue-500/50'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Tất cả ({attendees.length})
        </button>
        <button
          onClick={() => setAttendeeFilter('Yes')}
          className={`cursor-pointer text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-medium whitespace-nowrap transition ${
            attendeeFilter === 'Yes'
              ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-sm'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Tham gia (Yes)
        </button>
        <button
          onClick={() => setAttendeeFilter('No')}
          className={`cursor-pointer text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-medium whitespace-nowrap transition ${
            attendeeFilter === 'No'
              ? 'bg-zinc-700 text-white font-semibold shadow-sm'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Từ chối (No)
        </button>
      </div>

      {/* Attendees Grid / Skeletons */}
      {attendeesLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-3 sm:p-4 flex items-center gap-3 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-800/80 shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="h-3.5 bg-zinc-800 rounded w-20" />
                  <div className="h-3 bg-zinc-800/60 rounded-full w-14" />
                </div>
                <div className="h-3 bg-zinc-800/50 rounded w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : attendees.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 sm:p-12 text-center text-zinc-500 text-xs sm:text-sm">
          Chưa có ai đăng ký tham gia sự kiện này.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {attendees.map((attendee, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4 flex items-center gap-3 hover:border-zinc-700 transition"
            >
              {attendee.avatar_url ? (
                <img
                  src={attendee.avatar_url}
                  alt={attendee.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700 bg-zinc-800 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-700/60 flex items-center justify-center font-bold text-blue-300 shrink-0 text-xs">
                  {(attendee.full_name || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <div className="text-xs sm:text-sm font-semibold text-white truncate">{attendee.full_name}</div>
                  <span
                    className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                      attendee.response === 'Yes'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {attendee.response === 'Yes' ? 'Tham gia' : 'Từ chối'}
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 truncate mt-0.5">{attendee.email}</div>
                {attendee.timestamp && (
                  <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {new Date(attendee.timestamp).toLocaleDateString('vi-VN')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
