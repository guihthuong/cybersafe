"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { DemoQuizSection } from "@/components/home/DemoQuizSection";
import { QuickMiniChallenge } from "@/components/home/QuickMiniChallenge";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { SkillProgressDashboard } from "@/components/home/SkillProgressDashboard";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 selection:bg-blue-200 selection:text-blue-900">
      {/* 1. Hero Section with Large Slogan & 2 Big CTAs */}
      <HeroSection />

      {/* 2. 1-2 Interactive Demo Questions (No Login Required) */}
      <DemoQuizSection />

      {/* 3. Interactive Mini-challenge (Quick Check 30s) */}
      <QuickMiniChallenge />

      {/* 4. 11 Scam Categories Grid */}
      <CategoryGrid />

      {/* 4. Skill Matrix & Competency Progress Dashboard */}
      <SkillProgressDashboard />
    </div>
  );
}
