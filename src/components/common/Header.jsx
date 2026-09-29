import React from 'react';
import { Calendar, Plus, Users, Mail, Cloud, Shield, LogOut, LogIn } from 'lucide-react';

export default function Header({ activeTab, navigateTab, currentUser, onOpenAuth, onLogoutClick }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex h-13 sm:h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <div
              className="flex items-center gap-2 sm:gap-2.5 font-semibold text-sm sm:text-base cursor-pointer tracking-tight text-white hover:opacity-90 transition group shrink-0"
              onClick={() => navigateTab('events')}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold shadow-sm group-hover:border-blue-400 group-hover:text-white transition">
                <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300 group-hover:text-white transition" />
              </div>
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent font-bold">
                AWS Events
              </span>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-lg text-sm">
              <button
                onClick={() => navigateTab('events')}
                className={`cursor-pointer px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'events'
                    ? 'bg-blue-600 text-white shadow-sm border border-blue-500/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Calendar className="w-4 h-4" /> Sự kiện
              </button>
              <button
                onClick={() => navigateTab('manage')}
                className={`cursor-pointer px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'manage'
                    ? 'bg-blue-600 text-white shadow-sm border border-blue-500/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Plus className="w-4 h-4" /> Quản lý sự kiện
              </button>
              <button
                onClick={() => navigateTab('attendees')}
                className={`cursor-pointer px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'attendees'
                    ? 'bg-blue-600 text-white shadow-sm border border-blue-500/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Users className="w-4 h-4" /> Người tham gia
              </button>
              <button
                onClick={() => navigateTab('email')}
                className={`cursor-pointer px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'email'
                    ? 'bg-blue-600 text-white shadow-sm border border-blue-500/50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Mail className="w-4 h-4" /> Gửi Email
              </button>
            </nav>
          </div>

          {/* Right User Auth */}
          <div className="shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs bg-zinc-900 border border-zinc-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-zinc-300 max-w-[120px] sm:max-w-[190px] truncate">
                  <Shield className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="font-medium truncate">{currentUser.email}</span>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="cursor-pointer p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-400 text-zinc-400 transition"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" /> <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 border-t border-zinc-800/60 text-xs">
          <button
            onClick={() => navigateTab('events')}
            className={`cursor-pointer px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition flex items-center gap-1 shrink-0 ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-sm border border-blue-500/50'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Sự kiện
          </button>
          <button
            onClick={() => navigateTab('manage')}
            className={`cursor-pointer px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition flex items-center gap-1 shrink-0 ${
              activeTab === 'manage'
                ? 'bg-blue-600 text-white shadow-sm border border-blue-500/50'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Quản lý sự kiện
          </button>
          <button
            onClick={() => navigateTab('attendees')}
            className={`cursor-pointer px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition flex items-center gap-1 shrink-0 ${
              activeTab === 'attendees'
                ? 'bg-blue-600 text-white shadow-sm border border-blue-500/50'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Người tham gia
          </button>
          <button
            onClick={() => navigateTab('email')}
            className={`cursor-pointer px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition flex items-center gap-1 shrink-0 ${
              activeTab === 'email'
                ? 'bg-blue-600 text-white shadow-sm border border-blue-500/50'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Gửi Email
          </button>
        </div>
      </div>
    </header>
  );
}
