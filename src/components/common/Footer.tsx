import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Slogan Bar - Professional Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-extrabold">
                Quy trình ứng phó cốt lõi
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                1. Dừng lại &nbsp;➔&nbsp; 2. Kiểm tra &nbsp;➔&nbsp; 3. Xác minh &nbsp;➔&nbsp; 4. Mới hành động
              </div>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 max-w-sm font-medium">
            Triết lý giáo dục: <strong className="text-slate-800">Đồng cảm & Không đổ lỗi nạn nhân</strong>. Hướng dẫn kỹ năng thực tế bảo vệ gia đình trên không gian số.
          </div>
        </div>

        {/* Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Shield className="w-4 h-4 text-sky-700" />
            <span>CyberSafe Quest — Dự án Tham Gia Cuộc Thi Khoa Học Kỹ Thuật</span>
          </div>

          <div className="text-slate-500 font-medium">
            Phục vụ nghiên cứu và nâng cao năng lực an toàn số cộng đồng
          </div>
        </div>
      </div>
    </footer>
  );
}
