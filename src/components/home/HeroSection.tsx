"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Sparkles,
  Octagon,
  Search,
  PhoneForwarded,
  Info,
  PhoneCall,
  Flame,
  CheckCircle2,
} from "lucide-react";

export function HeroSection() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  // Active Hotspot on Phone Mockup
  const [activeHotspot, setActiveHotspot] = useState<number>(1);

  const handleStartTraining = () => {
    if (!user) {
      openAuthModal("signin");
    } else {
      router.push("/play");
    }
  };

  const hotspots = [
    {
      id: 1,
      title: "Mạo danh số gọi",
      badge: "Hotspot 1",
      detail: "Số điện thoại lạ mạo danh Viện kiểm sát / Công an. Cơ quan điều tra không bao giờ làm việc qua điện thoại.",
      color: "bg-rose-500",
    },
    {
      id: 2,
      title: "Áp lực thời gian",
      badge: "Hotspot 2",
      detail: "Ép buộc xử lý trong 30 phút - chiêu trò thao túng tâm lý sợ hãi để nạn nhân không kịp hỏi ý kiến người thân.",
      color: "bg-amber-500",
    },
    {
      id: 3,
      title: "Đòi chuyển tiền",
      badge: "Hotspot 3",
      detail: "Yêu cầu chuyển 50 triệu vào 'Tài khoản tạm giữ'. Pháp luật Việt Nam KHÔNG CÓ tài khoản tạm giữ qua chuyển khoản cá nhân.",
      color: "bg-rose-600",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-sky-50/30 to-white text-slate-900 border-b border-slate-200 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Main Grid: Value Proposition + Realistic Simulation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18]">
                Xây dựng phản xạ số,{" "}
                <span className="text-blue-600">
                  nâng cao nhận thức, năng lực phòng ngừa
                </span>{" "}
                trên không gian mạng.
              </h1>
              <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Nền tảng thực hành tình huống tương tác thực tế đầu tiên tại Việt Nam, mô phỏng 39 kịch bản đời thực giúp học sinh và người cao tuổi chủ động nhận diện bẫy thao túng tâm lý, giữ an toàn tài sản số.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleStartTraining}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-md hover-lift flex items-center justify-center gap-2.5 cursor-pointer transition-all border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
              >
                <span>Vào Luyện Tập Ngay</span>
                <ArrowRight className="w-5 h-5 text-blue-100" />
              </button>

              <button
                onClick={() => router.push("/about")}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-base shadow-xs hover-lift flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Tìm Hiểu Dự Án</span>
              </button>
            </div>

            {/* Trust Assurance */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-600 pt-3">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Miễn phí & Không yêu cầu mật khẩu ngân hàng
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Lock className="w-4 h-4 text-blue-600" />
                Bảo mật dữ liệu học tập cá nhân
              </span>
            </div>
          </div>

          {/* Right Column: Realistic Phone Mockup with Visual Illustration & Hotspot Pins */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl bg-white border-2 border-slate-300 shadow-xl overflow-hidden">
              {/* Phone Status Bar */}
              <div className="bg-slate-100 text-slate-700 px-5 py-2.5 flex items-center justify-between text-[11px] font-mono border-b border-slate-200">
                <span className="font-bold">09:41</span>
                <div className="flex items-center gap-2 text-slate-500">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Message Header */}
              <div className="px-5 py-3 border-b border-rose-100 bg-rose-50/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center font-bold text-xs animate-pulse">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>CẢNH BÁO: Cuộc gọi mạo danh</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Số máy lạ • Giả danh cơ quan điều tra</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  Rủi ro cao
                </span>
              </div>

              {/* Visual Illustration & Interactive Hotspots */}
              <div className="p-5 space-y-4 bg-slate-50/50">
                {/* Illustration with Hotspot Pins Overlay */}
                <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 p-3 flex flex-col items-center">
                  <div className="w-full h-36 relative flex items-center justify-center">
                    <img
                      src="/images/fake police.png"
                      alt="Minh họa giả danh công an"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />

                    {/* Hotspot Pin 1: Caller ID */}
                    <button
                      onClick={() => setActiveHotspot(1)}
                      className={`absolute top-2 left-4 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md transition-transform cursor-pointer ${
                        activeHotspot === 1
                          ? "bg-rose-600 text-white ring-4 ring-rose-200 scale-110"
                          : "bg-white text-slate-700 border border-slate-300 hover:scale-105"
                      }`}
                      title="Bấm xem điểm bất thường 1"
                    >
                      1
                    </button>

                    {/* Hotspot Pin 2: Urgent 30 minutes */}
                    <button
                      onClick={() => setActiveHotspot(2)}
                      className={`absolute top-1/2 right-4 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md transition-transform cursor-pointer ${
                        activeHotspot === 2
                          ? "bg-amber-600 text-white ring-4 ring-amber-200 scale-110"
                          : "bg-white text-slate-700 border border-slate-300 hover:scale-105"
                      }`}
                      title="Bấm xem điểm bất thường 2"
                    >
                      2
                    </button>

                    {/* Hotspot Pin 3: Bank transfer request */}
                    <button
                      onClick={() => setActiveHotspot(3)}
                      className={`absolute bottom-2 left-6 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md transition-transform cursor-pointer ${
                        activeHotspot === 3
                          ? "bg-rose-600 text-white ring-4 ring-rose-200 scale-110"
                          : "bg-white text-slate-700 border border-slate-300 hover:scale-105"
                      }`}
                      title="Bấm xem điểm bất thường 3"
                    >
                      3
                    </button>
                  </div>

                  {/* Hotspots Bar */}
                  <div className="w-full flex items-center justify-around gap-2 pt-2 border-t border-slate-200 text-[11px] font-bold">
                    {hotspots.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => setActiveHotspot(h.id)}
                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-xs ${
                          activeHotspot === h.id
                            ? "bg-blue-600 text-white shadow-xs font-bold"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                          {h.id}
                        </span>
                        <span>{h.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Explanation Card Based on Active Hotspot */}
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-slate-800 space-y-1.5 transition-all">
                  <div className="flex items-center gap-1.5 text-blue-700 font-black uppercase text-[11px] tracking-wider">
                    <Info className="w-4 h-4" />
                    <span>Bóc tách bẫy lừa đảo (Điểm #{activeHotspot}):</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 font-medium">
                    {hotspots.find((h) => h.id === activeHotspot)?.detail}
                  </p>
                </div>

                {/* Accuracy Stat Footer */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium">Hiệu quả rèn luyện:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    94.8% người học nhận diện đúng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Core Response Framework - Sơ Đồ Khối (Flowchart) / SmartArt To Rõ Ràng (Size Up) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-black text-blue-700 tracking-widest px-3.5 py-1 bg-blue-50 rounded-full border border-blue-200">
              QUY TRÌNH ỨNG PHÓ CHUẨN QUỐC GIA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              4 Bước Phản Xạ An Toàn Số Cho Mọi Tình Huống
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Ghi nhớ quy tắc liên kết 4 bước theo trình tự trước khi thực hiện bất kỳ thao tác hay giao dịch nào
            </p>
          </div>

          {/* Sơ đồ khối SmartArt có mũi tên liên kết từ trái sang phải */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 relative">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-rose-50/60 border-2 border-rose-200 shadow-xs flex flex-col justify-between gap-4 group hover:border-rose-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-3 py-1 rounded-lg bg-rose-600 text-white shadow-xs">
                    Bước 01
                  </span>
                  <Octagon className="w-7 h-7 text-rose-600" />
                </div>
                <h3 className="font-black text-slate-900 text-xl sm:text-2xl mb-1.5">DỪNG LẠI</h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Không bấm vào link lạ, không chuyển tiền, không đọc mã OTP khi đang bị hối thúc.
                </p>
              </div>
              <div className="text-xs font-bold text-rose-800 bg-rose-100 border border-rose-200 p-2.5 rounded-xl text-center">
                🛑 Bình tĩnh 30 giây
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-amber-50/60 border-2 border-amber-200 shadow-xs flex flex-col justify-between gap-4 group hover:border-amber-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-3 py-1 rounded-lg bg-amber-600 text-white shadow-xs">
                    Bước 02
                  </span>
                  <Search className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="font-black text-slate-900 text-xl sm:text-2xl mb-1.5">KIỂM TRA</h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Soi kỹ tên miền (.gov.vn, .com.vn), tệp đính kèm (.apk) và số điện thoại người gọi.
                </p>
              </div>
              <div className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 p-2.5 rounded-xl text-center">
                🔍 Soi kỹ chi tiết lạ
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-sky-50/60 border-2 border-sky-200 shadow-xs flex flex-col justify-between gap-4 group hover:border-sky-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-3 py-1 rounded-lg bg-sky-600 text-white shadow-xs">
                    Bước 03
                  </span>
                  <PhoneForwarded className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="font-black text-slate-900 text-xl sm:text-2xl mb-1.5">XÁC MINH</h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Gọi điện thoại thông thường cho người thân hoặc liên hệ số hotline chính thức.
                </p>
              </div>
              <div className="text-xs font-bold text-sky-800 bg-sky-100 border border-sky-200 p-2.5 rounded-xl text-center">
                📞 Kênh độc lập
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200 shadow-xs flex flex-col justify-between gap-4 group hover:border-emerald-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-3 py-1 rounded-lg bg-emerald-600 text-white shadow-xs">
                    Bước 04
                  </span>
                  <ShieldCheck className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-black text-slate-900 text-xl sm:text-2xl mb-1.5">HÀNH ĐỘNG</h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Chỉ thực hiện giao dịch khi đã xác thực 100% người nhận là đúng sự thật.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 p-2.5 rounded-xl text-center">
                🛡️ An toàn tài sản số
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
