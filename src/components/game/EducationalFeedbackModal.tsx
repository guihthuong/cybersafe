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
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    if (isOpen && passedSafely) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#2563eb", "#10b981", "#f59e0b"],
        });
      } catch (e) {
        // Safe fallback
      }
    }
    setShowFullDetails(false);
  }, [isOpen, passedSafely]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-slate-300 shadow-2xl p-5 sm:p-6 my-auto text-slate-900 flex flex-col gap-4">
        
        {/* THANH TIÊU ĐỀ: TRẠNG THÁI RÕ RÀNG + NÚT CỠ CHỮ + NÚT ĐÓNG */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs sm:text-sm font-black px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                passedSafely
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-rose-50 text-rose-800 border-rose-300"
              }`}
            >
              {passedSafely ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>BẠN ĐÃ XỬ LÝ AN TOÀN!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>CẢNH BÁO: BẪY NGUY HIỂM!</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút phóng to chữ cho người lớn tuổi */}
            <button
              onClick={() => setLargeText(!largeText)}
              title="Phóng to / Thu nhỏ cỡ chữ"
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                largeText
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
              }`}
            >
              Cỡ chữ {largeText ? "Lớn" : "Vừa"}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. 3 QUY TẮC VÀNG BẰNG BIỂU TƯỢNG (NHÌN LÀ HIỂU NGAY - KHÔNG CẦN ĐỌC NHIỀU) */}
        <div>
          <div className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>3 Bước Nhớ Nhanh Ngoài Đời Thực:</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Bước 1 */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center flex flex-col items-center justify-center gap-1 shadow-xs">
              <span className="text-xl sm:text-2xl">🛑</span>
              <span className={`font-black text-amber-950 ${largeText ? "text-sm" : "text-xs"} uppercase`}>
                1. CÚP MÁY NGAY
              </span>
              <span className="text-[10px] sm:text-xs text-amber-900 leading-tight">
                Không đôi co, cúp máy lập tức
              </span>
            </div>

            {/* Bước 2 */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-50 border-2 border-blue-300 text-center flex flex-col items-center justify-center gap-1 shadow-xs">
              <span className="text-xl sm:text-2xl">👨‍👩‍👦</span>
              <span className={`font-black text-blue-950 ${largeText ? "text-sm" : "text-xs"} uppercase`}>
                2. BÁO CON CHÁU
              </span>
              <span className="text-[10px] sm:text-xs text-blue-900 leading-tight">
                Hỏi người nhà hoặc Công an xã/phường
              </span>
            </div>

            {/* Bước 3 */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-50 border-2 border-rose-300 text-center flex flex-col items-center justify-center gap-1 shadow-xs">
              <span className="text-xl sm:text-2xl">🚫</span>
              <span className={`font-black text-rose-950 ${largeText ? "text-sm" : "text-xs"} uppercase`}>
                3. KHÔNG NỘP TIỀN
              </span>
              <span className="text-[10px] sm:text-xs text-rose-900 leading-tight">
                Không có "tài khoản điều tra"
              </span>
            </div>
          </div>
        </div>

        {/* 2. DẤU HIỆU LỪA ĐẢO VỪA GẶP (TỐI GIẢN CHỈ 2 Ý ĐẶC TRƯNG) */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="text-xs font-black text-slate-700 uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>2 Dấu hiệu lừa đảo trong câu này:</span>
          </div>
          <div className="space-y-1.5">
            {feedback.red_flags.slice(0, 2).map((flag, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-200"
              >
                <span className="text-rose-600 font-black text-sm">❌</span>
                <span className={`text-slate-900 font-semibold leading-snug ${largeText ? "text-sm" : "text-xs"}`}>
                  <HighlightKeywords text={flag} />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TỔNG ĐÀI CỨU TRỢ NHANH (NÚT BẤM TO RÕ) */}
        <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
          <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-blue-600" />
            <span>Đường dây nóng khẩn cấp:</span>
          </span>
          <div className="flex items-center gap-2">
            <a
              href="tel:113"
              className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              📞 113 (Công an)
            </a>
            <a
              href="tel:156"
              className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1 shadow-xs transition-colors"
            >
              🚨 156 (Báo lừa đảo)
            </a>
          </div>
        </div>

        {/* 4. XEM GIẢI THÍCH CHI TIẾT (MẶC ĐỊNH THU GỌN) */}
        <div>
          <button
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="w-full py-1.5 px-3 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-500 flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showFullDetails ? "Thu gọn giải thích" : "Xem thêm giải thích tâm lý & hậu quả"}</span>
            {showFullDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFullDetails && (
            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 animate-fadeIn">
              <p>
                <strong className="text-slate-900">Tâm lý: </strong>
                {feedback.empathy_note}
              </p>
              <p className="pt-1.5 border-t border-slate-200">
                <strong className="text-rose-700">Hậu quả nếu làm theo: </strong>
                {consequence.description}
              </p>
            </div>
          )}
        </div>

        {/* NÚT ĐI TIẾP / THỬ LẠI */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
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
                className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Qua Câu Tiếp Theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
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
              className="flex-1 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử Lại (Chọn Lại)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
