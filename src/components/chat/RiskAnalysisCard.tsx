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
  compact?: boolean;
}

export function RiskAnalysisCard({ analysis, compact = false }: RiskAnalysisCardProps) {
  const {
    risk_level,
    risk_score,
    title,
    summary,
    detected_red_flags,
    immediate_recommendations,
    safe_verification_steps,
  } = analysis;

  // Cấu hình theme màu sắc chuyên nghiệp và an toàn
  const config = {
    low: {
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      cardBg: "bg-emerald-50/30 border-emerald-200",
      barColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      label: "MỨC NGUY CƠ: THẤP",
    },
    check_required: {
      badgeBg: "bg-amber-50 text-amber-800 border-amber-300",
      cardBg: "bg-amber-50/30 border-amber-200",
      barColor: "bg-amber-500",
      textColor: "text-amber-700",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      label: "CẦN KIỂM CHỨNG",
    },
    high: {
      badgeBg: "bg-orange-50 text-orange-800 border-orange-300",
      cardBg: "bg-orange-50/30 border-orange-200",
      barColor: "bg-orange-500",
      textColor: "text-orange-700",
      icon: ShieldAlert,
      iconColor: "text-orange-600",
      label: "MỨC NGUY CƠ: CAO",
    },
    emergency: {
      badgeBg: "bg-rose-50 text-rose-800 border-rose-300",
      cardBg: "bg-rose-50/40 border-rose-300 shadow-xs",
      barColor: "bg-rose-600",
      textColor: "text-rose-700",
      icon: Flame,
      iconColor: "text-rose-600",
      label: "NGUY CƠ: KHẨN CẤP",
    },
  }[risk_level];

  const IconComponent = config.icon;
  // Clean title from emojis if any
  const cleanTitle = title.replace(/[🟢🟡🟠🔴]/g, "").trim();

  return (
    <div
      className={`rounded-2xl border text-slate-900 bg-white shadow-xs w-full overflow-hidden ${
        compact ? "p-3 sm:p-4 space-y-3.5 text-xs" : "p-5 sm:p-6 space-y-5 text-sm"
      } ${config.cardBg}`}
    >
      {/* 1. Header with Badge & Risk Meter (Không bao giờ bị méo hình tròn) */}
      <div className="space-y-2.5 pb-3 border-b border-slate-200">
        {/* Hàng 1: Badge nguy cơ + Điểm số rủi ro */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] sm:text-xs uppercase font-black px-2.5 py-1 rounded-lg border whitespace-nowrap inline-flex items-center gap-1 shrink-0 ${config.badgeBg}`}
            >
              <IconComponent className="w-3.5 h-3.5 shrink-0" />
              <span>{config.label}</span>
            </span>

            {!compact && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap hidden sm:inline-block">
                Đối chiếu CSDL thủ đoạn
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shrink-0 shadow-2xs">
            <span>Chỉ số rủi ro:</span>
            <strong className={`font-black ${config.textColor}`}>
              {risk_score}/100
            </strong>
          </div>
        </div>

        {/* Thanh Gauge rủi ro toàn chiều ngang */}
        <div className="w-full h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
            style={{ width: `${risk_score}%` }}
          />
        </div>

        {/* Tiêu đề tình huống */}
        <div className="flex items-start gap-2.5 pt-1">
          <div className="p-1.5 sm:p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs mt-0.5">
            <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${config.iconColor}`} />
          </div>
          <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-900 leading-snug break-words">
            {cleanTitle}
          </h3>
        </div>
      </div>

      {/* 2. Tóm tắt phân tích */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium break-words">
        {summary}
      </div>

      {/* 3. Dấu hiệu đáng ngờ phát hiện */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
          <ListFilter className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Dấu hiệu lạ phát hiện được ({detected_red_flags.length}):</span>
        </div>
        <div className="space-y-1.5">
          {detected_red_flags.map((flag, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 flex items-start gap-2 font-medium leading-relaxed shadow-2xs"
            >
              <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                !
              </span>
              <span className="break-words">{flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Khuyến nghị xử lý an toàn */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Lightbulb className="w-3.5 h-3.5 text-sky-700 shrink-0" />
          <span>Khuyến nghị xử lý an toàn:</span>
        </div>
        <div className="space-y-1.5">
          {immediate_recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-slate-800 flex items-start gap-2 font-medium leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <span className="break-words">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Quy trình 4 bước an toàn */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Quy trình ứng phó 4 bước:</span>
        </div>
        <div
          className={`grid gap-1.5 text-xs text-slate-700 ${
            compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {safe_verification_steps.map((step, idx) => {
            const cleanStep = step.replace(/[🛑🔍🛡️✅]/g, "").trim();
            return (
              <div
                key={idx}
                className="p-2 rounded-lg bg-white border border-slate-200 font-medium leading-snug flex items-center gap-2 shadow-2xs"
              >
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="break-words">{cleanStep}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Cảnh báo bảo mật */}
      <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-600 flex items-center gap-2 text-[11px] font-semibold">
        <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="leading-tight">
          Hệ thống tuyệt đối không bao giờ yêu cầu bạn cung cấp mật khẩu hay mã OTP.
        </span>
      </div>
    </div>
  );
}
