import React from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  authLoading,
  onLogin,
  onSignUp,
  onConfirmSignUp,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 sm:px-5 py-3 sm:py-4 shrink-0">
          <h3 className="font-semibold text-sm sm:text-base text-white">
            {authMode === 'login' && 'Đăng nhập tài khoản'}
            {authMode === 'signup' && 'Đăng ký tài khoản'}
            {authMode === 'confirm' && 'Xác thực OTP Email'}
          </h3>
          <button onClick={onClose} className="cursor-pointer text-zinc-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto no-scrollbar flex-1">
          {authMode !== 'confirm' && (
            <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`cursor-pointer py-1.5 rounded-md font-medium transition ${
                  authMode === 'login' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`cursor-pointer py-1.5 rounded-md font-medium transition ${
                  authMode === 'signup' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Đăng ký
              </button>
            </div>
          )}

          {/* Login Form */}
          {authMode === 'login' && (
            <form onSubmit={onLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Email</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white border border-blue-500/50 py-2.5 rounded-md text-xs sm:text-sm font-medium transition shadow-md shadow-blue-950/50 disabled:opacity-50 mt-2"
              >
                {authLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {authMode === 'signup' && (
            <form onSubmit={onSignUp} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Email *</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Mật khẩu *</label>
                <input
                  type="password"
                  placeholder="Admin@123456"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                {/* Password criteria checklist */}
                <div className="grid grid-cols-2 gap-1.5 pt-2 text-[10px] sm:text-[11px]">
                  <div className={`flex items-center gap-1.5 ${authForm.password.length >= 8 ? 'text-emerald-400 font-medium' : 'text-zinc-500'}`}>
                    {authForm.password.length >= 8 ? <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> : <div className="w-3 h-3 rounded-full border border-zinc-700 shrink-0" />}
                    <span>Tối thiểu 8 ký tự</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${/[a-z]/.test(authForm.password) ? 'text-emerald-400 font-medium' : 'text-zinc-500'}`}>
                    {/[a-z]/.test(authForm.password) ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <div className="w-3 h-3 rounded-full border border-zinc-700 shrink-0" />}
                    <span>Chữ thường (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(authForm.password) ? 'text-emerald-400 font-medium' : 'text-zinc-500'}`}>
                    {/[A-Z]/.test(authForm.password) ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <div className="w-3 h-3 rounded-full border border-zinc-700 shrink-0" />}
                    <span>Chữ in hoa (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${/[0-9]/.test(authForm.password) ? 'text-emerald-400 font-medium' : 'text-zinc-500'}`}>
                    {/[0-9]/.test(authForm.password) ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <div className="w-3 h-3 rounded-full border border-zinc-700 shrink-0" />}
                    <span>Chữ số (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 col-span-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(authForm.password) ? 'text-emerald-400 font-medium' : 'text-zinc-500'}`}>
                    {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(authForm.password) ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <div className="w-3 h-3 rounded-full border border-zinc-700 shrink-0" />}
                    <span>Ký tự đặc biệt (!@#$%^&*...)</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white border border-blue-500/50 py-2.5 rounded-md text-xs sm:text-sm font-medium transition shadow-md shadow-blue-950/50 disabled:opacity-50 mt-2"
              >
                {authLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>
            </form>
          )}

          {/* Confirm OTP Form */}
          {authMode === 'confirm' && (
            <form onSubmit={onConfirmSignUp} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Nhập mã OTP (6 số)</label>
                <input
                  type="text"
                  placeholder="123456"
                  value={authForm.code}
                  onChange={(e) => setAuthForm({ ...authForm, code: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-base rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center tracking-widest font-mono"
                  required
                />
                <p className="text-[10px] text-zinc-500 text-center">Kiểm tra hộp thư {authForm.email}</p>
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white border border-blue-500/50 py-2.5 rounded-md text-xs sm:text-sm font-medium transition shadow-md shadow-blue-950/50 disabled:opacity-50 mt-2"
              >
                {authLoading ? 'Đang xác thực...' : 'Xác thực tài khoản'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
