"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { QuickMiniChallenge } from "@/components/home/QuickMiniChallenge";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { SkillProgressDashboard } from "@/components/home/SkillProgressDashboard";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-200 selection:text-sky-900">
      {/* 1. Hero Section with Large Slogan & 2 Big CTAs */}
      <HeroSection />

      {/* 2. Interactive Mini-challenge (Quick Check 30s) */}
      <QuickMiniChallenge />

      {/* 3. 11 Scam Categories Grid */}
      <CategoryGrid />

      {/* 4. Skill Matrix & Competency Progress Dashboard */}
      <SkillProgressDashboard />
    </div>
  );
}
