"use client";

import { RiskAnalysisResult } from "@/types/scenario";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ListFilter,
  Lightbulb,
  Compass,
  Lock,
} from "lucide-react";

interface RiskAnalysisCardProps {
  analysis: RiskAnalysisResult;
  compact?: boolean;
}

export function RiskAnalysisCard({ analysis, compact = false }: RiskAnalysisCardProps) {
  const {
    risk_level,
    title,
    summary,
    detected_red_flags,
    immediate_recommendations,
    safe_verification_steps,
  } = analysis;

  // 3 Mức rủi ro quy chuẩn theo tài liệu: CAO, TRUNG BÌNH, THẤP / CHƯA THẤY DẤU HIỆU RÕ
  // Tuyệt đối không dùng phần trăm/điểm số rủi ro giả lập khi chưa có mô hình kiểm định
  const config = {
    low: {
      badgeBg: "bg-emerald-50 text-emerald-900 border-emerald-300",
      cardBg: "bg-emerald-50/20 border-emerald-200",
      icon: ShieldCheck,
      iconColor: "text-emerald-700",
      label: "ĐÁNH GIÁ: THẤP / CHƯA THẤY DẤU HIỆU RÕ",
      note: "Chưa phát hiện dấu hiệu bất thường rõ rệt từ thông tin hiện có. Vẫn cần duy trì cảnh giác khi có yêu cầu chuyển tiền sau đó.",
    },
    check_required: {
      badgeBg: "bg-amber-50 text-amber-900 border-amber-300",
      cardBg: "bg-amber-50/20 border-amber-200",
      icon: AlertTriangle,
      iconColor: "text-amber-700",
      label: "ĐÁNH GIÁ: MỨC TRUNG BÌNH",
      note: "Có một số dấu hiệu đáng ngờ nhưng chứng cứ chưa đầy đủ. Cần tạm dừng thao tác nhạy cảm và kiểm chứng độc lập.",
    },
    high: {
      badgeBg: "bg-orange-50 text-orange-900 border-orange-300",
      cardBg: "bg-orange-50/25 border-orange-200",
      icon: ShieldAlert,
      iconColor: "text-orange-700",
      label: "ĐÁNH GIÁ: MỨC ĐỘ RỦI RO CAO",
      note: "Có bằng chứng rõ ràng liên quan đến bẫy chiếm đoạt tài sản, đòi OTP hoặc cài app độc hại. Dừng thao tác ngay lập tức.",
    },
    emergency: {
      badgeBg: "bg-rose-50 text-rose-900 border-rose-300",
      cardBg: "bg-rose-50/30 border-rose-200",
      icon: Flame,
      iconColor: "text-rose-700",
      label: "ĐÁNH GIÁ: NGUY CƠ KHẨN CẤP (CAO)",
      note: "Chiêu trò kết hợp thao túng tâm lý khẩn cấp (tai nạn, bắt giam) và ép buộc tài chính. Tuyệt đối không làm theo yêu cầu.",
    },
  }[risk_level] || {
    badgeBg: "bg-slate-100 text-slate-900 border-slate-300",
    cardBg: "bg-slate-50 border-slate-200",
    icon: ShieldAlert,
    iconColor: "text-slate-700",
    label: "ĐÁNH GIÁ: MỨC TRUNG BÌNH",
    note: "Đang phân tích đối chiếu.",
  };

  const IconComponent = config.icon;
  // Bỏ emoji nếu có lẫn trong tiêu đề
  const cleanTitle = title.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}🟢🟡🟠🔴✅❌⚠️🛑]/gu, "").trim();

  return (
    <div
      className={`rounded-2xl border text-slate-900 bg-white shadow-xs w-full overflow-hidden ${
        compact ? "p-3 sm:p-4 space-y-3.5 text-xs" : "p-5 sm:p-6 space-y-4 text-sm"
      } ${config.cardBg}`}
    >
      {/* 1. Đánh giá mức độ rủi ro (3 mức quy chuẩn) */}
      <div className="space-y-2 pb-3 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            className={`text-xs uppercase font-black px-3 py-1.5 rounded-lg border whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 ${config.badgeBg}`}
          >
            <IconComponent className="w-4 h-4 shrink-0" />
            <span>{config.label}</span>
          </span>

          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Khung phân tích Scaffolding
          </span>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {config.note}
        </p>

        {/* Tiêu đề tình huống */}
        <div className="flex items-start gap-2 pt-1">
          <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-900 leading-snug break-words">
            {cleanTitle}
          </h3>
        </div>
      </div>

      {/* 2. Dấu hiệu nhận diện (Dữ kiện quan sát được & ý nghĩa) */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
          <ListFilter className="w-3.5 h-3.5 text-slate-700 shrink-0" />
          <span>Dấu hiệu nhận diện đáng ngờ:</span>
        </div>
        <div className="space-y-1.5">
          {detected_red_flags.map((flag, idx) => {
            const cleanFlag = flag.replace(/[\u{1F300}-\u{1FAFF}🛑⚠️❌✅]/gu, "").trim();
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 flex items-start gap-2 font-medium leading-relaxed shadow-2xs"
              >
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="break-words">{cleanFlag}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Khuyến nghị trước hành động */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
          <Lightbulb className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span>Khuyến nghị trước hành động:</span>
        </div>
        <div className="space-y-1.5">
          {immediate_recommendations.map((rec, idx) => {
            const cleanRec = rec.replace(/[\u{1F300}-\u{1FAFF}🛑⚠️❌✅]/gu, "").trim();
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800 flex items-start gap-2 font-medium leading-relaxed"
              >
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="break-words">{cleanRec}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Các bước xử lý tiếp theo */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
          <Compass className="w-3.5 h-3.5 text-slate-700 shrink-0" />
          <span>Các bước kiểm chứng & xử lý:</span>
        </div>
        <div className="space-y-1.5">
          {safe_verification_steps.map((step, idx) => {
            const cleanStep = step.replace(/[\u{1F300}-\u{1FAFF}🛑⚠️❌✅🔍🛡️]/gu, "").trim();
            return (
              <div
                key={idx}
                className="p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium leading-snug flex items-center gap-2 shadow-2xs"
              >
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="break-words">{cleanStep}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Căn cứ và bảo mật dữ liệu */}
      <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-600 flex items-center gap-2 text-[11px] font-medium">
        <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="leading-tight">
          Nguyên tắc mặc định: Tuyệt đối không cung cấp OTP, mật khẩu, không bấm link lạ hay chuyển tiền khi chưa xác minh độc lập.
        </span>
      </div>
    </div>
  );
}
