export interface PuzzleChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  description: string;
  levelStart: number; // 1-indexed (e.g. 1)
  levelEnd: number;   // 1-indexed (e.g. 4)
  badgeLabel: string;
  themeGradient: string;
  borderColor: string;
  landmarkName: string;
}

export const PUZZLE_CHAPTERS: PuzzleChapter[] = [
  {
    id: "chapter_1",
    chapterNumber: 1,
    title: "Pháo Đài Công Quyền & Pháp Lý",
    subtitle: "Giả mạo Công an, Tòa án & Viện kiểm sát",
    description: "Nhận diện đòn tâm lý 'đe dọa lệnh bắt tạm giam, rửa tiền' và giữ vững nguyên tắc không chuyển tiền vào tài khoản tạm giữ.",
    levelStart: 1,
    levelEnd: 4,
    badgeLabel: "Chương 1 • Quyền Lực Giả Mạo",
    themeGradient: "from-sky-700 to-indigo-900",
    borderColor: "border-sky-300",
    landmarkName: "Cổng Thành Tố Tụng",
  },
  {
    id: "chapter_2",
    chapterNumber: 2,
    title: "Thành Trì Ngân Hàng & Mã OTP",
    subtitle: "Giả mạo Ngân hàng & Sinh trắc học",
    description: "Rèn luyện kỹ năng soi đường link ngân hàng mạo danh (.cc, .top) và nguyên tắc sắt đá không chia sẻ mã OTP.",
    levelStart: 5,
    levelEnd: 8,
    badgeLabel: "Chương 2 • Mật Mã Ngân Hàng",
    themeGradient: "from-cyan-700 to-blue-900",
    borderColor: "border-cyan-300",
    landmarkName: "Tháp Bảo Mật OTP",
  },
  {
    id: "chapter_3",
    chapterNumber: 3,
    title: "Thung Lũng Việc Làm & Tài Chính Ảo",
    subtitle: "Việc nhẹ lương cao & Sàn đầu tư",
    description: "Phá vỡ cạm bẫy 'nạp tiền làm nhiệm vụ giật đơn Shopee', xem video TikTok kiếm tiền và sàn giao dịch tài chính lừa đảo.",
    levelStart: 9,
    levelEnd: 16,
    badgeLabel: "Chương 3 • Bẫy Mồi Thu Nhập",
    themeGradient: "from-amber-600 to-orange-800",
    borderColor: "border-amber-300",
    landmarkName: "Thung Lũng Hoa Hồng Ảo",
  },
  {
    id: "chapter_4",
    chapterNumber: 4,
    title: "Mê Cung Thao Túng & Deepfake",
    subtitle: "Deepfake AI, Giả shipper & Bẫy tình cảm",
    description: "Vạch trần cuộc gọi video Deepfake 5 giây mượn tiền cấp cứu, kiện hàng 0 đồng và quà tri ân trúng thưởng xe SH.",
    levelStart: 17,
    levelEnd: 28,
    badgeLabel: "Chương 4 • Đô Thị Ảo Giác",
    themeGradient: "from-purple-700 to-pink-900",
    borderColor: "border-purple-300",
    landmarkName: "Cầu Kính Deepfake",
  },
  {
    id: "chapter_5",
    chapterNumber: 5,
    title: "Đỉnh Núi Tự Vệ & Dịch Vụ Công",
    subtitle: "Mã độc .APK, Chiếm đoạt nick & Khảo sát",
    description: "Nhận biết file cài đặt .apk độc hại mạo danh VNeID, hack nick Zalo vay mượn tiền và hoàn thành bài kiểm tra đối chứng.",
    levelStart: 29,
    levelEnd: 39,
    badgeLabel: "Chương 5 • Đỉnh Cao Tự Vệ",
    themeGradient: "from-emerald-700 to-teal-900",
    borderColor: "border-emerald-300",
    landmarkName: "Đài Quan Sát An Toàn Số",
  },
];
