"use client";

import { useState } from "react";
import { Scenario, HotspotArea } from "@/types/scenario";
import { Eye, CheckCircle, AlertTriangle, HelpCircle, RotateCcw, Check, Info, ArrowRight, ShieldAlert } from "lucide-react";

interface HotspotQuestionProps {
  scenario: Scenario;
  onFinish: (passed: boolean, earnedScore: number) => void;
  onNextQuestion?: () => void;
  hasNext?: boolean;
}

export function HotspotQuestion({
  scenario,
  onFinish,
  onNextQuestion,
  hasNext = true,
}: HotspotQuestionProps) {
  const hotspots: HotspotArea[] = scenario.options.hotspots || [];
  const requiredSpots = hotspots.filter((h) => h.is_suspicious);

  const [clickedSpotIds, setClickedSpotIds] = useState<string[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<HotspotArea | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const foundSuspiciousCount = clickedSpotIds.filter((id) =>
    requiredSpots.some((h) => h.id === id)
  ).length;

  const handleSpotClick = (spot: HotspotArea) => {
    setActiveTooltip(spot);
    if (!clickedSpotIds.includes(spot.id)) {
      const updated = [...clickedSpotIds, spot.id];
      setClickedSpotIds(updated);

      const foundCount = updated.filter((id) => requiredSpots.some((h) => h.id === id)).length;
      if (foundCount === requiredSpots.length) {
        setIsSubmitted(true);
        onFinish(true, 100);
      }
    }
  };

  const handleReset = () => {
    setClickedSpotIds([]);
    setActiveTooltip(null);
    setIsSubmitted(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Target instruction & Counter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-sm sm:text-base text-slate-800 font-bold">
          <Eye className="w-5 h-5 text-sky-600 shrink-0" />
          <span>
            Nhiệm vụ: Hãy <strong className="text-amber-700 underline decoration-amber-400">bấm trực tiếp</strong> vào các điểm đáng ngờ trên ảnh tin nhắn.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">Đã tìm thấy:</span>
          <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-black text-sm">
            {foundSuspiciousCount} / {requiredSpots.length} điểm
          </span>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Thử lại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
          Tin nhắn Zalo mô phỏng gửi đến thiết bị
        </div>

        {/* Message visual */}
        <div className="relative max-w-xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              C06
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                {scenario.stimulus.sender || "Cán Bộ Hỗ Trợ VNeID"}
              </div>
              <div className="text-xs text-slate-500">Tin nhắn Zalo đến số điện thoại cá nhân</div>
            </div>
          </div>

          {/* Message Content Bubble */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm leading-relaxed text-slate-800 shadow-2xs">
            <p className="italic">
              &ldquo;{scenario.stimulus.content || scenario.context}&rdquo;
            </p>
          </div>

          {/* Inspection Choices Prompt */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Bấm vào các chi tiết bạn nghi ngờ là bẫy lừa đảo:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hotspots.map((spot, idx) => {
                const isClicked = clickedSpotIds.includes(spot.id);
                let btnStyle = "bg-white hover:bg-slate-100 border-slate-300 text-slate-800";

                if (isClicked) {
                  if (spot.is_suspicious) {
                    btnStyle = "bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-200";
                  } else {
                    btnStyle = "bg-slate-100 border-slate-300 text-slate-500";
                  }
                }

                return (
                  <button
                    key={spot.id}
                    onClick={() => handleSpotClick(spot)}
                    className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs ${btnStyle}`}
                  >
                    <span className="leading-snug">{spot.title}</span>
                    {isClicked && (
                      <span className="shrink-0 text-xs font-bold">
                        {spot.is_suspicious ? "⚠️ Bẫy lừa đảo" : "ℹ️ Bình thường"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Found Spots Checklist (KHÔNG LỘ ĐÁP ÁN TRƯỚC) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Tiến độ tìm bẫy lừa đảo ({foundSuspiciousCount} / {requiredSpots.length} dấu hiệu)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto">
            {requiredSpots.map((spot, idx) => {
              const isFound = clickedSpotIds.includes(spot.id);
              return (
                <div
                  key={spot.id}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
                    isFound
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs bg-white border border-slate-200 shrink-0">
                      {idx + 1}
                    </span>
                    <span>
                      {isFound ? spot.title : `Dấu hiệu nguy hiểm #${idx + 1}`}
                    </span>
                  </div>
                  <span className="text-[11px] uppercase tracking-wide">
                    {isFound ? "Đã phát hiện ✓" : "Chưa tìm ra ?"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip / Explanation Card */}
      {activeTooltip && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm ${
            activeTooltip.is_suspicious
              ? "bg-rose-50/70 border-rose-300 text-rose-950 font-medium"
              : "bg-slate-50 border-slate-200 text-slate-800"
          }`}
        >
          <div className="font-bold mb-1 flex items-center gap-1.5">
            <span>
              {activeTooltip.is_suspicious
                ? "Dấu hiệu bẫy lừa đảo chính xác:"
                : "Phân tích chi tiết:"}{" "}
              {activeTooltip.title}
            </span>
          </div>
          <p className="leading-relaxed">{activeTooltip.clue}</p>
        </div>
      )}

      {/* Completion Banner with Next Question Button */}
      {isSubmitted && (
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 font-bold text-base">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
            <span>Xuất sắc! Bạn đã phát hiện đầy đủ các điểm bẫy lừa đảo.</span>
          </div>

          {onNextQuestion && hasNext && (
            <button
              onClick={onNextQuestion}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base border-b-5 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-md flex items-center gap-2 cursor-pointer transition-all animate-pulse"
            >
              <span>Qua Câu Tiếp Theo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
