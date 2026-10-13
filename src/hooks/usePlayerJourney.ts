import { useState, useEffect, useCallback, useRef } from "react";
import { PlayerProfile, LevelProgress } from "@/types/scenario";
import { AVATAR_OPTIONS } from "@/data/avatars";
import { saveUserProgressToSupabase, syncUserProfileToSupabase, supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { OFFICIAL_QUESTION_BANK } from "@/data/officialQuestionBank";

const GUEST_STORAGE_KEY = "cybersafe_quest_guest_journey_v3";
const GUEST_UUID_KEY = "cybersafe_guest_uuid_v1";

function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "00000000-0000-0000-0000-000000000001";
  try {
    let pid = localStorage.getItem(GUEST_UUID_KEY);
    if (!pid) {
      pid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      localStorage.setItem(GUEST_UUID_KEY, pid);
    }
    return pid;
  } catch {
    return "00000000-0000-0000-0000-000000000001";
  }
}

const DEFAULT_PROFILE: PlayerProfile = {
  name: "Người Học An Toàn Số",
  avatarId: "guardian",
  avatarTitle: "Vệ Binh An Toàn Gia Đình",
  role: "Học Viên",
  joinedDate: "Khóa Rèn Luyện 2026",
};

export function usePlayerJourney() {
  const { user, profile: authProfile, refreshProfile } = useAuth();

  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [unlockedLevelIndex, setUnlockedLevelIndex] = useState<number>(0); // 0-indexed (0 = Level 1)
  const [completedLevels, setCompletedLevels] = useState<Record<number, LevelProgress>>({});
  const [totalXp, setTotalXp] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(1);
  const [isJuryUnlockedAll, setIsJuryUnlockedAll] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Active account ID: user.id nếu đã đăng nhập, hoặc guestId nếu là khách
  const activeUserId = user ? user.id : getOrCreateGuestId();
  const currentUserIdRef = useRef<string>(activeUserId);
  currentUserIdRef.current = activeUserId;

  // TẢI TIẾN TRÌNH THEO TỪNG TÀI KHOẢN (KHI CHUYỂN ĐỔI USER HOẶC VÀO APP)
  useEffect(() => {
    let isCancelled = false;

    async function loadAccountProgress() {
      setIsLoaded(false);

      if (user && supabase) {
        // === 1. TÀI KHOẢN ĐÃ ĐĂNG NHẬP: TẢI TRỰC TIẾP TỪ SUPABASE CLOUD ===
        try {
          // Lấy hồ sơ tài khoản
          const userAvatarObj =
            AVATAR_OPTIONS.find((a) => a.id === authProfile?.avatar_id) || AVATAR_OPTIONS[0];

          const userProfile: PlayerProfile = {
            name: authProfile?.display_name || user.email?.split("@")[0] || "Học Viên",
            avatarId: authProfile?.avatar_id || "guardian",
            avatarTitle: userAvatarObj.title,
            role:
              authProfile?.target_group === "student"
                ? "Học sinh / Sinh viên"
                : authProfile?.target_group === "elder"
                ? "Người cao tuổi"
                : "Học viên",
            joinedDate: new Date(user.created_at || Date.now()).toLocaleDateString("vi-VN"),
          };

          // Lấy toàn bộ tiến trình ải của tài khoản này từ bảng user_progress
          const { data: progressRows, error: progressErr } = await supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", user.id);

          const loadedLevels: Record<number, LevelProgress> = {};
          let maxPassedGlobalIdx = 0;
          let calculatedXp = 0;

          if (!progressErr && progressRows) {
            progressRows.forEach((row: any) => {
              const gIdx = OFFICIAL_QUESTION_BANK.findIndex(
                (s) => s.scenario_id === row.scenario_id
              );
              if (gIdx !== -1) {
                loadedLevels[gIdx] = {
                  levelIndex: gIdx,
                  scenarioId: row.scenario_id,
                  completed: true,
                  passedSafely: Boolean(row.passed_safely),
                  score: Number(row.score) || 0,
                  stars: Number(row.stars) || (row.passed_safely ? 2 : 0),
                  completedAt: row.completed_at,
                };
                calculatedXp += Number(row.score) || 0;
                if (row.passed_safely && gIdx + 1 > maxPassedGlobalIdx) {
                  maxPassedGlobalIdx = Math.min(38, gIdx + 1);
                }
              }
            });
          }

          if (!isCancelled) {
            setProfile(userProfile);
            setCompletedLevels(loadedLevels);
            setUnlockedLevelIndex(maxPassedGlobalIdx);
            setTotalXp(authProfile?.total_score || calculatedXp);
            setStreakDays(authProfile?.streak_days || 1);
          }
        } catch (err) {
          console.warn("Lỗi khi tải tiến trình tài khoản từ Supabase:", err);
        }
      } else {
        // === 2. CHẾ ĐỘ KHÁCH (GUEST): TẢI TIẾN TRÌNH CỦA KHÁCH TỪ LOCALSTORAGE ===
        try {
          const guestKey = `${GUEST_STORAGE_KEY}_${activeUserId}`;
          const saved = localStorage.getItem(guestKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (!isCancelled) {
              if (parsed.profile) setProfile(parsed.profile);
              if (typeof parsed.unlockedLevelIndex === "number")
                setUnlockedLevelIndex(parsed.unlockedLevelIndex);
              if (parsed.completedLevels) setCompletedLevels(parsed.completedLevels);
              if (typeof parsed.totalXp === "number") setTotalXp(parsed.totalXp);
              if (typeof parsed.streakDays === "number") setStreakDays(parsed.streakDays);
              if (typeof parsed.isJuryUnlockedAll === "boolean")
                setIsJuryUnlockedAll(parsed.isJuryUnlockedAll);
            }
          } else {
            if (!isCancelled) {
              setProfile(DEFAULT_PROFILE);
              setCompletedLevels({});
              setUnlockedLevelIndex(0);
              setTotalXp(0);
              setStreakDays(1);
            }
          }
        } catch (err) {
          console.warn("Lỗi đọc tiến trình khách:", err);
        }
      }

      if (!isCancelled) setIsLoaded(true);
    }

    loadAccountProgress();

    return () => {
      isCancelled = true;
    };
  }, [user, authProfile]);

  // Cập nhật hồ sơ tài khoản
  const updateProfile = useCallback(
    async (name: string, avatarId: string) => {
      const avatarObj = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];
      const newProfile: PlayerProfile = {
        ...profile,
        name: name.trim() || profile.name,
        avatarId,
        avatarTitle: avatarObj.title,
      };
      setProfile(newProfile);

      if (user && supabase) {
        // Cập nhật lên Supabase user_profiles của tài khoản
        try {
          await supabase
            .from("user_profiles")
            .update({
              display_name: newProfile.name,
              avatar_id: avatarId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);
          refreshProfile();
        } catch (e) {
          console.warn("Lỗi cập nhật user_profiles:", e);
        }
      } else {
        // Lưu cho khách
        const guestKey = `${GUEST_STORAGE_KEY}_${activeUserId}`;
        localStorage.setItem(
          guestKey,
          JSON.stringify({
            profile: newProfile,
            unlockedLevelIndex,
            completedLevels,
            totalXp,
            streakDays,
            isJuryUnlockedAll,
          })
        );
      }
    },
    [profile, user, refreshProfile, activeUserId, unlockedLevelIndex, completedLevels, totalXp, streakDays, isJuryUnlockedAll]
  );

  // GHI NHẬN KẾT QUẢ VƯỢT ẢI (ĐỒNG BỘ TRỰC TIẾP VÀO USER_PROGRESS CỦA TÀI KHOẢN ĐÓ)
  const recordLevelResult = useCallback(
    async (levelIndex: number, scenarioId: string, passed: boolean, score: number) => {
      let stars = 1;
      if (passed && score >= 90) stars = 3;
      else if (passed && score >= 60) stars = 2;
      else if (!passed) stars = 0;

      const existing = completedLevels[levelIndex];
      const newScore = existing ? Math.max(existing.score, score) : score;
      const newStars = existing ? Math.max(existing.stars, stars) : stars;

      const updatedLevels: Record<number, LevelProgress> = {
        ...completedLevels,
        [levelIndex]: {
          levelIndex,
          scenarioId,
          completed: true,
          passedSafely: passed || (existing ? existing.passedSafely : false),
          score: newScore,
          stars: newStars,
          completedAt: new Date().toISOString(),
        },
      };

      // Mở khóa ải kế tiếp nếu đạt chuẩn
      let nextUnlocked = unlockedLevelIndex;
      if (passed && levelIndex >= unlockedLevelIndex && levelIndex < 38) {
        nextUnlocked = levelIndex + 1;
        setUnlockedLevelIndex(nextUnlocked);
      }

      // Tích lũy XP
      const addedXp = existing ? (score > existing.score ? score - existing.score : 0) : score;
      const nextXp = totalXp + addedXp;

      setCompletedLevels(updatedLevels);
      setTotalXp(nextXp);

      if (user && supabase) {
        // === ĐỒNG BỘ LÊN CLOUD CHO TÀI KHOẢN NÀY ===
        try {
          // 1. Ghi hoặc cập nhật vào bảng user_progress theo (user_id, scenario_id)
          await supabase.from("user_progress").upsert(
            {
              user_id: user.id,
              scenario_id: scenarioId,
              score: newScore,
              passed_safely: passed || (existing ? existing.passedSafely : false),
              stars: newStars,
              attempts: (existing ? (existing as any).attempts || 1 : 0) + 1,
              completed_at: new Date().toISOString(),
            },
            { onConflict: "user_id,scenario_id" }
          );

          // 2. Cập nhật tổng điểm XP trong user_profiles
          await supabase
            .from("user_profiles")
            .update({
              total_score: nextXp,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);
        } catch (err) {
          console.warn("Lỗi lưu tiến trình tài khoản lên Supabase:", err);
        }
      } else {
        // === LƯU TIẾN TRÌNH CHO KHÁCH ===
        const guestKey = `${GUEST_STORAGE_KEY}_${activeUserId}`;
        try {
          localStorage.setItem(
            guestKey,
            JSON.stringify({
              profile,
              unlockedLevelIndex: nextUnlocked,
              completedLevels: updatedLevels,
              totalXp: nextXp,
              streakDays,
              isJuryUnlockedAll,
            })
          );
        } catch {}
      }

      return {
        isNewUnlock: passed && nextUnlocked > unlockedLevelIndex,
        earnedStars: stars,
        nextLevelIndex: nextUnlocked,
      };
    },
    [completedLevels, unlockedLevelIndex, totalXp, user, activeUserId, profile, streakDays, isJuryUnlockedAll]
  );


  // Toggle Jury Mode (unlock all 39 levels)
  const toggleJuryUnlockedAll = useCallback(() => {
    setIsJuryUnlockedAll((prev) => !prev);
  }, []);

  // Reset Progress
  const resetJourney = useCallback(async () => {
    setUnlockedLevelIndex(0);
    setCompletedLevels({});
    setTotalXp(0);
    setIsJuryUnlockedAll(false);
    if (user && supabase) {
      try {
        await supabase.from("user_progress").delete().eq("user_id", user.id);
        await supabase.from("user_profiles").update({ total_score: 0 }).eq("id", user.id);
      } catch {}
    } else if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`${GUEST_STORAGE_KEY}_${activeUserId}`);
      } catch {}
    }
  }, [user, activeUserId]);

  const isLevelUnlocked = useCallback(
    (idx: number) => {
      if (isJuryUnlockedAll) return true;
      return idx <= unlockedLevelIndex;
    },
    [isJuryUnlockedAll, unlockedLevelIndex]
  );

  const completedCount = Object.values(completedLevels).filter((l) => l.passedSafely).length;
  const progressPercent = Math.round((completedCount / 39) * 100);

  // Calculate Rank Title based on XP / Completed levels
  let rankTitle = "Cấp 1 • Tân Binh An Toàn";
  let rankColor = "text-sky-700 bg-sky-50 border-sky-200";
  if (completedCount >= 30) {
    rankTitle = "Cấp 5 • Đại Hiệp Sĩ Không Gian Mạng";
    rankColor = "text-amber-800 bg-amber-50 border-amber-300";
  } else if (completedCount >= 20) {
    rankTitle = "Cấp 4 • Chuyên Viên Phản Xạ Số";
    rankColor = "text-purple-800 bg-purple-50 border-purple-200";
  } else if (completedCount >= 10) {
    rankTitle = "Cấp 3 • Thám Tử An Ninh Mạng";
    rankColor = "text-indigo-800 bg-indigo-50 border-indigo-200";
  } else if (completedCount >= 4) {
    rankTitle = "Cấp 2 • Vệ Binh Cảnh Giác";
    rankColor = "text-emerald-800 bg-emerald-50 border-emerald-200";
  }

  return {
    profile,
    unlockedLevelIndex,
    completedLevels,
    totalXp,
    streakDays,
    isJuryUnlockedAll,
    isLoaded,
    completedCount,
    progressPercent,
    rankTitle,
    rankColor,
    updateProfile,
    recordLevelResult,
    toggleJuryUnlockedAll,
    resetJourney,
    isLevelUnlocked,
  };
}
