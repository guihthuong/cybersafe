"use client";

import { useMemo } from "react";
import { Scenario } from "@/types/scenario";
import { Lock, Check, Star, Play } from "lucide-react";

interface PuzzleJourneyMapProps {
  scenarios: Scenario[];
  unlockedLevelIndex: number;
  completedLevels: Record<number, { score: number; stars: number; passedSafely: boolean }>;
  isJuryUnlockedAll: boolean;
  avatarId?: string;
  onSelectLevel: (levelIndex: number) => void;
  globalStartIndex?: number; // 0-indexed offset if rendering a sub-chapter
}

const SCENARIO_ART_MAP: Record<string, { image: string; label: string }> = {
  // Chương 1: Giả Mạo Cơ Quan Chức Năng
  "Q1.1": { image: "/images/fake police.png", label: "Mạo danh Công an điều tra" },
  "Q1.2": { image: "/images/hacker.png", label: "Dọa bắt cóc online & tống tiền" },
  "Q1.3": { image: "/images/stealing OTP.png", label: "Mã độc VNeID giả mạo" },

  // Chương 2: Giả Mạo Ngân Hàng & Tài Chính (Hoàn toàn khác nhau, KHÔNG TRÙNG LẶP)
  "Q2.1": { image: "/images/fake mobile banking.png", label: "SMS mạo danh link ngân hàng" },
  "Q2.2": { image: "/images/imposter wearing face mask phone call.png", label: "Sinh trắc học giả mạo" },
  "Q2.3": { image: "/images/stealing OTP.png", label: "Chiếm đoạt Smart OTP" },

  // Chương 3: Lừa Đảo Việc Làm & Hoa Hồng CTV
  "Q3.1": { image: "/images/fake job scam trap.png", label: "Tuyển CTV giật đơn Shopee" },
  "Q3.2": { image: "/images/falling stock chart scam.png", label: "Nạp tiền nâng VIP làm nhiệm vụ" },
  "Q3.3": { image: "/images/fake lottery prize trap.png", label: "Đa cấp tài chính trá hình" },

  // Chương 4: Deepfake & Trí Tuệ Nhân Tạo AI
  "Q4.1": { image: "/images/imposter wearing face mask phone call.png", label: "Deepfake gọi video cấp cứu" },
  "Q4.2": { image: "/images/romance scam.png", label: "Giả giọng nói AI mượn tiền" },
  "Q4.3": { image: "/images/falling stock chart scam.png", label: "Sàn đầu tư vàng online 5%" },

  // Chương 5: Lừa Đảo Tình Cảm & Sàn Đầu Tư
  "Q5.1": { image: "/images/romance scam.png", label: "Làm quen hẹn hò qua mạng" },
  "Q5.2": { image: "/images/falling stock chart scam.png", label: "Bẫy 'mổ lợn' sàn Forex ảo" },
  "Q5.3": { image: "/images/fake lottery prize trap.png", label: "Chặn rút tiền ép nộp thuế" },

  // Chương 6: Mã Độc Tống Tiền & File .APK Lạ
  "Q6.1": { image: "/images/hacker.png", label: "Cài tệp .APK ngoài luồng" },
  "Q6.2": { image: "/images/stealing OTP.png", label: "Chiếm quyền Trợ năng máy" },
  "Q6.3": { image: "/images/cybersecurity.png", label: "Mã độc giám sát màn hình" },

  // Chương 7: Lừa Đảo TMĐT & Shipper
  "Q7.1": { image: "/images/fake lottery prize trap.png", label: "Trúng thưởng xe máy SH 0 đồng" },
  "Q7.2": { image: "/images/qr scam.png", label: "Shipper giả giục chuyển tiền" },
  "Q7.3": { image: "/images/fake mobile banking.png", label: "Mua hàng qua link giả mạo" },

  // Chương 8: Lừa Đảo Dịch Vụ Công & Bảo Hiểm
  "Q8.1": { image: "/images/false rumor fake news.png", label: "Lỗi hộ khẩu điện tử VNeID" },
  "Q8.2": { image: "/images/imposter wearing face mask phone call.png", label: "Hỗ trợ định danh mức 2 qua mạng" },
  "Q8.3": { image: "/images/fake mobile banking.png", label: "Hoàn tiền trợ cấp thất nghiệp" },

  // Chương 9: Giả Mạo Từ Thiện & Cứu Trợ
  "Q9.1": { image: "/images/qr scam.png", label: "Mã QR từ thiện bão lũ giả" },
  "Q9.2": { image: "/images/false rumor fake news.png", label: "Kêu gọi ủng hộ tài khoản cá nhân" },
  "Q9.3": { image: "/images/fake police.png", label: "Mạo danh cơ quan nhà nước uy tín" },

  // Chương 10: Chiếm Đoạt Tài Khoản MXH & Mượn Tiền
  "Q10.1": { image: "/images/hacker stealing social media profile.png", label: "Hack Facebook mượn tiền" },
  "Q10.2": { image: "/images/stealing OTP.png", label: "Nhờ chuyển khoản qua tài khoản thứ ba" },
  "Q10.3": { image: "/images/hacker.png", label: "Bình chọn cuộc thi chiếm token" },

  // Chương 11: Lừa Đảo Vé Máy Bay & Combo Du Lịch
  "Q11.1": { image: "/images/romance scam.png", label: "Vé máy bay Tết giá rẻ bất ngờ" },
  "Q11.2": { image: "/images/falling stock chart scam.png", label: "Combo phòng khách sạn 5 sao giá rẻ" },
  "Q11.3": { image: "/images/fake mobile banking.png", label: "Chuyển cọc qua tài khoản cá nhân" },

  // Chuyên Đề Đối Chứng C
  "C1": { image: "/images/fake police.png", label: "Phân biệt cuộc gọi chính thống" },
  "C2": { image: "/images/cybersecurity.png", label: "Kiểm tra tên miền an toàn" },
  "C3": { image: "/images/cybersecurity.png", label: "Nguyên tắc kiểm chứng đa kênh" },
};

function getScenarioScamArt(scenario: Scenario): { image: string; label: string } {
  // If stimulus has explicit image_url
  if (scenario.stimulus?.image_url) {
    return {
      image: scenario.stimulus.image_url,
      label: scenario.category_name_vi.split("(")[0].trim(),
    };
  }

  const sid = scenario.scenario_id;
  if (SCENARIO_ART_MAP[sid]) {
    return SCENARIO_ART_MAP[sid];
  }

  return { image: "/images/cybersecurity.png", label: scenario.category_name_vi.split("(")[0].trim() };
}

export function PuzzleJourneyMap({
  scenarios,
  unlockedLevelIndex,
  completedLevels,
  isJuryUnlockedAll,
  onSelectLevel,
  globalStartIndex = 0,
}: PuzzleJourneyMapProps) {
  const ROW_HEIGHT = 185;
  const totalHeight = Math.max(560, scenarios.length * ROW_HEIGHT + 140);

  // Compute coordinates for each node
  const nodes = useMemo(() => {
    return scenarios.map((scenario, relIdx) => {
      const globalIdx = globalStartIndex + relIdx;
      const xPercent = relIdx % 2 === 0 ? 25 : 75;
      const yPixels = relIdx * ROW_HEIGHT + 130;

      const isFirstInTopic = relIdx === 0;
      const prevNodeCompleted =
        relIdx > 0 &&
        Boolean(completedLevels[globalStartIndex + relIdx - 1]?.passedSafely);

      const isUnlocked =
        isJuryUnlockedAll ||
        isFirstInTopic ||
        prevNodeCompleted ||
        globalIdx <= unlockedLevelIndex;

      const isCompleted = Boolean(completedLevels[globalIdx]?.passedSafely);
      const isCurrent =
        isUnlocked &&
        !isCompleted &&
        (isFirstInTopic || prevNodeCompleted);

      const earnedStars = completedLevels[globalIdx]?.stars || 0;
      const scamArt = getScenarioScamArt(scenario);

      return {
        relIdx,
        globalIdx,
        levelNum: globalIdx + 1,
        relLevelNum: relIdx + 1,
        scenario,
        xPercent,
        yPixels,
        isUnlocked,
        isCompleted,
        isCurrent,
        earnedStars,
        scamArt,
      };
    });
  }, [scenarios, globalStartIndex, unlockedLevelIndex, completedLevels, isJuryUnlockedAll]);

  return (
    <div className="relative w-full max-w-3xl mx-auto py-2 sm:py-4 px-2 sm:px-4">
      {/* Main Map Trail Container */}
      <div
        className="relative w-full rounded-3xl bg-slate-50/80 border border-slate-200/90 shadow-xs overflow-hidden"
        style={{ minHeight: `${totalHeight}px` }}
      >
        {/* Subtle Background Dot Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* SVG Road Trail - Rendered with 1000px coordinate system to guarantee visible thick curvy road */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox={`0 0 1000 ${totalHeight}`}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {nodes.map((node, i) => {
            if (i >= nodes.length - 1) return null;
            const nextNode = nodes[i + 1];

            // 1000-width coordinate system: left node at 250 (25%), right node at 750 (75%)
            const startX = node.xPercent === 25 ? 250 : 750;
            const startY = node.yPixels;
            const endX = nextNode.xPercent === 25 ? 250 : 750;
            const endY = nextNode.yPixels;
            const midY = (startY + endY) / 2;

            const pathD = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
            const isSegmentCompleted = node.isCompleted;

            return (
              <g key={`trail_${node.scenario.scenario_id}`}>
                {/* 1. Road Outer Shadow / Border */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="52"
                  strokeLinecap="round"
                />

                {/* 2. Road Surface Asphalt */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSegmentCompleted ? "#0284c7" : "#e2e8f0"}
                  strokeWidth="42"
                  strokeLinecap="round"
                />

                {/* 3. Road Inner Lane */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSegmentCompleted ? "#38bdf8" : "#f8fafc"}
                  strokeWidth="32"
                  strokeLinecap="round"
                />

                {/* 4. Center Dashed Guide Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSegmentCompleted ? "#ffffff" : "#94a3b8"}
                  strokeWidth="5"
                  strokeDasharray="16 12"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* INTERACTIVE LEVEL NODES & SCENARIO CARDS WITH MILESTONE SCAM ART */}
        {nodes.map((node) => {
          const isLeft = node.xPercent < 50;
          const oppositeX = isLeft ? 75 : 25;

          return (
            <div key={node.scenario.scenario_id}>
              {/* 1. Node Button */}
              <div
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
                style={{
                  left: `${node.xPercent}%`,
                  top: `${node.yPixels}px`,
                }}
              >
                {/* Active Indicator Floating Pin */}
                {node.isCurrent && (
                  <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce pointer-events-none">
                    <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-tight shadow-md flex items-center gap-1.5 border border-sky-400">
                      <Play className="w-3 h-3 text-sky-400 fill-sky-400" />
                      <span>Ải Hiện Tại</span>
                    </div>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                  </div>
                )}

                {/* Stars Badge for Completed Level */}
                {node.isCompleted && (
                  <div className="absolute -top-6 flex items-center gap-0.5 z-30 bg-white px-2 py-0.5 rounded-full shadow-xs border border-amber-200">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= node.earnedStars
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Main Node Button */}
                <button
                  onClick={() => {
                    if (node.isUnlocked) {
                      onSelectLevel(node.globalIdx);
                    }
                  }}
                  disabled={!node.isUnlocked}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer font-black ${
                    node.isCompleted
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border-4 border-white hover:scale-105"
                      : node.isCurrent
                      ? "bg-sky-600 hover:bg-sky-700 text-white shadow-lg border-4 border-white ring-4 ring-sky-200 hover:scale-105"
                      : node.isUnlocked
                      ? "bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 shadow-sm hover:border-sky-500 hover:scale-105"
                      : "bg-slate-200 text-slate-400 border-2 border-slate-300 opacity-60 cursor-not-allowed"
                  }`}
                  title={
                    node.isUnlocked
                      ? `Ải ${node.relLevelNum}: ${node.scenario.category_name_vi}`
                      : `Ải ${node.relLevelNum} đang bị khóa. Hãy hoàn thành ải trước đó.`
                  }
                >
                  {node.isCompleted ? (
                    <>
                      <Check className="w-6 h-6 text-white stroke-[3]" />
                      <span className="text-[10px] font-bold text-emerald-100 -mt-0.5">
                        Ải {node.relLevelNum}
                      </span>
                    </>
                  ) : node.isCurrent ? (
                    <>
                      <span className="text-xl sm:text-2xl font-black leading-none text-white">
                        {node.relLevelNum}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-sky-100 tracking-wide mt-0.5">
                        Bắt đầu
                      </span>
                    </>
                  ) : node.isUnlocked ? (
                    <>
                      <span className="text-xl sm:text-2xl font-black leading-none text-slate-700">
                        {node.relLevelNum}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                        Sẵn sàng
                      </span>
                    </>
                  ) : (
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                  )}
                </button>

                {/* Mobile Milestone Illustration & Label below node */}
                <div className="mt-2 flex flex-col items-center gap-1 max-w-[120px] text-center sm:hidden">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
                    <img
                      src={encodeURI(node.scamArt.image)}
                      alt={node.scamArt.label}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 bg-white/95 px-2 py-0.5 rounded-md border border-slate-200 shadow-xs block truncate w-full">
                    {node.scamArt.label}
                  </span>
                </div>
              </div>

              {/* 2. Desktop Scenario Card WITH THE SCAM MILESTONE IMAGE */}
              <div
                className="hidden sm:flex absolute z-15 -translate-x-1/2 -translate-y-1/2 flex-col cursor-pointer transition-all hover-lift"
                style={{
                  left: `${oppositeX}%`,
                  top: `${node.yPixels}px`,
                }}
                onClick={() => {
                  if (node.isUnlocked) onSelectLevel(node.globalIdx);
                }}
              >
                <div
                  className={`p-3.5 rounded-2xl border text-left w-72 sm:w-80 shadow-xs transition-all flex items-center gap-3.5 ${
                    node.isCurrent
                      ? "bg-white border-sky-400 ring-2 ring-sky-100/90 shadow-md"
                      : node.isCompleted
                      ? "bg-white/95 border-emerald-200 hover:border-emerald-300"
                      : node.isUnlocked
                      ? "bg-white border-slate-200 hover:border-slate-300"
                      : "bg-slate-50/70 border-slate-200 opacity-60 pointer-events-none"
                  }`}
                >
                  {/* The Milestone Scam Image Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform">
                    <img
                      src={encodeURI(node.scamArt.image)}
                      alt={node.scamArt.label}
                      className="w-full h-full object-contain drop-shadow-sm select-none"
                    />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        Ải {node.relLevelNum} • {node.scenario.scenario_id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          node.scenario.difficulty === "beginner"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : node.scenario.difficulty === "intermediate"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {node.scenario.difficulty === "beginner"
                          ? "Cơ bản"
                          : node.scenario.difficulty === "intermediate"
                          ? "Thực tế"
                          : "Chuyên sâu"}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                      {node.scamArt.label}
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {node.scenario.skill || node.scenario.category_name_vi}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 text-[10px]">
                        {node.scenario.question_type === "branching_scenario"
                          ? "Hội thoại"
                          : node.scenario.question_type === "hotspot"
                          ? "Soi bẫy"
                          : "Trắc nghiệm"}
                      </span>
                      {node.isCompleted ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã đạt
                        </span>
                      ) : node.isCurrent ? (
                        <span className="text-sky-700 font-bold flex items-center gap-1 text-[11px]">
                          Luyện ngay →
                        </span>
                      ) : node.isUnlocked ? (
                        <span className="text-slate-600 font-bold text-[11px]">
                          Mở ải
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                          <Lock className="w-3 h-3" /> Khóa
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
