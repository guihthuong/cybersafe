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
      <div className="relative rounded-3xl border-3 border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-4">
          Tin nhắn mô phỏng (Bấm vào phần chữ hoặc liên kết bạn thấy bất thường)
        </div>

        {/* Message visual */}
        <div className="relative max-w-lg mx-auto bg-slate-50 rounded-3xl border-2 border-slate-300 p-5 shadow-xs">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-center text-rose-600 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black text-slate-900 flex items-center gap-2">
                Thông Báo Đáng Ngờ
                <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold border border-rose-200">
                  Cần kiểm tra
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">Tin nhắn gửi đến thiết bị</div>
            </div>
          </div>

          {/* Message Body */}
          <div className="mt-4 p-5 rounded-2xl bg-white border-2 border-slate-200 text-base leading-relaxed text-slate-900 space-y-3 font-medium">
            <p className="font-semibold text-slate-800">
              {scenario.context}
            </p>

            {/* Hotspots Interactive Items */}
            <div className="p-4 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap items-center gap-2 font-mono text-sm sm:text-base font-bold">
              {hotspots.map((spot, idx) => (
                <button
                  key={spot.id}
                  onClick={() => handleSpotClick(spot)}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    clickedSpotIds.includes(spot.id)
                      ? spot.is_suspicious
                        ? "bg-rose-500 text-white font-black ring-3 ring-rose-300 shadow-sm"
                        : "bg-slate-300 text-slate-800 font-bold"
                      : "bg-white hover:bg-amber-100 border border-slate-300 text-sky-700 underline"
                  }`}
                >
                  {spot.title}
                  {clickedSpotIds.includes(spot.id) && spot.is_suspicious && (
                    <Check className="w-4 h-4 inline ml-1.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Found Spots Checklist */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {requiredSpots.map((spot) => {
            const isFound = clickedSpotIds.includes(spot.id);
            return (
              <div
                key={spot.id}
                onClick={() => handleSpotClick(spot)}
                className={`p-3.5 rounded-2xl border-2 text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between font-bold ${
                  isFound
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isFound ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <span>{spot.title}</span>
                </div>
                <span className="text-xs uppercase font-black">
                  {isFound ? "Đã phát hiện" : "Chưa bấm"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tooltip Card */}
      {activeTooltip && (
        <div
          className={`p-5 rounded-2xl border-2 transition-all text-sm sm:text-base ${
            activeTooltip.is_suspicious
              ? "bg-amber-50 border-amber-300 text-amber-950 font-medium"
              : "bg-slate-50 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center gap-2 font-black mb-1.5">
            {activeTooltip.is_suspicious ? (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            ) : (
              <Info className="w-5 h-5 text-sky-600" />
            )}
            <span>
              {activeTooltip.is_suspicious ? "Dấu hiệu đáng ngờ:" : "Nhận định chuyên môn:"}{" "}
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
