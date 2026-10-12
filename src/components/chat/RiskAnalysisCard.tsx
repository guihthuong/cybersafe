"use client";

import { RiskAnalysisResult } from "@/types/scenario";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ListFilter,
  Lightbulb,
  Compass,
  Lock,
} from "lucide-react";

interface RiskAnalysisCardProps {
  analysis: RiskAnalysisResult;
}

export function RiskAnalysisCard({ analysis }: RiskAnalysisCardProps) {
  const { risk_level, risk_score, title, summary, detected_red_flags, immediate_recommendations, safe_verification_steps } = analysis;

  // Cấu hình theme màu sắc chuyên nghiệp
  const config = {
    low: {
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      cardBg: "bg-emerald-50/20 border-emerald-200",
      barColor: "bg-emerald-600",
      icon: ShieldCheck,
      iconColor: "text-emerald-700",
      label: "MỨC NGUY CƠ: THẤP",
    },
    check_required: {
      badgeBg: "bg-amber-50 text-amber-800 border-amber-300",
      cardBg: "bg-amber-50/20 border-amber-200",
      barColor: "bg-amber-600",
      icon: AlertTriangle,
      iconColor: "text-amber-700",
      label: "MỨC NGUY CƠ: CẦN KIỂM CHỨNG",
    },
    high: {
      badgeBg: "bg-orange-50 text-orange-800 border-orange-300",
      cardBg: "bg-orange-50/20 border-orange-200",
      barColor: "bg-orange-600",
      icon: ShieldAlert,
      iconColor: "text-orange-700",
      label: "MỨC NGUY CƠ: CAO",
    },
    emergency: {
      badgeBg: "bg-rose-50 text-rose-800 border-rose-300",
      cardBg: "bg-rose-50/30 border-rose-300 shadow-xs",
      barColor: "bg-rose-600",
      icon: Flame,
      iconColor: "text-rose-700",
      label: "MỨC NGUY CƠ: KHẨN CẤP",
    },
  }[risk_level];

  const IconComponent = config.icon;
  // Clean title from emojis if any
  const cleanTitle = title.replace(/[🟢🟡🟠🔴]/g, "").trim();

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 space-y-5 text-slate-900 bg-white shadow-xs ${config.cardBg}`}>
      {/* 1. Header with Badge & Risk Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0">
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div>
            <span className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full border tracking-wide inline-block mb-1 ${config.badgeBg}`}>
              {config.label}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {cleanTitle}
            </h3>
          </div>
        </div>

        {/* Risk Score Gauge */}
        <div className="flex flex-col items-start sm:items-end shrink-0">
          <div className="text-xs text-slate-500 font-bold mb-1">
            Chỉ số rủi ro: <strong className="text-slate-900 text-sm font-black">{risk_score} / 100</strong>
          </div>
          <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
              style={{ width: `${risk_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Summary text */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-medium">
        {summary}
      </div>

      {/* 3. Danh sách các dấu hiệu nhận diện (Red Flags) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <ListFilter className="w-4 h-4 text-slate-600" />
          <span>Dấu hiệu nhận biết đáng ngờ phát hiện được:</span>
        </div>
        <div className="space-y-1.5">
          {detected_red_flags.map((flag, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5 font-medium leading-relaxed"
            >
              <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                !
              </span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Khuyến nghị hành động tức thời */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-sky-700" />
          <span>Khuyến nghị xử lý an toàn:</span>
        </div>
        <div className="space-y-1.5">
          {immediate_recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-sky-50/60 border border-sky-200 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5 font-medium leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Quy trình 4 bước an toàn */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-slate-600" />
          <span>Quy trình ứng phó 4 bước chuẩn:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          {safe_verification_steps.map((step, idx) => {
            const cleanStep = step.replace(/[🛑🔍🛡️✅]/g, "").trim();
            return (
              <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 font-medium leading-relaxed">
                {cleanStep}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. CẢNH BÁO BẢO MẬT BẮT BUỘC */}
      <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 flex items-center gap-2.5 text-xs font-semibold">
        <Lock className="w-4 h-4 text-slate-600 shrink-0" />
        <span>
          Cảnh báo an toàn: Hệ thống tuyệt đối không yêu cầu người dùng cung cấp mật khẩu, OTP, số thẻ hoặc dữ liệu cá nhân cho chatbot.
        </span>
      </div>
    </div>
  );
}
