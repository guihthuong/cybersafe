"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, PhoneCall, HelpCircle } from "lucide-react";

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
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Thử Thách Phản Xạ Nhanh 30 Giây</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Bạn Sẽ Xử Lý Thế Nào Trước Cuộc Gọi Này?
            </h2>
          </div>

          {showFeedback && (
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Thử lại câu này
            </button>
          )}
        </div>

        {/* Question Content */}
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-900 flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-100 text-rose-700 shrink-0 flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-rose-600" />
            </div>

            <div className="space-y-1.5 flex-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Tình huống thực tế:
              </span>
              <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-900">
                Một người gọi điện thoại tự xưng là cán bộ Công an điều tra, thông báo số CCCD của bạn liên quan đường dây tội phạm. Họ yêu cầu bạn{" "}
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
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
                className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border-2 border-slate-300 hover:border-slate-400 shadow-xs hover-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>A. ĐÚNG — Chuyển tiền để hợp tác điều tra</span>
              </button>

              {/* Option B: SAI (Được giữ trung tính, không tô xanh trước làm lộ đáp án) */}
              <button
                onClick={() => handleChoose(false)}
                className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border-2 border-slate-300 hover:border-slate-400 shadow-xs hover-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>B. SAI — Đây là hành vi mạo danh lừa đảo</span>
              </button>
            </div>
          ) : (
            /* Instant Feedback Card */
            <div
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                isCorrect
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                  : "bg-rose-50/80 border-rose-300 text-rose-950"
              }`}
            >
              <div className="flex items-start gap-4">
                {isCorrect ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold">
                    {isCorrect ? "Nhận định hoàn toàn chính xác!" : "Cảnh báo: Lựa chọn rất nguy hiểm!"}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed font-normal">
                    {isCorrect
                      ? "Theo quy định pháp luật Việt Nam, Cơ quan Công an, Viện kiểm sát và Tòa án TUYỆT ĐỐI KHÔNG làm việc qua điện thoại và KHÔNG BAO GIỜ yêu cầu người dân chuyển tiền vào bất kỳ 'tài khoản tạm giữ' nào."
                      : "Nếu chuyển tiền, kẻ gian sẽ tẩu tán toàn bộ tiền sang các tài khoản ảo khác chỉ trong vài phút. Cơ quan chức năng Việt Nam chỉ gửi giấy triệu tập trực tiếp đến địa phương, không bao giờ yêu cầu chuyển tiền qua điện thoại."}
                  </p>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="p-4 rounded-xl bg-white/90 border border-slate-200/80 text-sm font-medium text-slate-800">
                <strong className="text-slate-900">Quy tắc ứng phó: </strong>
                Cúp máy ngay lập tức, thông báo cho người thân trong gia đình hoặc gọi đường dây nóng 113 / đến trụ sở Công an gần nhất để kiểm tra.
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Thử lại câu này
                </button>

                <Link
                  href="/play"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs hover-lift"
                >
                  <span>Chinh phục 39 tình huống thực tế</span>
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
