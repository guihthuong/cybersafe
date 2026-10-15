"use client";

import Link from "next/link";
import {
  Shield,
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
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  const targetAudiences = [
    {
      icon: GraduationCap,
      iconColor: "text-blue-600 bg-blue-100",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      title: "Học sinh, sinh viên",
      description:
        "Nhận diện các bẫy lừa đảo việc làm ('việc nhẹ lương cao'), giả mạo tài khoản mạng xã hội của bạn bè/người thân và bảo vệ dữ liệu cá nhân trên không gian mạng.",
      badge: "Học sinh & Sinh viên",
    },
    {
      icon: Users,
      iconColor: "text-amber-600 bg-amber-100",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      title: "Người cao tuổi",
      description:
        "Phòng ngừa các chiêu trò thao túng tâm lý giả danh công an, viện kiểm sát dọa bắt giam, lừa đảo trúng thưởng 'quà tri ân 0 đồng' và bẫy sàn đầu tư tài chính mạo hiểm.",
      badge: "Người cao tuổi",
    },
    {
      icon: Home,
      iconColor: "text-emerald-600 bg-emerald-100",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      title: "Phụ huynh & Gia đình",
      description:
        "Công cụ đồng hành để kiểm tra và bảo vệ an toàn tài chính gia đình, nhận diện cuộc gọi video Deepfake mượn tiền khẩn cấp và bảo vệ an toàn cho con em khi trực tuyến.",
      badge: "Gia đình & Phụ huynh",
    },
  ];

  const coreFeatures = [
    {
      step: "01",
      icon: Gamepad2,
      iconColor: "text-blue-600 bg-blue-100",
      badge: "Thực Hành Trải Nghiệm",
      title: "Thực hành mô phỏng tương tác (Game-based Learning)",
      description:
        "Trải nghiệm 39 kịch bản đời thực dạng Rẽ nhánh quyết định (Branching Scenario), Điểm chạm bất thường (Hotspot) và Mô phỏng thiết bị thực tế. Người học được tự tay ra quyết định trong môi trường an toàn, dễ hiểu, không có rủi ro mất mát.",
      image: "/images/cybersecurity.png",
      cta: { text: "Khám phá 39 ải luyện tập", link: "/play" },
    },
    {
      step: "02",
      icon: Bot,
      iconColor: "text-indigo-600 bg-indigo-100",
      badge: "Trí Tuệ Nhân Tạo",
      title: "Trợ lý AI CyberGuardBot Scaffolding",
      description:
        "Chatbot thông minh được tích hợp trực tiếp, sẵn sàng kiểm tra và bóc tách các dấu hiệu rủi ro từ tin nhắn, đường link hoặc số điện thoại lạ theo khung sư phạm Scaffolding (giảm dần sự trợ giúp để người học tự nâng cao năng lực). Hoàn toàn miễn phí, không yêu cầu đăng nhập.",
      image: "/images/stealing OTP.png",
      cta: { text: "Trò chuyện với CyberGuardBot", link: "/chatbot" },
    },
    {
      step: "03",
      icon: BookOpen,
      iconColor: "text-amber-600 bg-amber-100",
      badge: "Cẩm Nang Tra Cứu",
      title: "Cẩm nang An toàn số & Xử lý sự cố",
      description:
        "Thư viện hướng dẫn toàn diện cách nhận diện 11 nhóm chiêu thức lừa đảo, quy trình xử lý khẩn cấp khi đã lỡ bấm link hoặc chuyển tiền, cùng các căn cứ pháp lý và số điện thoại đường dây nóng từ cơ quan chức năng.",
      image: "/images/qr scam.png",
      cta: { text: "Mở Cẩm nang an toàn", link: "/guide" },
    },
    {
      step: "04",
      icon: BarChart3,
      iconColor: "text-emerald-600 bg-emerald-100",
      badge: "Đo Lường Năng Lực",
      title: "Bản đồ Năng lực & Báo cáo tiến bộ",
      description:
        "Hệ thống tự động ghi nhận và phân tích sự tiến bộ qua 4 trụ cột năng lực cốt lõi: Năng lực Nhận diện, Năng lực Kiểm chứng, Năng lực Bảo vệ Tài khoản và Năng lực Ứng phó Sự cố, hỗ trợ trích xuất số liệu phục vụ nghiên cứu khoa học.",
      image: "/images/falling stock chart scam.png",
      cta: { text: "Xem thống kê năng lực", link: "/admin" },
    },
  ];

  const commonScams = [
    {
      title: "Giả mạo cơ quan chức năng (Công an, Tòa án)",
      desc: "Dọa bắt giam, dọa rửa tiền xuyên quốc gia, ép nạn nhân chuyển tiền tiết kiệm vào tài khoản 'tạm giữ' để thanh tra.",
      img: "/images/fake police.png",
      tag: "Thao túng sợ hãi",
      tagStyle: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      title: "Giả mạo ngân hàng & Chiếm đoạt mã OTP",
      desc: "Gửi SMS mạo danh thương hiệu (Brandname), gửi link website giả dạng e-banking để lừa người dùng nhập mã OTP và mật khẩu.",
      img: "/images/fake mobile banking.png",
      tag: "Chiếm đoạt tài khoản",
      tagStyle: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      title: "Việc nhẹ lương cao / Cộng tác viên Shopee, TikTok",
      desc: "Tuyển người xem video, giật đơn hàng nhận hoa hồng lớn, sau đó bắt nạp tiền cọc với số tiền tăng dần rồi khóa tài khoản.",
      img: "/images/fake job scam trap.png",
      tag: "Bẫy tài chính",
      tagStyle: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "Sử dụng Deepfake giả mạo khuôn mặt / giọng nói",
      desc: "Cuộc gọi video ngắn mờ ảo giả dạng con cháu, người thân đang bị tai nạn cấp cứu ở bệnh viện để vay tiền gấp.",
      img: "/images/imposter wearing face mask phone call.png",
      tag: "Deepfake AI",
      tagStyle: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      title: "Mã độc dịch vụ công & Cài app .APK giả",
      desc: "Gửi đường link mạo danh VNeID, cơ quan Thuế yêu cầu cài file .apk giả mạo, chiếm toàn quyền điều khiển thiết bị từ xa.",
      img: "/images/hacker.png",
      tag: "Chiếm quyền thiết bị",
      tagStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800">
      {/* SECTION 1: HERO BANNER (Sứ mệnh của CyberSafe Quest) */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/70 via-sky-50/40 to-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs text-xs sm:text-sm font-bold text-blue-700">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>SÁNG KIẾN GIÁO DỤC AN TOÀN SỐ VÌ CỘNG ĐỒNG</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Sứ mệnh của{" "}
            <span className="text-blue-600">CyberSafe Quest</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto font-normal">
            <strong>CyberSafe Quest</strong> là nền tảng trò chơi tương tác giáo dục đầu tiên hỗ trợ cộng đồng rèn luyện kỹ năng phát hiện và phòng ngừa lừa đảo trực tuyến. Chúng tôi không chỉ cung cấp kiến thức, mà còn tạo ra môi trường giả lập an toàn để người dùng hình thành phản xạ số vững vàng:
          </p>

          {/* Banner Nổi Bật Nền Xanh Brand (bg-blue-600), Chữ Trắng, Bo Góc */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="p-4 sm:px-6 sm:py-4 rounded-2xl bg-blue-600 text-white font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-2 sm:gap-3 text-center">
              <span>Dừng lại</span>
              <span className="text-blue-200 font-normal">➔</span>
              <span>Kiểm tra</span>
              <span className="text-blue-200 font-normal">➔</span>
              <span>Xác minh</span>
              <span className="text-blue-200 font-normal">➔</span>
              <span>Mới hành động</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ĐỐI TƯỢNG HƯỚNG TỚI (3 Cột Dạng Card Sáng) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
              BẢO VỆ CỘNG ĐỒNG
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Đối Tượng Hướng Tới
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Nền tảng được thiết kế chuyên biệt để bảo vệ các nhóm đối tượng dễ bị tổn thương nhất trên không gian mạng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targetAudiences.map((target, idx) => {
              const Icon = target.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${target.iconColor} flex items-center justify-center shadow-xs`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${target.badgeColor}`}>
                        {target.badge}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      {target.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {target.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Thiết kế thân thiện, dễ hiểu</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: TÍNH NĂNG CỐT LÕI (Bố cục Zig-zag Xen Kẽ Nền Xanh Nhạt) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-blue-50/40 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full">
              TÍNH NĂNG NỀN TẢNG
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tính Năng Cốt Lõi Của CyberSafe Quest
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Trang bị phản xạ số chủ động qua 4 phương thức giáo dục hiện đại
            </p>
          </div>

          <div className="space-y-12">
            {coreFeatures.map((feat, idx) => {
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text Column */}
                  <div className={`lg:col-span-7 space-y-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                        {feat.step}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                      {feat.title}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {feat.description}
                    </p>

                    <div className="pt-2">
                      <Link
                        href={feat.cta.link}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
                      >
                        <span>{feat.cta.text}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Illustration Column */}
                  <div className={`lg:col-span-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="w-full h-52 sm:h-60 rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-center">
                      <img
                        src={feat.image}
                        alt={feat.title}
                        className="w-full h-full object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: TÓM TẮT CÁC NHÓM LỪA ĐẢO PHỔ BIẾN (Grid Cards Sáng) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              CẢNH BÁO THỰC TẾ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Các Hình Thức Lừa Đảo Phổ Biến
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Được trích xuất từ 11 nhóm thủ đoạn nguy hiểm và phổ biến nhất được cơ quan chức năng cảnh báo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonScams.map((scam, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Hình thức #{idx + 1}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${scam.tagStyle}`}>
                      {scam.tag}
                    </span>
                  </div>

                  <div className="w-full h-36 rounded-xl bg-slate-50 border border-slate-100 p-2.5 flex items-center justify-center">
                    <img
                      src={scam.img}
                      alt={scam.title}
                      className="w-full h-full object-contain filter drop-shadow-xs"
                    />
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {scam.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {scam.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href={`/play/chuong-${idx + 1}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Luyện tập tình huống này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200 text-center space-y-4 shadow-xs">
            <h3 className="text-2xl font-black text-slate-900">
              Sẵn Sàng Rèn Luyện Phản Xạ An Toàn Số Cùng CyberSafe Quest?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Trải nghiệm các ải tình huống miễn phí ngay hôm nay để trang bị cho bản thân và gia đình kỹ năng phòng vệ số vững chắc.
            </p>
            <div className="pt-2">
              <Link
                href="/play"
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Bắt Đầu Luyện Tập Ngay</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
