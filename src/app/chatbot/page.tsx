"use client";

import { useState } from "react";
import { analyzeRisk } from "@/utils/riskAnalyzer";
import { RiskAnalysisResult } from "@/types/scenario";
import { RiskAnalysisCard } from "@/components/chat/RiskAnalysisCard";
import { saveChatbotConsultation } from "@/lib/supabase";

import {
  Bot,
  Send,
  RotateCcw,
  User,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  analysis?: RiskAnalysisResult;
  timestamp: string;
}

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      sender: "bot",
      text: "Xin chào bạn. Tôi là Trợ Lý Tư Vấn An Toàn Số. Bạn có thể dán nội dung tin nhắn, số điện thoại hoặc đường link bạn nghi ngờ vào đây để hệ thống phân tích mức độ rủi ro và khuyến nghị biện pháp xử lý an toàn.",
      timestamp: "Hệ thống",
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mẫu tình huống thử nghiệm
  const sampleScenarios = [
    {
      label: "Tin nhắn yêu cầu chuyển tiền cấp cứu",
      text: "Con đang bị tai nạn giao thông nguy kịch cấp cứu ở bệnh viện Chợ Rẫy, mẹ chuyển gấp 50 triệu vào số tài khoản bác sĩ 104882xxxx để mổ gấp!",
    },
    {
      label: "Yêu cầu cập nhật VNeID tải tệp .apk",
      text: "Hồ sơ VNeID mức 2 bị lỗi cư trú, bấm vào https://vneid-capnhat.top/app.apk để tải bản vá trước 17h00 nếu không sẽ bị khóa mã định danh.",
    },
    {
      label: "Mạo danh cơ quan điều tra dọa lệnh bắt",
      text: "Tôi là cán bộ công an C03, tài khoản ông đang dính vụ án ma túy 40 tỷ, yêu cầu chuyển tiền vào tài khoản tạm giữ để thanh tra.",
    },
    {
      label: "Thông báo trúng thưởng nộp lệ phí nhận xe",
      text: "Chúc mừng bạn đã trúng thưởng 01 xe máy Honda SH 150i, vui lòng chuyển khoản trước 2.500.000đ tiền phí vận chuyển để nhận xe.",
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isAnalyzing) return;

    const userMsgId = `user_${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsAnalyzing(true);

    try {
      const result = await analyzeRisk(query);
      const botMsgId = `bot_${Date.now()}`;
      const newBotMsg: ChatMessage = {
        id: botMsgId,
        sender: "bot",
        text: `Hệ thống đã hoàn tất phân tích đối chiếu với ${result.detected_red_flags.length} dấu hiệu được ghi nhận:`,
        analysis: result,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, newBotMsg]);

      // Lưu kết quả tư vấn lên Supabase Cloud
      saveChatbotConsultation({
        inputText: query,
        riskLevel: result.risk_level,
        riskScore: result.risk_score,
        analysisSummary: result.summary,
        detectedFlags: result.detected_red_flags,
      });
    } catch (err) {
      console.error("Lỗi khi phân tích rủi ro:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg_welcome",
        sender: "bot",
        text: "Đoạn hội thoại đã được làm mới. Bạn có thể nhập tình huống cần phân tích.",
        timestamp: "Hệ thống",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner Header - Professional with Animated Cyber Guardian */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            {/* Animated Cyber Shield Avatar */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-sky-200/50 rounded-2xl blur-md animate-pulse-halo pointer-events-none" />
              <div className="relative z-10 w-full h-full animate-float-slow hover-tilt flex items-center justify-center p-1 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <img
                  src="/images/cybersecurity.png"
                  alt="CyberSafe Radar"
                  className="w-full h-full object-contain drop-shadow-sm select-none"
                />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Radar Phân Tích Nguy Cơ
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-bold border border-purple-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                  <span>Kiến Trúc Hybrid (Groq AI + Offline Fallback)</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Trợ Lý Tư Vấn Nhận Diện Lừa Đảo
              </h1>
            </div>
          </div>

          <button
            onClick={handleResetChat}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 z-10"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Làm mới hội thoại
          </button>
        </div>


        {/* STATIC PRIVACY WARNING BANNER */}
        <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-700 flex items-center gap-2.5 text-xs font-semibold shadow-xs">
          <ShieldAlert className="w-4 h-4 text-slate-600 shrink-0" />
          <span>
            Cảnh báo an toàn: Hệ thống tuyệt đối không yêu cầu người dùng cung cấp mật khẩu, mã OTP, số thẻ ngân hàng hoặc dữ liệu cá nhân cho chatbot.
          </span>
        </div>

        {/* Chat History Box */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 min-h-[460px] max-h-[680px] overflow-y-auto space-y-5 shadow-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* Bot Avatar */}
              {msg.sender === "bot" && (
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-1 text-slate-700">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div
                className={`max-w-[90%] sm:max-w-[85%] space-y-3 ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Text Bubble */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-sky-600 text-white rounded-tr-sm ml-auto font-medium shadow-xs"
                      : "bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-sm font-medium"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-[11px] mt-1.5 ${
                      msg.sender === "user" ? "text-right text-sky-100" : "text-left text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* If bot response includes analysis card */}
                {msg.analysis && (
                  <div className="w-full">
                    <RiskAnalysisCard analysis={msg.analysis} />
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.sender === "user" && (
                <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 mt-1 text-slate-700">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex gap-3 items-center p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <span>Trợ lý AI đang phân tích bối cảnh & đối chiếu quy tắc...</span>
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-bounce [animation-delay:0.3s]" />
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal">
                  Đang bóc tách tâm lý hoảng loạn, lòng tham và dấu hiệu kỹ thuật
                </p>
              </div>
            </div>
          )}
        </div>


        {/* Quick Sample Prompts Chips */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tình huống kiểm thử nhanh:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleScenarios.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sample.text)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-xs"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Dán nội dung tin nhắn, số điện thoại lạ hoặc đường link bạn nghi ngờ vào đây..."
            className="w-full pl-4 pr-28 py-3.5 rounded-xl bg-white border border-slate-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 outline-none text-sm text-slate-900 placeholder:text-slate-400 font-medium shadow-xs transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isAnalyzing}
            className={`absolute right-2 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              input.trim() && !isAnalyzing
                ? "bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <span>Phân tích</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
