"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
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
  MessageSquare,
  Lock,
  ShieldAlert,
  LogIn,
  LogOut,
  UserCheck,
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
  user_id?: string;
  input_text: string;
  risk_level: string;
  risk_score: number;
  analysis_summary: string;
  created_at?: string;
}

interface UserProfileRecord {
  id: string;
  display_name: string;
  avatar_id?: string;
  target_group?: string;
  total_score?: number;
  streak_days?: number;
  role?: string;
  created_at?: string;
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressList, setProgressList] = useState<UserProgressRecord[]>([]);
  const [chatbotList, setChatbotList] = useState<ChatbotRecord[]>([]);
  const [profilesList, setProfilesList] = useState<UserProfileRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"progress" | "chatbot" | "profiles">("progress");
  const [searchTerm, setSearchTerm] = useState("");

  const { user, profile, isAdmin, isLoading: authLoading, openAuthModal, signOut } = useAuth();

  const loadData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // 1. Fetch user progress trực tiếp từ bảng user_progress
        const { data: pData, error: pErr } = await supabase
          .from("user_progress")
          .select("*")
          .order("completed_at", { ascending: false })
          .limit(200);

        if (!pErr && pData) {
          setProgressList(pData);
        } else {
          setProgressList([]);
        }

        // 2. Fetch chatbot queries trực tiếp từ bảng chatbot_consultations
        const { data: cData, error: cErr } = await supabase
          .from("chatbot_consultations")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200);

        if (!cErr && cData) {
          setChatbotList(cData);
        } else {
          setChatbotList([]);
        }

        // 3. Fetch hồ sơ học viên trực tiếp từ bảng user_profiles
        const { data: uData, error: uErr } = await supabase
          .from("user_profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200);

        if (!uErr && uData) {
          setProfilesList(uData);
        } else {
          setProfilesList([]);
        }
      } else {
        setProgressList([]);
        setChatbotList([]);
        setProfilesList([]);
      }
    } catch (err) {
      console.warn("Lỗi tải dữ liệu quản trị từ Supabase:", err);
      setProgressList([]);
      setChatbotList([]);
      setProfilesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  // Compute metrics từ database thật
  const totalSubmissions = progressList.length;
  const safeCount = progressList.filter((p) => p.passed_safely).length;
  const safeRate = totalSubmissions > 0 ? Math.round((safeCount / totalSubmissions) * 100) : 0;
  const avgScore =
    totalSubmissions > 0
      ? Math.round(progressList.reduce((acc, cur) => acc + (cur.score || 0), 0) / totalSubmissions)
      : 0;

  // CSV export
  const exportProgressCSV = () => {
    const headers = ["STT", "Thời gian", "Mã ải", "Điểm số", "Kết quả an toàn", "Số lần thử", "User ID"];
    const rows = progressList.map((p, idx) => [
      idx + 1,
      formatDate(p.completed_at),
      p.scenario_id || "N/A",
      p.score || 0,
      p.passed_safely ? "Đạt an toàn" : "Rơi vào bẫy",
      p.attempts || 1,
      p.user_id || "Ẩn danh",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_cao_KHKT_Ket_qua_thuc_nghiem_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProgress = progressList.filter((p) =>
    (p.scenario_id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChatbot = chatbotList.filter((c) =>
    (c.input_text || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.risk_level || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProfiles = profilesList.filter((pr) =>
    (pr.display_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pr.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pr.target_group || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. Loading State
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-slate-600 font-medium bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-xs">
          <RefreshCw className="w-5 h-5 animate-spin text-sky-600" />
          <span>Đang kiểm tra quyền truy cập Quản Trị Viên...</span>
        </div>
      </div>
    );
  }

  // 2. Chưa đăng nhập -> Yêu cầu đăng nhập Admin
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200 uppercase">
              Admin Gateway
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Khu Vực Quản Trị Viên
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Trang này chứa dữ liệu thu thập thực nghiệm KHKT và quản trị cơ sở dữ liệu. Bạn cần đăng nhập bằng tài khoản Quản Trị Viên để tiếp tục.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => openAuthModal("signin")}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Tài Khoản Admin</span>
            </button>

            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors inline-block"
            >
              <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
              <span>Quay Lại Trang Chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Đã đăng nhập nhưng không phải Admin -> Báo 403 Forbidden
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 uppercase">
              403 • Truy Cập Bị Từ Chối
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Không Có Quyền Quản Trị
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Tài khoản hiện tại <strong className="text-slate-900">({user.email})</strong> là tài khoản Học Viên / Người Dùng thông thường, không có đặc quyền Quản Trị Viên (Admin).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1 text-slate-600">
            <div className="font-semibold text-slate-800">Hướng dẫn cấp quyền Admin:</div>
            <div>• Đăng nhập bằng tài khoản có email chứa tiền tố <code className="text-sky-600 font-bold">admin@...</code> hoặc</div>
            <div>• Trong Supabase SQL: <code className="text-slate-800 bg-slate-200 px-1 rounded">UPDATE user_profiles SET role = &apos;admin&apos; WHERE id = &apos;{user.id.slice(0, 8)}...&apos;;</code></div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                signOut().then(() => openAuthModal("signin"));
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng Xuất & Đổi Tài Khoản Admin</span>
            </button>

            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors inline-block"
            >
              <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
              <span>Quay Lại Trang Chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Đã xác thực quyền Admin -> Render Full Admin Dashboard
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
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                ADMIN • RESEARCH HUB
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Supabase Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trung Tâm Quản Trị & Thu Thập Dữ Liệu Nghiên Cứu KHKT
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Dữ liệu thời gian thực được đồng bộ trực tiếp từ Supabase Database cho đề tài nghiên cứu giáo dục an toàn số.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Làm mới DB</span>
            </button>

            <button
              onClick={exportProgressCSV}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Báo Cáo CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards từ Database Thật */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Lượt Làm Bài Thực Nghiệm</span>
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalSubmissions}</div>
            <p className="text-[11px] text-slate-400">Bảng user_progress Supabase</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Tỷ Lệ Vượt Ải An Toàn</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{safeRate}%</div>
            <p className="text-[11px] text-slate-400">{safeCount} lượt xử lý an toàn</p>
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
              <span>Tin Nhắn Đã Tra Cứu</span>
              <MessageSquare className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{chatbotList.length}</div>
            <p className="text-[11px] text-slate-400">Bảng chatbot_consultations</p>
          </div>
        </div>

        {/* Tab Controls & Search */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Tab switch */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("progress")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "progress"
                    ? "bg-white text-indigo-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tiến Trình 39 Ải ({progressList.length})
              </button>
              <button
                onClick={() => setActiveTab("chatbot")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "chatbot"
                    ? "bg-white text-indigo-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tin Nhắn Nghi Vấn ({chatbotList.length})
              </button>
              <button
                onClick={() => setActiveTab("profiles")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "profiles"
                    ? "bg-white text-indigo-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Học Viên Đã Đăng Ký ({profilesList.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm dữ liệu..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Table 1: User Progress (Database thật) */}
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
                    <th className="py-3 px-3">Mã học viên (UUID)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProgress.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                        <Database className="w-8 h-8 mx-auto text-slate-300" />
                        <div className="text-sm font-semibold text-slate-600">
                          Chưa có lượt làm bài nào trong bảng user_progress
                        </div>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Khi học viên đăng nhập tài khoản và hoàn thành các ải thử thách, kết quả sẽ tự động được ghi nhận và hiển thị ngay tại đây.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredProgress.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {formatDate(row.completed_at)}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {row.scenario_id || "N/A"}
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
                        <td className="py-3 px-3 font-bold text-slate-900">{row.score ?? 0}</td>
                        <td className="py-3 px-3 text-slate-600">{row.attempts || 1}</td>
                        <td className="py-3 px-3 font-mono text-slate-400">
                          {row.user_id ? `${String(row.user_id).slice(0, 8)}...` : "Khách ẩn danh"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table 2: Chatbot Queries (Database thật) */}
          {activeTab === "chatbot" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase tracking-wider">
                    <th className="py-3 px-3">Thời gian</th>
                    <th className="py-3 px-3">Nội dung tin nhắn người dùng nhập</th>
                    <th className="py-3 px-3">Mức độ rủi ro</th>
                    <th className="py-3 px-3">Điểm</th>
                    <th className="py-3 px-3">Tóm tắt phân tích</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredChatbot.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 space-y-2">
                        <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                        <div className="text-sm font-semibold text-slate-600">
                          Chưa có tin nhắn nào trong bảng chatbot_consultations
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredChatbot.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {formatDate(row.created_at)}
                        </td>
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
                            {(row.risk_level || "low").toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{row.risk_score || 0}/100</td>
                        <td className="py-3 px-3 text-slate-600 max-w-md line-clamp-2">
                          {row.analysis_summary}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table 3: User Profiles (Database thật) */}
          {activeTab === "profiles" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase tracking-wider">
                    <th className="py-3 px-3">Mã User</th>
                    <th className="py-3 px-3">Tên hiển thị</th>
                    <th className="py-3 px-3">Nhóm đối tượng</th>
                    <th className="py-3 px-3">Điểm tích lũy XP</th>
                    <th className="py-3 px-3">Chuỗi ngày</th>
                    <th className="py-3 px-3">Vai trò</th>
                    <th className="py-3 px-3">Ngày đăng ký</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 space-y-2">
                        <UserCheck className="w-8 h-8 mx-auto text-slate-300" />
                        <div className="text-sm font-semibold text-slate-600">
                          Chưa có tài khoản nào trong bảng user_profiles
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProfiles.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-400">
                          {row.id ? `${row.id.slice(0, 8)}...` : "N/A"}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {row.display_name}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            {row.target_group === "student"
                              ? "Học sinh"
                              : row.target_group === "elder"
                              ? "Người cao tuổi"
                              : "Phổ thông"}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-sky-600">
                          {row.total_score || 0} XP
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {row.streak_days || 1} ngày
                        </td>
                        <td className="py-3 px-3">
                          {row.role === "admin" ? (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px]">
                              ADMIN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                              Học Viên
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {formatDate(row.created_at)}
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
