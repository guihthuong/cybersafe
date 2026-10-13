"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Professional Project Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold shadow-xs">
          <span>Dự Án Nghiên Cứu Khoa Học Kỹ Thuật • Nền Tảng Giáo Dục An Toàn Số</span>
        </div>

        {/* Big Professional Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Nền Tảng Rèn Luyện Năng Lực <br className="hidden sm:inline" />
            <span className="text-sky-700">
              Phát Hiện Lừa Đảo Trực Tuyến
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed pt-1">
            Hệ thống tình huống mô phỏng và trợ lý tư vấn rủi ro, hỗ trợ nâng cao phản xạ tự vệ số cho người cao tuổi và học sinh.
          </p>
        </div>

        {/* CORE SLOGAN CARD - PROFESSIONAL 4-STEP FRAMEWORK */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-xs">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-extrabold mb-4">
            Quy trình 4 bước ứng phó an toàn số:
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. DỪNG LẠI */}
            <div className="p-4 rounded-2xl bg-white border border-rose-200 flex flex-col items-center justify-center gap-1 shadow-xs">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Bước 01
              </span>
              <span className="text-sm sm:text-base font-extrabold text-rose-700 mt-1">DỪNG LẠI</span>
              <span className="text-xs text-slate-500 font-medium">Không bấm, không chuyển</span>
            </div>

            {/* 2. KIỂM TRA */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200 flex flex-col items-center justify-center gap-1 shadow-xs">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Bước 02
              </span>
              <span className="text-sm sm:text-base font-extrabold text-amber-700 mt-1">KIỂM TRA</span>
              <span className="text-xs text-slate-500 font-medium">Soi link, số điện thoại</span>
            </div>

            {/* 3. XÁC MINH */}
            <div className="p-4 rounded-2xl bg-white border border-sky-200 flex flex-col items-center justify-center gap-1 shadow-xs">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                Bước 03
              </span>
              <span className="text-sm sm:text-base font-extrabold text-sky-700 mt-1">XÁC MINH</span>
              <span className="text-xs text-slate-500 font-medium">Gọi điện cho người thân</span>
            </div>

            {/* 4. HÀNH ĐỘNG */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 flex flex-col items-center justify-center gap-1 shadow-xs">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Bước 04
              </span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-700 mt-1">HÀNH ĐỘNG</span>
              <span className="text-xs text-slate-500 font-medium">Chỉ làm khi chắc chắn 100%</span>
            </div>
          </div>
        </div>

        {/* 2 MAIN CALL-TO-ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
          {/* CTA 1: Vào Phòng Huấn Luyện */}
          <Link
            href="/play"
            className="p-5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base sm:text-lg shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Vào Bản Đồ Thử Thách 39 Ải</span>
            <ArrowRight className="w-5 h-5 text-sky-200 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* CTA 2: Kiểm Tra Tin Nhắn Khả Nghi */}
          <Link
            href="/chatbot"
            className="p-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 font-extrabold text-base sm:text-lg shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Kiểm Tra Tin Nhắn Khả Nghi</span>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Subtitle assurance */}
        <p className="text-xs text-slate-500 font-medium pt-1">
          Hệ thống tuyệt đối không yêu cầu người dùng cung cấp mật khẩu, OTP, số thẻ hoặc dữ liệu cá nhân.
        </p>
      </div>
    </section>
  );
}
