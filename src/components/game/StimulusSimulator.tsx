"use client";

import { Scenario, StimulusData } from "@/types/scenario";
import { parseScenarioStory } from "@/utils/scenarioStoryParser";
import { PhoneCall, AlertTriangle, Globe, Lock, Shield, MessageSquare, User, UserCheck } from "lucide-react";

interface StimulusSimulatorProps {
  stimulus: StimulusData;
  contextText: string;
  scenario?: Scenario;
}

export function StimulusSimulator({ stimulus, contextText, scenario }: StimulusSimulatorProps) {
  // Parse storyline if scenario is available, or create mock scenario for parser
  const story = scenario
    ? parseScenarioStory(scenario)
    : parseScenarioStory({
        scenario_id: "DEMO",
        category: "bank_otp_fraud",
        category_name_vi: "",
        skill: "",
        difficulty: "beginner",
        question_type: "multiple_choice",
        context: contextText,
        stimulus,
        options: {},
        correct_answer: "",
        feedback: { core_rule: "Dừng lại", empathy_note: "", red_flags: [], safe_action: "" },
        consequence: { title: "", description: "", severity: "low" },
      });

  const displayContent = story.dialogueOrContent || stimulus.content;

  return (
    <div className="flex flex-col gap-3">
      {/* Role & Event Intro Pill - Gọn gàng, súc tích */}
      <div className="px-3.5 py-2 rounded-2xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
        <div className="inline-flex items-center gap-1.5 font-bold text-slate-800">
          <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Vai trò: <strong className="text-blue-900 font-black">{story.role}</strong></span>
        </div>
        <span className="text-blue-700 font-semibold">{story.eventIntro}</span>
      </div>

      {/* Interactive Device Screen Simulator - Friendly Light Phone Frame */}
      <div className="rounded-3xl border-2 border-slate-300 bg-white p-3.5 sm:p-4 shadow-xs overflow-hidden relative">
        <div className="pt-2 pb-1">
          {/* 1. PHONE CALL SIMULATION */}
          {stimulus.type === "phone_call" && (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center animate-pulse shadow-xs">
                  <PhoneCall className="w-7 h-7 text-rose-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-[10px] font-black text-white uppercase tracking-wider">
                  Ghi âm
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  Cuộc gọi đến • {stimulus.timestamp || "10:05 AM"}
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">{story.senderLabel || stimulus.sender}</h3>
                <p className="text-xs text-rose-600 font-bold">
                  Đe dọa khởi tố • Ép giữ bí mật
                </p>
              </div>

              {/* Sound wave */}
              <div className="flex items-center gap-1 h-5 my-0.5">
                {[20, 40, 60, 30, 50, 70, 40, 60, 30, 50, 65, 35].map((height, i) => (
                  <span
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-1 bg-rose-500 rounded-full animate-pulse"
                  />
                ))}
              </div>

              {/* Speech bubble */}
              <div className="w-full text-left p-3.5 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-1">
                <div className="text-[11px] font-bold text-rose-700 flex items-center gap-1.5 uppercase">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Lời thoại phát ra từ loa:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                  &ldquo;{displayContent}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* 2. CHAT / ZALO SIMULATION */}
          {stimulus.type === "chat" && (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5">
              {/* Chat Header */}
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                    {story.senderLabel || stimulus.sender}
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                      Chưa xác minh
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Tin nhắn nhận lúc {stimulus.timestamp || "14:20"}</p>
                </div>
              </div>

              {/* Message Thread */}
              <div className="py-3 space-y-2">
                <div className="text-center text-[11px] text-slate-400 font-medium">{stimulus.timestamp || "Hôm nay 14:20"}</div>
                <div className="flex items-start gap-2 max-w-[95%]">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white border-2 border-slate-200 p-4 text-slate-900 text-base sm:text-lg font-bold leading-relaxed shadow-xs">
                    <p>{displayContent}</p>
                  </div>
                </div>
              </div>

              {stimulus.metadata && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-xs font-bold text-sky-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>{Object.values(stimulus.metadata)[0]}</span>
                </div>
              )}
            </div>
          )}

          {/* 3. BROWSER SIMULATION */}
          {stimulus.type === "browser" && (
            <div className="rounded-2xl bg-slate-50 border-2 border-slate-200 overflow-hidden">
              {/* Address bar */}
              <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 flex items-center gap-2 text-slate-800 font-mono text-xs overflow-x-auto shadow-xs">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-400">https://</span>
                  <span className="text-rose-600 font-black underline decoration-rose-500 underline-offset-4">
                    {stimulus.suspicious_url ? stimulus.suspicious_url.replace("https://", "") : "abc-bank.com.vn.ebanking-update.cc/login"}
                  </span>
                </div>
              </div>

              {/* Browser mockup content */}
              <div className="p-5 text-center bg-white">
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-sky-700 font-black text-sm sm:text-base">
                    <Globe className="w-4 h-4" />
                    <span>Cổng Cập Nhật Sinh Trắc Học Khách Hàng ABC</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-800 font-semibold leading-relaxed">{displayContent}</p>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs sm:text-sm font-bold text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <strong>Cảnh báo quan trọng:</strong> Soi kỹ phần đuôi tên miền gốc trước dấu gạch chéo đầu tiên!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SMS SIMULATION */}
          {stimulus.type === "sms" && (
            <div className="rounded-2xl bg-slate-50 border-2 border-slate-200 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <span className="font-black text-slate-900 text-sm sm:text-base">{story.senderLabel || stimulus.sender}</span>
                </div>
                <span className="text-xs text-slate-500">{stimulus.timestamp || "Vừa xong"}</span>
              </div>
              <div className="py-4">
                <div className="p-4 rounded-2xl rounded-tl-sm bg-white text-slate-900 text-base sm:text-lg font-bold leading-relaxed border-2 border-slate-200 shadow-xs">
                  {displayContent}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
