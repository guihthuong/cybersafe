"use client";

import { useState, useEffect } from "react";
import { Scenario } from "@/types/scenario";
import { X, ArrowRight, RotateCcw } from "lucide-react";

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
    setShowFullDetails(false);
  }, [isOpen, passedSafely]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6 my-auto text-slate-900 flex flex-col gap-4 cursor-default"
      >
        {/* Header: Đơn giản, rõ ràng, không màu mè */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                passedSafely ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {passedSafely ? "Xử lý an toàn" : "Chưa đạt an toàn"}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {passedSafely ? "Bạn đã vượt qua câu hỏi này" : "Cần lưu ý bẫy thao túng tâm lý"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quy tắc ứng phó: <strong className="text-slate-700">{feedback.core_rule}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Cách xử lý ngoài đời thực (Khối trắng viền xám nhã nhặn) */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Bài học cần ghi nhớ:
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            {feedback.safe_action}
          </p>
        </div>

        {/* 2. Dấu hiệu nhận biết trong tình huống */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Dấu hiệu bất thường trong câu này:
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
            {feedback.red_flags.slice(0, 2).map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span className="leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Kênh hỗ trợ chính thống (Không dùng nút màu sặc sỡ) */}
        <div className="pt-2.5 pb-1 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <span>Tổng đài hỗ trợ chính thức:</span>
          <div className="flex items-center gap-3 font-semibold text-slate-800">
            <span>Cảnh sát: <strong>113</strong></span>
            <span className="text-slate-300">•</span>
            <span>Báo tin nhắn rác / lừa đảo: <strong>156</strong></span>
          </div>
        </div>

        {/* 4. Xem thêm phân tích (Thu gọn mặc định) */}
        <div>
          <button
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="w-full py-1 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors text-center cursor-pointer"
          >
            {showFullDetails ? "Thu gọn phân tích" : "Xem thêm phân tích chi tiết"}
          </button>

          {showFullDetails && (
            <div className="mt-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <p>
                <strong className="text-slate-900">Tâm lý đối tượng: </strong>
                {feedback.empathy_note}
              </p>
              <p className="pt-2 border-t border-slate-200">
                <strong className="text-slate-900">Hậu quả thực tế nếu làm theo: </strong>
                {consequence.description}
              </p>
            </div>
          )}
        </div>

        {/* Nút hành động phía dưới */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
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
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Qua câu tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Hoàn thành ải
              </button>
            )
          ) : (
            <button
              onClick={() => {
                onClose();
                if (onRetry) onRetry();
              }}
              className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử lại câu này</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
