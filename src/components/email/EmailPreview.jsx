import React from 'react';
import { Eye, Calendar, MapPin } from 'lucide-react';

export default function EmailPreview({ targetEvent = {} }) {
  const currentEv = targetEvent;

  return (
    <div className="lg:col-span-7 space-y-2 sm:space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <Eye className="w-3.5 h-3.5 text-blue-400" /> Xem trước giao diện Email gửi qua SES
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        {/* Email Browser Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-3.5 py-2 flex items-center justify-between text-xs text-zinc-400">
          <span className="truncate pr-2"><strong>Chủ đề:</strong> [AWS Event] Thư xác nhận: {currentEv.title || 'AWS Event'}</span>
          <span className="text-[10px] text-zinc-500 shrink-0">HTML Preview</span>
        </div>

        {/* Rendered Email Content */}
        <div className="p-3.5 sm:p-6 space-y-3.5 max-w-lg mx-auto bg-zinc-900/60 my-2 sm:my-4 rounded-xl border border-zinc-800/80">
          <img
            src={currentEv.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'}
            alt={currentEv.title || 'Banner'}
            className="w-full h-28 sm:h-36 object-cover rounded-lg border border-zinc-800"
          />

          <div>
            <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-700/50 font-semibold uppercase">
              AWS Cloud Event
            </span>
            <h3 className="text-sm sm:text-lg font-bold text-white mt-1">{currentEv.title || 'Tên sự kiện'}</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
              {currentEv.description || 'Nội dung chia sẻ kiến trúc Cloud, Serverless và AI thực chiến.'}
            </p>
          </div>

          <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-2.5 sm:p-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate"><strong>Thời gian:</strong> {currentEv.start_at ? new Date(currentEv.start_at).toLocaleString('vi-VN') : 'Sắp diễn ra'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate"><strong>Địa điểm:</strong> {currentEv.venue || 'Trực tuyến'}</span>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-800/70 border border-zinc-750 p-2.5 sm:p-3 text-xs space-y-1 text-zinc-300">
            <div className="font-semibold text-white">Thông tin xác nhận:</div>
            <div>Người nhận: <em>[Tên người tham gia]</em></div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span>Trạng thái:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                ĐÃ ĐĂNG KÝ THAM GIA
              </span>
            </div>
          </div>

          <div className="text-center text-[10px] sm:text-[11px] text-zinc-500 pt-1.5 border-t border-zinc-800">
            © 2026 AWS Cloud Events Platform | Powered by AWS SES
          </div>
        </div>
      </div>
    </div>
  );
}
