"use client";

import { useState, useEffect, useCallback } from "react";
import { PlayerProfile, LevelProgress } from "@/types/scenario";
import { AVATAR_OPTIONS } from "@/data/avatars";
import { saveUserProgressToSupabase } from "@/lib/supabase";


const JOURNEY_STORAGE_KEY = "cybersafe_quest_player_journey_v2";

const DEFAULT_PROFILE: PlayerProfile = {
  name: "Nguyễn Anh Đức",
  avatarId: "guardian",
  avatarTitle: "Vệ Binh An Toàn Gia Đình",
  role: "Học sinh 11E2 THPT Chuyên Ngoại Ngữ",
  joinedDate: "Khóa Huấn Luyện 2026",
};

export function usePlayerJourney() {
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [unlockedLevelIndex, setUnlockedLevelIndex] = useState<number>(0); // 0-indexed (0 = Level 1)
  const [completedLevels, setCompletedLevels] = useState<Record<number, LevelProgress>>({});
  const [totalXp, setTotalXp] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [isJuryUnlockedAll, setIsJuryUnlockedAll] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(JOURNEY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (typeof parsed.unlockedLevelIndex === "number") setUnlockedLevelIndex(parsed.unlockedLevelIndex);
        if (parsed.completedLevels) setCompletedLevels(parsed.completedLevels);
        if (typeof parsed.totalXp === "number") setTotalXp(parsed.totalXp);
        if (typeof parsed.streakDays === "number") setStreakDays(parsed.streakDays);
        if (typeof parsed.isJuryUnlockedAll === "boolean") setIsJuryUnlockedAll(parsed.isJuryUnlockedAll);
      }
    } catch (e) {
      console.warn("Could not load player journey from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  const saveState = useCallback(
    (
      newProfile: PlayerProfile,
      newUnlockedIdx: number,
      newCompleted: Record<number, LevelProgress>,
      newXp: number,
      newJury: boolean
    ) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(
          JOURNEY_STORAGE_KEY,
          JSON.stringify({
            profile: newProfile,
            unlockedLevelIndex: newUnlockedIdx,
            completedLevels: newCompleted,
            totalXp: newXp,
            streakDays,
            isJuryUnlockedAll: newJury,
          })
        );
      } catch (e) {
        console.warn("Could not save player journey to localStorage", e);
      }
    },
    [streakDays]
  );

  // Update profile
  const updateProfile = useCallback(
    (name: string, avatarId: string) => {
      const avatarObj = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];
      const newProfile: PlayerProfile = {
        ...profile,
        name: name.trim() || profile.name,
        avatarId,
        avatarTitle: avatarObj.title,
      };
      setProfile(newProfile);
      saveState(newProfile, unlockedLevelIndex, completedLevels, totalXp, isJuryUnlockedAll);
    },
    [profile, unlockedLevelIndex, completedLevels, totalXp, isJuryUnlockedAll, saveState]
  );

  // Record Level Outcome
  const recordLevelResult = useCallback(
    (levelIndex: number, scenarioId: string, passed: boolean, score: number) => {
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

      // If passed, unlock next level
      let nextUnlocked = unlockedLevelIndex;
      if (passed && levelIndex >= unlockedLevelIndex && levelIndex < 38) {
        nextUnlocked = levelIndex + 1;
        setUnlockedLevelIndex(nextUnlocked);
      }

      // Add XP
      const addedXp = existing ? (score > existing.score ? score - existing.score : 0) : score;
      const nextXp = totalXp + addedXp;

      setCompletedLevels(updatedLevels);
      setTotalXp(nextXp);

      saveState(profile, nextUnlocked, updatedLevels, nextXp, isJuryUnlockedAll);

      // Đồng bộ tiến độ lên Supabase Cloud (bất đồng bộ)
      saveUserProgressToSupabase({
        scenarioId,
        score,
        passedSafely: passed,
      }).catch(() => {});

      return {
        isNewUnlock: passed && nextUnlocked > unlockedLevelIndex,
        earnedStars: stars,
        nextLevelIndex: nextUnlocked,
      };
    },
    [completedLevels, unlockedLevelIndex, totalXp, profile, isJuryUnlockedAll, saveState]
  );


  // Toggle Jury Mode (unlock all 39 levels)
  const toggleJuryUnlockedAll = useCallback(() => {
    setIsJuryUnlockedAll((prev) => {
      const next = !prev;
      saveState(profile, unlockedLevelIndex, completedLevels, totalXp, next);
      return next;
    });
  }, [profile, unlockedLevelIndex, completedLevels, totalXp, saveState]);

  // Reset Progress
  const resetJourney = useCallback(() => {
    setUnlockedLevelIndex(0);
    setCompletedLevels({});
    setTotalXp(0);
    setIsJuryUnlockedAll(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(JOURNEY_STORAGE_KEY);
      } catch (e) {
        // ignore
      }
    }
  }, []);

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
