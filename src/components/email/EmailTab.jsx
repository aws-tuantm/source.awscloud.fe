import React from 'react';
import { Send, RefreshCw } from 'lucide-react';
import CustomSelect from '../CustomSelect';
import EmailChipInput from '../EmailChipInput';
import EmailPreview from './EmailPreview';

export default function EmailTab({
  events = [],
  emailForm,
  setEmailForm,
  emailSending,
  onSendEmail,
  onFillYesAttendees,
}) {
  const currentEv = events.find((e) => e.event_id === emailForm.event_id) || events[0] || {};

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="border-b border-zinc-800 pb-3">
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">Gửi Email Thông Báo Sự Kiện</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">Gửi email xác nhận sự kiện hàng loạt qua Amazon SES với mẫu template chuẩn đẹp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          <form onSubmit={onSendEmail} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-200">
                  Chọn sự kiện gửi thông báo <span className="text-red-400">*</span>
                </label>
                {!emailForm.event_id && (
                  <span className="text-[11px] text-amber-400 font-medium animate-pulse">
                    Bắt buộc chọn sự kiện
                  </span>
                )}
              </div>
              <CustomSelect
                value={emailForm.event_id}
                onChange={(val) => setEmailForm({ ...emailForm, event_id: val })}
                options={events.map((ev) => ({
                  value: ev.event_id,
                  label: ev.title,
                  subtext: `${new Date(ev.start_at).toLocaleDateString('vi-VN')} • ${ev.venue || 'Online'}`
                }))}
                placeholder="-- Bấm vào đây để chọn sự kiện --"
                className={!emailForm.event_id ? 'ring-1 ring-amber-500/60 rounded-lg' : ''}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">Danh sách email người nhận <span className="text-red-400">*</span></label>
                <button
                  type="button"
                  onClick={onFillYesAttendees}
                  className="cursor-pointer text-[11px] text-blue-400 hover:text-blue-300 underline decoration-blue-500/50 transition font-medium"
                >
                  + Lấy từ người tham gia (Yes)
                </button>
              </div>

              {/* Email Chip Input Component */}
              <EmailChipInput
                emails={emailForm.emails}
                onChange={(newEmails) => setEmailForm({ ...emailForm, emails: newEmails })}
                placeholder="Nhập email rồi nhấn Enter..."
              />
            </div>

            <button
              type="submit"
              disabled={emailSending}
              className="cursor-pointer w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:via-blue-500 hover:to-indigo-600 active:scale-[0.98] text-white font-semibold py-2.5 rounded-lg text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-950/60 border border-blue-400/40 disabled:opacity-50"
            >
              {emailSending ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Đang gửi email qua SES...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" /> Gửi Email Xác Nhận Ngay
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Email Template Preview */}
        <EmailPreview targetEvent={currentEv} />
      </div>
    </div>
  );
}
