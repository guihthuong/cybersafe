"use client";

import React, { useState, useEffect } from "react";
import { useAuth, AuthTabType } from "@/context/AuthContext";
import { AVATAR_OPTIONS } from "@/data/avatars";
import {
  X,
  Mail,
  Phone,
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
  KeyRound,
  Calendar,
} from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    signIn,
    signUp,
    resetPassword,
  } = useAuth();

  const [identifier, setIdentifier] = useState(""); // SĐT hoặc Email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [targetGroup, setTargetGroup] = useState<"student" | "elder" | "general">("student");
  const [selectedAvatarId, setSelectedAvatarId] = useState("guardian");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tự động gợi ý nhóm đối tượng khi người dùng nhập độ tuổi
  const handleAgeChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setAge("");
      return;
    }
    setAge(num);
    if (num < 18) {
      setTargetGroup("student");
    } else if (num >= 55) {
      setTargetGroup("elder");
    } else {
      setTargetGroup("general");
    }
  };

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
        if (!identifier.trim()) {
          setErrorMessage("Vui lòng nhập Số điện thoại hoặc Email của bạn.");
          setIsSubmitting(false);
          return;
        }
        if (!password) {
          setErrorMessage("Vui lòng nhập mật khẩu.");
          setIsSubmitting(false);
          return;
        }
        const res = await signIn(identifier, password);
        if (!res.success) {
          setErrorMessage(res.error || "Đăng nhập thất bại.");
        }
      } else if (authModalTab === "signup") {
        if (!identifier.trim()) {
          setErrorMessage("Vui lòng nhập Số điện thoại hoặc Email để làm tên đăng nhập.");
          setIsSubmitting(false);
          return;
        }
        if (!displayName.trim()) {
          setErrorMessage("Vui lòng nhập họ và tên hoặc biệt danh của bạn.");
          setIsSubmitting(false);
          return;
        }
        if (age === "" || Number(age) < 6 || Number(age) > 120) {
          setErrorMessage("Vui lòng điền độ tuổi hợp lệ (từ 6 đến 120 tuổi) để hệ thống phân tích và tối ưu giao diện.");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 8) {
          setErrorMessage("Mật khẩu bảo mật phải có tối thiểu 8 ký tự theo đúng quy chuẩn an toàn.");
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage("Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.");
          setIsSubmitting(false);
          return;
        }

        const res = await signUp({
          identifier,
          pass: password,
          displayName,
          age: Number(age),
          targetGroup,
          avatarId: selectedAvatarId,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Đăng ký thất bại.");
        } else {
          setSuccessMessage("Đăng ký tài khoản thành công! Đang đăng nhập...");
        }
      } else if (authModalTab === "forgot") {
        if (!identifier.trim()) {
          setErrorMessage("Vui lòng nhập Số điện thoại hoặc Email đã đăng ký để khôi phục mật khẩu.");
          setIsSubmitting(false);
          return;
        }
        const res = await resetPassword(identifier);
        if (res.success) {
          setSuccessMessage(res.message || "Yêu cầu khôi phục mật khẩu đã được gửi thành công!");
        } else {
          setErrorMessage(res.error || "Không thể gửi yêu cầu khôi phục.");
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Nền Tảng Trò Chơi An Toàn Số</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {authModalTab === "signin" && "Đăng Nhập Tài Khoản"}
            {authModalTab === "signup" && "Đăng Ký Tài Khoản Mới"}
            {authModalTab === "forgot" && "Khôi Phục Mật Khẩu"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {authModalTab === "signin" && "Sử dụng SĐT hoặc Email để đăng nhập vào làm 39 ải thử thách và dùng trợ lý CyberGuardBot."}
            {authModalTab === "signup" && "Sử dụng SĐT hoặc Email làm tên đăng nhập trực tiếp. Nhập độ tuổi để cá nhân hóa giao diện và theo dõi thang đo năng lực."}
            {authModalTab === "forgot" && "Nhập SĐT hoặc Email bạn đã đăng ký để nhận mã OTP hoặc đường dẫn đặt lại mật khẩu mới."}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setSuccessMessage(null);
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
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setSuccessMessage(null);
              openAuthModal("forgot");
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authModalTab === "forgot"
                ? "bg-white text-slate-900 font-black shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Quên MK</span>
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
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name (Only for signup) */}
          {authModalTab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Họ và Tên hoặc Biệt Danh</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-semibold transition-all"
                />
              </div>
            </div>
          )}

          {/* SĐT hoặc Email (Identifier chung cho tất cả các tab) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Số điện thoại hoặc Email</span>
              <span className="text-[11px] font-normal text-slate-500">Dùng làm tên đăng nhập</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                <Phone className="w-3.5 h-3.5" />
                <span className="text-slate-300">/</span>
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                required
                placeholder="0912345678 hoặc name@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-14 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Độ tuổi (Bắt buộc khi đăng ký - dùng để phân tích & tùy biến giao diện) */}
          {authModalTab === "signup" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Độ tuổi của bạn</label>
                <span className="text-[11px] text-blue-600 font-semibold">Bắt buộc theo đề tài</span>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="6"
                  max="120"
                  required
                  placeholder="Ví dụ: 16 (Học sinh) hoặc 65 (Cao tuổi)"
                  value={age}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-semibold transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Hệ thống dựa vào độ tuổi để phân tích thang đo năng lực số và tự động cấu hình giao diện (cỡ chữ lớn, độ tương phản cao cho người lớn tuổi).
              </p>
            </div>
          )}

          {/* Password (Chỉ cho signin và signup) */}
          {authModalTab !== "forgot" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Mật Khẩu Bảo Mật</label>
                {authModalTab === "signin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setSuccessMessage(null);
                      openAuthModal("forgot");
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Tối thiểu 8 ký tự bảo mật"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-semibold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authModalTab === "signup" && (
                <span className="text-[11px] text-slate-500 font-medium block">
                  Quy định bảo mật: Mật khẩu tối thiểu 8 ký tự.
                </span>
              )}
            </div>
          )}

          {/* Confirm Password (Chỉ khi Sign Up) */}
          {authModalTab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Xác Nhận Lại Mật Khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Nhập lại mật khẩu vừa đặt"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-semibold transition-all"
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

          {/* Target Group & Avatar Selection (Chỉ khi Sign Up) */}
          {authModalTab === "signup" && (
            <>
              {/* Target Group */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Giao diện phù hợp (Tự động cập nhật theo độ tuổi)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetGroup("student")}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      targetGroup === "student"
                        ? "bg-blue-50 border-blue-500 text-blue-900 font-black shadow-xs ring-2 ring-blue-200"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[11px]">Học Sinh / Trẻ Em</span>
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
                    <span className="text-[11px]">Phổ Thông</span>
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
                          ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-300 shadow-xs"
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
            className="w-full mt-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>
                {authModalTab === "signin" && "Đăng Nhập Vào Hệ Thống"}
                {authModalTab === "signup" && "Hoàn Tất Đăng Ký Tài Khoản"}
                {authModalTab === "forgot" && "Gửi Yêu Cầu Khôi Phục Mật Khẩu"}
              </span>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          {authModalTab === "signin" && (
            <p>
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  openAuthModal("signup");
                }}
                className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
              >
                Đăng ký bằng SĐT hoặc Email
              </button>
            </p>
          )}
          {authModalTab === "signup" && (
            <p>
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  openAuthModal("signin");
                }}
                className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </p>
          )}
          {authModalTab === "forgot" && (
            <p>
              Nhớ mật khẩu rồi?{" "}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  openAuthModal("signin");
                }}
                className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
              >
                Quay lại đăng nhập
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
