export interface AvatarOption {
  id: string;
  name: string;
  title: string;
  tagline: string;
  bgGradient: string;
  borderColor: string;
  badgeColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: "guardian",
    name: "Chiến Binh Hộ Vệ",
    title: "Vệ Binh An Toàn Gia Đình",
    tagline: "Luôn bảo vệ ông bà và người thân trước mọi cuộc gọi thao túng",
    bgGradient: "from-sky-500 to-blue-600",
    borderColor: "border-sky-400",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
  },
  {
    id: "detective",
    name: "Thám Tử Trực Tuyến",
    title: "Chuyên Gia Soi Link & Tên Miền",
    tagline: "Tinh mắt phát hiện ngay các đuôi lạ .cc, .top, .apk trong 3 giây",
    bgGradient: "from-amber-500 to-orange-600",
    borderColor: "border-amber-400",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    id: "cyber_cop",
    name: "Sĩ Quan An Ninh Mạng",
    title: "Người Kiểm Chứng Pháp Lý",
    tagline: "Biết rõ cơ quan công quyền không bao giờ làm việc qua điện thoại",
    bgGradient: "from-emerald-500 to-teal-700",
    borderColor: "border-emerald-400",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "elder",
    name: "Đại Sứ Cao Tuổi",
    title: "Gương Sáng Cảnh Giác Số",
    tagline: "Bình tĩnh, cúp máy dứt khoát trước mọi đe dọa đòi chuyển tiền",
    bgGradient: "from-indigo-500 to-purple-600",
    borderColor: "border-indigo-400",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
  },
  {
    id: "student",
    name: "Học Viên Kỹ Thuật Số",
    title: "Khắc Tinh Việc Nhẹ Lương Cao",
    tagline: "Nói KHÔNG với bẫy giật đơn Shopee, nạp tiền làm nhiệm vụ",
    bgGradient: "from-rose-500 to-pink-600",
    borderColor: "border-rose-400",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
  },
];
