"use client";

import { useState } from "react";
import Link from "next/link";
import { OFFICIAL_QUESTION_BANK } from "@/data/officialQuestionBank";
import { SCENARIO_Q1_1, SCENARIO_Q1_3, SCENARIO_Q2_2 } from "@/data/phase2Scenarios";
import { PUZZLE_CHAPTERS } from "@/data/puzzleChapters";
import { Scenario } from "@/types/scenario";
import { usePlayerJourney } from "@/hooks/usePlayerJourney";
import { useScenarios } from "@/hooks/useScenarios";
import { PlayerHeaderBar } from "@/components/game/PlayerHeaderBar";
import { PuzzleLevelModal } from "@/components/game/PuzzleLevelModal";
import {
  Layers,
  ChevronDown,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Lock,
  Database,
  Cloud,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Server,
  FileCode,
  Flag,
  Compass,
  Award,
} from "lucide-react";

export default function PlayPage() {
  const { scenarios, supabaseStatus, refreshData } = useScenarios();

  // Toàn bộ ngân hàng 39 câu hỏi: ưu tiên từ Supabase Cloud nếu có
  const currentDataset = scenarios && scenarios.length > 0 ? scenarios : OFFICIAL_QUESTION_BANK;
  const allScenarios: Scenario[] = currentDataset.map((s) => {
    if (s.scenario_id === "Q1.1") return SCENARIO_Q1_1;
    if (s.scenario_id === "Q1.3") return SCENARIO_Q1_3;
    if (s.scenario_id === "Q2.2") return SCENARIO_Q2_2;
    return s;
  });

  const {
    profile,
    unlockedLevelIndex,
    completedLevels,
    totalXp,
    streakDays,
    isJuryUnlockedAll,
    completedCount,
    progressPercent,
    rankTitle,
    rankColor,
    updateProfile,
    recordLevelResult,
    toggleJuryUnlockedAll,
    resetJourney,
    isLevelUnlocked,
  } = usePlayerJourney();

  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [activeModalLevelIndex, setActiveModalLevelIndex] = useState<number | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedStatusMessage, setSeedStatusMessage] = useState<string | null>(null);

  const handleSeedDatabase = async () => {
    setSeedLoading(true);
    setSeedStatusMessage(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeedStatusMessage(`✅ Đã nạp thành công ${data.count} ải vào Supabase Cloud!`);
        await refreshData();
      } else {
        setSeedStatusMessage(
          `⚠️ ${data.error || data.instruction || "Chính sách RLS của Supabase đang bảo vệ bảng. Vui lòng mở Supabase Dashboard -> SQL Editor và chạy file supabase/seed_39_scenarios.sql để nạp trực tiếp toàn quyền."}`
        );
      }
    } catch (err: any) {
      setSeedStatusMessage(`❌ Lỗi kết nối: ${err.message}`);
    } finally {
      setSeedLoading(false);
    }
  };

  const handleSelectLevel = (levelIndex: number) => {
    setActiveModalLevelIndex(levelIndex);
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
    if (activeModalLevelIndex !== null && activeModalLevelIndex < allScenarios.length - 1) {
      setActiveModalLevelIndex(activeModalLevelIndex + 1);
    } else {
      setActiveModalLevelIndex(null);
    }
  };

  const handleContinueActiveLevel = () => {
    const targetIdx = Math.min(38, unlockedLevelIndex);
    setActiveModalLevelIndex(targetIdx);
  };

  const activeScenario =
    activeModalLevelIndex !== null ? allScenarios[activeModalLevelIndex] : null;

  const filteredBank = allScenarios.filter((s) => {
    if (selectedCategoryFilter === "all") return true;
    return s.category === selectedCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 1. PERSONALIZED PLAYER PROFILE & STATUS BAR */}
        <PlayerHeaderBar
          profile={profile}
          totalXp={totalXp}
          streakDays={streakDays}
          completedCount={completedCount}
          progressPercent={progressPercent}
          unlockedLevelIndex={unlockedLevelIndex}
          rankTitle={rankTitle}
          rankColor={rankColor}
          isJuryUnlockedAll={isJuryUnlockedAll}
          viewMode={viewMode}
          supabaseStatus={supabaseStatus}
          onToggleViewMode={setViewMode}
          onToggleJuryMode={toggleJuryUnlockedAll}
          onUpdateProfile={updateProfile}
          onResetJourney={resetJourney}
          onContinueActiveLevel={handleContinueActiveLevel}
          onOpenDatabaseInfo={() => setIsDbModalOpen(true)}
        />

        {/* 2. CHÍNH: HUB BẢN ĐỒ CÁC ĐỀ TÀI KHOA HỌC (THEO CHƯƠNG ROUTE RIÊNG) */}
        {viewMode === "map" ? (
          <div className="space-y-6">
            {/* Header Introduction */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase font-mono font-bold text-sky-800 tracking-wider">
                11 Nhóm Thủ Đoạn Lừa Đảo Trực Tuyến & Bộ Câu Hỏi Kiểm Chuẩn
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Chọn Đề Tài Luyện Tập Phản Xạ An Toàn Số
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mỗi đề tài là một tuyến hành trình độc lập gồm các tình huống thực tiễn. Trong mỗi đề tài,
                bạn <strong>phải trả lời đúng chuẩn từng ải</strong> mới được mở khóa ải tiếp theo, không thể bỏ qua (skip).
              </p>
            </div>

            {/* Grid of Topics / Chapters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PUZZLE_CHAPTERS.map((chapter, idx) => {
                // Calculate progress within this specific topic
                const chapterScenarios = chapter.scenarioIds
                  .map((id) => allScenarios.find((s) => s.scenario_id === id))
                  .filter(Boolean);

                const completedInChapter = chapterScenarios.filter((s) => {
                  const gIdx = allScenarios.findIndex((all) => all.scenario_id === s?.scenario_id);
                  return completedLevels[gIdx]?.passedSafely;
                }).length;

                const starsInChapter = chapterScenarios.reduce((acc, s) => {
                  const gIdx = allScenarios.findIndex((all) => all.scenario_id === s?.scenario_id);
                  return acc + (completedLevels[gIdx]?.stars || 0);
                }, 0);

                const totalStarsPossible = chapterScenarios.length * 3;
                const isCompleted = completedInChapter === chapterScenarios.length && chapterScenarios.length > 0;
                const chapterPercent = Math.round((completedInChapter / chapterScenarios.length) * 100);

                return (
                  <div
                    key={chapter.id}
                    className="rounded-3xl bg-white border-2 border-slate-200 hover:border-sky-400 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-3">
                      {/* Topic Illustration Preview */}
                      {chapter.imageUrl && (
                        <div className="relative h-36 bg-gradient-to-b from-slate-50 via-sky-50/30 to-white rounded-2xl flex items-center justify-center p-3 border border-slate-100 overflow-hidden group-hover:border-sky-300 transition-colors">
                          <div className="absolute w-24 h-24 rounded-full bg-sky-200/40 blur-lg pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                          {(() => {
                            const swayAnim =
                              idx % 3 === 0
                                ? "animate-pendulum"
                                : idx % 3 === 1
                                ? "animate-rock-sway"
                                : "animate-wobble";
                            return (
                              <div className={`relative z-10 w-24 h-24 ${swayAnim} hover-tilt flex items-center justify-center`}>
                                <img
                                  src={chapter.imageUrl}
                                  alt={chapter.title}
                                  className="w-full h-full object-contain drop-shadow-sm select-none group-hover:scale-110 transition-transform duration-300"
                                  loading="lazy"
                                />
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Topic Badge & Stars */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold font-mono uppercase tracking-wider">
                          <Flag className="w-3 h-3 text-sky-700" />
                          <span>{chapter.topicCode}</span>
                        </span>

                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>
                            {starsInChapter}/{totalStarsPossible}★
                          </span>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                          {chapter.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">
                          {chapter.subtitle}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {chapter.description}
                      </p>
                    </div>

                    {/* Progress Bar & Enter Topic Button */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span>
                            Tiến độ: <strong>{completedInChapter}/{chapterScenarios.length} Ải</strong>
                          </span>
                          <span className={isCompleted ? "text-emerald-700 font-black" : "text-slate-600"}>
                            {isCompleted ? "ĐÃ HOÀN TẤT ✓" : `${chapterPercent}%`}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? "bg-emerald-500"
                                : "bg-gradient-to-r from-sky-500 to-indigo-600"
                            }`}
                            style={{ width: `${Math.max(4, chapterPercent)}%` }}
                          />
                        </div>
                      </div>

                      {/* Link to dedicated Chapter Road route */}
                      <Link
                        href={`/play/${chapter.id}`}
                        className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-800 border-2 border-emerald-300 hover:bg-emerald-100"
                            : "bg-sky-600 hover:bg-sky-700 text-white border-b-4 border-sky-800 active:border-b-0 active:translate-y-1"
                        }`}
                      >
                        <span>{isCompleted ? "Xem Lại Bản Đồ Đề Tài" : "Vào Luyện Tập Đề Tài Này"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 3. ALTERNATIVE VIEW: LIST BROWSER */
          <div className="space-y-5">
            {/* Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategoryFilter("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Tất Cả 39 Ải
              </button>
              <button
                onClick={() => setSelectedCategoryFilter("fake_police_authority")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === "fake_police_authority"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Mạo Danh Công Quyền
              </button>
              <button
                onClick={() => setSelectedCategoryFilter("fake_brand_bank")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === "fake_brand_bank"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Giả Mạo Ngân Hàng
              </button>
              <button
                onClick={() => setSelectedCategoryFilter("online_employment")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === "online_employment"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Lừa Đảo Việc Làm
              </button>
              <button
                onClick={() => setSelectedCategoryFilter("deepfake_multimedia")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === "deepfake_multimedia"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                Deepfake & AI
              </button>
            </div>

            {/* Grid Cards of Filtered Levels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBank.map((scenario) => {
                const globalIndex = allScenarios.findIndex(
                  (s) => s.scenario_id === scenario.scenario_id
                );
                const isUnlocked = isLevelUnlocked(globalIndex);
                const progressItem = completedLevels[globalIndex];
                const isPassed = progressItem?.passedSafely;

                return (
                  <div
                    key={scenario.scenario_id}
                    onClick={() => {
                      if (isUnlocked) handleSelectLevel(globalIndex);
                    }}
                    className={`rounded-2xl p-5 border transition-all text-left flex flex-col justify-between space-y-3 ${
                      !isUnlocked
                        ? "bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                        : "bg-white border-slate-200 hover:border-sky-300 hover:shadow-md cursor-pointer group"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-700 px-2 py-0.5 rounded-md bg-slate-100">
                          Ải {globalIndex + 1} • {scenario.scenario_id}
                        </span>

                        <div className="flex items-center gap-1">
                          {isPassed ? (
                            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {progressItem.stars}★
                            </span>
                          ) : isUnlocked ? (
                            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                              Sẵn sàng
                            </span>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {scenario.category_name_vi}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {scenario.context}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{scenario.skill}</span>
                      {isUnlocked && (
                        <span className="text-sky-700 font-bold flex items-center gap-1">
                          Chơi ➔
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. MODAL CHALLENGE STAGE */}
        {activeScenario && activeModalLevelIndex !== null && (
          <PuzzleLevelModal
            scenario={activeScenario}
            levelIndex={activeModalLevelIndex}
            totalLevels={allScenarios.length}
            isOpen={true}
            onClose={handleCloseModal}
            onCompleteLevel={handleCompleteLevel}
            onNextLevel={handleNextLevel}
            hasNext={activeModalLevelIndex < allScenarios.length - 1}
          />
        )}

        {/* 5. MODAL SUPABASE DATABASE STATUS & SYNC */}
        {isDbModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Database className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Cơ Sở Dữ Liệu Supabase Cloud
                    </h3>
                    <p className="text-xs text-slate-500">
                      Hệ thống lưu trữ trực tuyến cho CyberSafe Quest
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDbModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status overview cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">
                    Trạng Thái Kết Nối
                  </span>
                  <div className="flex items-center gap-1.5 font-black text-emerald-700 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Supabase Connected (200 OK)</span>
                  </div>
                  <p className="text-slate-500 truncate text-[11px] pt-1">
                    https://rtbqwfejaqczeibvjkyu.supabase.co
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">
                    Dữ Liệu Kịch Bản (Scenarios)
                  </span>
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                    <Server className="w-4 h-4 text-sky-600" />
                    <span>{supabaseStatus?.scenarioCount || 39} / 39 Ải Sẵn Sàng</span>
                  </div>
                  <p className="text-emerald-700 font-bold text-[11px] pt-1">
                    {supabaseStatus && supabaseStatus.scenarioCount > 0
                      ? "Đang nạp trực tiếp từ Supabase"
                      : "Sẵn sàng nạp lên Supabase"}
                  </p>
                </div>
              </div>

              {/* Message from action */}
              {seedStatusMessage && (
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed font-medium">
                  {seedStatusMessage}
                </div>
              )}

              {/* Actions & Guide */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSeedDatabase}
                    disabled={seedLoading}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${seedLoading ? "animate-spin" : ""}`} />
                    <span>{seedLoading ? "Đang xử lý..." : "Nạp / Đồng Bộ 39 Ải Vào Supabase"}</span>
                  </button>

                  <button
                    onClick={() => refreshData()}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Kiểm tra lại kết nối</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2 text-amber-950">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <FileCode className="w-4 h-4 text-amber-700" />
                    <span>Hướng dẫn nạp dữ liệu chuẩn trong 30 giây:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed">
                    <li>
                      Mở <strong>Supabase Dashboard</strong> dự án của bạn và chọn mục <strong>SQL Editor</strong>.
                    </li>
                    <li>
                      Mở file đã tạo sẵn trong mã nguồn: <code className="bg-amber-100 px-1 py-0.5 rounded text-slate-900 font-mono">supabase/seed_39_scenarios.sql</code>.
                    </li>
                    <li>
                      Sao chép toàn bộ nội dung và dán vào SQL Editor, sau đó bấm nút <strong>RUN</strong>.
                    </li>
                    <li>
                      Toàn bộ 39 câu hỏi chuẩn khoa học và các chính sách bảo mật sẽ được nạp tức thì vào Cloud Database!
                    </li>
                  </ol>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsDbModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Đóng Bảng Điều Khiển
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
