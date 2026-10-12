"use client";

import { useState } from "react";
import { Scenario, BranchingNode } from "@/types/scenario";
import { GitBranch, ArrowRight, ShieldCheck, AlertCircle, RotateCcw, CheckCircle2 } from "lucide-react";

interface BranchingScenarioQuestionProps {
  scenario: Scenario;
  onFinish: (passed: boolean, earnedScore: number) => void;
  onNextQuestion?: () => void;
  hasNext?: boolean;
}

export function BranchingScenarioQuestion({
  scenario,
  onFinish,
  onNextQuestion,
  hasNext = true,
}: BranchingScenarioQuestionProps) {
  const tree = scenario.options.branching_tree || {};
  const startNodeId = scenario.options.start_node_id || "node_start";

  const [currentNodeId, setCurrentNodeId] = useState<string>(startNodeId);
  const [history, setHistory] = useState<{ nodeId: string; choiceText: string; isSafe: boolean; feedback: string }[]>([]);
  const [selectedChoiceFeedback, setSelectedChoiceFeedback] = useState<string | null>(null);

  const currentNode: BranchingNode | undefined = tree[currentNodeId];

  const handleSelectChoice = (choice: {
    id: string;
    text: string;
    next_node_id: string | null;
    is_safe: boolean;
    feedback: string;
  }) => {
    setSelectedChoiceFeedback(choice.feedback);

    const nextId = choice.next_node_id || "node_safe_resolved";
    const nextNode = tree[nextId];

    setHistory((prev) => [
      ...prev,
      {
        nodeId: currentNodeId,
        choiceText: choice.text,
        isSafe: choice.is_safe,
        feedback: choice.feedback,
      },
    ]);

    setCurrentNodeId(nextId);

    if (nextNode?.is_terminal) {
      const isSafeEnd = nextNode.final_outcome === "safe";
      const score = isSafeEnd ? 100 : 20;
      onFinish(isSafeEnd, score);
    }
  };

  const handleReset = () => {
    setCurrentNodeId(startNodeId);
    setHistory([]);
    setSelectedChoiceFeedback(null);
  };

  if (!currentNode) {
    return (
      <div className="p-6 rounded-3xl bg-white text-center border-2 border-slate-200">
        <p className="text-slate-600 font-bold">Không tìm thấy dữ liệu kịch bản.</p>
        <button
          onClick={handleReset}
          className="mt-4 px-5 py-2.5 bg-sky-500 rounded-2xl text-white font-black text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Bắt đầu lại
        </button>
      </div>
    );
  }

  const isTerminal = currentNode.is_terminal;
  const isSafeOutcome = currentNode.final_outcome === "safe";

  return (
    <div className="flex flex-col gap-5">
      {/* Progress Breadcrumb */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-slate-200 text-sm shadow-xs">
        <div className="flex items-center gap-2 text-sky-700 font-black">
          <GitBranch className="w-5 h-5 text-sky-600" />
          <span>Bước quyết định #{history.length + 1}</span>
        </div>
        <button
          onClick={handleReset}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Bắt đầu lại
        </button>
      </div>

      {/* Decision Node Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-3 transition-all ${
          isTerminal
            ? isSafeOutcome
              ? "bg-emerald-50 border-emerald-300 shadow-sm"
              : "bg-rose-50 border-rose-300 shadow-sm"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        {/* Prompt */}
        <div className="mb-6">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-300 mb-3 inline-block">
            {isTerminal ? "Kết quả kịch bản" : `Tình huống bước ${history.length + 1}`}
          </span>
          <h4 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
            {currentNode.prompt}
          </h4>
        </div>

        {/* Previous feedback */}
        {selectedChoiceFeedback && !isTerminal && (
          <div className="mb-5 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sm sm:text-base text-slate-800 flex items-start gap-3 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-sky-800">Nhận định bước trước: </span>
              {selectedChoiceFeedback}
            </div>
          </div>
        )}

        {/* Choices Buttons */}
        {!isTerminal ? (
          <div className="space-y-3.5">
            <div className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider mb-2">
              Bạn sẽ làm gì tiếp theo? Hãy chọn cách xử lý:
            </div>
            {currentNode.choices.map((choice, idx) => (
              <button
                key={choice.id}
                onClick={() => handleSelectChoice(choice)}
                className="w-full text-left p-5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 border-b-6 border-slate-400 active:border-b-2 active:translate-y-1 text-slate-900 font-bold text-base sm:text-lg transition-all group flex items-start justify-between gap-4 cursor-pointer shadow-xs"
              >
                <div className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center font-black text-sm shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{choice.text}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        ) : (
          /* Terminal Outcome */
          <div className="space-y-4">
            <div
              className={`p-5 rounded-2xl border-2 flex items-start gap-4 ${
                isSafeOutcome
                  ? "bg-white border-emerald-300 text-emerald-950"
                  : "bg-white border-rose-300 text-rose-950"
              }`}
            >
              {isSafeOutcome ? (
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-rose-600 shrink-0" />
              )}
              <div>
                <h5 className="font-black text-lg sm:text-xl">
                  {isSafeOutcome ? "Bảo Vệ Bản Thân Thành Công!" : "Cảnh Báo: Rủi Ro Thiệt Hại!"}
                </h5>
                <p className="text-sm sm:text-base mt-1 leading-relaxed font-medium">
                  {isSafeOutcome
                    ? "Bạn đã xử lý an toàn, bình tĩnh không để kẻ gian thao túng và kiểm chứng qua kênh chính thống."
                    : "Kẻ lừa đảo đã lợi dụng sự hoang mang hoặc sơ hở để dẫn dụ bạn vào bẫy."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Khám phá nhánh khác
              </button>

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
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm">
          <div className="font-black text-slate-700 mb-2">Nhật ký các lựa chọn của bạn:</div>
          <div className="space-y-1.5">
            {history.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="text-sky-700 font-black">#{idx + 1}</span>
                <span className="truncate">{step.choiceText}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-black ml-auto shrink-0 border ${
                    step.isSafe
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-rose-100 text-rose-800 border-rose-300"
                  }`}
                >
                  {step.isSafe ? "An toàn" : "Nguy cơ"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
