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
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PreTestModal } from "@/components/auth/PreTestModal";
import { WeeklyLeaderboard } from "@/components/game/WeeklyLeaderboard";

export default function PlayPage() {
  const { user, profile: authProfile, openAuthModal, recordPreTestResult } = useAuth();
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

  // Kiểm tra xem người dùng đã hoàn thành bài khảo sát đầu vào Pre-Test chưa
  const isPretestDone = Boolean(
    authProfile?.pretest_completed ||
    (typeof window !== "undefined" && user?.id && localStorage.getItem(`cybersafe_pretest_done_${user.id}`) === "true")
  );
  const [showPreTestModal, setShowPreTestModal] = useState<boolean>(!isPretestDone);

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

  const handlePreTestComplete = async (
    score: number,
    details: { competencyLevel: string; needsImprovement: string[] }
  ) => {
    setShowPreTestModal(false);
    await recordPreTestResult(score, details);
  };

  // 1. Kiểm tra trạng thái đăng nhập bắt buộc theo yêu cầu đề tài
  if (!user) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600 font-mono">
              Bắt Buộc Đăng Nhập
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Khu Vực 39 Ải Thử Thách
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Theo quy định của hệ thống, bạn cần đăng nhập tài khoản bằng SĐT hoặc Email để làm các câu hỏi chính thức, đo lường năng lực và tích lũy huy hiệu.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal("signin")}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Đăng Nhập Ngay</span>
            </button>

            <button
              onClick={() => openAuthModal("signup")}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
            >
              Chưa có tài khoản? Đăng ký bằng SĐT / Email
            </button>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/#demo-quiz"
                className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold inline-flex items-center gap-1"
              >
                <span>Trải nghiệm 2 câu hỏi Demo ở Trang chủ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Pre-Test Modal xuất hiện ở lần đăng nhập đầu tiên */}
      <PreTestModal
        isOpen={showPreTestModal}
        onComplete={handlePreTestComplete}
        userDisplayName={authProfile?.display_name || user.email || "Học Viên"}
      />

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

        {/* Diagnostic Insights: Nội dung cần cải thiện khi người dùng đăng nhập */}
        {authProfile?.needs_improvement && authProfile.needs_improvement.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Nội dung cần tập trung cải thiện (Theo khảo sát đầu vào):</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {authProfile.needs_improvement.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-950"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full shrink-0">
              Điểm Pre-test: {authProfile.pretest_score ?? 0}/10
            </span>
          </div>
        )}

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
                    className="rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between space-y-4 group"
                  >
                    {/* 1. Header: Topic Code, Stars & Count */}
                    <div className="flex items-center justify-between pb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
                          {chapter.topicCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {chapterScenarios.length} Ải
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>
                          {starsInChapter}/{totalStarsPossible}★
                        </span>
                      </div>
                    </div>

                    {/* 2. FULL UNCROPPED ILLUSTRATION DISPLAY */}
                    <div className="w-full h-48 sm:h-52 bg-slate-50/80 rounded-2xl overflow-hidden p-2.5 flex items-center justify-center border border-slate-100 group-hover:border-sky-200 group-hover:bg-sky-50/20 transition-all">
                      <img
                        src={encodeURI(chapter.imageUrl)}
                        alt={chapter.title}
                        className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300 select-none"
                      />
                    </div>

                    {/* 3. Text Details */}
                    <div className="space-y-1.5 flex-1">
                      <div>
                        <h3 className="text-base font-black text-slate-900 group-hover:text-sky-700 transition-colors leading-snug line-clamp-1">
                          {chapter.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5 line-clamp-1">
                          {chapter.subtitle}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {chapter.description}
                      </p>
                    </div>

                    {/* 4. Progress Bar & Enter Topic Button */}
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
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-800 border-2 border-emerald-300 hover:bg-emerald-100"
                            : "bg-sky-600 hover:bg-sky-700 text-white border-b-2 border-sky-800 active:translate-y-0.5"
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

                const scenarioChapter = PUZZLE_CHAPTERS.find((c) =>
                  c.scenarioIds.includes(scenario.scenario_id)
                );

                return (
                  <div
                    key={scenario.scenario_id}
                    onClick={() => {
                      if (isUnlocked) handleSelectLevel(globalIndex);
                    }}
                    className={`rounded-2xl p-4 border transition-all text-left flex flex-col justify-between space-y-3 ${
                      !isUnlocked
                        ? "bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                        : "bg-white border-slate-200 hover:border-sky-300 hover:shadow-md cursor-pointer group"
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200 shadow-xs">
                            <img
                              src={encodeURI(scenarioChapter?.imageUrl || "/images/cybersecurity.png")}
                              alt={scenario.category_name_vi}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                              Ải {globalIndex + 1} • {scenario.scenario_id}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {scenario.category_name_vi}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {isPassed ? (
                            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {progressItem.stars}★
                            </span>
                          ) : isUnlocked ? (
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                              Sẵn sàng
                            </span>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {scenario.context}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="text-[10px] font-medium text-slate-400">{scenario.skill}</span>
                      {isUnlocked && (
                        <span className="text-sky-700 font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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

        {/* 4. BẢNG XẾP HẠNG TOP 10 TUẦN / CHỦ ĐỀ & VINH DANH */}
        <WeeklyLeaderboard />

        {/* 5. MODAL SUPABASE DATABASE STATUS & SYNC */}
        {isDbModalOpen && (
          <div
            onClick={() => setIsDbModalOpen(false)}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 cursor-default"
            >
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
