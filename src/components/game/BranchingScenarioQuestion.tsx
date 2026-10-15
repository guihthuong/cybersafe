"use client";

import { useState } from "react";
import { Scenario, BranchingNode } from "@/types/scenario";
import { ArrowRight, ShieldCheck, AlertCircle, RotateCcw, CheckCircle2, PhoneCall, AlertTriangle } from "lucide-react";

interface BranchingScenarioQuestionProps {
  scenario: Scenario;
  onFinish: (passed: boolean, earnedScore: number) => void;
  onNextQuestion?: () => void;
  hasNext?: boolean;
}

// Hàm tách lựa chọn thành Tiêu đề hành động ngắn + Lời thoại cụ thể để người già & trẻ em dễ đọc
function parseChoiceDisplay(rawText: string) {
  let actionTitle = rawText.trim();
  let speechText = "";
  let icon = "👉";
  let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";

  const colonIdx = rawText.indexOf(":");
  if (colonIdx > 0 && colonIdx < 50) {
    actionTitle = rawText.slice(0, colonIdx).trim();
    speechText = rawText.slice(colonIdx + 1).trim().replace(/^["'“](.*)["'”]$/, "$1");
  }

  const lower = actionTitle.toLowerCase();
  if (lower.includes("hoang mang") || lower.includes("lo sợ") || lower.includes("sợ") || lower.includes("thanh minh")) {
    icon = "😰";
    badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
    if (!actionTitle.includes(" ")) actionTitle = "Lo sợ, thanh minh";
  } else if (lower.includes("dừng") || lower.includes("cúp máy") || lower.includes("thoát") || lower.includes("từ chối")) {
    icon = "🛑";
    badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (!actionTitle.includes(" ")) actionTitle = "Dừng lại, cúp máy ngay";
  } else if (lower.includes("nghi ngờ") || lower.includes("hỏi") || lower.includes("kiểm tra") || lower.includes("xác minh")) {
    icon = "🔍";
    badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
    if (!actionTitle.includes(" ")) actionTitle = "Nghi ngờ, yêu cầu giấy triệu tập";
  } else if (lower.includes("chuyển") || lower.includes("làm theo") || lower.includes("nạp")) {
    icon = "💸";
    badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return { actionTitle, speechText, icon, badgeColor };
}

// Hàm dọn dẹp prompt để không bị dồn một cục chữ to đùng gây choáng ngợp
function parsePromptDisplay(rawPrompt: string) {
  let intro = "Kẻ gian tiếp tục gây áp lực:";
  let dialogue = rawPrompt.trim();

  const matchQuote = rawPrompt.match(/^(.*?)(?:quát|nói|yêu cầu|thông báo)?\s*[:]\s*["“']([^"”']+)["”']$/i);
  if (matchQuote) {
    intro = matchQuote[1].trim() || "Kẻ gọi điện đe dọa:";
    dialogue = matchQuote[2].trim();
  }

  return { intro, dialogue };
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
      <div className="p-6 rounded-2xl bg-white text-center border border-slate-200">
        <p className="text-slate-600 font-bold">Không tìm thấy dữ liệu kịch bản.</p>
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-xl text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Bắt đầu lại
        </button>
      </div>
    );
  }

  const isTerminal = currentNode.is_terminal;
  const isSafeOutcome = currentNode.final_outcome === "safe";
  const { intro: promptIntro, dialogue: promptDialogue } = parsePromptDisplay(currentNode.prompt);

  return (
    <div className="flex flex-col gap-4">
      {/* Step Indicator & Reset Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs">
        <div className="flex items-center gap-2 font-black text-blue-700">
          <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-700 font-mono">
            {history.length + 1}
          </span>
          <span>Bước xử lý #{history.length + 1}</span>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleReset}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Thử lại từ đầu
          </button>
        )}
      </div>

      {/* Decision Node Card */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border-2 transition-all space-y-4 ${
          isTerminal
            ? isSafeOutcome
              ? "bg-emerald-50/70 border-emerald-300 shadow-xs"
              : "bg-rose-50/70 border-rose-300 shadow-xs"
            : "bg-white border-slate-200 shadow-xs"
        }`}
      >
        {/* Dialogue Balloon of Current Turn */}
        {!isTerminal ? (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{promptIntro}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-800 font-bold leading-relaxed">
                &ldquo;{promptDialogue}&rdquo;
              </p>
            </div>

            {/* Direct Simple Question */}
            <div className="pt-1">
              <h4 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>👉 Bác / Bạn sẽ làm gì lúc này?</span>
              </h4>
              <p className="text-xs text-slate-500 font-medium">Bấm chọn 1 cách xử lý phù hợp nhất bên dưới:</p>
            </div>
          </div>
        ) : null}

        {/* Previous Step Feedback (If Any) */}
        {selectedChoiceFeedback && !isTerminal && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Nhận xét bước trước:</strong> {selectedChoiceFeedback}
            </span>
          </div>
        )}

        {/* Choices Buttons - Action Oriented, Easy to Read for Elders & Kids */}
        {!isTerminal ? (
          <div className="space-y-2.5">
            {currentNode.choices.map((choice, idx) => {
              const { actionTitle, speechText, icon, badgeColor } = parseChoiceDisplay(choice.text);

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice)}
                  className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-blue-50/40 border-2 border-slate-200 hover:border-blue-300 border-b-4 border-slate-300 active:border-b-2 active:translate-y-0.5 transition-all flex items-start justify-between gap-3 cursor-pointer shadow-xs group"
                >
                  <div className="flex items-start gap-3 w-full">
                    {/* Number Badge */}
                    <span className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-slate-200">
                      {idx + 1}
                    </span>

                    {/* Content */}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${badgeColor} inline-flex items-center gap-1`}>
                          <span>{icon}</span>
                          <span>{actionTitle}</span>
                        </span>
                      </div>
                      {speechText && (
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed italic">
                          &ldquo;{speechText}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
                </button>
              );
            })}
          </div>
        ) : (
          /* Terminal Outcome */
          <div className="space-y-4">
            <div
              className={`p-5 rounded-2xl border-2 flex items-start gap-3.5 ${
                isSafeOutcome
                  ? "bg-white border-emerald-300 text-emerald-950"
                  : "bg-white border-rose-300 text-rose-950"
              }`}
            >
              {isSafeOutcome ? (
                <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h5 className="font-black text-base sm:text-lg">
                  {isSafeOutcome ? "Chúc Mừng! Bạn Đã Bảo Vệ Bản Thân An Toàn" : "Cảnh Báo: Bạn Đã Rơi Vào Bẫy Lừa Đảo!"}
                </h5>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
                  {isSafeOutcome
                    ? "Bạn đã xử lý dứt khoát, không để kẻ gian thao túng và tuân thủ quy tắc kiểm chứng thông tin qua cơ quan chức năng sở tại."
                    : "Kẻ gian đã thành công trong việc đánh vào nỗi sợ hãi hoặc hối thúc để kiểm soát tâm lý của bạn. Hãy ghi nhớ quy tắc: Dừng lại và Cúp máy!"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Thử lại kịch bản
              </button>

              {onNextQuestion && hasNext && (
                <button
                  onClick={onNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>Qua Câu Tiếp Theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* History (Clean, Compact) */}
      {history.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs">
          <div className="font-bold text-slate-600 mb-1.5">Lịch sử quyết định của bạn:</div>
          <div className="space-y-1">
            {history.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700">
                <span className="text-blue-700 font-bold">#{idx + 1}</span>
                <span className="truncate max-w-[280px] sm:max-w-md">{step.choiceText}</span>
                <span
                  className={`text-[10px] px-2 py-0.2 rounded-full font-bold ml-auto shrink-0 border ${
                    step.isSafe
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  {step.isSafe ? "An toàn" : "Nguy hiểm"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
