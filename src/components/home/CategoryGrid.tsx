"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldAlert,
  CreditCard,
  Gift,
  Briefcase,
  HeartHandshake,
  Video,
  Smartphone,
  Plane,
  Package,
  UserCheck,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";

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
    warningNote: "Dọa bắt giam, dọa rửa tiền, ép chuyển tiền vào tài khoản tạm giữ",
    imageUrl: "/images/fake police.png",
  },
  {
    id: "bank_otp_fraud",
    code: "N02",
    name: "Giả mạo ngân hàng / Chiếm đoạt mã OTP",
    scenariosCount: 5,
    vulnerableTarget: "Mọi đối tượng",
    warningNote: "Tin nhắn SMS mạo danh, gửi link giả mạo đánh cắp mã OTP và mật khẩu",
    imageUrl: "/images/fake mobile banking.png",
  },
  {
    id: "lottery_reward_trap",
    code: "N03",
    name: "Lừa đảo trúng thưởng / Quà tri ân 0 đồng",
    scenariosCount: 3,
    vulnerableTarget: "Người lớn tuổi & Nội trợ",
    warningNote: "Thông báo trúng thưởng lớn, yêu cầu đóng thuế hoặc cọc trước",
    imageUrl: "/images/fake lottery prize trap.png",
  },
  {
    id: "easy_job_high_pay",
    code: "N04",
    name: "Việc nhẹ lương cao / Cộng tác viên Shopee, TikTok",
    scenariosCount: 4,
    vulnerableTarget: "Học sinh, sinh viên",
    warningNote: "Nhiệm vụ xem video giật đơn, nạp tiền nhỏ rút được tiền lớn bị khóa",
    imageUrl: "/images/fake job scam trap.png",
  },
  {
    id: "romance_investment_pig",
    code: "N05",
    name: "Bẫy tình cảm / Đầu tư sàn tài chính ảo",
    scenariosCount: 3,
    vulnerableTarget: "Thanh niên & Người độc thân",
    warningNote: "Làm quen thân mật, rủ rê nạp tiền sàn đầu tư ảo rồi chiếm đoạt",
    imageUrl: "/images/falling stock chart scam.png",
  },
  {
    id: "deepfake_video_call",
    code: "N06",
    name: "Deepfake khuôn mặt & Giọng nói người thân",
    scenariosCount: 4,
    vulnerableTarget: "Phụ huynh & Người già",
    warningNote: "Cuộc gọi video ngắn mờ ảo mượn tiền gấp vì tai nạn cấp cứu",
    imageUrl: "/images/imposter wearing face mask phone call.png",
  },
  {
    id: "malicious_app_link",
    code: "N07",
    name: "Mã độc dịch vụ công / Cài file .APK giả",
    scenariosCount: 4,
    vulnerableTarget: "Người dùng điện thoại Android",
    warningNote: "Link mạo danh VNeID/Thuế cài file .apk chiếm quyền điều khiển điện thoại",
    imageUrl: "/images/hacker.png",
  },
  {
    id: "travel_ticket_scam",
    code: "N08",
    name: "Vé máy bay giá rẻ / Combo du lịch ảo",
    scenariosCount: 3,
    vulnerableTarget: "Gia đình đi nghỉ hè",
    warningNote: "Fanpage giả mạo hãng lữ hành, nhận tiền cọc vé rồi chặn liên lạc",
    imageUrl: "/images/romance scam.png",
  },
  {
    id: "ecommerce_fake_shipper",
    code: "N09",
    name: "Giả danh shipper giao hàng / Đơn 0 đồng",
    scenariosCount: 3,
    vulnerableTarget: "Người hay mua online",
    warningNote: "Giao bưu kiện không đặt, hối thúc chuyển khoản tiền hàng gấp",
    imageUrl: "/images/qr scam.png",
  },
  {
    id: "social_account_takeover",
    code: "N10",
    name: "Hack tài khoản mạng xã hội / Mượn tiền khẩn cấp",
    scenariosCount: 3,
    vulnerableTarget: "Bạn bè & Người thân",
    warningNote: "Chiếm quyền Zalo/Facebook, nhắn tin hỏi vay tiền vì đang kẹt gấp",
    imageUrl: "/images/hacker stealing social media profile.png",
  },
  {
    id: "fake_scholarship_course",
    code: "N11",
    name: "Khóa học hè / Học bổng trại hè quốc tế giả",
    scenariosCount: 3,
    vulnerableTarget: "Phụ huynh có con nhỏ",
    warningNote: "Mạo danh ban tổ chức trại hè uy tín, yêu cầu đóng lệ phí khảo sát lớn",
    imageUrl: "/images/false rumor fake news.png",
  },
];

const CATEGORY_ICONS = [
  { icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
  { icon: CreditCard, color: "text-sky-600", bg: "bg-sky-50 border-sky-200" },
  { icon: Gift, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  { icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { icon: HeartHandshake, color: "text-pink-600", bg: "bg-pink-50 border-pink-200" },
  { icon: Video, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
  { icon: Smartphone, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  { icon: Plane, color: "text-teal-600", bg: "bg-teal-50 border-teal-200" },
  { icon: Package, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  { icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { icon: GraduationCap, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
];

export function CategoryGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
            KHO DỮ LIỆU ĐỜI THỰC
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            11 Nhóm Chiêu Thức Thường Gặp
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Được tổng hợp từ các vụ việc thực tế tại Việt Nam, phân loại chi tiết giúp người học dễ dàng nhận diện và phòng ngừa.
          </p>
        </div>

        {/* Grid Cards - Clean, Readable, Full uncropped illustrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.map((cat, idx) => {
            const iconConfig = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
            const Icon = iconConfig.icon;

            return (
              <div
                key={cat.id}
                className="rounded-3xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg p-5 flex flex-col justify-between transition-all duration-300 group space-y-4 shadow-xs"
              >
                {/* Card Top: Icon & Count */}
                <div className="flex items-center justify-between pb-1">
                  <div className={`w-9 h-9 rounded-xl ${iconConfig.bg} border flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconConfig.color}`} />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {cat.scenariosCount} ải tình huống
                  </span>
                </div>

                {/* Full Uncropped Illustration Image Display */}
                <div className="w-full h-44 sm:h-48 rounded-2xl bg-slate-50 border border-slate-200 p-2.5 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50/20 transition-all">
                  <img
                    src={encodeURI(cat.imageUrl)}
                    alt={cat.name}
                    className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-300 select-none"
                  />
                </div>

                {/* Title & Warning */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {cat.name}
                  </h3>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{cat.warningNote}</span>
                  </div>
                </div>

                {/* Bottom Target & Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate max-w-[190px]">
                    Đối tượng: <strong className="text-slate-800">{cat.vulnerableTarget}</strong>
                  </span>

                  <Link
                    href={`/play/chuong-${idx + 1}`}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer"
                  >
                    <span>Luyện tập</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
