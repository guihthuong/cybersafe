"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AVATAR_OPTIONS } from "@/data/avatars";
import {
  X,
  Mail,
  Lock,
  User,
  Shield,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  UserCheck,
  GraduationCap,
  Heart,
  Compass,
} from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    signIn,
    signUp,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [targetGroup, setTargetGroup] = useState<"student" | "elder" | "general">("student");
  const [selectedAvatarId, setSelectedAvatarId] = useState("guardian");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (authModalTab === "signin") {
        const res = await signIn(email, password);
        if (!res.success) {
          setErrorMessage(res.error || "Đăng nhập thất bại.");
        }
      } else {
        if (!displayName.trim()) {
          setErrorMessage("Vui lòng nhập họ và tên hoặc biệt danh của bạn.");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự để đảm bảo an toàn.");
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
          setIsSubmitting(false);
          return;
        }

        const res = await signUp({
          email,
          pass: password,
          displayName,
          targetGroup,
          avatarId: selectedAvatarId,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Đăng ký thất bại.");
        } else {
          setSuccessMessage("Đăng ký tài khoản thành công! Đang đăng nhập...");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white border-2 border-slate-200 shadow-2xl p-6 sm:p-8 my-6 text-slate-900 flex flex-col gap-5 max-h-[92vh] overflow-y-auto cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 text-center sm:text-left pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold font-mono uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>Xác Thực Tài Khoản Độc Lập</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {authModalTab === "signin" ? "Đăng Nhập Tài Khoản" : "Tạo Tài Khoản Mới"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Mỗi tài khoản có một bản đồ tiến trình và hồ sơ rèn luyện độc lập lưu vĩnh viễn trên Supabase Cloud.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setSuccessMessage(null);
              setPassword("");
              setConfirmPassword("");
              openAuthModal("signin");
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authModalTab === "signin"
                ? "bg-white text-slate-900 font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setSuccessMessage(null);
              setPassword("");
              setConfirmPassword("");
              openAuthModal("signup");
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authModalTab === "signup"
                ? "bg-white text-slate-900 font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đăng Ký</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name (Only for signup) */}
          {authModalTab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Họ và Tên / Biệt Danh</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm font-semibold transition-all"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Đăng Nhập</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="tennguoidung@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Mật Khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm font-semibold transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Only for Sign Up) */}
          {authModalTab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Xác Nhận Mật Khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Nhập lại mật khẩu vừa đặt"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm font-semibold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Target Group & Avatar Selection (Only for Sign Up) */}
          {authModalTab === "signup" && (
            <>
              {/* Target Group Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nhóm Đối Tượng Mục Tiêu
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetGroup("student")}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      targetGroup === "student"
                        ? "bg-sky-50 border-sky-500 text-sky-800 font-black shadow-xs ring-2 ring-sky-200"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[11px]">Học Sinh / SV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup("elder")}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      targetGroup === "elder"
                        ? "bg-amber-50 border-amber-500 text-amber-900 font-black shadow-xs ring-2 ring-amber-200"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-[11px]">Người Cao Tuổi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetGroup("general")}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      targetGroup === "general"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-black shadow-xs ring-2 ring-emerald-200"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span className="text-[11px]">Đại Chúng</span>
                  </button>
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Chọn Huy Hiệu Đại Diện
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`p-2 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        selectedAvatarId === av.id
                          ? "border-sky-500 bg-sky-50/50 ring-2 ring-sky-300 shadow-xs"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${av.bgGradient} text-white flex items-center justify-center font-black text-xs shadow-xs`}
                      >
                        <Shield className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                        {av.title.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>
                {authModalTab === "signin"
                  ? "Đăng Nhập Vào Hệ Thống"
                  : "Hoàn Tất Đăng Ký Tài Khoản"}
              </span>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          {authModalTab === "signin" ? (
            <p>
              Chưa có tài khoản riêng?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  openAuthModal("signup");
                }}
                className="text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
              >
                Đăng ký tài khoản miễn phí
              </button>
            </p>
          ) : (
            <p>
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  openAuthModal("signin");
                }}
                className="text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
