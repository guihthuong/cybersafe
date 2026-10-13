"use client";

import { useMemo } from "react";
import { Scenario } from "@/types/scenario";
import { AVATAR_OPTIONS } from "@/data/avatars";
import {
  Lock,
  Check,
  Star,
  Play,
  Shield,
  Flag,
} from "lucide-react";

interface PuzzleJourneyMapProps {
  scenarios: Scenario[];
  unlockedLevelIndex: number;
  completedLevels: Record<number, { score: number; stars: number; passedSafely: boolean }>;
  isJuryUnlockedAll: boolean;
  avatarId: string;
  onSelectLevel: (levelIndex: number) => void;
  globalStartIndex?: number; // 0-indexed offset if rendering a sub-chapter
  chapterTitle?: string;
  chapterBadge?: string;
  chapterDescription?: string;
  chapterImageUrl?: string;
}

export function PuzzleJourneyMap({
  scenarios,
  unlockedLevelIndex,
  completedLevels,
  isJuryUnlockedAll,
  avatarId,
  onSelectLevel,
  globalStartIndex = 0,
  chapterTitle,
  chapterBadge,
  chapterDescription,
  chapterImageUrl,
}: PuzzleJourneyMapProps) {
  const currentAvatar =
    AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];

  const ROW_HEIGHT = 160;
  const totalHeight = Math.max(480, scenarios.length * ROW_HEIGHT + 100);

  // Compute (x, y) coordinates for each node
  // x is percentage (26% to 74%), y is pixels
  const nodes = useMemo(() => {
    return scenarios.map((scenario, relIdx) => {
      const globalIdx = globalStartIndex + relIdx;
      // Oscillate horizontally between 28% and 72%
      // relIdx % 2 === 0 => 32%, relIdx % 2 === 1 => 68%
      const xPercent = relIdx % 2 === 0 ? 32 : 68;
      const yPixels = relIdx * ROW_HEIGHT + 80;

      const isUnlocked = isJuryUnlockedAll || globalIdx <= unlockedLevelIndex;
      const isCompleted = Boolean(completedLevels[globalIdx]?.passedSafely);
      const isCurrent = globalIdx === unlockedLevelIndex && !isCompleted;
      const earnedStars = completedLevels[globalIdx]?.stars || 0;

      return {
        relIdx,
        globalIdx,
        levelNum: globalIdx + 1,
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
    <div className="relative w-full max-w-2xl mx-auto py-6 px-4">
      {/* Optional Chapter Header Landmark */}
      {chapterTitle && (
        <div className="mb-8 p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider">
              <Flag className="w-3.5 h-3.5 text-sky-700" />
              <span>{chapterBadge || "Chặng Hành Trình"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {chapterTitle}
            </h3>
            {chapterDescription && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md">
                {chapterDescription}
              </p>
            )}
          </div>

          {/* Illustrated Chapter Landmark with Swaying Animation */}
          {chapterImageUrl && (
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-sky-200/40 rounded-full blur-xl animate-pulse-halo pointer-events-none" />
              <div className="relative z-10 w-full h-full animate-sway-gentle hover-tilt flex items-center justify-center">
                <img
                  src={chapterImageUrl}
                  alt={chapterTitle}
                  className="w-full h-full object-contain drop-shadow-md select-none"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Map Trail Container */}
      <div
        className="relative w-full rounded-3xl bg-gradient-to-b from-sky-50/50 via-slate-50 to-emerald-50/50 border-2 border-slate-200 shadow-inner overflow-hidden"
        style={{ minHeight: `${totalHeight}px` }}
      >
        {/* SVG CANDY CRUSH ROAD OVERLAY */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ width: "100%", height: `${totalHeight}px` }}
        >
          <defs>
            <linearGradient id="roadUnlockedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="roadCompletedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {nodes.map((node, i) => {
            if (i >= nodes.length - 1) return null;
            const nextNode = nodes[i + 1];

            // SVG Path using cubic Bezier curve
            // We use percentage coordinates converted to path representation:
            // S-curve between (node.xPercent%, node.yPixels) and (nextNode.xPercent%, nextNode.yPixels)
            const y1 = node.yPixels;
            const y2 = nextNode.yPixels;
            const dy = (y2 - y1) * 0.55;

            // Compute SVG path with SVG percentages by viewBox or relative path
            const x1 = node.xPercent;
            const x2 = nextNode.xPercent;

            const pathD = `M ${x1}% ${y1} C ${x1}% ${y1 + dy}, ${x2}% ${y2 - dy}, ${x2}% ${y2}`;
            const isSegmentCompleted = node.isCompleted && nextNode.isUnlocked;

            return (
              <g key={`road_segment_${i}`}>
                {/* 1. Road Base / Curb border (độ dày viền đường) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="38"
                  strokeLinecap="round"
                />

                {/* 2. Road Surface (mặt đường paved) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSegmentCompleted ? "#d1fae5" : "#f1f5f9"}
                  strokeWidth="28"
                  strokeLinecap="round"
                />

                {/* 3. Center Painted Dashes (vạch kẻ đường Candy style) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSegmentCompleted ? "#059669" : "#94a3b8"}
                  strokeWidth="4"
                  strokeDasharray="10 10"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* INTERACTIVE LEVEL CIRCLE NODES */}
        {nodes.map((node) => {
          return (
            <div
              key={node.scenario.scenario_id}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all"
              style={{
                left: `${node.xPercent}%`,
                top: `${node.yPixels}px`,
              }}
            >
              {/* Active Floating Avatar Pin */}
              {node.isCurrent && (
                <div className="absolute -top-14 z-20 flex flex-col items-center animate-bounce pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border-2 border-sky-400">
                    <Play className="w-3 h-3 text-sky-400 fill-sky-400" />
                    <span>Ải Hiện Tại</span>
                  </div>
                  <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1" />
                </div>
              )}

              {/* Stars Badge for Completed Levels */}
              {node.isCompleted && (
                <div className="absolute -top-6 flex items-center gap-0.5 z-20 bg-white/90 px-2 py-0.5 rounded-full shadow-xs border border-amber-200">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-3.5 h-3.5 ${
                        starIdx <= node.earnedStars
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Circular Node Button */}
              <button
                onClick={() => {
                  if (node.isUnlocked) {
                    onSelectLevel(node.globalIdx);
                  }
                }}
                disabled={!node.isUnlocked}
                className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer font-black ${
                  node.isCompleted
                    ? "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-4 border-emerald-200 border-b-6 border-b-emerald-800 shadow-lg active:border-b-4 active:translate-y-0.5 hover:scale-105"
                    : node.isCurrent
                    ? "bg-gradient-to-b from-sky-400 to-sky-600 text-white border-4 border-sky-200 border-b-6 border-b-sky-800 shadow-xl ring-4 ring-sky-300 ring-offset-2 animate-pulse hover:scale-105"
                    : node.isUnlocked
                    ? "bg-gradient-to-b from-white to-slate-100 text-slate-800 border-4 border-slate-300 border-b-6 border-b-slate-400 shadow-md hover:border-sky-400 hover:text-sky-700 hover:scale-105"
                    : "bg-slate-200 text-slate-400 border-4 border-slate-300 border-b-4 border-b-slate-300 opacity-60 cursor-not-allowed"
                }`}
                title={
                  node.isUnlocked
                    ? `Ải ${node.levelNum}: ${node.scenario.category_name_vi}`
                    : `Ải ${node.levelNum} đang bị khóa. Hãy hoàn thành ải trước đó.`
                }
              >
                {node.isCompleted ? (
                  <>
                    <span className="text-lg font-black leading-none">
                      {node.levelNum}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-100 mt-0.5">
                      ✓ Đạt
                    </span>
                  </>
                ) : node.isCurrent ? (
                  <>
                    <span className="text-xl font-black leading-none text-white">
                      {node.levelNum}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-sky-100 mt-0.5">
                      Chơi
                    </span>
                  </>
                ) : node.isUnlocked ? (
                  <>
                    <span className="text-xl font-black leading-none">
                      {node.levelNum}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                      Mở
                    </span>
                  </>
                ) : (
                  <Lock className="w-6 h-6 text-slate-400" />
                )}
              </button>

              {/* Scenario Label Pill below node */}
              <div className="mt-2.5 max-w-[130px] text-center">
                <span className="text-[11px] font-bold text-slate-700 bg-white/95 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs block truncate">
                  {node.scenario.scenario_id} • {node.scenario.category_name_vi}
                </span>
              </div>
            </div>
          );
        })}

        {/* ROADSIDE DECORATIVE LANDMARKS & ILLUSTRATIONS */}
        {nodes.map((node) => {
          let roadsideArt: { image: string; label: string; anim: string } | null = null;
          const isRightSideEmpty = node.relIdx % 2 === 0;
          const xLandmark = isRightSideEmpty ? 82 : 18;

          if (node.relIdx === 0) {
            roadsideArt = {
              image: "/images/stealing OTP.png",
              label: "Cảnh Giác OTP",
              anim: "animate-float-slow",
            };
          } else if (node.relIdx === 1) {
            roadsideArt = {
              image: "/images/hacker.png",
              label: "Vùng Nguy Cơ",
              anim: "animate-sway-gentle",
            };
          } else if (node.relIdx === 2) {
            roadsideArt = {
              image: "/images/qr scam.png",
              label: "Bẫy Quét QR",
              anim: "animate-float-reverse",
            };
          } else if (node.relIdx === 3) {
            roadsideArt = {
              image: "/images/falling stock chart scam.png",
              label: "Sàn Ảo Đáy",
              anim: "animate-float-slow",
            };
          }

          if (!roadsideArt) return null;

          return (
            <div
              key={`roadside_${node.scenario.scenario_id}`}
              className="hidden sm:flex absolute z-5 -translate-x-1/2 -translate-y-1/2 flex-col items-center pointer-events-none select-none"
              style={{
                left: `${xLandmark}%`,
                top: `${node.yPixels}px`,
              }}
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 ${roadsideArt.anim} hover-tilt flex items-center justify-center opacity-90`}>
                <img
                  src={roadsideArt.image}
                  alt={roadsideArt.label}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs mt-1">
                {roadsideArt.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
