"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, PhoneCall } from "lucide-react";

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
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs uppercase font-bold text-sky-800 tracking-wider block mb-0.5">
              Khảo sát phản xạ an toàn số
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Đánh giá phản xạ ứng phó trước tình huống thực tế
            </h3>
          </div>

          {showFeedback && (
            <button
              onClick={handleReset}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Thử lại câu này
            </button>
          )}
        </div>

        {/* Question Content */}
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-100/80 border border-rose-200 text-rose-700 shrink-0 flex items-center justify-center shadow-xs">
              <PhoneCall className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600" />
            </div>

            <div className="space-y-1 flex-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Tình huống mô phỏng thực tế:
              </span>
              <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-900">
                Một người gọi điện thoại tự xưng là cán bộ Công an điều tra, thông báo số CCCD của bạn liên quan đường dây rửa tiền. Họ yêu cầu bạn{" "}
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  chuyển toàn bộ tiền tiết kiệm vào &apos;Tài khoản tạm giữ của Tòa án&apos;
                </span>{" "}
                để giám định chứng minh trong sạch. Điều này có đúng quy định pháp luật Việt Nam không?
              </p>
            </div>
          </div>

          {/* 2 Choice Buttons */}
          {!showFeedback ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: ĐÚNG */}
              <button
                onClick={() => handleChoose(true)}
                className="p-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border-2 border-slate-300 hover:border-slate-400 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>A. ĐÚNG — Chuyển tiền để hợp tác điều tra</span>
              </button>

              {/* Option B: SAI */}
              <button
                onClick={() => handleChoose(false)}
                className="p-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>B. SAI — Đây là hành vi mạo danh lừa đảo</span>
              </button>
            </div>
          ) : (
            /* Instant Feedback Card */
            <div
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                isCorrect
                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                  : "bg-rose-50/70 border-rose-300 text-rose-950"
              }`}
            >
              <div className="flex items-start gap-4">
                {isCorrect ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
                )}
                <div className="space-y-1">
                  <h4 className="text-lg sm:text-xl font-bold">
                    {isCorrect ? "Nhận định chính xác" : "Cảnh báo nguy cơ"}
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed font-medium">
                    {isCorrect
                      ? "Theo quy định pháp luật Việt Nam, Cơ quan Công an, Viện kiểm sát và Tòa án không bao giờ làm việc qua điện thoại và tuyệt đối không có thủ tục yêu cầu người dân chuyển tiền vào bất kỳ 'tài khoản tạm giữ' nào."
                      : "Phương án này tiềm ẩn rủi ro rất cao. Khi người dân chuyển tiền, các đối tượng sẽ chiếm đoạt và tẩu tán sang nhiều tài khoản khác trong thời gian rất ngắn. Cơ quan nhà nước không làm việc hay yêu cầu chuyển tiền qua điện thoại."}
                  </p>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800">
                <span className="font-bold text-slate-900">Khuyến nghị xử lý: </span>
                Cúp máy ngay lập tức, thông báo cho người thân trong gia đình hoặc liên hệ trực tiếp Công an Phường/Xã sở tại để được hỗ trợ.
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Thử lại câu này
                </button>

                <Link
                  href="/play"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Luyện tập các tình huống tiếp theo</span>
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
