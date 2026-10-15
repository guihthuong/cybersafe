"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { EducationalFeedback, Scenario } from "@/types/scenario";
import { HighlightKeywords } from "@/utils/textHighlighter";
import {
  X,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Info,
} from "lucide-react";

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
  const [showFullDetails, setShowFullDetails] = useState(false);

  useEffect(() => {
    if (isOpen && passedSafely) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#2563eb", "#10b981", "#f59e0b"],
        });
      } catch (e) {
        // Safe fallback
      }
    }
    // Reset view
    setShowFullDetails(false);
  }, [isOpen, passedSafely]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border-2 border-slate-300 shadow-2xl p-5 sm:p-6 my-4 text-slate-900 flex flex-col gap-4 max-h-[94vh] overflow-y-auto">
        {/* Header: Kết quả súc tích */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                passedSafely
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-rose-50 text-rose-800 border-rose-300"
              }`}
            >
              {passedSafely ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>XỬ LÝ AN TOÀN CHUẨN XÁC</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>CHƯA ĐẠT CHUẨN AN TOÀN</span>
                </>
              )}
            </span>

            <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Quy tắc: {feedback.core_rule}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. KHỐI BÀI HỌC CỐT LÕI (NỔI BẬT NHẤT - ĐẬP VÀO MẮT NGAY LẬP TỨC) */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border-2 space-y-1.5 ${
            passedSafely
              ? "bg-emerald-50/70 border-emerald-300"
              : "bg-rose-50/70 border-rose-300"
          }`}
        >
          <div
            className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              passedSafely ? "text-emerald-800" : "text-rose-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>BÀI HỌC CỐT LÕI CẦN NHỚ:</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            <HighlightKeywords text={feedback.safe_action} />
          </p>
        </div>

        {/* 2. CÁC ĐIỂM QUAN TRỌNG CẦN NHỚ (NGẮN GỌN - TÔ ĐẬM TỪ KHÓA) */}
        <div className="space-y-2.5">
          {/* Dấu hiệu nhận biết */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
            <div className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Dấu hiệu lạ vừa xuất hiện:</span>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-slate-800 font-medium">
              {feedback.red_flags.slice(0, 2).map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-black">•</span>
                  <span>
                    <HighlightKeywords text={flag} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hotline khẩn cấp */}
          <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5 text-blue-900">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>Tổng đài hỗ trợ khẩn cấp:</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-700 font-black">
                113 (Công an)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-700 font-black">
                156 (Báo lừa đảo)
              </span>
            </div>
          </div>
        </div>

        {/* 3. NÚT MỞ RỘNG XEM CHI TIẾT (MẶC ĐỊNH THU GỌN ĐỂ TRÁNH QUÁ TẢI CHỮ) */}
        <div>
          <button
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {showFullDetails
                ? "Thu gọn giải thích chi tiết"
                : "Xem thêm giải thích tâm lý & hậu quả nếu làm theo"}
            </span>
            {showFullDetails ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showFullDetails && (
            <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
              {/* Empathy note */}
              <div>
                <strong className="text-slate-900 block mb-0.5">
                  1. Đồng cảm & Không đổ lỗi nạn nhân:
                </strong>
                <p className="italic text-slate-600 leading-relaxed">
                  &ldquo;{feedback.empathy_note}&rdquo;
                </p>
              </div>

              {/* Consequence */}
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-rose-700 block mb-0.5">
                  2. Hậu quả thực tế nếu làm theo kẻ gian:
                </strong>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {consequence.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS - GỌN GÀNG, RÕ RÀNG */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>

          {passedSafely ? (
            onNextQuestion && hasNext ? (
              <button
                onClick={() => {
                  onClose();
                  onNextQuestion();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Qua Câu Tiếp Theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Hoàn Thành Ải!</span>
              </button>
            )
          ) : (
            <button
              onClick={() => {
                onClose();
                if (onRetry) onRetry();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử Lại Ải Này (Chọn Lại)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
