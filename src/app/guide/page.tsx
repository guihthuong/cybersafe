"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES_DATA } from "@/components/home/CategoryGrid";
import {
  BookOpen,
  Phone,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function GuidePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = CATEGORIES_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.warningNote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vulnerableTarget.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-700 mb-1.5">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Cẩm Nang Cục An Toàn Thông Tin & Nghiên Cứu KHKT</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
              Cẩm Nang Nhận Diện 11 Chiêu Thức Lừa Đảo
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1">
              Tra cứu nhanh dấu hiệu nhận biết, biện pháp phòng tránh và số điện thoại hỗ trợ khẩn cấp.
            </p>
          </div>

          <Link
            href="/play"
            className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Vào Luyện Tập Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Step Slogan Banner */}
        <div className="p-6 rounded-3xl bg-sky-50 border-2 border-sky-200 space-y-3">
          <div className="text-xs uppercase tracking-widest text-sky-800 font-black">
            Nguyên tắc phòng vệ số bất di bất dịch:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-900 text-sm">
            <div className="p-3.5 rounded-2xl bg-white border border-sky-200 font-bold">
              <span className="text-xs uppercase tracking-wider text-rose-600 block mb-0.5">Bước 1</span>
              <strong>Dừng lại:</strong> Không vội chuyển tiền, không bấm link khi bị hối thúc.
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-sky-200 font-bold">
              <span className="text-xs uppercase tracking-wider text-amber-600 block mb-0.5">Bước 2</span>
              <strong>Kiểm tra:</strong> Soi kỹ tên miền (.gov.vn, .com.vn), tệp cài đặt (.apk).
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-sky-200 font-bold">
              <span className="text-xs uppercase tracking-wider text-sky-600 block mb-0.5">Bước 3</span>
              <strong>Xác minh:</strong> Gọi điện thoại di động thông thường cho người thân.
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-sky-200 font-bold">
              <span className="text-xs uppercase tracking-wider text-emerald-600 block mb-0.5">Bước 4</span>
              <strong>Hành động:</strong> Chỉ thao tác khi đã xác thực 100% người nhận là thật.
            </div>
          </div>
        </div>

        {/* Emergency Hotlines Directory */}
        <div className="p-6 rounded-3xl bg-rose-50 border-2 border-rose-200 space-y-4">
          <div className="flex items-center gap-2 text-rose-800 font-black text-base">
            <Phone className="w-5 h-5 text-rose-600" />
            <span>Đường Dây Nóng Khẩn Cấp Khi Nghi Ngờ Hoặc Đã Bị Lừa Đảo:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="p-4 rounded-2xl bg-white border border-rose-200">
              <div className="text-xs text-slate-500 font-bold">Trực ban Cảnh sát Hình sự</div>
              <div className="text-lg font-black text-rose-600">113</div>
              <div className="text-xs text-slate-600 mt-1">Trình báo ngay khi vừa chuyển tiền</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200">
              <div className="text-xs text-slate-500 font-bold">Phản ánh Tin nhắn / Cuộc gọi rác</div>
              <div className="text-lg font-black text-sky-600">156 (miễn phí)</div>
              <div className="text-xs text-slate-600 mt-1">Tổng đài tiếp nhận phản ánh quốc gia</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200">
              <div className="text-xs text-slate-500 font-bold">Cổng Dịch vụ công Quốc gia</div>
              <div className="text-lg font-black text-emerald-600">1800 1096</div>
              <div className="text-xs text-slate-600 mt-1">Hỗ trợ tài khoản VNeID và thủ tục hành chính</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên chiêu thức (ví dụ: công an, shipper, vneid, xe sh, otp)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-slate-300 focus:border-sky-500 outline-none text-base font-semibold shadow-xs"
          />
        </div>

        {/* 11 Categories Handbook List */}
        <div className="space-y-4">
          {filteredCategories.map((cat) => {
            return (
              <div
                key={cat.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 font-mono text-sm font-bold text-slate-800">
                    {cat.code}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        Đối tượng nguy cơ: {cat.vulnerableTarget}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-semibold border border-sky-200">
                        {cat.scenariosCount} tình huống
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">{cat.name}</h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {cat.warningNote}
                    </p>
                  </div>
                </div>

                <Link
                  href="/play"
                  className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-black text-xs sm:text-sm border border-sky-300 shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Xem tình huống</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
