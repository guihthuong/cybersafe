"use client";

import { useState } from "react";
import { Scenario, MultipleChoiceOption } from "@/types/scenario";
import { parseScenarioStory } from "@/utils/scenarioStoryParser";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle, Check } from "lucide-react";

interface MultipleChoiceQuestionProps {
  scenario: Scenario;
  onFinish: (passed: boolean, earnedScore: number) => void;
  onNextQuestion?: () => void;
  hasNext?: boolean;
}

export function MultipleChoiceQuestion({
  scenario,
  onFinish,
  onNextQuestion,
  hasNext = true,
}: MultipleChoiceQuestionProps) {
  const options: MultipleChoiceOption[] = scenario.options.multiple_choice || [];
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const story = parseScenarioStory(scenario);

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);
    const chosen = options.find((opt) => opt.id === selectedOptionId);
    const isCorrect = chosen?.is_correct || false;
    onFinish(isCorrect, isCorrect ? 100 : 30);
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Question Action Prompt - Trực diện, ngắn gọn, dễ hiểu */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-2xs space-y-1.5">
        <div className="text-[11px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Câu hỏi cần xử lý:</span>
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
          {story.questionPrompt}
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          👉 Bấm chọn 1 phương án an toàn bên dưới rồi nhấn nút <strong className="text-blue-700 font-bold">Xác Nhận</strong>.
        </p>
      </div>

      {/* Options List - Chunky, High-contrast, Easy-to-tap Buttons */}
      <div className="space-y-2.5">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let containerStyle =
            "bg-white border-2 border-slate-200 border-b-4 border-slate-300 hover:bg-slate-50 hover:border-blue-300 text-slate-900";

          if (isSubmitted) {
            if (opt.is_correct) {
              containerStyle =
                "bg-emerald-50 border-2 border-emerald-500 border-b-4 border-emerald-600 text-emerald-950 font-bold";
            } else if (isSelected && !opt.is_correct) {
              containerStyle =
                "bg-rose-50 border-2 border-rose-500 border-b-4 border-rose-600 text-rose-950 font-bold";
            } else {
              containerStyle = "bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-60";
            }
          } else if (isSelected) {
            containerStyle =
              "bg-blue-50 border-2 border-blue-600 border-b-4 border-blue-700 text-blue-950 font-bold shadow-xs";
          }

          // Option letter A, B, C...
          const letter = opt.id.toUpperCase();

          return (
            <div
              key={opt.id}
              onClick={() => {
                if (!isSubmitted) setSelectedOptionId(opt.id);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer flex flex-col gap-1.5 ${containerStyle}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 w-full">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 transition-colors border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-700 shadow-2xs"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isSubmitted && opt.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isSubmitted && isSelected && !opt.is_correct ? (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    ) : (
                      letter
                    )}
                  </div>
                  <span className="text-sm sm:text-base font-bold leading-relaxed pt-0.5">
                    {opt.label}
                  </span>
                </div>
              </div>

              {/* In-line explanation if submitted */}
              {isSubmitted && (isSelected || opt.is_correct) && (
                <div
                  className={`mt-2 pt-2 border-t text-xs sm:text-sm leading-relaxed font-medium ${
                    opt.is_correct
                      ? "border-emerald-200 text-emerald-900"
                      : "border-rose-200 text-rose-900"
                  }`}
                >
                  <strong className="font-bold">Giải thích: </strong>
                  {opt.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Làm lại câu này
        </button>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOptionId}
            className={`px-8 py-4 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all ${
              selectedOptionId
                ? "bg-sky-500 hover:bg-sky-600 text-white border-b-6 border-sky-700 active:border-b-0 active:translate-y-1 shadow-lg cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Check className="w-5 h-5" />
            <span>Xác Nhận Lựa Chọn</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {onNextQuestion && hasNext && (
              <button
                onClick={onNextQuestion}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base sm:text-lg border-b-6 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
              >
                <span>Qua Câu Tiếp Theo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
