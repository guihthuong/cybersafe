"use client";

import Link from "next/link";
import {
  Shield,
  Target,
  GraduationCap,
  Users,
  Home,
  Bot,
  Gamepad2,
  BookOpen,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  const targetAudiences = [
    {
      icon: GraduationCap,
      color: "from-sky-500 to-indigo-600",
      textColor: "text-sky-400",
      bgLight: "bg-sky-500/10 border-sky-500/30",
      title: "Học sinh, sinh viên",
      description:
        "Nhận diện các bẫy lừa đảo việc làm ('việc nhẹ lương cao'), giả mạo tài khoản mạng xã hội của bạn bè/người thân và bảo vệ dữ liệu cá nhân trên không gian mạng.",
      badge: "Nhóm trẻ em & Gen Z",
    },
    {
      icon: Users,
      color: "from-amber-500 to-rose-600",
      textColor: "text-amber-400",
      bgLight: "bg-amber-500/10 border-amber-500/30",
      title: "Người cao tuổi",
      description:
        "Phòng ngừa các chiêu trò thao túng tâm lý giả danh công an, viện kiểm sát dọa bắt giam, lừa đảo trúng thưởng 'quà tri ân 0 đồng' và bẫy sàn đầu tư tài chính mạo hiểm.",
      badge: "Đối tượng dễ tổn thương",
    },
    {
      icon: Home,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      bgLight: "bg-emerald-500/10 border-emerald-500/30",
      title: "Phụ huynh & Gia đình",
      description:
        "Công cụ đồng hành để kiểm tra và bảo vệ an toàn tài chính gia đình, nhận diện cuộc gọi video Deepfake mượn tiền khẩn cấp và bảo vệ an toàn cho con em khi trực tuyến.",
      badge: "Hậu phương số an toàn",
    },
  ];

  const coreFeatures = [
    {
      step: "01",
      icon: Gamepad2,
      badge: "Game-based Learning",
      title: "Thực hành mô phỏng tương tác đa dạng",
      description:
        "Trải nghiệm 39 kịch bản đời thực dạng Rẽ nhánh quyết định (Branching Scenario), Điểm chạm bất thường (Hotspot) và Mô phỏng thiết bị thực tế. Người học được tự tay ra quyết định trong môi trường giả lập an toàn mà không phải trả giá bằng tài sản thật.",
      image: "/images/cybersecurity.png",
      cta: { text: "Vào trải nghiệm ngay", link: "/play" },
    },
    {
      step: "02",
      icon: Bot,
      badge: "Trí Tuệ Nhân Tạo",
      title: "Trợ lý AI CyberGuardBot Scaffolding",
      description:
        "Chatbot thông minh được tích hợp trực tiếp, sẵn sàng kiểm tra và bóc tách các dấu hiệu rủi ro từ tin nhắn, đường link, hình ảnh hoặc số điện thoại lạ theo khung sư phạm Scaffolding (giảm dần sự trợ giúp để người học tự nâng cao năng lực).",
      image: "/images/stealing OTP.png",
      cta: { text: "Thử nghiệm Chatbot AI", link: "/chatbot" },
    },
    {
      step: "03",
      icon: BookOpen,
      badge: "Cẩm Nang An Toàn",
      title: "Thư viện kiến thức & Hướng dẫn xử lý sự cố",
      description:
        "Thư viện số hóa toàn diện hướng dẫn cách nhận diện 11 nhóm chiêu thức lừa đảo, quy trình xử lý khẩn cấp khi đã lỡ bấm link hoặc chuyển tiền, cùng các căn cứ pháp lý chính thức từ cơ quan nhà nước.",
      image: "/images/qr scam.png",
      cta: { text: "Tra cứu Cẩm nang", link: "/guide" },
    },
    {
      step: "04",
      icon: BarChart3,
      badge: "Đo Lường Khoa Học",
      title: "Bản đồ Năng lực & Báo cáo Đánh giá",
      description:
        "Hệ thống tự động ghi nhận và phân tích sự tiến bộ qua 4 trụ cột năng lực cốt lõi: Năng lực Nhận diện, Năng lực Kiểm chứng, Năng lực Bảo vệ Tài khoản và Năng lực Ứng phó Sự cố, hỗ trợ trích xuất số liệu phục vụ nghiên cứu khoa học.",
      image: "/images/falling stock chart scam.png",
      cta: { text: "Xem số liệu KHKT", link: "/admin" },
    },
  ];

  const commonScams = [
    {
      title: "Giả mạo cơ quan chức năng (Công an, Tòa án)",
      desc: "Dọa bắt giam, dọa rửa tiền xuyên quốc gia, ép nạn nhân chuyển tiền tiết kiệm vào tài khoản 'tạm giữ' để thanh tra.",
      img: "/images/fake police.png",
      tag: "Thao túng sợ hãi",
      color: "border-rose-500/40 bg-rose-950/20",
    },
    {
      title: "Giả mạo ngân hàng & Chiếm đoạt mã OTP",
      desc: "Gửi SMS mạo danh thương hiệu (Brandname), gửi link website giả dạng e-banking để lừa người dùng nhập mã OTP và mật khẩu.",
      img: "/images/fake mobile banking.png",
      tag: "Chiếm đoạt tài khoản",
      color: "border-sky-500/40 bg-sky-950/20",
    },
    {
      title: "Việc nhẹ lương cao / Cộng tác viên Shopee, TikTok",
      desc: "Tuyển người like video, chốt đơn nhận hoa hồng khủng, sau đó bắt nạp tiền cọc với số tiền ngày càng lớn rồi khóa tài khoản.",
      img: "/images/fake job scam trap.png",
      tag: "Bẫy lòng tham",
      color: "border-amber-500/40 bg-amber-950/20",
    },
    {
      title: "Sử dụng Deepfake giả mạo khuôn mặt / giọng nói",
      desc: "Cuộc gọi video ngắn mờ mịt giả dạng con cháu, người thân đang bị tai nạn cấp cứu ở bệnh viện để vay tiền gấp.",
      img: "/images/imposter wearing face mask phone call.png",
      tag: "Công nghệ AI giả mạo",
      color: "border-purple-500/40 bg-purple-950/20",
    },
    {
      title: "Mã độc dịch vụ công & Chiếm đoạt điện thoại",
      desc: "Gửi đường link mạo danh VNeID, cơ quan Thuế yêu cầu cài file .apk giả mạo, chiếm toàn quyền điều khiển thiết bị từ xa.",
      img: "/images/hacker.png",
      tag: "Mã độc nguy hiểm",
      color: "border-emerald-500/40 bg-emerald-950/20",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-sky-400 selection:text-slate-950">
      {/* SECTION 1: HERO BANNER (Giới thiệu chung & Mục tiêu) */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-sky-900/40 overflow-hidden bg-gradient-to-b from-slate-950 via-sky-950/80 to-slate-950">
        {/* Tech Grid Pattern & Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-sky-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-900/60 border border-sky-500/40 text-xs sm:text-sm font-black text-sky-300 shadow-lg">
            <Shield className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>DỰ ÁN SÁNG KIẾN GIÁO DỤC AN TOÀN SỐ</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Sứ mệnh của{" "}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              CyberSafe Quest
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            <strong>CyberSafe Quest</strong> là nền tảng trò chơi tương tác giáo dục đầu tiên hỗ trợ cộng đồng rèn luyện kỹ năng phát hiện và phòng ngừa lừa đảo trực tuyến. Chúng tôi không chỉ cung cấp kiến thức, mà còn tạo ra môi trường giả lập an toàn để người dùng hình thành phản xạ số vững vàng:
          </p>

          <div className="pt-2">
            <span className="inline-block p-4 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-sky-900/90 via-indigo-900/90 to-sky-900/90 border-2 border-sky-400/50 text-white font-black text-base sm:text-xl shadow-xl tracking-wide">
              &ldquo;Dừng lại &nbsp;➔&nbsp; Kiểm tra &nbsp;➔&nbsp; Xác minh &nbsp;➔&nbsp; Mới hành động&rdquo;
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: ĐỐI TƯỢNG HƯỚNG TỚI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/70 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-sky-400 bg-sky-950/80 px-3.5 py-1 rounded-full border border-sky-500/30">
              BẢO VỆ CỘNG ĐỒNG
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Đối Tượng Hướng Tới
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              Nền tảng được thiết kế chuyên biệt để bảo vệ các nhóm đối tượng dễ bị tổn thương nhất trên không gian mạng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targetAudiences.map((target, idx) => {
              const Icon = target.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between space-y-5 bg-slate-900/90 shadow-xl ${target.bgLight}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${target.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {target.badge}
                      </span>
                    </div>

                    <h3 className={`text-xl font-black ${target.textColor}`}>
                      {target.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {target.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Thiết kế trực quan • Dễ tiếp cận</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: TÍNH NĂNG CỐT LÕI (Khối Zig-Zag) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-sky-950/40 to-slate-950 border-b border-sky-900/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-sky-400 bg-sky-950/80 px-3.5 py-1 rounded-full border border-sky-500/30">
              CÔNG NGHỆ & SƯ PHẠM
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tính Năng Cốt Lõi Của Nền Tảng
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              Sự kết hợp giữa kịch bản giả lập thực tế, trợ lý AI thông minh và phương pháp sư phạm hiện đại
            </p>
          </div>

          <div className="space-y-14">
            {coreFeatures.map((feat, idx) => {
              const isEven = idx % 2 === 1;
              const Icon = feat.icon;

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 rounded-3xl bg-slate-900/80 border-2 border-slate-800 hover:border-sky-500/40 transition-all shadow-xl backdrop-blur-md ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text Column */}
                  <div className={`lg:col-span-7 space-y-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black text-sky-400 bg-sky-950 px-2.5 py-0.5 rounded-md border border-sky-800">
                        TÍNH NĂNG {feat.step}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                      {feat.title}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                      {feat.description}
                    </p>

                    <div className="pt-2">
                      <Link
                        href={feat.cta.link}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer hover:translate-x-1"
                      >
                        <span>{feat.cta.text}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Illustration Column */}
                  <div className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="w-full h-56 sm:h-64 rounded-2xl bg-slate-950/90 border border-slate-800 p-4 flex items-center justify-center group overflow-hidden">
                      <img
                        src={feat.image}
                        alt={feat.title}
                        className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: ĐỐI MẶT CÁC HÌNH THỨC LỪA ĐẢO PHỔ BIẾN (Grid Cards) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/90 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-rose-400 bg-rose-950/80 px-3.5 py-1 rounded-full border border-rose-500/30">
              KHO TÌNH HUỐNG THỰC TẾ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Đối Mặt Với Các Hình Thức Lừa Đảo Phổ Biến
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              Các kịch bản được xây dựng dựa trên các vụ án và thủ đoạn lừa đảo phổ biến nhất được ghi nhận tại Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonScams.map((scam, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border-2 flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-md transition-all hover:scale-[1.02] ${scam.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                      Chiêu thức #{idx + 1}
                    </span>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {scam.tag}
                    </span>
                  </div>

                  <div className="w-full h-36 rounded-2xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center">
                    <img
                      src={scam.img}
                      alt={scam.title}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>

                  <h3 className="text-base font-black text-white leading-snug">
                    {scam.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {scam.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <Link
                    href={`/play/chuong-${idx + 1}`}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Xem kịch bản mô phỏng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-2 border-sky-500/40 text-center space-y-4 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Sẵn Sàng Rèn Luyện Phản Xạ An Toàn Số Cùng CyberSafe Quest?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto font-medium">
              Bắt đầu với các ải tình huống miễn phí ngay hôm nay để trang bị cho bản thân và gia đình lá chắn phòng thủ số vững chắc.
            </p>
            <div className="pt-2">
              <Link
                href="/play"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-base shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Bắt Đầu Luyện Tập Ngay</span>
                <ArrowRight className="w-5 h-5 text-sky-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
