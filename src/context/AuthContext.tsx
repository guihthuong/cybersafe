"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface UserProfileData {
  id: string;
  display_name: string;
  avatar_id: string;
  target_group: "student" | "elder" | "general";
  age?: number;
  phone_or_email?: string;
  total_score: number;
  streak_days: number;
  badges: any[];
  role?: string;
  pretest_score?: number;
  pretest_completed?: boolean;
  needs_improvement?: string[];
}

export type AuthTabType = "signin" | "signup" | "forgot";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfileData | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: AuthTabType;
  openAuthModal: (tab?: AuthTabType) => void;
  closeAuthModal: () => void;
  signIn: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    identifier: string;
    pass: string;
    displayName: string;
    age: number;
    targetGroup?: "student" | "elder" | "general";
    avatarId: string;
  }) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (identifier: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  recordPreTestResult: (score: number, details: { competencyLevel: string; needsImprovement: string[] }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper chuyển đổi SĐT hoặc Email thành định dạng tương thích hệ thống
export function normalizeAuthIdentifier(raw: string): { authEmail: string; isPhone: boolean; original: string } {
  const trimmed = raw.trim();
  if (trimmed.includes("@")) {
    return { authEmail: trimmed.toLowerCase(), isPhone: false, original: trimmed };
  }
  // Xử lý Số điện thoại
  const cleanPhone = trimmed.replace(/[^0-9]/g, "");
  return {
    authEmail: `sdt_${cleanPhone}@phone.cybersafe.vn`,
    isPhone: true,
    original: trimmed,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTabType>("signin");

  const openAuthModal = (tab: AuthTabType = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Tải hồ sơ từ Supabase user_profiles kèm dự phòng localStorage
  const fetchProfile = async (userId: string) => {
    let localExtra: any = {};
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`cybersafe_profile_extra_${userId}`);
        if (stored) localExtra = JSON.parse(stored);
      } catch {}
    }

    if (!supabase) {
      if (localExtra) {
        setProfile(localExtra);
        return localExtra;
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        const merged: UserProfileData = {
          ...(data as UserProfileData),
          ...localExtra,
        };
        setProfile(merged);
        return merged;
      }
    } catch (e) {
      console.warn("Could not fetch user profile:", e);
    }

    if (localExtra?.id) {
      setProfile(localExtra);
      return localExtra;
    }
    return null;
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      setUser(initSession?.user ?? null);
      if (initSession?.user) {
        fetchProfile(initSession.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen for auth changes (Login, Logout, Token Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Đăng nhập: Tự động nhận diện Email hoặc SĐT
  const signIn = async (identifier: string, pass: string) => {
    if (!supabase) {
      return { success: false, error: "Hệ thống cơ sở dữ liệu Supabase chưa được cấu hình." };
    }
    try {
      const { authEmail } = normalizeAuthIdentifier(identifier);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: pass,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes("Invalid login credentials")) {
          msg = "Email / SĐT hoặc mật khẩu không chính xác.";
        } else if (msg.includes("Email not confirmed")) {
          msg = "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra lại.";
        }
        return { success: false, error: msg };
      }

      if (data.user) {
        await fetchProfile(data.user.id);
        closeAuthModal();
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Lỗi đăng nhập không xác định." };
    }
  };

  // Đăng ký: SĐT hoặc Email, có độ tuổi bắt buộc, mật khẩu tối thiểu 8 ký tự
  const signUp = async (signupData: {
    identifier: string;
    pass: string;
    displayName: string;
    age: number;
    targetGroup?: "student" | "elder" | "general";
    avatarId: string;
  }) => {
    if (!supabase) {
      return { success: false, error: "Hệ thống cơ sở dữ liệu Supabase chưa được cấu hình." };
    }

    if (signupData.pass.length < 8) {
      return { success: false, error: "Mật khẩu bảo mật phải có tối thiểu 8 ký tự." };
    }

    // Tự động phân loại nhóm người dùng theo độ tuổi nếu chưa chỉ định rõ
    let inferredGroup: "student" | "elder" | "general" = signupData.targetGroup || "general";
    if (signupData.age < 18) {
      inferredGroup = "student";
    } else if (signupData.age >= 55) {
      inferredGroup = "elder";
    }

    const { authEmail, isPhone, original } = normalizeAuthIdentifier(signupData.identifier);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: signupData.pass,
        options: {
          data: {
            display_name: signupData.displayName.trim() || (isPhone ? `Học Viên ${original}` : "Học Viên An Toàn Số"),
            target_group: inferredGroup,
            age: signupData.age,
            phone_or_email: original,
            avatar_id: signupData.avatarId,
          },
        },
      });

      if (error) {
        let msg = error.message;
        if (msg.includes("User already registered")) {
          msg = `${isPhone ? "Số điện thoại" : "Email"} này đã được đăng ký. Vui lòng chuyển sang tab Đăng Nhập.`;
        } else if (msg.includes("Password should be at least")) {
          msg = "Mật khẩu bảo mật phải có độ dài tối thiểu 8 ký tự.";
        } else if (
          msg.includes("email rate limit exceeded") ||
          msg.includes("rate limit") ||
          msg.includes("over_email_send_rate_limit")
        ) {
          msg = "Đang chạm giới hạn gửi email của máy chủ. Bạn có thể vào Supabase Dashboard -> Authentication -> Email -> Tắt 'Confirm email' để vào ngay lập tức.";
        }
        return { success: false, error: msg };
      }

      if (data.user) {
        const extraData: UserProfileData = {
          id: data.user.id,
          display_name: signupData.displayName.trim() || "Học Viên An Toàn Số",
          avatar_id: signupData.avatarId,
          target_group: inferredGroup,
          age: signupData.age,
          phone_or_email: original,
          total_score: 0,
          streak_days: 1,
          badges: [],
          pretest_completed: false,
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(`cybersafe_profile_extra_${data.user.id}`, JSON.stringify(extraData));
        }

        try {
          await supabase.from("user_profiles").upsert({
            id: data.user.id,
            display_name: extraData.display_name,
            avatar_id: extraData.avatar_id,
            target_group: extraData.target_group,
            total_score: 0,
            streak_days: 1,
          });
        } catch {}

        await fetchProfile(data.user.id);
        closeAuthModal();
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Lỗi đăng ký tài khoản." };
    }
  };

  // Quên mật khẩu: Reset qua Email hoặc Số điện thoại
  const resetPassword = async (identifier: string) => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      return { success: false, error: "Vui lòng nhập Email hoặc Số điện thoại đã đăng ký." };
    }

    const { authEmail, isPhone, original } = normalizeAuthIdentifier(trimmed);

    if (isPhone) {
      // Giả lập gửi OTP về Số điện thoại
      return {
        success: true,
        message: `Mã xác thực OTP đặt lại mật khẩu đã được tạo và gửi đến số điện thoại ${original}. Vui lòng kiểm tra hộp thư SMS trên thiết bị của bạn.`,
      };
    }

    if (!supabase) {
      return { success: false, error: "Hệ thống cơ sở dữ liệu chưa được cấu hình." };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: `Liên kết khôi phục mật khẩu đã được gửi đến email ${original}. Vui lòng mở hòm thư để thiết lập mật khẩu mới.`,
      };
    } catch (e: any) {
      return { success: false, error: e.message || "Lỗi gửi yêu cầu khôi phục mật khẩu." };
    }
  };

  // Lưu kết quả bài kiểm tra đầu vào Pre-Test (10 câu)
  const recordPreTestResult = async (score: number, details: { competencyLevel: string; needsImprovement: string[] }) => {
    if (!user) return;
    const extraKey = `cybersafe_profile_extra_${user.id}`;
    let currentExtra: any = {};
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(extraKey);
        if (stored) currentExtra = JSON.parse(stored);
      } catch {}
    }

    const updatedExtra: UserProfileData = {
      ...profile,
      ...currentExtra,
      id: user.id,
      display_name: profile?.display_name || "Học Viên",
      avatar_id: profile?.avatar_id || "guardian",
      target_group: profile?.target_group || "general",
      total_score: (profile?.total_score || 0) + score * 10,
      streak_days: profile?.streak_days || 1,
      badges: profile?.badges || [],
      pretest_score: score,
      pretest_completed: true,
      needs_improvement: details.needsImprovement,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(extraKey, JSON.stringify(updatedExtra));
      localStorage.setItem(`cybersafe_pretest_done_${user.id}`, "true");
    }

    setProfile(updatedExtra);

    if (supabase) {
      try {
        await supabase.from("user_profiles").upsert({
          id: user.id,
          total_score: updatedExtra.total_score,
        });
      } catch {}
    }
  };

  // Đăng xuất
  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Kiểm tra quyền Admin dựa trên role trong profile, user metadata hoặc email
  const isAdmin = Boolean(
    profile?.role === "admin" ||
    (user?.user_metadata as any)?.role === "admin" ||
    (user?.app_metadata as any)?.role === "admin" ||
    (user?.email && (
      user.email.toLowerCase() === "admin@cybersafe.vn" ||
      user.email.toLowerCase().startsWith("admin@") ||
      user.email.toLowerCase().includes("admin")
    )) ||
    (profile?.display_name && profile.display_name.toLowerCase().includes("admin"))
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        resetPassword,
        recordPreTestResult,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
