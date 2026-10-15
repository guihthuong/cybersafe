import Link from "next/link";
import { Shield, Mail, Phone, MapPin, Heart, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer id="ve-chung-toi" className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Slogan Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border-2 border-sky-500/30 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-sky-400 font-black">
                SLOGAN & TRIẾT LÝ HÀNH ĐỘNG
              </div>
              <div className="text-lg sm:text-xl font-black text-white mt-0.5">
                Xây dựng phản xạ số — Giữ an toàn tài sản và gia đình trên không gian mạng
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Quy trình ứng phó: <strong className="text-sky-300">1. Dừng lại ➔ 2. Kiểm tra ➔ 3. Xác minh ➔ 4. Mới hành động</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-semibold shrink-0">
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Triết lý: <strong>Đồng cảm & Không đổ lỗi nạn nhân</strong></span>
          </div>
        </div>

        {/* 4 Columns: Brand/About, Navigation, Core Competencies, Author & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-sm">
          {/* Col 1: Về Dự Án */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white font-black text-sm">
                CS
              </div>
              <span className="text-lg font-black text-white">CyberSafe Quest</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng trò chơi tương tác giáo dục đầu tiên tại Việt Nam hỗ trợ học sinh và người cao tuổi rèn luyện phản xạ phòng ngừa 11 nhóm thủ đoạn lừa đảo qua 39 tình huống thực tế.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dự án Khoa Học Kỹ Thuật (KHKT)</span>
            </div>
          </div>

          {/* Col 2: Điều Hướng */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Khám Phá Nền Tảng
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-sky-500" /> Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/play" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-sky-500" /> Sản Phẩm (39 Ải Luyện Tập)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-sky-500" /> Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-sky-500" /> Cẩm Nang An Toàn Số
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-sky-500" /> Trợ Lý AI CyberGuardBot
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: 4 Trụ Cột Năng Lực */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Trụ Cột Năng Lực Số
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> 1. Năng lực Nhận diện
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 2. Năng lực Kiểm chứng
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> 3. Năng lực Bảo vệ Tài khoản
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 4. Năng lực Ứng phó Sự cố
              </li>
              <li className="pt-1">
                <Link href="/admin" className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1">
                  Quản Trị & Số Liệu KHKT ➔
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tác Giả & Liên Hệ (Theo yêu cầu) */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              Tác Giả & Liên Hệ
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 font-semibold">
                Tác giả: <strong className="text-white">Nhóm Nghiên Cứu Đề Tài CyberSafe Quest</strong>
              </p>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>hotro@cybersafe-quest.edu.vn</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cảnh báo khẩn cấp: 113 / 156</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Phục vụ cộng đồng giáo dục số Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 CyberSafe Quest. Sáng kiến Giáo dục An toàn số vì cộng đồng. Bảo lưu mọi quyền.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Phiên bản 2.0 (Duolingo Style)</span>
            <span>•</span>
            <span className="text-sky-400 font-bold">100% Phi thương mại</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
