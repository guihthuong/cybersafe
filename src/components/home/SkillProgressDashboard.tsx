"use client";

import { Users } from "lucide-react";

export function SkillProgressDashboard() {
  const competencies = [
    {
      name: "1. Năng lực Nhận diện (Detection)",
      desc: "Phát hiện link lạ (.cc, .top), tệp cài đặt đuôi .apk, tin nhắn mạo danh công an đòi chuyển tiền.",
      score: 85,
      level: "Tốt",
      barColor: "bg-sky-500",
      badgeColor: "bg-sky-50 text-sky-800 border-sky-200",
    },
    {
      name: "2. Năng lực Kiểm chứng (Verification)",
      desc: "Biết tra cứu cổng dịch vụ công (.gov.vn), số hotline ngân hàng in trên thẻ ATM, gọi điện xác minh.",
      score: 92,
      level: "Xuất sắc",
      barColor: "bg-emerald-500",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      name: "3. Bảo vệ Tài khoản (Account Protection)",
      desc: "Tuyệt đối không gửi mã OTP cho bất kỳ ai, không cài app ngoài cửa hàng CH Play / App Store.",
      score: 78,
      level: "Khá",
      barColor: "bg-amber-500",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      name: "4. Ứng phó Sự cố (Incident Response)",
      desc: "Biết bật chế độ máy bay khi lỡ bấm link, khóa thẻ ngân hàng trên ứng dụng, báo Công an 113.",
      score: 80,
      level: "Tốt",
      barColor: "bg-indigo-500",
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
    },
  ];

  const badges = [
    { name: "Kỹ năng Soi Link", desc: "Phát hiện thành công 10 link mạo danh đuôi .cc, .top" },
    { name: "Bảo Vệ Mã OTP", desc: "Không bao giờ để lộ mã OTP trong mọi tình huống" },
    { name: "Nhận Diện Deepfake", desc: "Phát hiện cuộc gọi video giả mạo của đối tượng" },
    { name: "Xử Lý Quyết Đoán", desc: "Cúp máy dứt khoát trước đe dọa của đối tượng mạo danh" },
  ];

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200 mb-10">
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs uppercase font-mono font-bold text-slate-500 tracking-wider">
              Theo Dõi Năng Lực Học Tập
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Bảng Đánh Giá Kỹ Năng An Toàn Số
            </h2>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <div className="text-xs text-slate-500 font-semibold">Chỉ số năng lực tổng hợp</div>
            <div className="text-lg sm:text-xl font-bold text-slate-900">84% • Mức Khá Tốt</div>
          </div>
        </div>

        {/* 4 Competency Bars */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Đánh giá 4 trụ cột năng lực cốt lõi:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencies.map((comp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">{comp.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${comp.badgeColor}`}>
                      {comp.score}% • {comp.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{comp.desc}</p>
                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${comp.barColor}`}
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Indicators */}
        <div className="space-y-4 pt-2">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Tiêu chí năng lực đã kiểm chứng đạt chuẩn:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {badges.map((b, idx) => {
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Đạt chuẩn
                    </span>
                    <span className="text-xs font-mono text-slate-400">#TC0{idx + 1}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">{b.name}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{b.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          <Users className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong>Ý nghĩa giáo dục: </strong>
            Bảng theo dõi giúp người học và gia đình xác định nhóm kỹ năng cần cải thiện để tập trung luyện tập, từ đó hình thành phản xạ tự vệ số bền vững.
          </div>
        </div>
      </div>
    </section>
  );
}
