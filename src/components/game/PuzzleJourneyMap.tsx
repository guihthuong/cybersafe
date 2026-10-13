"use client";

import { useMemo } from "react";
import { Scenario } from "@/types/scenario";
import { Lock, Check, Star, Play, Shield } from "lucide-react";

interface PuzzleJourneyMapProps {
  scenarios: Scenario[];
  unlockedLevelIndex: number;
  completedLevels: Record<number, { score: number; stars: number; passedSafely: boolean }>;
  isJuryUnlockedAll: boolean;
  avatarId: string;
  onSelectLevel: (levelIndex: number) => void;
  globalStartIndex?: number; // 0-indexed offset if rendering a sub-chapter
}

export function PuzzleJourneyMap({
  scenarios,
  unlockedLevelIndex,
  completedLevels,
  isJuryUnlockedAll,
  onSelectLevel,
  globalStartIndex = 0,
}: PuzzleJourneyMapProps) {
  const ROW_HEIGHT = 175;
  const totalHeight = Math.max(540, scenarios.length * ROW_HEIGHT + 140);

  // Compute (x, y) coordinates for each node
  // Oscillate between 26% and 74%
  const nodes = useMemo(() => {
    return scenarios.map((scenario, relIdx) => {
      const globalIdx = globalStartIndex + relIdx;
      const xPercent = relIdx % 2 === 0 ? 26 : 74;
      const yPixels = relIdx * ROW_HEIGHT + 130;

      // Ải đầu tiên của đề tài luôn mở
      const isFirstInTopic = relIdx === 0;
      const prevNodeCompleted =
        relIdx > 0 &&
        Boolean(completedLevels[globalStartIndex + relIdx - 1]?.passedSafely);

      const isUnlocked =
        isJuryUnlockedAll ||
        isFirstInTopic ||
        prevNodeCompleted ||
        globalIdx <= unlockedLevelIndex;

      const isCompleted = Boolean(completedLevels[globalIdx]?.passedSafely);
      const isCurrent =
        isUnlocked &&
        !isCompleted &&
        (isFirstInTopic || prevNodeCompleted);

      const earnedStars = completedLevels[globalIdx]?.stars || 0;

      return {
        relIdx,
        globalIdx,
        levelNum: globalIdx + 1,
        relLevelNum: relIdx + 1,
        scenario,
        xPercent,
        yPixels,
        isUnlocked,
        isCompleted,
        isCurrent,
        earnedStars,
      };
    });
  }, [scenarios, globalStartIndex, unlockedLevelIndex, completedLevels, isJuryUnlockedAll]);

  return (
    <div className="relative w-full max-w-3xl mx-auto py-2 sm:py-4 px-2 sm:px-4">
      {/* Main Map Trail Container */}
      <div
        className="relative w-full rounded-3xl bg-slate-50/80 border border-slate-200/90 shadow-xs overflow-hidden"
        style={{ minHeight: `${totalHeight}px` }}
      >
        {/* Subtle Background Pattern (Clean grid dots) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* SVG ROAD TRAIL */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          {nodes.map((node, i) => {
            if (i >= nodes.length - 1) return null;
            const nextNode = nodes[i + 1];

            // SVG cubic bezier path
            const startX = `${node.xPercent}%`;
            const startY = node.yPixels;
            const endX = `${nextNode.xPercent}%`;
            const endY = nextNode.yPixels;
            const midY = (startY + endY) / 2;

            const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
            const isSegmentCompleted = node.isCompleted;

            return (
              <g key={`trail_${node.scenario.scenario_id}`}>
                {/* 1. Road Bed Base */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="38"
                  strokeLinecap="round"
                />

                {/* 2. Road Surface */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSegmentCompleted ? "#ecfdf5" : "#ffffff"}
                  strokeWidth="28"
                  strokeLinecap="round"
                />

                {/* 3. Center Guide Dashes */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSegmentCompleted ? "#10b981" : "#94a3b8"}
                  strokeWidth="4"
                  strokeDasharray="10 8"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* INTERACTIVE LEVEL NODES & CORRESPONDING PREVIEW CARDS */}
        {nodes.map((node) => {
          const isLeft = node.xPercent < 50;
          const oppositeX = isLeft ? 74 : 26;

          return (
            <div key={node.scenario.scenario_id}>
              {/* 1. Node Button */}
              <div
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
                style={{
                  left: `${node.xPercent}%`,
                  top: `${node.yPixels}px`,
                }}
              >
                {/* Active Indicator Floating Pin */}
                {node.isCurrent && (
                  <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce pointer-events-none">
                    <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-tight shadow-md flex items-center gap-1.5 border border-sky-400">
                      <Play className="w-3 h-3 text-sky-400 fill-sky-400" />
                      <span>Ải Hiện Tại</span>
                    </div>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                  </div>
                )}

                {/* Stars Badge for Completed Level */}
                {node.isCompleted && (
                  <div className="absolute -top-6 flex items-center gap-0.5 z-30 bg-white px-2 py-0.5 rounded-full shadow-xs border border-amber-200">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= node.earnedStars
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Main Node Button */}
                <button
                  onClick={() => {
                    if (node.isUnlocked) {
                      onSelectLevel(node.globalIdx);
                    }
                  }}
                  disabled={!node.isUnlocked}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer font-black ${
                    node.isCompleted
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border-4 border-white hover:scale-105"
                      : node.isCurrent
                      ? "bg-sky-600 hover:bg-sky-700 text-white shadow-lg border-4 border-white ring-4 ring-sky-200 hover:scale-105"
                      : node.isUnlocked
                      ? "bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 shadow-sm hover:border-sky-500 hover:scale-105"
                      : "bg-slate-200 text-slate-400 border-2 border-slate-300 opacity-60 cursor-not-allowed"
                  }`}
                  title={
                    node.isUnlocked
                      ? `Ải ${node.relLevelNum}: ${node.scenario.category_name_vi}`
                      : `Ải ${node.relLevelNum} đang bị khóa. Hãy hoàn thành ải trước đó.`
                  }
                >
                  {node.isCompleted ? (
                    <>
                      <Check className="w-6 h-6 text-white stroke-[3]" />
                      <span className="text-[10px] font-bold text-emerald-100 -mt-0.5">
                        Ải {node.relLevelNum}
                      </span>
                    </>
                  ) : node.isCurrent ? (
                    <>
                      <span className="text-xl sm:text-2xl font-black leading-none text-white">
                        {node.relLevelNum}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-sky-100 tracking-wide mt-0.5">
                        Bắt đầu
                      </span>
                    </>
                  ) : node.isUnlocked ? (
                    <>
                      <span className="text-xl sm:text-2xl font-black leading-none text-slate-700">
                        {node.relLevelNum}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                        Sẵn sàng
                      </span>
                    </>
                  ) : (
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                  )}
                </button>

                {/* Mobile Info Pill under node */}
                <div className="mt-2 max-w-[120px] text-center sm:hidden">
                  <span className="text-[10px] font-bold text-slate-700 bg-white/95 px-2 py-0.5 rounded-md border border-slate-200 shadow-xs block truncate">
                    Ải {node.relLevelNum} • {node.scenario.scenario_id}
                  </span>
                </div>
              </div>

              {/* 2. Desktop Human-crafted Scenario Overview Card on Opposite Side */}
              <div
                className="hidden sm:flex absolute z-15 -translate-x-1/2 -translate-y-1/2 flex-col cursor-pointer transition-all hover-lift"
                style={{
                  left: `${oppositeX}%`,
                  top: `${node.yPixels}px`,
                }}
                onClick={() => {
                  if (node.isUnlocked) onSelectLevel(node.globalIdx);
                }}
              >
                <div
                  className={`p-4 rounded-2xl border text-left w-64 shadow-xs transition-all ${
                    node.isCurrent
                      ? "bg-white border-sky-300 ring-2 ring-sky-100/80 shadow-md"
                      : node.isCompleted
                      ? "bg-white/95 border-emerald-200 hover:border-emerald-300"
                      : node.isUnlocked
                      ? "bg-white border-slate-200 hover:border-slate-300"
                      : "bg-slate-50/70 border-slate-200 opacity-60 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      Ải {node.relLevelNum} • {node.scenario.scenario_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        node.scenario.difficulty === "beginner"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : node.scenario.difficulty === "intermediate"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {node.scenario.difficulty === "beginner"
                        ? "Cơ bản"
                        : node.scenario.difficulty === "intermediate"
                        ? "Thực tế"
                        : "Chuyên sâu"}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mb-2.5">
                    {node.scenario.skill || node.scenario.category_name_vi}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 font-medium">
                      {node.scenario.question_type === "branching_scenario"
                        ? "Hội thoại phân nhánh"
                        : node.scenario.question_type === "hotspot"
                        ? "Tìm điểm khả nghi"
                        : "Trắc nghiệm tình huống"}
                    </span>
                    {node.isCompleted ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã đạt
                      </span>
                    ) : node.isCurrent ? (
                      <span className="text-sky-700 font-bold flex items-center gap-1">
                        Luyện ngay →
                      </span>
                    ) : node.isUnlocked ? (
                      <span className="text-slate-600 font-bold">
                        Mở ải
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Đang khóa
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
