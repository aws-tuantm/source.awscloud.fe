import React from 'react';
import { X, Image } from 'lucide-react';

export default function EventModal({
  isOpen,
  mode = 'create', // 'create' | 'edit'
  onClose,
  eventForm,
  setEventForm,
  submitting,
  onSubmit,
  onBannerChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 sm:px-5 py-3 sm:py-4 shrink-0">
          <h3 className="font-semibold text-sm sm:text-base text-white">
            {mode === 'create' ? 'Tạo sự kiện mới' : 'Chỉnh sửa sự kiện'}
          </h3>
          <button onClick={onClose} className="cursor-pointer text-zinc-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto no-scrollbar flex-1">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Tiêu đề sự kiện *</label>
            <input
              type="text"
              placeholder="AWS Cloud Day 2026"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Mô tả sự kiện</label>
            <textarea
              placeholder="Mô tả nội dung, diễn giả, lịch trình..."
              rows={3}
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 text-xs sm:text-sm rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Thời gian bắt đầu</label>
              <input
                type="datetime-local"
                value={eventForm.start_at}
                onChange={(e) => setEventForm({ ...eventForm, start_at: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Địa điểm</label>
              <input
                type="text"
                placeholder="TP. HCM / Online"
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 text-xs rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Banner Upload directly to S3 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Ảnh bìa sự kiện (Tối đa 2MB)</label>
            {eventForm.bannerPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
                <img src={eventForm.bannerPreview} alt="Banner Preview" className="w-full h-28 sm:h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => setEventForm({ ...eventForm, bannerFile: null, bannerPreview: null, banner_url: '' })}
                  className="cursor-pointer absolute top-2 right-2 p-1 rounded-md bg-zinc-950/80 text-zinc-300 hover:text-red-400 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-zinc-800 hover:border-blue-500/60 rounded-lg p-3 sm:p-4 text-center cursor-pointer block bg-zinc-950/50 hover:bg-zinc-950 transition group">
                <Image className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-blue-400 mx-auto mb-1 transition" />
                <div className="text-xs font-medium text-zinc-300 group-hover:text-white transition">Chọn file ảnh bìa sự kiện</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Chỉ hỗ trợ: JPG, PNG, WEBP (Tối đa 2MB)</div>
                <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={onBannerChange} />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white border border-blue-500/50 py-2.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 shadow-md shadow-blue-950/50 disabled:opacity-50 mt-1"
          >
            {submitting ? 'Đang lưu sự kiện...' : (mode === 'create' ? 'Tạo sự kiện ngay' : 'Lưu thay đổi')}
          </button>
        </form>
      </div>
    </div>
  );
}
