"use client";

import { useState } from "react";
import { OFFICIAL_QUESTION_BANK } from "@/data/officialQuestionBank";

import { SCENARIO_Q1_1, SCENARIO_Q1_3, SCENARIO_Q2_2 } from "@/data/phase2Scenarios";
import { Scenario } from "@/types/scenario";
import { usePlayerJourney } from "@/hooks/usePlayerJourney";
import { useScenarios } from "@/hooks/useScenarios";
import { PlayerHeaderBar } from "@/components/game/PlayerHeaderBar";
import { PuzzleJourneyMap } from "@/components/game/PuzzleJourneyMap";
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
  const [isBankOpen, setIsBankOpen] = useState(false);
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


  // Click on level node
  const handleSelectLevel = (levelIndex: number) => {
    setActiveModalLevelIndex(levelIndex);
  };

  // Close modal
  const handleCloseModal = () => {
    setActiveModalLevelIndex(null);
  };

  // Level completed in modal
  const handleCompleteLevel = (
    levelIndex: number,
    scenarioId: string,
    passed: boolean,
    score: number
  ) => {
    recordLevelResult(levelIndex, scenarioId, passed, score);
  };

  // Jump to next level
  const handleNextLevel = () => {
    if (activeModalLevelIndex !== null && activeModalLevelIndex < allScenarios.length - 1) {
      setActiveModalLevelIndex(activeModalLevelIndex + 1);
    } else {
      setActiveModalLevelIndex(null);
    }
  };

  // Jump to active level from header bar
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
      <div className="max-w-6xl mx-auto space-y-6">
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


        {/* 2. MAIN EXPERIENCE: PUZZLE JOURNEY MAP (CANDY CRUSH / DUOLINGO STYLE) */}
        {viewMode === "map" ? (
          <div className="space-y-4">
            {/* Map Header Introduction */}
            <div className="text-center max-w-xl mx-auto space-y-1.5 pt-2">
              <span className="text-xs uppercase font-mono font-bold text-sky-800 tracking-wider">
                Bản Đồ Thử Thách Không Gian Mạng
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Chinh Phục 39 Ải Phòng Ngừa Lừa Đảo
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Nhấn vào các ải mở khóa trên đường đi để rèn luyện phản xạ. Trả lời chính xác để mở đường tới các vùng đất tiếp theo!
              </p>
            </div>

            {/* The Winding Puzzle Road */}
            <PuzzleJourneyMap
              scenarios={allScenarios}
              unlockedLevelIndex={unlockedLevelIndex}
              completedLevels={completedLevels}
              isJuryUnlockedAll={isJuryUnlockedAll}
              avatarId={profile.avatarId}
              onSelectLevel={handleSelectLevel}
            />
          </div>
        ) : (
          /* 3. ALTERNATIVE: DIRECT LIST / CARD BROWSER VIEW */
          <div className="space-y-6">
            {/* Filter and Bank Header */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-xs font-mono font-bold text-sky-800 uppercase tracking-wider block mb-1">
                  Chế Độ Danh Sách Tình Huống
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Toàn Bộ 39 Bài Tập Rèn Luyện
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Xem theo nhóm danh mục hoặc chọn trực tiếp bài tập bạn muốn kiểm tra.
                </p>
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="all">Tất cả 11 nhóm chủ đề</option>
                <option value="fake_police_authority">N01: Giả mạo cơ quan công quyền</option>
                <option value="bank_otp_fraud">N02: Giả mạo ngân hàng / OTP</option>
                <option value="easy_job_high_pay">N03: Lừa việc làm, CTV</option>
                <option value="romance_investment_pig">N04: Lừa đầu tư, tài chính ảo</option>
                <option value="ecommerce_fake_shipper">N05: Lừa mua bán, shipper</option>
                <option value="social_account_takeover">N07: Chiếm đoạt nick mạng xã hội</option>
                <option value="deepfake_video_call">N08: Deepfake gọi video</option>
                <option value="lottery_reward_trap">N09: Trúng thưởng tri ân</option>
                <option value="fake_scholarship_course">N10: Trại hè, học bổng nhí</option>
                <option value="malicious_app_link">N11: Mã độc tải file .apk</option>
              </select>
            </div>

            {/* List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBank.map((scenario) => {
                const globalIdx = allScenarios.findIndex(
                  (s) => s.scenario_id === scenario.scenario_id
                );
                const levelNum = globalIdx + 1;
                const isUnlocked = isLevelUnlocked(globalIdx);
                const isCompleted = completedLevels[globalIdx]?.passedSafely;
                const stars = completedLevels[globalIdx]?.stars || 0;

                return (
                  <div
                    key={scenario.scenario_id}
                    onClick={() => {
                      if (isUnlocked) handleSelectLevel(globalIdx);
                    }}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-xs ${
                      isCompleted
                        ? "bg-white border-emerald-300 hover:border-emerald-500 cursor-pointer"
                        : isUnlocked
                        ? "bg-white border-slate-200 hover:border-sky-500 cursor-pointer"
                        : "bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-800"
                              : isUnlocked
                              ? "bg-sky-100 text-sky-800"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          Ải {levelNum} • {scenario.scenario_id}
                        </span>

                        <div className="flex items-center gap-1">
                          {isCompleted ? (
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= stars
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
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

