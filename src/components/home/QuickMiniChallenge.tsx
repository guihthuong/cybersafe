"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, PhoneCall, HelpCircle, ShieldCheck } from "lucide-react";

export function QuickMiniChallenge() {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Câu hỏi: Công an yêu cầu chuyển tiền vào tài khoản tạm giữ qua điện thoại có đúng quy định không?
  // Đáp án đúng: SAI (KHÔNG ĐÚNG)
  const isCorrect = selectedAnswer === false;

  const handleChoose = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-sky-950/60 to-slate-950 border-b border-sky-900/30">
      <div className="max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl bg-slate-900/90 border-2 border-sky-500/30 shadow-2xl relative overflow-hidden space-y-6 backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-sky-400 uppercase tracking-widest mb-1.5">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Thử Thách Phản Xạ Nhanh 30 Giây</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Bạn Sẽ Xử Lý Thế Nào Trước Cuộc Gọi Này?
            </h2>
          </div>

          {showFeedback && (
            <button
              onClick={handleReset}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 shrink-0"
            >
              <RotateCcw className="w-4 h-4" /> Thử lại câu này
            </button>
          )}
        </div>

        {/* Question Content */}
        <div className="space-y-6">
          <div className="p-5 sm:p-7 rounded-2xl bg-slate-950/80 border-2 border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-7 h-7 text-rose-400" />
            </div>

            <div className="space-y-2 flex-1">
              <span className="text-xs text-sky-400 font-black uppercase tracking-wider block">
                Tình huống thực tế:
              </span>
              <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-200">
                Một người gọi điện thoại tự xưng là cán bộ Công an điều tra, thông báo số CCCD của bạn liên quan đường dây tội phạm. Họ yêu cầu bạn{" "}
                <span className="text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-800">
                  chuyển ngay tiền tiết kiệm vào &apos;Tài khoản tạm giữ của Tòa án&apos;
                </span>{" "}
                để thanh tra chứng minh vô tội. Điều này có đúng quy định pháp luật Việt Nam không?
              </p>
            </div>
          </div>

          {/* 2 Choice Buttons */}
          {!showFeedback ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: ĐÚNG */}
              <button
                onClick={() => handleChoose(true)}
                className="p-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-black text-base sm:text-lg border-2 border-slate-700 hover:border-slate-500 shadow-md hover-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>A. ĐÚNG — Chuyển tiền để hợp tác điều tra</span>
              </button>

              {/* Option B: SAI (Giữ trung tính, không tô màu trước làm lộ đáp án) */}
              <button
                onClick={() => handleChoose(false)}
                className="p-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-black text-base sm:text-lg border-2 border-slate-700 hover:border-slate-500 shadow-md hover-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>B. SAI — Đây là hành vi mạo danh lừa đảo</span>
              </button>
            </div>
          ) : (
            /* Instant Feedback Card */
            <div
              className={`p-6 sm:p-8 rounded-2xl border-2 transition-all space-y-4 ${
                isCorrect
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-100"
                  : "bg-rose-950/80 border-rose-500 text-rose-100"
              }`}
            >
              <div className="flex items-start gap-4">
                {isCorrect ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isCorrect
                          ? "bg-emerald-900/80 text-emerald-300 border border-emerald-700"
                          : "bg-rose-900/80 text-rose-300 border border-rose-700"
                      }`}
                    >
                      {isCorrect ? "Chính xác tuyệt đối!" : "Rủi ro cảnh báo!"}
                    </span>
                    <span className="text-xs text-slate-300 font-bold">Quy tắc vàng: 1. Dừng lại</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isCorrect
                      ? "Bạn đã xử lý hoàn toàn chính xác!"
                      : "Cảnh báo: Bạn có thể đã rơi vào bẫy lừa đảo!"}
                  </h3>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                    {isCorrect
                      ? "Cơ quan điều tra Công an, Viện kiểm sát và Tòa án KHÔNG BAO GIỜ làm việc qua điện thoại và TUYỆT ĐỐI KHÔNG yêu cầu người dân chuyển tiền vào bất kỳ tài khoản nào để chứng minh vô tội."
                      : "Cơ quan công an TUYỆT ĐỐI KHÔNG BAO GIỜ yêu cầu người dân chuyển tiền vào bất kỳ tài khoản nào qua điện thoại. Mọi hoạt động tố tụng đều có giấy triệu tập trực tiếp tại trụ sở."}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-sky-300">
                      <ShieldCheck className="w-4 h-4 text-sky-400" />
                      Phản xạ an toàn: Cúp máy ➔ Báo người thân ➔ Gọi 113
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Next */}
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Rèn luyện thêm 39 kịch bản thực tế có trong hệ thống
                </span>
                <Link
                  href="/play"
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-sm flex items-center gap-2 shadow-md hover-lift transition-all cursor-pointer"
                >
                  <span>Khám phá 39 ải luyện tập</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
