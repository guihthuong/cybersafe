"use client";

import { useState } from "react";
import { PRE_TEST_QUESTIONS, calculateCompetencyScale } from "@/data/preTestData";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  BookOpen,
  Compass,
  Flame,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

interface PreTestModalProps {
  isOpen: boolean;
  onComplete: (score: number, details: { competencyLevel: string; needsImprovement: string[] }) => void;
  onClose?: () => void;
  userDisplayName?: string;
}

export function PreTestModal({
  isOpen,
  onComplete,
  onClose,
  userDisplayName = "Học Viên",
}: PreTestModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showIntroStep, setShowIntroStep] = useState(false);

  if (!isOpen) return null;

  const currentQ = PRE_TEST_QUESTIONS[currentIdx];
  const totalQ = PRE_TEST_QUESTIONS.length;
  const isLastQuestion = currentIdx === totalQ - 1;

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // Tính điểm khi nộp bài
  let score = 0;
  const incorrectCategories: string[] = [];

  PRE_TEST_QUESTIONS.forEach((q) => {
    const userChoice = selectedAnswers[q.id];
    if (userChoice === q.correctOption) {
      score += 1;
    } else {
      incorrectCategories.push(q.category);
    }
  });

  const uniqueNeedsImprovement = Array.from(new Set(incorrectCategories));
  const competency = calculateCompetencyScale(score);

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
  };

  const handleFinishAndStart = () => {
    onComplete(score, {
      competencyLevel: competency.level,
      needsImprovement: uniqueNeedsImprovement,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border-2 border-slate-300 shadow-2xl p-5 sm:p-8 my-4 text-slate-900 flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* State 1: Làm bài kiểm tra 10 câu */}
        {!isSubmitted && (
          <>
            {/* Header */}
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bài Kiểm Tra Đầu Vào (Pre-Test)</span>
                </div>
                <span className="text-xs font-bold font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Câu {currentIdx + 1} / {totalQ}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Khảo Sát Năng Lực An Toàn Số Ban Đầu
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Chào mừng <span className="font-bold text-slate-900">{userDisplayName}</span>! Hãy hoàn thành 10 câu trắc nghiệm thực tế để hệ thống đo lường phản xạ số và thiết lập thang đo năng lực cho bạn.
              </p>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200 inline-block">
                  Chủ đề: {currentQ.category}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                  {currentQ.question}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                  Bối cảnh: {currentQ.context}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((optText, oIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === oIdx;
                  const letter = String.fromCharCode(65 + oIdx);
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/80 text-blue-950 font-bold shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-800"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700 border border-slate-300"
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed">{optText}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Câu Trước</span>
              </button>

              <div className="flex items-center gap-2">
                {!isLastQuestion ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Câu Tiếp Theo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < totalQ}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Nộp Bài Khảo Sát</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* State 2: Kết quả Thang đo năng lực & Hướng dẫn sử dụng */}
        {isSubmitted && !showIntroStep && (
          <div className="space-y-6">
            <div className="text-center space-y-2 border-b border-slate-200 pb-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center font-black shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                Kết Quả Đánh Giá Năng Lực Đầu Vào
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {score} / {totalQ} Câu Chính Xác
              </h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 font-bold text-blue-900 text-sm">
                {competency.level}
              </div>
            </div>

            {/* Competency Explanation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Nhận định năng lực số của bạn:
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {competency.description}
              </p>
            </div>

            {/* Needs Improvement */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Nội dung cần củng cố & cải thiện ({uniqueNeedsImprovement.length} chủ đề):</span>
              </h3>
              {uniqueNeedsImprovement.length === 0 ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  Tuyệt vời! Bạn không sai câu nào trong bài kiểm tra đầu vào.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {uniqueNeedsImprovement.map((topic, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
              <h4 className="text-xs font-bold uppercase text-blue-800 tracking-wider">
                Lộ trình rèn luyện đề xuất:
              </h4>
              <ul className="text-xs text-slate-700 space-y-1 font-medium list-disc pl-4">
                {competency.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Next to Intro button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowIntroStep(true)}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Xem Hướng Dẫn Nền Tảng & Bản Đồ 39 Ải</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* State 3: Intro giới thiệu và cách sử dụng nền tảng */}
        {isSubmitted && showIntroStep && (
          <div className="space-y-6">
            <div className="text-center space-y-2 border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">
                Chào Mừng Bạn Đến Với Nền Tảng
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Cách Sử Dụng CyberSafe Quest Hiệu Quả
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Hệ thống rèn luyện được thiết kế theo 7 chủ đề với các dạng câu hỏi tương tác thực tế
              </p>
            </div>

            {/* 3 Core Intro Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black mx-auto">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-black text-xs text-slate-900">7 Chủ Đề Rèn Luyện</h3>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  39 ải thử thách mô phỏng màn hình điện thoại thật: Nhận diện dấu hiệu lừa đảo và ra quyết định an toàn.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black mx-auto">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-black text-xs text-slate-900">Huy Hiệu & Vinh Danh</h3>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Nhận huy hiệu danh dự sau mỗi chủ đề hoàn thành, duy trì chuỗi ngày học và đua Top 10 Bảng xếp hạng tuần.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black mx-auto">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-black text-xs text-slate-900">Cẩm Nang An Toàn</h3>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Tra cứu quy trình ứng phó khẩn cấp khi bị lừa đảo, căn cứ pháp lý và trợ lý AI CyberGuardBot tư vấn 24/7.
                </p>
              </div>
            </div>

            {/* Finish Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinishAndStart}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Check className="w-5 h-5" />
                <span>Hoàn Tất & Vào Khám Phá Bản Đồ 39 Ải Ngay</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
