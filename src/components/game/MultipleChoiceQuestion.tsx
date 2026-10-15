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
    <div className="flex flex-col gap-5">
      {/* Question Action Prompt - Trực diện, ngắn gọn, dễ hiểu cho người cao tuổi & trẻ em */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/80 border-2 border-amber-300 shadow-xs">
        <div className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
            ?
          </span>
          <span>Thao tác bạn cần làm:</span>
        </div>
        <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
          {story.questionPrompt}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
          👉 Bấm chọn 1 phương án an toàn nhất bên dưới rồi nhấn nút <strong className="text-sky-700 font-bold">Xác Nhận Lựa Chọn</strong>.
        </p>
      </div>

      {/* Options List - Chunky, High-contrast, Easy-to-tap Buttons */}
      <div className="space-y-3.5">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let containerStyle =
            "bg-white border-2 border-slate-300 border-b-6 border-slate-400 hover:bg-slate-50 hover:border-slate-400 text-slate-900";

          if (isSubmitted) {
            if (opt.is_correct) {
              containerStyle =
                "bg-emerald-50 border-2 border-emerald-500 border-b-6 border-emerald-600 text-emerald-950 font-bold";
            } else if (isSelected && !opt.is_correct) {
              containerStyle =
                "bg-rose-50 border-2 border-rose-500 border-b-6 border-rose-600 text-rose-950 font-bold";
            } else {
              containerStyle = "bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-60";
            }
          } else if (isSelected) {
            containerStyle =
              "bg-sky-50 border-2 border-sky-500 border-b-6 border-sky-600 text-sky-950 font-bold shadow-md";
          }

          // Option letter A, B, C...
          const letter = opt.id.toUpperCase();

          return (
            <div
              key={opt.id}
              onClick={() => {
                if (!isSubmitted) setSelectedOptionId(opt.id);
              }}
              className={`p-4 sm:p-5 rounded-2xl transition-all cursor-pointer flex flex-col gap-2 ${containerStyle}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 w-full">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? "bg-sky-500 text-white shadow-xs"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isSubmitted && opt.is_correct ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : isSubmitted && isSelected && !opt.is_correct ? (
                      <XCircle className="w-6 h-6 text-rose-600" />
                    ) : (
                      letter
                    )}
                  </div>
                  <span className="text-base sm:text-lg font-bold leading-relaxed pt-0.5">
                    {opt.label}
                  </span>
                </div>
              </div>

              {/* In-line explanation if submitted */}
              {isSubmitted && (isSelected || opt.is_correct) && (
                <div
                  className={`mt-2 pt-2 border-t text-sm sm:text-base leading-relaxed font-semibold ${
                    opt.is_correct
                      ? "border-emerald-200 text-emerald-900"
                      : "border-rose-200 text-rose-900"
                  }`}
                >
                  <strong className="font-black">Giải thích: </strong>
                  {opt.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Làm lại câu này
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
