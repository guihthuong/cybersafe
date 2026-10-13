"use client";

import { useMemo } from "react";
import { Scenario } from "@/types/scenario";
import { PUZZLE_CHAPTERS } from "@/data/puzzleChapters";
import { AVATAR_OPTIONS } from "@/data/avatars";
import {
  Lock,
  Check,
  Star,
  Play,
  Shield,
  Flag,
  HelpCircle,
} from "lucide-react";

interface PuzzleJourneyMapProps {
  scenarios: Scenario[];
  unlockedLevelIndex: number;
  completedLevels: Record<number, { score: number; stars: number; passedSafely: boolean }>;
  isJuryUnlockedAll: boolean;
  avatarId: string;
  onSelectLevel: (levelIndex: number) => void;
}

export function PuzzleJourneyMap({
  scenarios,
  unlockedLevelIndex,
  completedLevels,
  isJuryUnlockedAll,
  avatarId,
  onSelectLevel,
}: PuzzleJourneyMapProps) {
  const currentAvatar =
    AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];

  // Compute serpentine horizontal position (percentage from left: 20% to 80%)
  // Creates a smooth S-curve oscillation
  const nodePositions = useMemo(() => {
    return scenarios.map((_, idx) => {
      // Sinusoidal wave: period of ~8 levels
      // Offset oscillates between ~20% and ~80%
      const angle = (idx / 4) * Math.PI;
      const xPercent = Math.round(50 + 32 * Math.sin(angle));
      return { xPercent };
    });
  }, [scenarios]);

  return (
    <div className="relative w-full max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Background Decor Trail */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-slate-50 to-emerald-50/60 rounded-3xl border border-slate-200 pointer-events-none -z-10 shadow-xs" />

      {/* Chapters & Nodes Sequential Rendering */}
      <div className="space-y-12">
        {PUZZLE_CHAPTERS.map((chapter) => {
          // Chapter levels (0-indexed indices)
          const chapterStartIdx = chapter.levelStart - 1;
          const chapterEndIdx = chapter.levelEnd - 1;
          const chapterScenarios = scenarios.slice(chapterStartIdx, chapterEndIdx + 1);

          return (
            <div key={chapter.id} className="space-y-8 relative">
              {/* CHAPTER LANDMARK BANNER (Candy Crush Style Landmark) */}
              <div className="mx-auto max-w-md p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-center relative overflow-hidden group hover:border-sky-400 transition-all">
                <div
                  className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${chapter.themeGradient}`}
                />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider mb-2">
                  <Flag className="w-3.5 h-3.5 text-sky-700" />
                  <span>{chapter.badgeLabel}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {chapter.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  {chapter.description}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Mốc địa danh: {chapter.landmarkName}</span>
                  <span>Ải {chapter.levelStart} ➔ {chapter.levelEnd}</span>
                </div>
              </div>

              {/* SERPENTINE NODES FOR THIS CHAPTER */}
              <div className="relative py-4 space-y-14">
                {chapterScenarios.map((scenario, relIdx) => {
                  const globalIdx = chapterStartIdx + relIdx;
                  const levelNum = globalIdx + 1;
                  const pos = nodePositions[globalIdx] || { xPercent: 50 };

                  const isUnlocked = isJuryUnlockedAll || globalIdx <= unlockedLevelIndex;
                  const isCompleted = completedLevels[globalIdx]?.passedSafely;
                  const isCurrent = globalIdx === unlockedLevelIndex && !isCompleted;
                  const earnedStars = completedLevels[globalIdx]?.stars || 0;

                  return (
                    <div
                      key={scenario.scenario_id}
                      className="relative flex flex-col items-center justify-center transition-all"
                      style={{
                        marginLeft: `${Math.max(5, Math.min(75, pos.xPercent - 15))}%`,
                      }}
                    >
                      {/* Current Active Floating Avatar Pin */}
                      {isCurrent && (
                        <div className="absolute -top-12 z-20 flex flex-col items-center animate-bounce pointer-events-none">
                          <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-sky-400">
                            <Play className="w-3 h-3 text-sky-400 fill-sky-400" />
                            <span>Ải Hiện Tại</span>
                          </div>
                          <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1" />
                        </div>
                      )}

                      {/* Stars for Completed Levels */}
                      {isCompleted && (
                        <div className="absolute -top-5 flex items-center gap-0.5 z-10">
                          {[1, 2, 3].map((starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-3.5 h-3.5 ${
                                starIdx <= earnedStars
                                  ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Main Level Circle Node Button */}
                      <button
                        onClick={() => {
                          if (isUnlocked) {
                            onSelectLevel(globalIdx);
                          }
                        }}
                        disabled={!isUnlocked}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer font-black ${
                          isCompleted
                            ? "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-4 border-emerald-200 border-b-6 border-b-emerald-800 shadow-md active:border-b-4 active:translate-y-0.5 hover:scale-105"
                            : isCurrent
                            ? "bg-gradient-to-b from-sky-400 to-sky-600 text-white border-4 border-sky-200 border-b-6 border-b-sky-800 shadow-lg ring-4 ring-sky-300 ring-offset-2 animate-pulse hover:scale-105"
                            : isUnlocked
                            ? "bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800 border-4 border-slate-300 border-b-6 border-b-slate-400 shadow-xs hover:border-sky-400 hover:text-sky-700 hover:scale-105"
                            : "bg-slate-200 text-slate-400 border-4 border-slate-300 border-b-4 border-b-slate-300 opacity-60 cursor-not-allowed"
                        }`}
                        title={
                          isUnlocked
                            ? `Ải ${levelNum}: ${scenario.category_name_vi}`
                            : `Ải ${levelNum} đang bị khóa. Hãy hoàn thành ải trước đó.`
                        }
                      >
                        {/* Status Icon or Level Number */}
                        {isCompleted ? (
                          <>
                            <span className="text-base sm:text-lg font-black leading-none">
                              {levelNum}
                            </span>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          </>
                        ) : isCurrent ? (
                          <>
                            <span className="text-lg sm:text-xl font-black leading-none">
                              {levelNum}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-tight opacity-90">
                              Vào
                            </span>
                          </>
                        ) : isUnlocked ? (
                          <>
                            <span className="text-base sm:text-lg font-black leading-none">
                              {levelNum}
                            </span>
                          </>
                        ) : (
                          <Lock className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      {/* Small Subtitle Label under Node */}
                      <div className="mt-2 text-center max-w-[130px]">
                        <span className="text-[11px] font-bold text-slate-700 block truncate">
                          {scenario.scenario_id}: {scenario.skill}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {scenario.question_type === "branching_scenario"
                            ? "Rẽ nhánh"
                            : scenario.question_type === "hotspot"
                            ? "Vùng nguy hại"
                            : "Trắc nghiệm"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Finish Trophy Banner */}
      <div className="mt-14 p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
          <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
        </div>
        <h4 className="text-lg font-black text-slate-900">
          Đích Đến: Bằng Tốt Nghiệp An Toàn Không Gian Mạng
        </h4>
        <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
          Chinh phục trọn vẹn 39 ải để đạt danh hiệu Đại Hiệp Sĩ An Toàn Số và nhận chứng chỉ hoàn thành nghiên cứu.
        </p>
      </div>
    </div>
  );
}
