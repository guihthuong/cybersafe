"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";

export interface CategoryMeta {
  id: string;
  code: string;
  name: string;
  scenariosCount: number;
  vulnerableTarget: string;
  warningNote: string;
  imageUrl: string;
}

export const CATEGORIES_DATA: CategoryMeta[] = [
  {
    id: "fake_police_authority",
    code: "N01",
    name: "Giả mạo Công an / Viện kiểm sát / Tòa án",
    scenariosCount: 4,
    vulnerableTarget: "Người cao tuổi",
    warningNote: "Dọa bắt giam, dọa rửa tiền, ép chuyển tiền tạm giữ",
    imageUrl: "/images/fake police.png",
  },
  {
    id: "bank_otp_fraud",
    code: "N02",
    name: "Giả mạo ngân hàng / Chiếm đoạt mã OTP",
    scenariosCount: 5,
    vulnerableTarget: "Mọi đối tượng",
    warningNote: "Tin nhắn SMS mạo danh, gửi link câu trộm mã OTP và mật khẩu",
    imageUrl: "/images/fake mobile banking.png",
  },
  {
    id: "lottery_reward_trap",
    code: "N03",
    name: "Lừa đảo trúng thưởng / Quà tri ân 0 đồng",
    scenariosCount: 3,
    vulnerableTarget: "Người lớn tuổi & Nội trợ",
    warningNote: "Thông báo trúng xe máy SH, bắt nộp thuế nhận giải trước",
    imageUrl: "/images/fake lottery prize trap.png",
  },
  {
    id: "easy_job_high_pay",
    code: "N04",
    name: "Việc nhẹ lương cao / Cộng tác viên Shopee, TikTok",
    scenariosCount: 4,
    vulnerableTarget: "Học sinh, sinh viên",
    warningNote: "Thả tim xem video kiếm tiền, nạp tiền làm nhiệm vụ giật đơn",
    imageUrl: "/images/fake job scam trap.png",
  },
  {
    id: "romance_investment_pig",
    code: "N05",
    name: "Bẫy tình cảm / Đầu tư sàn tài chính ảo",
    scenariosCount: 3,
    vulnerableTarget: "Thanh niên & Người độc thân",
    warningNote: "Kết bạn làm quen yêu đương, rủ rê nạp tiền sàn ảo rồi khóa tài khoản",
    imageUrl: "/images/romance scam.png",
  },
  {
    id: "deepfake_video_call",
    code: "N06",
    name: "Deepfake khuôn mặt & Giọng nói người thân",
    scenariosCount: 4,
    vulnerableTarget: "Phụ huynh & Người già",
    warningNote: "Gọi video ngắn 5 giây mờ ảo, mượn tiền gấp vì tai nạn cấp cứu",
    imageUrl: "/images/imposter wearing face mask phone call.png",
  },
  {
    id: "malicious_app_link",
    code: "N07",
    name: "Mã độc dịch vụ công / Cài file .APK giả",
    scenariosCount: 4,
    vulnerableTarget: "Người dùng điện thoại Android",
    warningNote: "Hướng dẫn cài VNeID qua link lạ, chiếm quyền điện thoại rút sạch tiền",
    imageUrl: "/images/stealing OTP.png",
  },
  {
    id: "travel_ticket_scam",
    code: "N08",
    name: "Vé máy bay giá rẻ / Combo du lịch ảo",
    scenariosCount: 3,
    vulnerableTarget: "Gia đình đi nghỉ hè",
    warningNote: "Trang mạng mạo danh hãng máy bay, nhận tiền cọc rồi chặn liên lạc",
    imageUrl: "/images/falling stock chart scam.png",
  },
  {
    id: "ecommerce_fake_shipper",
    code: "N09",
    name: "Giả danh shipper giao hàng / Đơn 0 đồng",
    scenariosCount: 3,
    vulnerableTarget: "Người hay mua online",
    warningNote: "Giao gói hàng không đặt, hối thúc chuyển khoản tiền hàng gấp",
    imageUrl: "/images/qr scam.png",
  },
  {
    id: "social_account_takeover",
    code: "N10",
    name: "Hack Facebook, Zalo / Mượn tiền bạn bè",
    scenariosCount: 3,
    vulnerableTarget: "Bạn bè & Người thân",
    warningNote: "Cướp nick mạng xã hội, nhắn tin mượn tiền hàng loạt danh bạ",
    imageUrl: "/images/hacker stealing social media profile.png",
  },
  {
    id: "fake_scholarship_course",
    code: "N11",
    name: "Học bổng trại hè / Khóa học kỹ năng trẻ em",
    scenariosCount: 3,
    vulnerableTarget: "Trẻ em & Phụ huynh",
    warningNote: "Trại hè quân đội giả, cuộc thi nhí yêu cầu nộp tiền khảo sát",
    imageUrl: "/images/false rumor fake news.png",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200">
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs">
          <span>Danh Mục Tình Huống Khoa Học</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          11 Chiêu Thức Lừa Đảo Thường Gặp Nhất
        </h2>
        <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
          Dễ dàng tìm hiểu và luyện tập phản xạ cho từng tình huống quen thuộc trong đời sống.
        </p>
      </div>

      {/* Grid Cards - Rich Illustrated Taxonomy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_DATA.map((cat, idx) => {
          const groupCode = `N${idx < 9 ? "0" : ""}${idx + 1}`;
          return (
            <div
              key={cat.id}
              className="rounded-3xl bg-white border-2 border-slate-200 hover:border-sky-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xs"
            >
              {/* Illustration Top Frame with Gentle Floating / Swaying */}
              <div className="relative h-44 bg-gradient-to-b from-slate-50 via-sky-50/30 to-white flex items-center justify-center p-4 border-b border-slate-100 overflow-hidden">
                {/* Soft ambient glow */}
                <div className="absolute w-32 h-32 rounded-full bg-sky-200/40 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                {/* Main Illustrated Mascot (Still at rest, sways playfully on hover) */}
                {(() => {
                  const swayHoverClass =
                    idx % 3 === 0
                      ? "group-hover-sway"
                      : idx % 3 === 1
                      ? "group-hover-rock"
                      : "group-hover-wobble";
                  return (
                    <div className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 ${swayHoverClass} transition-transform duration-300 flex items-center justify-center`}>
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-full h-full object-contain drop-shadow-md select-none group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  );
                })()}

                {/* Floating Group Code Pill */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-full bg-white/95 text-slate-800 border border-slate-200 shadow-xs">
                    {groupCode}
                  </span>
                </div>

                {/* Scenario Count Pill */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 shadow-xs">
                    {cat.scenariosCount} tình huống
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {cat.warningNote}
                  </p>
                </div>

                {/* Bottom footer tag & action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate max-w-[170px]">
                    Mục tiêu: <strong className="text-slate-800">{cat.vulnerableTarget}</strong>
                  </span>

                  <Link
                    href={`/play/chuong-${idx + 1}`}
                    className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Luyện tập</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
