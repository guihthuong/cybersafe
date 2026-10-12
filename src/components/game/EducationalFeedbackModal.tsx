"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { EducationalFeedback, Scenario } from "@/types/scenario";
import { X, CheckCircle, ArrowRight } from "lucide-react";

interface EducationalFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  passedSafely: boolean;
  earnedScore: number;
  onNextQuestion?: () => void;
  hasNext?: boolean;
}

export function EducationalFeedbackModal({
  isOpen,
  onClose,
  scenario,
  passedSafely,
  earnedScore,
  onNextQuestion,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 sm:p-8 my-8 text-slate-900 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-2 pr-10 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-md border ${
              passedSafely
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-rose-50 text-rose-800 border-rose-300"
            }`}>
              {passedSafely ? "KẾT QUẢ: XỬ LÝ AN TOÀN" : "CẢNH BÁO: PHƯƠNG ÁN RỦI RO"}
            </span>

            <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-300">
              Quy tắc: {feedback.core_rule}
            </span>

            <span className="text-xs text-slate-500 font-semibold ml-auto">
              Điểm rèn luyện: +{earnedScore} XP
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug pt-1">
            {passedSafely
              ? "Đánh Giá: Bạn Đã Bảo Vệ Bản Thân An Toàn"
              : "Khuyến Nghị: Cần Nâng Cao Kỹ Năng Tự Vệ Số"}
          </h3>
        </div>

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

        {/* FOOTER ACTIONS - Prominent Next Question Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
          >
            Đóng bảng giải thích
          </button>

          {onNextQuestion && hasNext ? (
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
              <span>Đã Hiểu & Hoàn Tất</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
