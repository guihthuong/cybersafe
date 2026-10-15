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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 text-white border-b border-sky-900/30">
      <div className="max-w-6xl mx-auto p-6 sm:p-10 rounded-3xl bg-slate-900/90 border-2 border-sky-500/30 shadow-2xl backdrop-blur-xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-mono font-black text-sky-400 tracking-widest px-3 py-1 bg-sky-950 rounded-full border border-sky-800">
              THEO DÕI NĂNG LỰC HỌC TẬP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Bảng Đánh Giá Kỹ Năng An Toàn Số
            </h2>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-right">
            <div className="text-xs text-slate-400 font-semibold">Chỉ số năng lực tổng hợp</div>
            <div className="text-lg sm:text-xl font-bold text-sky-300">84% • Mức Khá Tốt</div>
          </div>
        </div>

        {/* 4 Competency Bars */}
        <div className="space-y-4">
          <div className="text-xs font-black text-sky-400 uppercase tracking-wider">
            Đánh giá 4 trụ cột năng lực cốt lõi:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencies.map((comp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-3 shadow-sm hover:border-sky-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm sm:text-base text-white">{comp.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${comp.badgeColor}`}>
                      {comp.score}% • {comp.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-normal leading-relaxed">{comp.desc}</p>
                </div>

                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
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
          <div className="text-xs font-black text-sky-400 uppercase tracking-wider">
            Tiêu chí năng lực đã kiểm chứng đạt chuẩn:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((b, idx) => {
              const badgeImages = [
                { img: "/images/qr scam.png", anim: "animate-float-slow" },
                { img: "/images/stealing OTP.png", anim: "animate-sway-gentle" },
                { img: "/images/imposter wearing face mask phone call.png", anim: "animate-float-reverse" },
                { img: "/images/cybersecurity.png", anim: "animate-float-slow" },
              ];
              const curImg = badgeImages[idx];

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 hover:border-sky-400 space-y-3 shadow-md hover-tilt transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      Đạt chuẩn
                    </span>
                    <span className="text-xs font-mono text-slate-500">#TC0{idx + 1}</span>
                  </div>

                  <div className="w-16 h-16 mx-auto my-1 flex items-center justify-center">
                    <img
                      src={curImg.img}
                      alt={b.name}
                      className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <div className="font-bold text-sm text-white leading-snug">{b.name}</div>
                    <div className="text-xs text-slate-400 leading-relaxed mt-0.5">{b.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quy trình ứng phó cốt lõi (SmartArt Flowchart) */}
        <div className="p-6 rounded-3xl bg-slate-950 border-2 border-slate-800 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <span className="text-xs uppercase font-black text-sky-400 tracking-wider">
              QUY TRÌNH ỨNG PHÓ CỐT LÕI
            </span>
            <span className="text-xs text-slate-400 font-semibold italic">
              Triết lý giáo dục: Đồng cảm & Không đổ lỗi nạn nhân. Hướng dẫn kỹ năng thực tế bảo vệ gia đình trên không gian số.
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-rose-500/50 shadow-xs">
              <span className="font-black text-rose-400 text-sm sm:text-base block">1. DỪNG LẠI</span>
              <span className="text-[11px] text-slate-400 font-medium">Bình tĩnh 30 giây</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 shadow-xs">
              <span className="font-black text-amber-400 text-sm sm:text-base block">2. KIỂM TRA</span>
              <span className="text-[11px] text-slate-400 font-medium">Soi kỹ thông tin lạ</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-sky-500/50 shadow-xs">
              <span className="font-black text-sky-400 text-sm sm:text-base block">3. XÁC MINH</span>
              <span className="text-[11px] text-slate-400 font-medium">Gọi người thân / Tổng đài</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 shadow-xs">
              <span className="font-black text-emerald-400 text-sm sm:text-base block">4. HÀNH ĐỘNG</span>
              <span className="text-[11px] text-slate-400 font-medium">Xử lý an toàn dứt khoát</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          <Users className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <strong>Ý nghĩa giáo dục: </strong>
            Bảng theo dõi giúp người học và gia đình xác định nhóm kỹ năng cần cải thiện để tập trung luyện tập, từ đó hình thành phản xạ tự vệ số bền vững.
          </div>
        </div>
      </div>
    </section>
  );
}
