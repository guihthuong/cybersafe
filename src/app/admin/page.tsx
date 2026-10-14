"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  ArrowLeft,
  Database,
  ShieldCheck,
  Search,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface UserProgressRecord {
  id?: string;
  user_id?: string;
  scenario_id: string;
  score: number;
  passed_safely: boolean;
  attempts: number;
  completed_at: string;
}

interface ChatbotRecord {
  id?: string;
  input_text: string;
  risk_level: string;
  risk_score: number;
  analysis_summary: string;
  created_at?: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [progressList, setProgressList] = useState<UserProgressRecord[]>([]);
  const [chatbotList, setChatbotList] = useState<ChatbotRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"progress" | "chatbot">("progress");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Fetch user progress
        const { data: pData } = await supabase
          .from("user_progress")
          .select("*")
          .order("completed_at", { ascending: false })
          .limit(100);

        if (pData && pData.length > 0) {
          setProgressList(pData);
        } else {
          setProgressList(mockProgress);
        }

        // Fetch chatbot queries
        const { data: cData } = await supabase
          .from("chatbot_consultations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (cData && cData.length > 0) {
          setChatbotList(cData);
        } else {
          setChatbotList(mockChatbot);
        }
      } else {
        setProgressList(mockProgress);
        setChatbotList(mockChatbot);
      }
    } catch (err) {
      console.warn("Lỗi tải dữ liệu quản trị:", err);
      setProgressList(mockProgress);
      setChatbotList(mockChatbot);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute metrics
  const totalSubmissions = progressList.length;
  const safeCount = progressList.filter((p) => p.passed_safely).length;
  const safeRate = totalSubmissions > 0 ? Math.round((safeCount / totalSubmissions) * 100) : 0;
  const avgScore =
    totalSubmissions > 0
      ? Math.round(progressList.reduce((acc, cur) => acc + (cur.score || 0), 0) / totalSubmissions)
      : 0;

  // CSV export
  const exportProgressCSV = () => {
    const headers = ["STT", "Thời gian", "Mã ải", "Điểm số", "Kết quả an toàn", "Số lần thử"];
    const rows = progressList.map((p, idx) => [
      idx + 1,
      new Date(p.completed_at).toLocaleString("vi-VN"),
      p.scenario_id,
      p.score,
      p.passed_safely ? "Đạt an toàn" : "Rơi vào bẫy",
      p.attempts,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_cao_KHKT_Ket_qua_lam_bai_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProgress = progressList.filter((p) =>
    p.scenario_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChatbot = chatbotList.filter((c) =>
    c.input_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.risk_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Quay lại trang chủ"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                ADMIN • RESEARCH HUB
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trung Tâm Quản Trị & Thu Thập Dữ Liệu Nghiên Cứu KHKT
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Theo dõi kết quả thực nghiệm, phản xạ của người dùng trước 39 tình huống và dữ liệu phục vụ báo cáo khoa học.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </button>

            <button
              onClick={exportProgressCSV}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Báo Cáo CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Tổng Lượt Làm Bài</span>
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalSubmissions}</div>
            <p className="text-[11px] text-slate-400">Ghi nhận từ bài thực nghiệm</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Tỷ Lệ Vượt Ải An Toàn</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{safeRate}%</div>
            <p className="text-[11px] text-slate-400">{safeCount} lượt xử lý đúng chuẩn</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Điểm Số Trung Bình</span>
              <BarChart3 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{avgScore} / 100</div>
            <p className="text-[11px] text-slate-400">Đánh giá trên thang điểm 100</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Lượt Tra Cứu Tin Nhắn</span>
              <MessageSquare className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{chatbotList.length}</div>
            <p className="text-[11px] text-slate-400">Mẫu tin nghi vấn đã phân tích</p>
          </div>
        </div>

        {/* Tab Controls & Search */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Tab switch */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("progress")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "progress"
                    ? "bg-white text-sky-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Kết Quả Làm Bài ({progressList.length})
              </button>
              <button
                onClick={() => setActiveTab("chatbot")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "chatbot"
                    ? "bg-white text-sky-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Lịch Sử Kiểm Tra Tin Nhắn ({chatbotList.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo mã ải hoặc từ khóa..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Table 1: User Progress */}
          {activeTab === "progress" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase tracking-wider">
                    <th className="py-3 px-3">Thời gian</th>
                    <th className="py-3 px-3">Mã ải</th>
                    <th className="py-3 px-3">Kết quả</th>
                    <th className="py-3 px-3">Điểm</th>
                    <th className="py-3 px-3">Số lần thử</th>
                    <th className="py-3 px-3">Mã người học</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProgress.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Chưa có dữ liệu nào khớp với tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredProgress.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {new Date(row.completed_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {row.scenario_id}
                        </td>
                        <td className="py-3 px-3">
                          {row.passed_safely ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Đạt An Toàn
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 font-bold border border-rose-200 text-[11px]">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Bị Lừa / Rủi Ro
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{row.score}</td>
                        <td className="py-3 px-3 text-slate-600">{row.attempts || 1}</td>
                        <td className="py-3 px-3 font-mono text-slate-400">
                          {row.user_id ? `${row.user_id.slice(0, 8)}...` : "Khách ẩn danh"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table 2: Chatbot Queries */}
          {activeTab === "chatbot" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase tracking-wider">
                    <th className="py-3 px-3">Nội dung tin nhắn người dùng nhập</th>
                    <th className="py-3 px-3">Mức độ rủi ro</th>
                    <th className="py-3 px-3">Điểm rủi ro</th>
                    <th className="py-3 px-3">Tóm tắt phân tích</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredChatbot.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        Chưa có dữ liệu nào khớp với tìm kiếm.
                      </td>
                    </tr>
                  ) : (
                    filteredChatbot.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 text-slate-900 font-medium max-w-sm truncate">
                          &ldquo;{row.input_text}&rdquo;
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              row.risk_level === "emergency" || row.risk_level === "high"
                                ? "bg-rose-50 text-rose-800 border border-rose-200"
                                : row.risk_level === "check_required"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {row.risk_level.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{row.risk_score}/100</td>
                        <td className="py-3 px-3 text-slate-600 max-w-md line-clamp-1">
                          {row.analysis_summary}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sample fallback records for research demonstration if Supabase has zero rows yet
const mockProgress: UserProgressRecord[] = [
  {
    scenario_id: "Q1.1",
    score: 100,
    passed_safely: true,
    attempts: 1,
    completed_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user_id: "usr_student_01",
  },
  {
    scenario_id: "Q1.2",
    score: 90,
    passed_safely: true,
    attempts: 2,
    completed_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user_id: "usr_student_01",
  },
  {
    scenario_id: "Q1.3",
    score: 20,
    passed_safely: false,
    attempts: 1,
    completed_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user_id: "usr_elderly_04",
  },
  {
    scenario_id: "Q2.1",
    score: 100,
    passed_safely: true,
    attempts: 1,
    completed_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    user_id: "usr_elderly_04",
  },
  {
    scenario_id: "Q2.2",
    score: 100,
    passed_safely: true,
    attempts: 1,
    completed_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    user_id: "usr_general_12",
  },
];

const mockChatbot: ChatbotRecord[] = [
  {
    input_text: "Con đang cấp cứu ở bệnh viện Chợ Rẫy chuyển gấp 50 triệu mổ",
    risk_level: "emergency",
    risk_score: 95,
    analysis_summary: "Mạo danh con cái bị tai nạn cấp cứu để đánh vào tâm lý hoảng loạn của phụ huynh.",
  },
  {
    input_text: "VNeID mức 2 bị lỗi cư trú tải vneid-capnhat.top/app.apk",
    risk_level: "emergency",
    risk_score: 98,
    analysis_summary: "Dụ cài đặt tệp .apk chứa mã độc giám sát màn hình và đánh cắp OTP ngân hàng.",
  },
  {
    input_text: "Tài khoản trúng thưởng xe máy Honda SH chuyển 2tr5 phí giao",
    risk_level: "high",
    risk_score: 85,
    analysis_summary: "Lừa đảo trúng thưởng bắt nộp thuế nhận giải trước.",
  },
];
