"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { analyzeRisk } from "@/utils/riskAnalyzer";
import { RiskAnalysisResult } from "@/types/scenario";
import { RiskAnalysisCard } from "@/components/chat/RiskAnalysisCard";
import {
  Bot,
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

export function FloatingCyberGuardBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conversation, setConversation] = useState<
    {
      sender: "user" | "bot";
      text: string;
      analysis?: RiskAnalysisResult;
      time: string;
    }[]
  >([
    {
      sender: "bot",
      text: "Xin chào bạn! Tôi là CyberGuardBot — Trợ lý AI chuyên hỗ trợ phân tích rủi ro và ra quyết định an toàn số. Bạn nhận được tin nhắn, cuộc gọi hoặc đường link đáng ngờ nào không? Hãy nhập vào đây để tôi kiểm tra ngay nhé!",
      time: "Vừa xong",
    },
  ]);

  // Ẩn chatbot khi đang ở trong phòng luyện tập / làm câu hỏi (theo yêu cầu trong đề tài)
  if (pathname?.startsWith("/play")) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isAnalyzing) return;

    const userMsg = {
      sender: "user" as const,
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setConversation((prev) => [...prev, userMsg]);
    setInput("");
    setIsAnalyzing(true);

    try {
      await new Promise((r) => setTimeout(r, 600));
      const result = await analyzeRisk(textToSend);

      const botMsg = {
        sender: "bot" as const,
        text: `CyberGuardBot đã phân tích tình huống của bạn: Phát hiện mức độ rủi ro ${result.risk_level.toUpperCase()}. Dưới đây là bóc tách dấu hiệu và hướng dẫn xử lý khẩn cấp:`,
        analysis: result,
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };

      setConversation((prev) => [...prev, botMsg]);
    } catch {
      setConversation((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Đã xảy ra lỗi khi phân tích. Bạn vui lòng thử lại sau giây lát.",
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button Fixed at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-sky-200 text-xs font-bold text-slate-800 shadow-lg animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>CyberGuardBot trực tuyến</span>
          </div>
        )}

        <button
          onClick={handleToggle}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-white"
          title="Mở trợ lý AI CyberGuardBot"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[460px] md:w-[490px] max-h-[85vh] h-[620px] bg-white rounded-3xl border-2 border-slate-300 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-white shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm leading-tight flex items-center gap-1.5">
                  <span>CyberGuardBot</span>
                  <span className="text-[10px] bg-emerald-400 text-emerald-950 font-black px-1.5 py-0.2 rounded-full">
                    AI Online
                  </span>
                </h3>
                <p className="text-[11px] text-sky-100 font-medium">Trợ lý phân tích an toàn số Scaffolding</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setConversation([
                    {
                      sender: "bot",
                      text: "Xin chào bạn! Tôi là CyberGuardBot — Trợ lý AI chuyên hỗ trợ phân tích rủi ro và ra quyết định an toàn số. Bạn nhận được tin nhắn, cuộc gọi hoặc đường link đáng ngờ nào không? Hãy nhập vào đây để tôi kiểm tra ngay nhé!",
                      time: "Vừa xong",
                    },
                  ])
                }
                title="Làm mới đoạn chat"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Prompts */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-thin">
            <button
              onClick={() => handleSend("Tin nhắn đòi tiền cấp cứu")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 font-semibold cursor-pointer shrink-0 transition-colors"
            >
              🚑 Đòi tiền cấp cứu
            </button>
            <button
              onClick={() => handleSend("Công an dọa bắt chuyển tiền")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 font-semibold cursor-pointer shrink-0 transition-colors"
            >
              👮 Công an dọa bắt
            </button>
            <button
              onClick={() => handleSend("Cập nhật VNeID tải app .apk")}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700 font-semibold cursor-pointer shrink-0 transition-colors"
            >
              📱 Cài file .apk
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col w-full ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                    msg.sender === "user"
                      ? "max-w-[85%] bg-sky-600 text-white rounded-tr-xs"
                      : "max-w-[95%] bg-white text-slate-900 border border-slate-200 shadow-2xs rounded-tl-xs"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {msg.analysis && (
                  <div className="mt-2 w-full">
                    <RiskAnalysisCard analysis={msg.analysis} compact={true} />
                  </div>
                )}

                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 text-xs text-sky-700 font-bold max-w-[80%] shadow-2xs animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin text-sky-600" />
                <span>Đang phân tích dấu hiệu rủi ro & bóc tách thủ đoạn...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Dán tin nhắn, link hoặc số lạ vào đây..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isAnalyzing}
              className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                input.trim() && !isAnalyzing
                  ? "bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
