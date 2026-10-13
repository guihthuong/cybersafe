"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, AlertCircle, PhoneCall, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Top Split: Text & Realistic Scenario Inspection Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading, Human Slogan & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Project Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Dự án Giáo dục An toàn số • Nghiên cứu Khoa học Kỹ thuật</span>
            </div>

            {/* Human-Centered Title */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Rèn Luyện Phản Xạ <br className="hidden sm:inline" />
                <span className="text-sky-700">
                  Phòng Chống Lừa Đảo Số
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Hệ thống 39 tình huống tương tác sát với thực tế đời sống, đồng hành cùng người cao tuổi, học sinh và gia đình xây dựng thói quen cảnh giác, bảo vệ an toàn tài sản trên không gian mạng.
              </p>
            </div>

            {/* 2 Main Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto lg:mx-0 pt-1">
              <Link
                href="/play"
                className="p-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm sm:text-base shadow-sm hover-lift flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Bắt Đầu Với 39 Ải Thực Tế</span>
                <ArrowRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/chatbot"
                className="p-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 hover:border-slate-400 font-bold text-sm sm:text-base shadow-xs hover-lift flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Kiểm Tra Tin Nhắn Nghi Vấn</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Non-blaming Privacy Assurance */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hoàn toàn miễn phí, an toàn & không thu thập thông tin cá nhân hay mật khẩu.</span>
            </div>
          </div>

          {/* Right Column: Realistic Interactive Message Inspection Mockup */}
          <div className="lg:col-span-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
              {/* Mockup Header: Realistic Message Alert */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    !
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Ví dụ tình huống thực tế</div>
                    <div className="text-[11px] text-slate-500">Mạo danh cơ quan chức năng</div>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Rủi ro cao
                </span>
              </div>

              {/* Realistic Message Bubble */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
                    <PhoneCall className="w-3 h-3 text-slate-400" /> +84 981 xxx 412
                  </span>
                  <span>10:42 Hôm nay</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  &ldquo;Tài khoản của ông/bà đang liên quan vụ án rửa tiền nghiêm trọng. Yêu cầu chuyển 50.000.000đ vào số tài khoản tạm giữ của Tòa án để thanh tra trong 30 phút...&rdquo;
                </p>
              </div>

              {/* Realistic Red Flags Breakdown */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  3 Dấu hiệu nhận diện ngay:
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100 flex items-start gap-2 text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span><strong>Thao túng sợ hãi:</strong> Tạo áp lực thời gian (30 phút) để nạn nhân không kịp suy nghĩ.</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-100 flex items-start gap-2 text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Quy định pháp luật:</strong> Công an và Tòa án KHÔNG làm việc qua điện thoại và KHÔNG có &apos;tài khoản tạm giữ&apos;.</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-start gap-2 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Cách xử lý đúng:</strong> Cúp máy ngay, gọi điện cho người thân hoặc đến trụ sở công an gần nhất.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORE 4-STEP FRAMEWORK - CLEAN & HUMAN */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-4 text-center sm:text-left">
            Quy trình 4 bước ứng phó an toàn số:
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. DỪNG LẠI */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1 hover-lift">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Bước 01
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">DỪNG LẠI</span>
              <span className="text-xs text-slate-500 font-medium text-center">Không bấm, không chuyển tiền</span>
            </div>

            {/* 2. KIỂM TRA */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1 hover-lift">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Bước 02
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">KIỂM TRA</span>
              <span className="text-xs text-slate-500 font-medium text-center">Soi kỹ đường link, đầu số</span>
            </div>

            {/* 3. XÁC MINH */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1 hover-lift">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                Bước 03
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">XÁC MINH</span>
              <span className="text-xs text-slate-500 font-medium text-center">Hỏi người thân hoặc kênh chính thức</span>
            </div>

            {/* 4. HÀNH ĐỘNG */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1 hover-lift">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Bước 04
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">HÀNH ĐỘNG</span>
              <span className="text-xs text-slate-500 font-medium text-center">Chỉ thực hiện khi chắc chắn 100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
