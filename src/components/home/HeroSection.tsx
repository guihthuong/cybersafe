"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Split: Text & Main Hero Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Slogan & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Professional Project Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dự Án Nghiên Cứu Khoa Học Kỹ Thuật • Nền Tảng Giáo Dục An Toàn Số</span>
            </div>

            {/* Big Professional Title */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Rèn Luyện Năng Lực <br className="hidden sm:inline" />
                <span className="text-sky-700">
                  Phát Hiện Lừa Đảo Trực Tuyến
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Hệ thống 39 tình huống mô phỏng thực tế và trợ lý AI phân tích rủi ro chuyên sâu, xây dựng phản xạ tự vệ số bền vững cho người cao tuổi và học sinh.
              </p>
            </div>

            {/* 2 MAIN CALL-TO-ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto lg:mx-0 pt-1">
              {/* CTA 1: Vào Phòng Huấn Luyện */}
              <Link
                href="/play"
                className="p-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Vào Bản Đồ 39 Ải</span>
                <ArrowRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* CTA 2: Kiểm Tra Tin Nhắn Khả Nghi */}
              <Link
                href="/chatbot"
                className="p-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Trợ Lý Kiểm Tra Tin Nhắn</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Subtitle assurance */}
            <p className="text-xs text-slate-500 font-medium">
              Tuyệt đối không yêu cầu người dùng cung cấp mật khẩu, OTP, số tài khoản hoặc dữ liệu cá nhân.
            </p>
          </div>

          {/* Right Column: Dynamic Animated Illustration with Floating Chips */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Soft Ambient Radial Halo */}
            <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-sky-200/50 via-indigo-100/40 to-emerald-200/40 blur-2xl animate-pulse-halo pointer-events-none" />

            {/* Illustration Card Container */}
            <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 shadow-xl flex flex-col items-center hover-tilt">
              {/* Swaying & Floating Main Illustration */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 animate-float-slow flex items-center justify-center">
                <img
                  src="/images/cybersecurity.png"
                  alt="CyberSafe Defense Hub"
                  className="w-full h-full object-contain drop-shadow-md select-none transition-transform hover:scale-105 duration-300"
                />
              </div>

              {/* Micro Floating Badges */}
              <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 animate-float-reverse">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bảo Vệ Đa Lớp</span>
              </div>

              <div className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-md flex items-center gap-1.5 animate-float-slow">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>39 Ải Chuẩn Khoa Học</span>
              </div>
            </div>
          </div>
        </div>

        {/* CORE SLOGAN CARD - PROFESSIONAL 4-STEP FRAMEWORK */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-xs">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-extrabold mb-4 text-center sm:text-left">
            Quy trình 4 bước ứng phó an toàn số:
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. DỪNG LẠI */}
            <div className="p-4 rounded-2xl bg-white border border-rose-200 flex flex-col items-center justify-center gap-1 shadow-xs hover-tilt">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Bước 01
              </span>
              <span className="text-sm sm:text-base font-extrabold text-rose-700 mt-1">DỪNG LẠI</span>
              <span className="text-xs text-slate-500 font-medium text-center">Không bấm, không chuyển</span>
            </div>

            {/* 2. KIỂM TRA */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200 flex flex-col items-center justify-center gap-1 shadow-xs hover-tilt">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Bước 02
              </span>
              <span className="text-sm sm:text-base font-extrabold text-amber-700 mt-1">KIỂM TRA</span>
              <span className="text-xs text-slate-500 font-medium text-center">Soi link, số điện thoại</span>
            </div>

            {/* 3. XÁC MINH */}
            <div className="p-4 rounded-2xl bg-white border border-sky-200 flex flex-col items-center justify-center gap-1 shadow-xs hover-tilt">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                Bước 03
              </span>
              <span className="text-sm sm:text-base font-extrabold text-sky-700 mt-1">XÁC MINH</span>
              <span className="text-xs text-slate-500 font-medium text-center">Gọi điện cho người thân</span>
            </div>

            {/* 4. HÀNH ĐỘNG */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 flex flex-col items-center justify-center gap-1 shadow-xs hover-tilt">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Bước 04
              </span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-700 mt-1">HÀNH ĐỘNG</span>
              <span className="text-xs text-slate-500 font-medium text-center">Chỉ làm khi chắc chắn 100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
