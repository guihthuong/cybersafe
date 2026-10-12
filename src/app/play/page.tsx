"use client";

import { useState } from "react";
import { OFFICIAL_QUESTION_BANK } from "@/data/officialQuestionBank";
import { SCENARIO_Q1_1, SCENARIO_Q1_3, SCENARIO_Q2_2 } from "@/data/phase2Scenarios";
import { Scenario } from "@/types/scenario";
import { StimulusSimulator } from "@/components/game/StimulusSimulator";
import { BranchingScenarioQuestion } from "@/components/game/BranchingScenarioQuestion";
import { HotspotQuestion } from "@/components/game/HotspotQuestion";
import { MultipleChoiceQuestion } from "@/components/game/MultipleChoiceQuestion";
import { EducationalFeedbackModal } from "@/components/game/EducationalFeedbackModal";
import {
  Layers,
  ChevronDown,
  BookOpen,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function PlayPage() {
  // Toàn bộ ngân hàng 39 câu hỏi từ đề tài nghiên cứu
  const allScenarios: Scenario[] = OFFICIAL_QUESTION_BANK.map((s) => {
    if (s.scenario_id === "Q1.1") return SCENARIO_Q1_1;
    if (s.scenario_id === "Q1.3") return SCENARIO_Q1_3;
    if (s.scenario_id === "Q2.2") return SCENARIO_Q2_2;
    return s;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [isBankOpen, setIsBankOpen] = useState(false);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    passedSafely: boolean;
    score: number;
  }>({
    isOpen: false,
    passedSafely: false,
    score: 0,
  });

  const activeScenario = allScenarios[currentIndex] || allScenarios[0];

  const handleFinishQuestion = (passedSafely: boolean, earnedScore: number) => {
    setModalState({
      isOpen: true,
      passedSafely,
      score: earnedScore,
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < allScenarios.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setModalState({ isOpen: false, passedSafely: false, score: 0 });
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setModalState({ isOpen: false, passedSafely: false, score: 0 });
    }
  };

  const handleSelectScenario = (id: string) => {
    const foundIdx = allScenarios.findIndex((s) => s.scenario_id === id);
    if (foundIdx !== -1) {
      setCurrentIndex(foundIdx);
      setModalState({ isOpen: false, passedSafely: false, score: 0 });
      setIsBankOpen(false);
    }
  };

  const filteredBank = allScenarios.filter((s) => {
    if (selectedCategoryFilter === "all") return true;
    return s.category === selectedCategoryFilter;
  });

  const progressPercent = Math.round(((currentIndex + 1) / allScenarios.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Lab Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-800 mb-1.5">
              Phòng Huấn Luyện Thực Nghiệm • Ngân Hàng 39 Tình Huống
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Rèn Luyện Bản Lĩnh Nhận Diện Lừa Đảo
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
              Quy trình chuẩn: <strong className="text-sky-800">1. Dừng lại ➔ 2. Kiểm tra ➔ 3. Xác minh ➔ 4. Mới hành động</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBankOpen(!isBankOpen)}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Kho 39 Câu Hỏi</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isBankOpen ? "rotate-180" : ""}`} />
            </button>

            <button
              onClick={() =>
                setModalState({
                  isOpen: true,
                  passedSafely: true,
                  score: 100,
                })
              }
              className="px-4 py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-800 text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Xem Lời Khuyên</span>
            </button>
          </div>
        </div>

        {/* DUOLINGO STYLE QUESTION PROGRESS & NAVIGATION BAR */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black">
            {/* Prev button */}
            <button
              onClick={handlePrevQuestion}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                currentIndex === 0
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 active:scale-95"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            {/* Counter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">Tiến trình:</span>
              <span className="text-base sm:text-lg font-black text-sky-700">
                Câu {currentIndex + 1} / {allScenarios.length}
              </span>
              <span className="text-xs font-bold text-slate-400">({progressPercent}%)</span>
            </div>

            {/* Next button */}
            <button
              onClick={handleNextQuestion}
              disabled={currentIndex === allScenarios.length - 1}
              className={`px-5 py-2 rounded-xl font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                currentIndex === allScenarios.length - 1
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-sky-500 hover:bg-sky-600 text-white border-b-3 border-sky-700 active:border-b-0 active:translate-y-1 shadow-xs"
              }`}
            >
              <span>Câu tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar Fill */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Expandable 39-Question Bank Browser */}
        {isBankOpen && (
          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-300 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="text-sm font-black text-slate-800">
                Ngân Hàng Toàn Bộ 39 Tình Huống (Q1.1 – Q11.3 & C1–C3)
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="all">Tất cả 11 nhóm chủ đề</option>
                <option value="fake_police_authority">N1: Giả mạo cơ quan công quyền</option>
                <option value="bank_otp_fraud">N2: Giả mạo ngân hàng / OTP</option>
                <option value="easy_job_high_pay">N3: Lừa việc làm, CTV</option>
                <option value="romance_investment_pig">N4: Lừa đầu tư, tài chính</option>
                <option value="ecommerce_fake_shipper">N5: Lừa mua bán, shipper</option>
                <option value="social_account_takeover">N7: Chiếm đoạt nick mạng xã hội</option>
                <option value="deepfake_video_call">N8: Deepfake gọi video</option>
                <option value="lottery_reward_trap">N9: Trúng thưởng tri ân</option>
                <option value="fake_scholarship_course">N10: Trại hè, học bổng nhí</option>
                <option value="malicious_app_link">N11: Mã độc tải file .apk</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredBank.map((q) => (
                <button
                  key={q.scenario_id}
                  onClick={() => handleSelectScenario(q.scenario_id)}
                  className={`p-2.5 rounded-xl border text-xs text-left font-bold transition-all cursor-pointer ${
                    activeScenario.scenario_id === q.scenario_id
                      ? "bg-sky-500 text-white border-sky-600 shadow-xs font-black"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{q.scenario_id}</span>
                    <span className="text-[10px] opacity-75">{q.difficulty === "beginner" ? "Dễ" : q.difficulty === "intermediate" ? "TB" : "Khó"}</span>
                  </div>
                  <div className="truncate text-[11px] mt-0.5 opacity-90">{q.skill}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Active Scenario Info Bar */}
        <div className="px-5 py-3.5 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-600 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-black text-sm">
              {activeScenario.scenario_id}
            </span>
            <span className="text-slate-900 font-black text-sm">{activeScenario.category_name_vi}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>Dạng bài: <strong className="text-slate-800">{activeScenario.question_type === "branching_scenario" ? "Rẽ nhánh" : activeScenario.question_type === "hotspot" ? "Vùng nguy hại (Hotspot)" : "Trắc nghiệm"}</strong></span>
            <span>•</span>
            <span>Đối tượng: <strong className="text-slate-800">{activeScenario.stimulus?.metadata?.["Đối tượng trọng tâm"] || "Mọi lứa tuổi"}</strong></span>
          </div>
        </div>

        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Device Simulator */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="text-xs uppercase font-bold text-slate-500 mb-2">
                Màn hình thiết bị thực nghiệm
              </div>
              <StimulusSimulator
                stimulus={activeScenario.stimulus}
                contextText={activeScenario.context}
              />
            </div>
          </div>

          {/* Right: Question Interaction */}
          <div className="lg:col-span-7">
            <div className="text-xs uppercase font-bold text-slate-500 mb-2">
              Khu vực tương tác giải quyết tình huống
            </div>

            {activeScenario.question_type === "branching_scenario" && (
              <BranchingScenarioQuestion
                key={activeScenario.scenario_id}
                scenario={activeScenario}
                onFinish={handleFinishQuestion}
                onNextQuestion={handleNextQuestion}
                hasNext={currentIndex < allScenarios.length - 1}
              />
            )}

            {activeScenario.question_type === "hotspot" && (
              <HotspotQuestion
                key={activeScenario.scenario_id}
                scenario={activeScenario}
                onFinish={handleFinishQuestion}
                onNextQuestion={handleNextQuestion}
                hasNext={currentIndex < allScenarios.length - 1}
              />
            )}

            {activeScenario.question_type === "multiple_choice" && (
              <MultipleChoiceQuestion
                key={activeScenario.scenario_id}
                scenario={activeScenario}
                onFinish={handleFinishQuestion}
                onNextQuestion={handleNextQuestion}
                hasNext={currentIndex < allScenarios.length - 1}
              />
            )}
          </div>
        </div>

        {/* Educational Feedback Modal */}
        <EducationalFeedbackModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
          scenario={activeScenario}
          passedSafely={modalState.passedSafely}
          earnedScore={modalState.score}
          onNextQuestion={handleNextQuestion}
          hasNext={currentIndex < allScenarios.length - 1}
        />
      </div>
    </div>
  );
}
