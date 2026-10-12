import { Scenario } from "@/types/scenario";
import { OFFICIAL_QUESTION_BANK } from "./officialQuestionBank";

export const CATEGORIES_LIST = [
  { id: "fake_police_authority", name: "Giả mạo cơ quan công an / Viện kiểm sát", icon: "ShieldAlert", count: 4 },
  { id: "bank_otp_fraud", name: "Giả mạo ngân hàng / Chiếm đoạt mã OTP", icon: "Landmark", count: 5 },
  { id: "lottery_reward_trap", name: "Lừa đảo trúng thưởng / Quà tri ân", icon: "Gift", count: 3 },
  { id: "easy_job_high_pay", name: "Việc nhẹ lương cao / Tuyển cộng tác viên", icon: "Briefcase", count: 4 },
  { id: "romance_investment_pig", name: "Bẫy tình cảm / Đầu tư sàn ảo đa cấp", icon: "TrendingUp", count: 3 },
  { id: "deepfake_video_call", name: "Deepfake khuôn mặt / Giọng nói người thân", icon: "Video", count: 4 },
  { id: "malicious_app_link", name: "Mã độc dịch vụ công / Cài file .APK giả", icon: "DownloadCloud", count: 4 },
  { id: "travel_ticket_scam", name: "Vé máy bay giá rẻ / Combo du lịch ảo", icon: "Plane", count: 3 },
  { id: "ecommerce_fake_shipper", name: "Giả danh shipper giao hàng / Đơn 0 đồng", icon: "Package", count: 3 },
  { id: "social_account_takeover", name: "Chiếm đoạt tài khoản / Mượn tiền khẩn cấp", icon: "MessageCircle", count: 3 },
  { id: "fake_scholarship_course", name: "Học bổng trại hè / Khóa học kỹ năng trẻ em", icon: "GraduationCap", count: 3 },
];

export const MOCK_SCENARIOS: Scenario[] = OFFICIAL_QUESTION_BANK;
