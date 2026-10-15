"use client";

import { Scenario } from "@/types/scenario";
import { StimulusSimulator } from "@/components/game/StimulusSimulator";
import { BranchingScenarioQuestion } from "@/components/game/BranchingScenarioQuestion";
import { HotspotQuestion } from "@/components/game/HotspotQuestion";
import { MultipleChoiceQuestion } from "@/components/game/MultipleChoiceQuestion";
import { EducationalFeedbackModal } from "@/components/game/EducationalFeedbackModal";
import { X, ArrowLeft, Shield, Award } from "lucide-react";
import { useState, useEffect } from "react";

interface PuzzleLevelModalProps {
  scenario: Scenario;
  levelIndex: number; // 0-indexed
  totalLevels: number;
  isOpen: boolean;
  onClose: () => void;
  onCompleteLevel: (levelIndex: number, scenarioId: string, passed: boolean, score: number) => void;
  onNextLevel: () => void;
  hasNext: boolean;
}

export function PuzzleLevelModal({
  scenario,
  levelIndex,
  totalLevels,
  isOpen,
  onClose,
  onCompleteLevel,
  onNextLevel,
  hasNext,
}: PuzzleLevelModalProps) {
  const [modalFeedbackState, setModalFeedbackState] = useState<{
    isOpen: boolean;
    passedSafely: boolean;
    earnedScore: number;
  }>({
    isOpen: false,
    passedSafely: false,
    earnedScore: 0,
  });

  // Key để reset lại câu hỏi khi người dùng bấm Thử lại
  const [questionAttemptKey, setQuestionAttemptKey] = useState<number>(0);

  if (!isOpen) return null;

  const levelNum = levelIndex + 1;

  const handleFinishQuestion = (passedSafely: boolean, earnedScore: number) => {
    // Record to parent
    onCompleteLevel(levelIndex, scenario.scenario_id, passedSafely, earnedScore);

    // Open educational feedback
    setModalFeedbackState({
      isOpen: true,
      passedSafely,
      earnedScore,
    });
  };

  const handleModalNextQuestion = () => {
    setModalFeedbackState({ isOpen: false, passedSafely: false, earnedScore: 0 });
    onNextLevel();
  };

  const handleRetryQuestion = () => {
    setModalFeedbackState({ isOpen: false, passedSafely: false, earnedScore: 0 });
    setQuestionAttemptKey((prev) => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !modalFeedbackState.isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, modalFeedbackState.isOpen, onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-3xl bg-slate-50 border-2 border-slate-300 shadow-2xl p-4 sm:p-6 my-2 flex flex-col gap-4 max-h-[95vh] overflow-y-auto cursor-default"
      >
        {/* Top Header Bar - STICKY TOP */}
        <div className="sticky -top-4 sm:-top-6 -mt-2 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-3 pb-3 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trở lại bản đồ</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono font-black text-xs">
                  ẢI {levelNum} / {totalLevels}
                </span>
                <span className="text-xs uppercase font-bold text-slate-500">
                  {scenario.scenario_id}
                </span>
              </div>
              <h3 className="text-sm sm:text-lg font-black text-slate-900 leading-snug line-clamp-1">
                {scenario.category_name_vi}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200 shrink-0"
            title="Đóng ải (Trở lại)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenge Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Device Simulator */}
          <div className="lg:col-span-5">
            <div className="text-xs uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Tình huống trên điện thoại</span>
            </div>
            <StimulusSimulator
              stimulus={scenario.stimulus}
              contextText={scenario.context}
              scenario={scenario}
            />
          </div>

          {/* Right: Question Interaction */}
          <div className="lg:col-span-7">
            <div className="text-xs uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Lựa chọn cách xử lý của bạn</span>
            </div>

            {scenario.question_type === "branching_scenario" && (
              <BranchingScenarioQuestion
                key={`${scenario.scenario_id}_${questionAttemptKey}`}
                scenario={scenario}
                onFinish={handleFinishQuestion}
                onNextQuestion={handleModalNextQuestion}
                hasNext={hasNext}
              />
            )}

            {scenario.question_type === "hotspot" && (
              <HotspotQuestion
                key={`${scenario.scenario_id}_${questionAttemptKey}`}
                scenario={scenario}
                onFinish={handleFinishQuestion}
                onNextQuestion={handleModalNextQuestion}
                hasNext={hasNext}
              />
            )}

            {scenario.question_type === "multiple_choice" && (
              <MultipleChoiceQuestion
                key={`${scenario.scenario_id}_${questionAttemptKey}`}
                scenario={scenario}
                onFinish={handleFinishQuestion}
                onNextQuestion={handleModalNextQuestion}
                hasNext={hasNext}
              />
            )}
          </div>
        </div>

        {/* Educational Feedback Modal */}
        <EducationalFeedbackModal
          isOpen={modalFeedbackState.isOpen}
          onClose={() =>
            setModalFeedbackState((prev) => ({ ...prev, isOpen: false }))
          }
          scenario={scenario}
          passedSafely={modalFeedbackState.passedSafely}
          earnedScore={modalFeedbackState.earnedScore}
          onNextQuestion={handleModalNextQuestion}
          onRetry={handleRetryQuestion}
          hasNext={hasNext}
        />
      </div>
    </div>
  );
}
