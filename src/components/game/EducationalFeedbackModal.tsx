"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { EducationalFeedback, Scenario } from "@/types/scenario";
import { X, CheckCircle, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";

interface EducationalFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  passedSafely: boolean;
  earnedScore: number;
  onNextQuestion?: () => void;
  onRetry?: () => void;
  hasNext?: boolean;
}

export function EducationalFeedbackModal({
  isOpen,
  onClose,
  scenario,
  passedSafely,
  earnedScore,
  onNextQuestion,
  onRetry,
  hasNext = true,
}: EducationalFeedbackModalProps) {
  const { feedback, consequence } = scenario;

  useEffect(() => {
    if (isOpen && passedSafely) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0284c7", "#10b981", "#f59e0b"],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen, passedSafely]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 sm:p-8 my-6 text-slate-900 flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        {/* Sticky Header with Close Button */}
        <div className="sticky -top-6 -mt-2 -mx-6 px-6 pt-4 pb-4 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-md border flex items-center gap-1.5 ${
                  passedSafely
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-rose-50 text-rose-800 border-rose-300"
                }`}
              >
                {passedSafely ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>KẾT QUẢ: XỬ LÝ AN TOÀN CHUẨN XÁC</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>CẢNH BÁO: CHƯA ĐẠT CHUẨN AN TOÀN</span>
                  </>
                )}
              </span>

              <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-300">
                {feedback.core_rule}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {passedSafely
                ? "Đánh Giá: Bạn Đã Bảo Vệ Bản Thân An Toàn"
                : "Khuyến Nghị: Hành Động Rủi Ro Cần Khắc Phục"}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cảnh báo nghiêm ngặt nếu chưa an toàn */}
        {!passedSafely && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-950 space-y-1">
            <div className="font-black text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Yêu cầu quy chuẩn đề tài:</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed text-rose-900">
              Bạn chưa thể mở khóa ải tiếp theo vì đã chọn phương án tiềm ẩn nguy hiểm. Vui lòng đọc kỹ giải thích bên dưới và bấm <strong>&ldquo;Thử Lại Ải Này&rdquo;</strong> để đưa ra quyết định an toàn!
            </p>
          </div>
        )}

        {/* KHỐI 1: VÌ SAO LỰA CHỌN NÀY AN TOÀN / KHÔNG AN TOÀN + ĐỒNG CẢM KHÔNG ĐỔ LỖI */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-2">
            1. Góc nhìn Đồng Cảm & Không Đổ Lỗi Nạn Nhân:
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-medium italic">
            &ldquo;{feedback.empathy_note}&rdquo;
          </p>
        </div>

        {/* KHỐI 2: DẤU HIỆU (RED FLAGS) CẦN NHỚ */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
          <div className="text-amber-900 font-bold text-xs uppercase tracking-wider mb-3">
            2. Dấu hiệu nhận biết đáng ngờ (Red Flags) cốt lõi:
          </div>
          <ul className="space-y-2">
            {feedback.red_flags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-amber-950 font-medium">
                <span className="w-5 h-5 rounded-md bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* KHỐI 3: CÁCH XỬ LÝ NGOÀI ĐỜI THỰC */}
        <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200">
          <div className="text-sky-900 font-bold text-xs uppercase tracking-wider mb-2">
            3. Phương án xử lý an toàn ngoài đời thực:
          </div>
          <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-semibold">
            {feedback.safe_action}
          </p>

          {feedback.hotline_or_official_channel && (
            <div className="mt-3 pt-3 border-t border-sky-200 flex items-center gap-2 text-xs sm:text-sm text-sky-900 font-bold">
              <span>Đường dây nóng chính thức: <strong>{feedback.hotline_or_official_channel}</strong></span>
            </div>
          )}
        </div>

        {/* HẬU QUẢ THỰC TẾ NẾU SẬP BẪY */}
        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 text-rose-950">
          <div className="text-rose-800 font-bold text-xs uppercase tracking-wider mb-1">
            4. Hệ quả thực tế nếu làm theo kẻ gian:
          </div>
          <div className="font-bold text-sm text-rose-900 mb-1">{consequence.title}</div>
          <p className="text-xs sm:text-sm leading-relaxed text-rose-800 font-medium">{consequence.description}</p>
        </div>

        {/* FOOTER ACTIONS - Xử lý theo đúng chuẩn: Đúng mới qua, sai thì phải thử lại */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
          >
            Đóng bảng giải thích
          </button>

          {passedSafely ? (
            onNextQuestion && hasNext ? (
              <button
                onClick={() => {
                  onClose();
                  onNextQuestion();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base border-b-5 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Qua Câu Tiếp Theo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base border-b-5 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Hoàn Thành Xuất Sắc Ải Này!</span>
              </button>
            )
          ) : (
            <button
              onClick={() => {
                onClose();
                if (onRetry) onRetry();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base border-b-5 border-rose-800 active:border-b-0 active:translate-y-1 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Thử Lại Ải Này (Chọn Lại Hành Động An Toàn)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
