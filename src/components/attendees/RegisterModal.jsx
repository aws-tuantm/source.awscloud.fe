import React from 'react';
import { X, CheckCircle, XCircle, Upload } from 'lucide-react';

export default function RegisterModal({
  isOpen,
  onClose,
  registerForm,
  setRegisterForm,
  submitting,
  onSubmit,
  onAvatarChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 sm:px-5 py-3 sm:py-4 shrink-0">
          <h3 className="font-semibold text-sm sm:text-base text-white">Đăng ký tham gia sự kiện</h3>
          <button onClick={onClose} className="cursor-pointer text-zinc-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto no-scrollbar flex-1">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Mã sự kiện</label>
            <input
              type="text"
              value={registerForm.event_id}
              readOnly
              className="w-full bg-zinc-950/60 border border-zinc-800/80 text-xs rounded-md px-3 py-2 text-zinc-400 cursor-not-allowed font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Họ và tên *</label>
            <input
              type="text"
              placeholder="Trần Văn Sĩ"
              value={registerForm.full_name}
              onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Email *</label>
            <input
              type="email"
              placeholder="tranvansi@gmail.com"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Trạng thái tham gia</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRegisterForm({ ...registerForm, response: 'Yes' })}
                className={`cursor-pointer py-2 px-3 rounded-md text-xs font-semibold border transition flex items-center justify-center gap-1.5 ${
                  registerForm.response === 'Yes'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" /> Có (Yes)
              </button>
              <button
                type="button"
                onClick={() => setRegisterForm({ ...registerForm, response: 'No' })}
                className={`cursor-pointer py-2 px-3 rounded-md text-xs font-semibold border transition flex items-center justify-center gap-1.5 ${
                  registerForm.response === 'No'
                    ? 'border-zinc-600 bg-zinc-800 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" /> Không (No)
              </button>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Ảnh đại diện (Tối đa 2MB)</label>
            {registerForm.avatarPreview ? (
              <div className="flex items-center gap-2.5 p-2 rounded-md bg-zinc-950 border border-zinc-800">
                <img src={registerForm.avatarPreview} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0" />
                <span className="text-xs text-zinc-300 truncate flex-1">{registerForm.avatarFile?.name}</span>
                <button
                  type="button"
                  onClick={() => setRegisterForm({ ...registerForm, avatarFile: null, avatarPreview: null })}
                  className="cursor-pointer text-xs text-zinc-400 hover:text-red-400 px-2 py-1"
                >
                  Xóa
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-zinc-800 hover:border-blue-500/60 rounded-lg p-3 sm:p-4 text-center cursor-pointer block bg-zinc-950/50 hover:bg-zinc-950 transition group">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-blue-400 mx-auto mb-1 transition" />
                <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition">Chọn file ảnh đại diện</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Chỉ hỗ trợ: JPG, PNG, WEBP (Tối đa 2MB)</div>
                <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={onAvatarChange} />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white border border-blue-500/50 py-2.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 shadow-md shadow-blue-950/50 disabled:opacity-50 mt-1"
          >
            {submitting ? 'Đang gửi...' : 'Đăng ký ngay'}
          </button>
        </form>
      </div>
    </div>
  );
}
