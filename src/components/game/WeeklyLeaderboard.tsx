"use client";

import { useState } from "react";
import { Trophy, Flame, Award, Medal, Shield, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  group: "student" | "elder" | "general";
  score: number;
  streakDays: number;
  badgeCount: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, id: "top-1", name: "Trần Minh Quân", group: "student", score: 3820, streakDays: 14, badgeCount: 7 },
  { rank: 2, id: "top-2", name: "Bác Lê Văn Hùng", group: "elder", score: 3750, streakDays: 21, badgeCount: 7 },
  { rank: 3, id: "top-3", name: "Nguyễn Thu Hà", group: "general", score: 3640, streakDays: 11, badgeCount: 6 },
  { rank: 4, id: "top-4", name: "Cô Vũ Thị Mai", group: "elder", score: 3490, streakDays: 18, badgeCount: 6 },
  { rank: 5, id: "top-5", name: "Phạm Đăng Khoa", group: "student", score: 3320, streakDays: 9, badgeCount: 5 },
  { rank: 6, id: "top-6", name: "Hoàng Gia Bảo", group: "student", score: 3150, streakDays: 8, badgeCount: 5 },
  { rank: 7, id: "top-7", name: "Bùi Thanh Trúc", group: "general", score: 2980, streakDays: 7, badgeCount: 4 },
  { rank: 8, id: "top-8", name: "Ông Nguyễn Văn Đức", group: "elder", score: 2840, streakDays: 15, badgeCount: 4 },
  { rank: 9, id: "top-9", name: "Đỗ Quốc Cường", group: "general", score: 2710, streakDays: 5, badgeCount: 4 },
  { rank: 10, id: "top-10", name: "Lê Ngọc Hân", group: "student", score: 2560, streakDays: 6, badgeCount: 3 },
];

export function WeeklyLeaderboard() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<"week" | "topic">("week");

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-5 sm:p-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase font-mono">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Vinh Danh Xuất Sắc</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Bảng Xếp Hạng Top 10 Tuần
          </h3>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab("week")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === "week"
                ? "bg-white text-blue-900 font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Toàn Tuần
          </button>
          <button
            type="button"
            onClick={() => setTab("topic")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              tab === "topic"
                ? "bg-white text-blue-900 font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Theo Chủ Đề
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
              <th className="py-2.5 px-3">Hạng</th>
              <th className="py-2.5 px-3">Học Viên</th>
              <th className="py-2.5 px-3">Nhóm</th>
              <th className="py-2.5 px-3 text-center">Chuỗi Ngày</th>
              <th className="py-2.5 px-3 text-center">Huy Hiệu</th>
              <th className="py-2.5 px-3 text-right">Tổng Điểm XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {MOCK_LEADERBOARD.map((item) => {
              const isCurrentUser = profile && profile.display_name === item.name;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${
                    isCurrentUser ? "bg-blue-50/70 font-bold" : "hover:bg-slate-50/70"
                  }`}
                >
                  <td className="py-3 px-3 whitespace-nowrap">
                    {item.rank === 1 && (
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-xs inline-flex items-center justify-center shadow-xs">
                        1
                      </span>
                    )}
                    {item.rank === 2 && (
                      <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs inline-flex items-center justify-center shadow-xs">
                        2
                      </span>
                    )}
                    {item.rank === 3 && (
                      <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs inline-flex items-center justify-center shadow-xs">
                        3
                      </span>
                    )}
                    {item.rank > 3 && (
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs inline-flex items-center justify-center">
                        {item.rank}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                      {isCurrentUser && (
                        <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                          Bạn
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    {item.group === "student" && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                        Học sinh
                      </span>
                    )}
                    {item.group === "elder" && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        Người cao tuổi
                      </span>
                    )}
                    {item.group === "general" && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        Phổ thông
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                      <Flame className="w-3.5 h-3.5 fill-rose-500" />
                      <span>{item.streakDays} ngày</span>
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                      <Award className="w-3.5 h-3.5" />
                      <span>{item.badgeCount} / 7</span>
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap font-mono font-black text-blue-700">
                    {item.score.toLocaleString()} XP
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
