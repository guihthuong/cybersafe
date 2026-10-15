"use client";

import { useState } from "react";
import { PlayerProfile } from "@/types/scenario";
import { AVATAR_OPTIONS, AvatarOption } from "@/data/avatars";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  Award,
  Zap,
  Edit3,
  Check,
  RotateCcw,
  Unlock,
  Lock,
  Map as MapIcon,
  ListFilter,
  User,
  Database,
  Cloud,
  ChevronRight,
} from "lucide-react";

interface PlayerHeaderBarProps {
  profile: PlayerProfile;
  totalXp: number;
  streakDays: number;
  completedCount: number;
  progressPercent: number;
  unlockedLevelIndex: number;
  rankTitle: string;
  rankColor: string;
  isJuryUnlockedAll: boolean;
  viewMode: "map" | "list";
  supabaseStatus?: {
    connected: boolean;
    scenarioCount: number;
    message: string;
  };
  onToggleViewMode: (mode: "map" | "list") => void;
  onToggleJuryMode: () => void;
  onUpdateProfile: (name: string, avatarId: string) => void;
  onResetJourney: () => void;
  onContinueActiveLevel: () => void;
  onOpenDatabaseInfo?: () => void;
}

export function PlayerHeaderBar({
  profile,
  totalXp,
  streakDays,
  completedCount,
  progressPercent,
  unlockedLevelIndex,
  rankTitle,
  rankColor,
  isJuryUnlockedAll,
  viewMode,
  supabaseStatus,
  onToggleViewMode,
  onToggleJuryMode,
  onUpdateProfile,
  onResetJourney,
  onContinueActiveLevel,
  onOpenDatabaseInfo,
}: PlayerHeaderBarProps) {
  const { user, openAuthModal } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatarId);

  const currentAvatar =
    AVATAR_OPTIONS.find((a) => a.id === profile.avatarId) || AVATAR_OPTIONS[0];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editName, selectedAvatarId);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-5 sm:p-7 space-y-5">
        {/* Top Profile & Rank Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* User Identity & Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentAvatar.bgGradient} flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white ring-2 ring-slate-200 group-hover:scale-105 transition-transform`}
              >
                <Shield className="w-8 h-8" />
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs hover:bg-sky-600 transition-colors"
                title="Thay đổi hình đại diện & tên"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {profile.name}
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-sky-700 hover:text-sky-900 font-bold px-2 py-0.5 rounded-md hover:bg-sky-50 transition-colors cursor-pointer"
                >
                  Đổi tên
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-2.5 py-0.5 rounded-full font-bold border ${rankColor}`}>
                  {rankTitle}
                </span>
                <span className="text-slate-500 font-medium">
                  {currentAvatar.title}
                </span>
                {user ? (
                  <span
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border border-sky-200 bg-sky-50 text-sky-800 text-[11px]"
                    title={`Đang đăng nhập bằng tài khoản: ${user.email}`}
                  >
                    <Check className="w-3 h-3 text-sky-600" />
                    <span className="max-w-[130px] truncate">{user.email?.split("@")[0]}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => openAuthModal("signin")}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-[11px] transition-colors cursor-pointer"
                    title="Đăng nhập để mỗi tài khoản có 1 tiến trình và lưu vĩnh viễn trên Supabase"
                  >
                    <User className="w-3 h-3 text-amber-600" />
                    <span>Lưu Tiến Trình Cloud</span>
                  </button>
                )}
                {onOpenDatabaseInfo && (
                  <button
                    onClick={onOpenDatabaseInfo}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full font-bold border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                    title={supabaseStatus?.message || "Kiểm tra cơ sở dữ liệu Supabase"}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Supabase: {supabaseStatus?.scenarioCount || 39} ải Cloud</span>
                  </button>
                )}
              </div>
            </div>
          </div>


          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 shrink-0 w-full lg:w-auto">
            {/* Metric 1: XP */}
            <div className="p-2 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                <Award className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">Kinh Nghiệm</span>
              </div>
              <div className="text-sm sm:text-lg font-black text-slate-900 mt-0.5">
                {totalXp} XP
              </div>
            </div>

            {/* Metric 2: Progress */}
            <div className="p-2 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                <Shield className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">Đã Đạt</span>
              </div>
              <div className="text-sm sm:text-lg font-black text-sky-700 mt-0.5">
                {completedCount} / 39
              </div>
            </div>

            {/* Metric 3: Streak */}
            <div className="p-2 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">Chuỗi Rèn</span>
              </div>
              <div className="text-sm sm:text-lg font-black text-slate-900 mt-0.5">
                {streakDays} Ngày
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-bold">
            <span className="text-slate-600">
              Tiến trình: <strong className="text-slate-900">{progressPercent}%</strong>
            </span>
            <span className="text-slate-500">
              Kế tiếp: <strong>Ải {Math.min(39, unlockedLevelIndex + 1)}</strong>
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Control Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Left: View Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => onToggleViewMode("map")}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "map"
                  ? "bg-white text-sky-800 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Bản Đồ Hành Trình</span>
            </button>
            <button
              onClick={() => onToggleViewMode("list")}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-sky-800 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Danh Sách Ải</span>
            </button>
          </div>

          {/* Right: Quick Play & Jury Mode */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onToggleJuryMode}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isJuryUnlockedAll
                  ? "bg-amber-100 text-amber-900 border-amber-300 font-black shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border-slate-300"
              }`}
              title="Chế độ dành cho Ban Giám Khảo kiểm thử tức thì mọi câu hỏi mà không cần mở khóa tuần tự"
            >
              {isJuryUnlockedAll ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Giám Khảo (Mở hết)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Chế độ Giám Khảo</span>
                </>
              )}
            </button>

            <button
              onClick={onContinueActiveLevel}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Vào Ải {unlockedLevelIndex + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div
          onClick={() => setIsEditModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl space-y-6 cursor-default"
          >
            <div>
              <span className="text-xs uppercase font-mono font-bold text-sky-800 tracking-wider">
                Cá Nhân Hóa Người Chơi
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Thiết Lập Hồ Sơ An Toàn Số
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Tùy chỉnh tên gọi và hình tượng đại diện đồng hành cùng bạn trên bản đồ hành trình.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Tên của bạn hoặc vai trò trải nghiệm:
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Anh Đức, Bác Bình (68 tuổi), v.v."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 outline-none text-sm font-semibold text-slate-900"
                  required
                />
              </div>

              {/* Avatar Selection Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Chọn nhân vật đại diện:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {AVATAR_OPTIONS.map((avatar) => {
                    const isSelected = selectedAvatarId === avatar.id;
                    return (
                      <div
                        key={avatar.id}
                        onClick={() => setSelectedAvatarId(avatar.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? "bg-sky-50 border-sky-400 ring-2 ring-sky-200"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatar.bgGradient} flex items-center justify-center text-white shrink-0 shadow-xs`}
                        >
                          <Shield className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5 text-left">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <span>{avatar.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-sky-700 ml-auto" />}
                          </div>
                          <div className="text-[11px] text-slate-500 leading-tight">
                            {avatar.tagline}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onResetJourney}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại hành trình từ đầu</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    Lưu Hồ Sơ
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
