"use client";

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
  ShieldAlert,
} from "lucide-react";

export function HeroSection() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();

  const handleStartTraining = () => {
    if (!user) {
      openAuthModal("signin");
    } else {
      router.push("/play");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/50 via-slate-50/50 to-white border-b border-slate-200/80 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* Subtle ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-sky-100/40 via-indigo-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Main Grid: Value Proposition + Realistic Simulation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Project Research Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs sm:text-sm font-semibold text-slate-800">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sáng Kiến Giáo Dục An Toàn Số • Cuộc Thi Khoa Học Kỹ Thuật</span>
            </div>

            {/* Main Headline - Theo bản góp ý PDF 1 */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Xây dựng phản xạ số,{" "}
                <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 bg-clip-text text-transparent">
                  nâng cao nhận thức, năng lực phòng ngừa
                </span>{" "}
                trên không gian mạng.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Nền tảng thực hành tình huống tương tác thực tế đầu tiên tại Việt Nam, mô phỏng 39 kịch bản đời thực giúp học sinh và người cao tuổi chủ động nhận diện bẫy thao túng tâm lý, giữ an toàn tài sản số.
              </p>
            </div>

            {/* CTAs - Bắt buộc đăng nhập mới được vào luyện tập */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={handleStartTraining}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-lg shadow-lg hover-lift flex items-center justify-center gap-2.5 cursor-pointer transition-all border-b-4 border-sky-800 active:border-b-0 active:translate-y-1"
              >
                <span>Vào Luyện Tập Ngay</span>
                <ArrowRight className="w-5 h-5 text-sky-200" />
              </button>
            </div>

            {/* Trust Assurance */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 pt-3">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Miễn phí & Không yêu cầu mật khẩu ngân hàng
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Lock className="w-4 h-4 text-sky-600" />
                Bảo mật dữ liệu học tập cá nhân
              </span>
            </div>
          </div>

          {/* Right Column: Realistic High-Fidelity Simulation Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden">
              {/* Phone Status Bar */}
              <div className="bg-slate-900 text-white px-5 py-2.5 flex items-center justify-between text-[11px] font-mono">
                <span>09:41</span>
                <div className="flex items-center gap-2 text-slate-300">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Message Header */}
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    !
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>CẢNH BÁO: Cuộc gọi / SMS lạ</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Mạo danh cơ quan chức năng</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Rủi ro cao
                </span>
              </div>

              {/* Message Body Simulation */}
              <div className="p-5 space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  &ldquo;LỆNH BẮT TẠM GIAM: Số CCCD của ông/bà liên quan đường dây rửa tiền xuyên quốc gia. Yêu cầu chuyển 50.000.000đ vào tài khoản tạm giữ Tòa án để thanh tra trong 30 phút...&rdquo;
                </div>

                {/* 3 Red Flag Inspection Points */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Bóc tách dấu hiệu lừa đảo:
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-950 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Thao túng sợ hãi:</strong> Tạo áp lực thời gian (30 phút) để nạn nhân hoảng loạn.</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs text-amber-950 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Sai quy định pháp luật:</strong> Cơ quan điều tra KHÔNG BAO GIỜ yêu cầu chuyển tiền qua điện thoại.</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Phản xạ an toàn:</strong> Cúp máy ngay ➔ Gọi hỏi người thân hoặc đến trụ sở Công an.</span>
                  </div>
                </div>

                {/* Accuracy Stat Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Hiệu quả rèn luyện:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    94.8% người học nhận diện đúng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Core Response Framework - SmartArt / Flowchart Thiết kế to rõ ràng, có mũi tên liên kết */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-slate-300 shadow-md space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-black text-sky-700 tracking-widest px-3 py-1 bg-sky-50 rounded-full border border-sky-200">
              QUY TRÌNH ỨNG PHÓ CHUẨN QUỐC GIA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              4 Bước Phản Xạ An Toàn Số Cho Mọi Tình Huống
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Ghi nhớ quy tắc phản xạ 4 bước trước khi thực hiện bất kỳ thao tác hay giao dịch nào
            </p>
          </div>

          {/* Flowchart Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="relative p-5 rounded-2xl bg-rose-50/80 border-2 border-rose-300 shadow-xs flex flex-col justify-between gap-3 group hover:border-rose-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-rose-600 text-white shadow-2xs">
                    Bước 01
                  </span>
                  <Octagon className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl mb-1">DỪNG LẠI</h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Không bấm vào link, không chuyển tiền, không đọc mã OTP khi đang bị hối thúc.
                </p>
              </div>
              <div className="text-[11px] font-bold text-rose-800 bg-rose-100/80 p-2 rounded-xl">
                🛑 Bình tĩnh 30 giây
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-xs flex flex-col justify-between gap-3 group hover:border-amber-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-amber-600 text-white shadow-2xs">
                    Bước 02
                  </span>
                  <Search className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl mb-1">KIỂM TRA</h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Soi kỹ tên miền (.gov.vn, .com.vn), tệp đính kèm (.apk) và số điện thoại người gọi.
                </p>
              </div>
              <div className="text-[11px] font-bold text-amber-800 bg-amber-100/80 p-2 rounded-xl">
                🔍 Soi kỹ chi tiết lạ
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-5 rounded-2xl bg-sky-50/80 border-2 border-sky-300 shadow-xs flex flex-col justify-between gap-3 group hover:border-sky-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-sky-600 text-white shadow-2xs">
                    Bước 03
                  </span>
                  <PhoneForwarded className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl mb-1">XÁC MINH</h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Gọi điện thoại thông thường cho người thân hoặc liên hệ số hotline chính thức.
                </p>
              </div>
              <div className="text-[11px] font-bold text-sky-800 bg-sky-100/80 p-2 rounded-xl">
                📞 Kênh độc lập
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 shadow-xs flex flex-col justify-between gap-3 group hover:border-emerald-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-2xs">
                    Bước 04
                  </span>
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl mb-1">HÀNH ĐỘNG</h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  Chỉ thực hiện giao dịch khi đã xác thực 100% người nhận là đúng sự thật.
                </p>
              </div>
              <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 p-2 rounded-xl">
                🛡️ An toàn tài sản số
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
