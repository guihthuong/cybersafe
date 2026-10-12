"use client";

import { useState } from "react";
import { Scenario, MultipleChoiceOption } from "@/types/scenario";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle } from "lucide-react";

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
      {/* Question Prompt */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-xs">
        <div className="text-xs font-black text-sky-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-5 h-5 text-sky-600" />
          <span>Câu hỏi tình huống an toàn số</span>
        </div>
        <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
          {scenario.context}
        </h4>
      </div>

      {/* Options List - Chunky Duolingo Style */}
      <div className="space-y-3.5">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let containerStyle = "bg-white border-2 border-slate-300 border-b-5 border-slate-400 hover:bg-slate-50 text-slate-900";

          if (isSubmitted) {
            if (opt.is_correct) {
              containerStyle = "bg-emerald-50 border-2 border-emerald-500 border-b-5 border-emerald-600 text-emerald-950 font-bold";
            } else if (isSelected && !opt.is_correct) {
              containerStyle = "bg-rose-50 border-2 border-rose-500 border-b-5 border-rose-600 text-rose-950 font-bold";
            } else {
              containerStyle = "bg-slate-100 border-2 border-slate-200 text-slate-400 opacity-60";
            }
          } else if (isSelected) {
            containerStyle = "bg-sky-50 border-2 border-sky-500 border-b-5 border-sky-600 text-sky-950 font-bold";
          }

          return (
            <div
              key={opt.id}
              onClick={() => {
                if (!isSubmitted) setSelectedOptionId(opt.id);
              }}
              className={`p-5 rounded-2xl transition-all cursor-pointer flex flex-col gap-2 ${containerStyle}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-sky-500 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isSubmitted && opt.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isSubmitted && isSelected && !opt.is_correct ? (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    ) : (
                      opt.label.charAt(0)
                    )}
                  </div>
                  <span className="text-base sm:text-lg font-bold leading-relaxed">
                    {opt.label}
                  </span>
                </div>
              </div>

              {/* In-line explanation if submitted */}
              {isSubmitted && (isSelected || opt.is_correct) && (
                <div
                  className={`mt-2 pt-2 border-t text-sm leading-relaxed font-semibold ${
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
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Làm lại câu này
        </button>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOptionId}
            className={`px-6 py-3 rounded-2xl font-black text-base flex items-center gap-2 transition-all ${
              selectedOptionId
                ? "bg-sky-500 hover:bg-sky-600 text-white border-b-5 border-sky-700 active:border-b-0 active:translate-y-1 shadow-md cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>Kiểm Tra Đáp Án</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {onNextQuestion && hasNext && (
              <button
                onClick={onNextQuestion}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base border-b-5 border-emerald-700 active:border-b-0 active:translate-y-1 shadow-md flex items-center gap-2 cursor-pointer transition-all animate-pulse"
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
