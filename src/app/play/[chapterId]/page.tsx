"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { PUZZLE_CHAPTERS, PuzzleChapter } from "@/data/puzzleChapters";
import { OFFICIAL_QUESTION_BANK } from "@/data/officialQuestionBank";
import { SCENARIO_Q1_1, SCENARIO_Q1_3, SCENARIO_Q2_2 } from "@/data/phase2Scenarios";
import { Scenario } from "@/types/scenario";
import { usePlayerJourney } from "@/hooks/usePlayerJourney";
import { PuzzleJourneyMap } from "@/components/game/PuzzleJourneyMap";
import { PuzzleLevelModal } from "@/components/game/PuzzleLevelModal";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Flag,
  Lock,
  Unlock,
  Star,
  Award,
  Shield,
  RotateCcw,
} from "lucide-react";

interface ChapterPageProps {
  params: Promise<{
    chapterId: string;
  }>;
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const { chapterId } = use(params);
  const router = useRouter();

  // Find corresponding chapter/topic
  const chapter = useMemo(() => {
    return PUZZLE_CHAPTERS.find((c) => c.id === chapterId);
  }, [chapterId]);

  if (!chapter) {
    notFound();
  }

  // Find next chapter if available
  const nextChapter = useMemo(() => {
    const currentIdx = PUZZLE_CHAPTERS.findIndex((c) => c.id === chapterId);
    if (currentIdx !== -1 && currentIdx < PUZZLE_CHAPTERS.length - 1) {
      return PUZZLE_CHAPTERS[currentIdx + 1];
    }
    return null;
  }, [chapterId]);

  // All 39 scenarios
  const allScenarios: Scenario[] = useMemo(() => {
    return OFFICIAL_QUESTION_BANK.map((s) => {
      if (s.scenario_id === "Q1.1") return SCENARIO_Q1_1;
      if (s.scenario_id === "Q1.3") return SCENARIO_Q1_3;
      if (s.scenario_id === "Q2.2") return SCENARIO_Q2_2;
      return s;
    });
  }, []);

  // Filter scenarios belonging to this chapter
  const chapterScenarios = useMemo(() => {
    return chapter.scenarioIds
      .map((id) => allScenarios.find((s) => s.scenario_id === id))
      .filter((s): s is Scenario => Boolean(s));
  }, [chapter, allScenarios]);

  // Global index of first scenario in this chapter
  const globalStartIndex = useMemo(() => {
    if (chapterScenarios.length === 0) return 0;
    const firstId = chapterScenarios[0].scenario_id;
    const idx = allScenarios.findIndex((s) => s.scenario_id === firstId);
    return idx !== -1 ? idx : 0;
  }, [chapterScenarios, allScenarios]);

  const {
    profile,
    unlockedLevelIndex,
    completedLevels,
    isJuryUnlockedAll,
    toggleJuryUnlockedAll,
    recordLevelResult,
  } = usePlayerJourney();

  const [activeModalLevelIndex, setActiveModalLevelIndex] = useState<number | null>(null);

  const handleSelectLevel = (globalIdx: number) => {
    setActiveModalLevelIndex(globalIdx);
  };

  const handleCloseModal = () => {
    setActiveModalLevelIndex(null);
  };

  const handleCompleteLevel = (
    levelIndex: number,
    scenarioId: string,
    passed: boolean,
    score: number
  ) => {
    recordLevelResult(levelIndex, scenarioId, passed, score);
  };

  const handleNextLevel = () => {
    if (activeModalLevelIndex !== null) {
      // Find position of current scenario within chapter
      const currentScenario = allScenarios[activeModalLevelIndex];
      const relIdx = chapterScenarios.findIndex((s) => s.scenario_id === currentScenario.scenario_id);
      if (relIdx !== -1 && relIdx < chapterScenarios.length - 1) {
        const nextScenario = chapterScenarios[relIdx + 1];
        const nextGlobalIdx = allScenarios.findIndex((s) => s.scenario_id === nextScenario.scenario_id);
        setActiveModalLevelIndex(nextGlobalIdx);
        return;
      }
    }
    setActiveModalLevelIndex(null);
  };

  // Check progress within this chapter
  const chapterCompletedCount = useMemo(() => {
    return chapterScenarios.filter((s) => {
      const gIdx = allScenarios.findIndex((all) => all.scenario_id === s.scenario_id);
      return completedLevels[gIdx]?.passedSafely;
    }).length;
  }, [chapterScenarios, allScenarios, completedLevels]);

  const isChapterAllCompleted = chapterCompletedCount === chapterScenarios.length;

  const activeScenario =
    activeModalLevelIndex !== null ? allScenarios[activeModalLevelIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* UNIFIED CHAPTER HEADER CARD - GỌN GÀNG, KHÔNG BỊ TRÙNG LẶP */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          {/* Top row: Back button & Status metrics */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <Link
              href="/play"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay Lại Danh Sách Đề Tài</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Đã đạt: {chapterCompletedCount} / {chapterScenarios.length} Ải
                </span>
              </div>

              <button
                onClick={toggleJuryUnlockedAll}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isJuryUnlockedAll
                    ? "bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-xs"
                    : "bg-white text-slate-500 hover:text-slate-800 border-slate-200"
                }`}
                title="Chế độ giám khảo (mở toàn bộ ải)"
              >
                {isJuryUnlockedAll ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-amber-700" />
                    <span className="hidden sm:inline">Giám Khảo (Mở Hết)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Chế độ Giám Khảo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom row: Topic Info & Mascot */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 uppercase tracking-wider">
                  {chapter.topicCode}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {chapter.badgeLabel}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {chapter.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                {chapter.description}
              </p>
            </div>

            {/* Mascot Landmark (gọn gàng, tỉ lệ cân xứng, không chiếm nhiều diện tích) */}
            {chapter.imageUrl && (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 mx-auto sm:mx-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-sky-100 rounded-2xl blur-md pointer-events-none" />
                <div className="relative z-10 w-full h-full animate-pendulum hover-tilt flex items-center justify-center p-1 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <img
                    src={chapter.imageUrl}
                    alt={chapter.title}
                    className="w-full h-full object-contain drop-shadow-sm select-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Winding Road Puzzle for this Chapter */}
        <PuzzleJourneyMap
          scenarios={chapterScenarios}
          unlockedLevelIndex={unlockedLevelIndex}
          completedLevels={completedLevels}
          isJuryUnlockedAll={isJuryUnlockedAll}
          avatarId={profile.avatarId}
          onSelectLevel={handleSelectLevel}
          globalStartIndex={globalStartIndex}
        />

        {/* Chapter Completion Victory Card */}
        {isChapterAllCompleted && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-sky-600 text-white shadow-xl text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center font-black">
              <Award className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">
                Chứng Chỉ Hoàn Thành Đề Tài
              </span>
              <h3 className="text-2xl font-black">
                Xuất Sắc! Bạn Đã Vượt Qua Toàn Bộ Ải Của {chapter.title}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto font-medium">
                Phản xạ an toàn của bạn đối với chiêu thức này đã đạt mức vững vàng. Hãy tiếp tục thử thách với các đề tài tiếp theo!
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/play"
                className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors"
              >
                Trở Về Trang Đề Tài
              </Link>

              {nextChapter && (
                <Link
                  href={`/play/${nextChapter.id}`}
                  className="px-6 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-black text-xs shadow-md transition-colors flex items-center gap-1.5"
                >
                  <span>Chinh Phục {nextChapter.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Level Challenge Modal */}
        {activeScenario && activeModalLevelIndex !== null && (
          <PuzzleLevelModal
            scenario={activeScenario}
            levelIndex={activeModalLevelIndex}
            totalLevels={allScenarios.length}
            isOpen={true}
            onClose={handleCloseModal}
            onCompleteLevel={handleCompleteLevel}
            onNextLevel={handleNextLevel}
            hasNext={Boolean(
              chapterScenarios.findIndex((s) => s.scenario_id === activeScenario.scenario_id) <
                chapterScenarios.length - 1
            )}
          />
        )}
      </div>
    </div>
  );
}
