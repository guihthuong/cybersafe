"use client";

import { useState, useEffect, useCallback } from "react";
import { Scenario, QuestionType, ScamCategory, UserScenarioProgress } from "@/types/scenario";
import { fetchAllScenarios } from "@/lib/supabase";
import { MOCK_SCENARIOS } from "@/data/mockScenarios";

const PROGRESS_STORAGE_KEY = "cybersafe_quest_progress_v1";

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>(MOCK_SCENARIOS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ScamCategory | "all">("all");
  const [selectedType, setSelectedType] = useState<QuestionType | "all">("all");
  const [progress, setProgress] = useState<Record<string, UserScenarioProgress>>({});
  const [totalScore, setTotalScore] = useState<number>(0);

  // Khởi tạo và load progress từ localStorage
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllScenarios();
        setScenarios(data);
      } catch (err) {
        console.error("Lỗi khi tải kịch bản:", err);
      } finally {
        setLoading(false);
      }
    }

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setProgress(parsed.scenarios || {});
          setTotalScore(parsed.totalScore || 0);
        }
      } catch (e) {
        console.warn("Could not parse local progress:", e);
      }
    }

    loadData();
  }, []);

  // Ghi nhận kết quả trả lời kịch bản
  const recordScenarioCompletion = useCallback(
    (scenarioId: string, passedSafely: boolean, earnedScore: number) => {
      setProgress((prev) => {
        const existing = prev[scenarioId];
        const newAttempts = existing ? existing.attempts + 1 : 1;
        const bestScore = existing ? Math.max(existing.score, earnedScore) : earnedScore;

        const updated: Record<string, UserScenarioProgress> = {
          ...prev,
          [scenarioId]: {
            scenario_id: scenarioId,
            completed: true,
            score: bestScore,
            attempts: newAttempts,
            passed_safely: existing?.passed_safely || passedSafely,
            completed_at: new Date().toISOString(),
          },
        };

        // Tính tổng điểm mới
        const calculatedScore = Object.values(updated).reduce((sum, item) => sum + item.score, 0);
        setTotalScore(calculatedScore);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            PROGRESS_STORAGE_KEY,
            JSON.stringify({
              scenarios: updated,
              totalScore: calculatedScore,
              lastUpdated: new Date().toISOString(),
            })
          );
        }

        return updated;
      });
    },
    []
  );

  // Reset tiến độ phục vụ kiểm thử
  const resetProgress = useCallback(() => {
    setProgress({});
    setTotalScore(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    }
  }, []);

  // Lọc danh sách theo filter
  const filteredScenarios = scenarios.filter((s) => {
    const matchCategory = selectedCategory === "all" || s.category === selectedCategory;
    const matchType = selectedType === "all" || s.question_type === selectedType;
    return matchCategory && matchType;
  });

  const completedCount = Object.values(progress).filter((p) => p.completed).length;

  return {
    scenarios,
    filteredScenarios,
    loading,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    progress,
    totalScore,
    completedCount,
    recordScenarioCompletion,
    resetProgress,
  };
}
