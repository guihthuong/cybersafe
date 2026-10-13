"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface UserProfileData {
  id: string;
  display_name: string;
  avatar_id: string;
  target_group: "student" | "elder" | "general";
  total_score: number;
  streak_days: number;
  badges: any[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfileData | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "signup";
  openAuthModal: (tab?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    email: string;
    pass: string;
    displayName: string;
    targetGroup: "student" | "elder" | "general";
    avatarId: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");

  const openAuthModal = (tab: "signin" | "signup" = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Tải hồ sơ từ Supabase user_profiles
  const fetchProfile = async (userId: string) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as UserProfileData);
        return data as UserProfileData;
      }
    } catch (e) {
      console.warn("Could not fetch user profile:", e);
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

  // Đăng nhập
  const signIn = async (email: string, pass: string) => {
    if (!supabase) {
      return { success: false, error: "Hệ thống cơ sở dữ liệu Supabase chưa được cấu hình." };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes("Invalid login credentials")) {
          msg = "Email hoặc mật khẩu không chính xác.";
        } else if (msg.includes("Email not confirmed")) {
          msg = "Tài khoản chưa được xác nhận email. Vui lòng kiểm tra hòm thư của bạn.";
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

  // Đăng ký
  const signUp = async (signupData: {
    email: string;
    pass: string;
    displayName: string;
    targetGroup: "student" | "elder" | "general";
    avatarId: string;
  }) => {
    if (!supabase) {
      return { success: false, error: "Hệ thống cơ sở dữ liệu Supabase chưa được cấu hình." };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email.trim(),
        password: signupData.pass,
        options: {
          data: {
            display_name: signupData.displayName.trim() || "Học Viên An Toàn Số",
            target_group: signupData.targetGroup,
            avatar_id: signupData.avatarId,
          },
        },
      });

      if (error) {
        let msg = error.message;
        if (msg.includes("User already registered")) {
          msg = "Email này đã được đăng ký tài khoản. Vui lòng chọn Đăng nhập.";
        } else if (msg.includes("Password should be at least")) {
          msg = "Mật khẩu phải có độ dài ít nhất 6 ký tự.";
        }
        return { success: false, error: msg };
      }

      // Nếu Supabase trả về user ngay (không bật confirm email bắt buộc)
      if (data.user) {
        // Dự phòng tạo bản ghi profile nếu trigger chưa kịp chạy
        try {
          await supabase.from("user_profiles").upsert({
            id: data.user.id,
            display_name: signupData.displayName.trim() || "Học Viên An Toàn Số",
            avatar_id: signupData.avatarId,
            target_group: signupData.targetGroup,
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

  // Đăng xuất
  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
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
