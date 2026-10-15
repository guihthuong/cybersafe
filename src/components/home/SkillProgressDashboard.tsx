"use client";

import { Users, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export function SkillProgressDashboard() {
  const competencies = [
    {
      name: "1. Năng lực Nhận diện",
      desc: "Phát hiện link lạ (.cc, .top), tệp cài đặt đuôi .apk, tin nhắn mạo danh công an đòi chuyển tiền.",
      score: 85,
      level: "Tốt",
      barColor: "bg-sky-500",
      badgeColor: "bg-sky-950 text-sky-300 border-sky-700",
    },
    {
      name: "2. Năng lực Kiểm chứng",
      desc: "Biết tra cứu cổng dịch vụ công (.gov.vn), số hotline ngân hàng in trên thẻ ATM, gọi điện xác minh.",
      score: 92,
      level: "Xuất sắc",
      barColor: "bg-emerald-500",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-700",
    },
    {
      name: "3. Năng lực Bảo vệ Tài khoản",
      desc: "Tuyệt đối không gửi mã OTP cho bất kỳ ai, không cài app ngoài cửa hàng CH Play / App Store.",
      score: 78,
      level: "Khá",
      barColor: "bg-amber-500",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-700",
    },
    {
      name: "4. Năng lực Ứng phó Sự cố",
      desc: "Biết bật chế độ máy bay khi lỡ bấm link, khóa thẻ ngân hàng trên ứng dụng, báo Công an 113.",
      score: 80,
      level: "Tốt",
      barColor: "bg-indigo-500",
      badgeColor: "bg-indigo-950 text-indigo-300 border-indigo-700",
    },
  ];

  const badges = [
    { name: "Kỹ năng Soi Link", desc: "Phát hiện thành công 10 link mạo danh đuôi .cc, .top" },
    { name: "Bảo Vệ Mã OTP", desc: "Không bao giờ để lộ mã OTP trong mọi tình huống" },
    { name: "Nhận Diện Deepfake", desc: "Phát hiện cuộc gọi video giả mạo của đối tượng" },
    { name: "Xử Lý Quyết Đoán", desc: "Cúp máy dứt khoát trước đe dọa của đối tượng mạo danh" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs uppercase font-mono font-black text-blue-700 tracking-widest px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
              THEO DÕI NĂNG LỰC HỌC TẬP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Bảng Đánh Giá Kỹ Năng An Toàn Số
            </h2>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 text-right">
            <div className="text-xs text-slate-600 font-semibold">Chỉ số năng lực tổng hợp</div>
            <div className="text-lg sm:text-xl font-bold text-blue-700">84% • Mức Khá Tốt</div>
          </div>
        </div>

        {/* 4 Competency Bars */}
        <div className="space-y-4">
          <div className="text-xs font-black text-blue-700 uppercase tracking-wider">
            Đánh giá 4 trụ cột năng lực cốt lõi:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencies.map((comp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 shadow-xs hover:border-blue-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">{comp.name}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded border bg-white text-slate-700 border-slate-200">
                      {comp.score}% • {comp.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">{comp.desc}</p>
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
          <div className="text-xs font-black text-blue-700 uppercase tracking-wider">
            Tiêu chí năng lực đã kiểm chứng đạt chuẩn:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((b, idx) => {
              const badgeImages = [
                { img: "/images/qr scam.png" },
                { img: "/images/stealing OTP.png" },
                { img: "/images/imposter wearing face mask phone call.png" },
                { img: "/images/cybersecurity.png" },
              ];
              const curImg = badgeImages[idx];

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 space-y-3 shadow-xs hover-tilt transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Đạt chuẩn
                    </span>
                    <span className="text-xs font-mono text-slate-400">#TC0{idx + 1}</span>
                  </div>

                  <div className="w-16 h-16 mx-auto my-1 flex items-center justify-center">
                    <img
                      src={curImg.img}
                      alt={b.name}
                      className="w-full h-full object-contain drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <div className="font-bold text-sm text-slate-900 leading-snug">{b.name}</div>
                    <div className="text-xs text-slate-600 leading-relaxed mt-0.5">{b.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quy trình ứng phó cốt lõi (SmartArt Flowchart) */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <span className="text-xs uppercase font-black text-blue-700 tracking-wider">
              QUY TRÌNH ỨNG PHÓ CỐT LÕI
            </span>
            <span className="text-xs text-slate-500 font-semibold italic">
              Triết lý giáo dục: Đồng cảm & Không đổ lỗi nạn nhân. Hướng dẫn kỹ năng thực tế bảo vệ gia đình trên không gian số.
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-white border-2 border-rose-200 shadow-xs">
              <span className="font-black text-rose-700 text-sm sm:text-base block">1. DỪNG LẠI</span>
              <span className="text-[11px] text-slate-500 font-medium">Bình tĩnh 30 giây</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs">
              <span className="font-black text-amber-700 text-sm sm:text-base block">2. KIỂM TRA</span>
              <span className="text-[11px] text-slate-500 font-medium">Soi kỹ thông tin lạ</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border-2 border-sky-200 shadow-xs">
              <span className="font-black text-sky-700 text-sm sm:text-base block">3. XÁC MINH</span>
              <span className="text-[11px] text-slate-500 font-medium">Gọi người thân / Tổng đài</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-200 shadow-xs">
              <span className="font-black text-emerald-700 text-sm sm:text-base block">4. HÀNH ĐỘNG</span>
              <span className="text-[11px] text-slate-500 font-medium">Xử lý an toàn dứt khoát</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <Users className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Ý nghĩa giáo dục: </strong>
            Bảng theo dõi giúp người học và gia đình xác định nhóm kỹ năng cần cải thiện để tập trung luyện tập, từ đó hình thành phản xạ tự vệ số bền vững.
          </div>
        </div>
      </div>
    </section>
  );
}
