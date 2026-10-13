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
} from "lucide-react";

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
  avatarId,
  onSelectLevel,
  globalStartIndex = 0,
}: PuzzleJourneyMapProps) {
  const currentAvatar =
    AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];

  const ROW_HEIGHT = 160;
  const totalHeight = Math.max(520, scenarios.length * ROW_HEIGHT + 150);

  // Compute (x, y) coordinates for each node
  // x is percentage (26% to 74%), y is pixels
  const nodes = useMemo(() => {
    return scenarios.map((scenario, relIdx) => {
      const globalIdx = globalStartIndex + relIdx;
      // Oscillate horizontally between 30% and 70%
      const xPercent = relIdx % 2 === 0 ? 30 : 70;
      const yPixels = relIdx * ROW_HEIGHT + 130;

      // ĐIỀU KIỆN MỞ KHÓA CHO TỪNG ĐỀ TÀI:
      // 1. Ải đầu tiên của đề tài (relIdx === 0) luôn luôn được mở để người học vào bất kỳ đề tài nào cũng rèn luyện được ngay!
      // 2. Các ải tiếp theo trong đề tài (relIdx > 0) chỉ mở khi ải trước đó đã trả lời đúng chuẩn an toàn (passedSafely)!
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
    <div className="relative w-full max-w-2xl mx-auto py-4 sm:py-6 px-2 sm:px-4">
      {/* Main Map Trail Container */}
      <div
        className="relative w-full rounded-3xl bg-gradient-to-b from-sky-50/50 via-slate-50 to-emerald-50/50 border-2 border-slate-200 shadow-inner overflow-hidden"
        style={{ minHeight: `${totalHeight}px` }}
      >
        {/* SVG CANDY CRUSH ROAD OVERLAY WITH VISIBLE CONNECTING WIRE */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox={`0 0 1000 ${totalHeight}`}
          preserveAspectRatio="none"
          style={{ width: "100%", height: `${totalHeight}px` }}
        >
          {nodes.map((node, i) => {
            if (i >= nodes.length - 1) return null;
            const nextNode = nodes[i + 1];

            // Numerical SVG coordinates (0 to 1000 x-axis)
            const x1 = (node.xPercent / 100) * 1000;
            const x2 = (nextNode.xPercent / 100) * 1000;
            const y1 = node.yPixels;
            const y2 = nextNode.yPixels;
            const dy = (y2 - y1) * 0.55;

            const pathD = `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
            const isSegmentCompleted = node.isCompleted && nextNode.isUnlocked;

            return (
              <g key={`road_segment_${i}`}>
                {/* 1. Road Base / Curb border (độ dày viền đường) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="48"
                  strokeLinecap="round"
                />

                {/* 2. Road Surface (mặt đường paved) */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSegmentCompleted ? "#dcfce7" : "#f1f5f9"}
                  strokeWidth="36"
                  strokeLinecap="round"
                />

                {/* 3. Center Painted Dashes / Dây nối Candy style */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSegmentCompleted ? "#059669" : "#64748b"}
                  strokeWidth="6"
                  strokeDasharray="16 14"
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
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer font-black ${
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
                    <span className="text-base sm:text-lg font-black leading-none">
                      {node.relLevelNum || node.levelNum}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-100 mt-0.5">
                      ✓ Đạt
                    </span>
                  </>
                ) : node.isCurrent ? (
                  <>
                    <span className="text-lg sm:text-xl font-black leading-none text-white">
                      {node.relLevelNum || node.levelNum}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-sky-100 mt-0.5">
                      Chơi
                    </span>
                  </>
                ) : node.isUnlocked ? (
                  <>
                    <span className="text-lg sm:text-xl font-black leading-none">
                      {node.relLevelNum || node.levelNum}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                      Mở
                    </span>
                  </>
                ) : (
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                )}
              </button>

              {/* Scenario Label Pill below node */}
              <div className="mt-2 max-w-[105px] sm:max-w-[130px] text-center">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 bg-white/95 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs block truncate">
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
              anim: "animate-pendulum",
            };
          } else if (node.relIdx === 1) {
            roadsideArt = {
              image: "/images/hacker.png",
              label: "Vùng Nguy Cơ",
              anim: "animate-rock-sway",
            };
          } else if (node.relIdx === 2) {
            roadsideArt = {
              image: "/images/qr scam.png",
              label: "Bẫy Quét QR",
              anim: "animate-wobble",
            };
          } else if (node.relIdx === 3) {
            roadsideArt = {
              image: "/images/falling stock chart scam.png",
              label: "Sàn Ảo Đáy",
              anim: "animate-pendulum",
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
