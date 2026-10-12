export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type QuestionType = "multiple_choice" | "branching_scenario" | "hotspot";

export type ScamCategory =
  | "fake_police_authority"       // Giả danh công an, viện kiểm sát, tòa án
  | "bank_otp_fraud"              // Giả mạo ngân hàng, chiếm đoạt OTP
  | "lottery_reward_trap"         // Trúng thưởng, quà tặng tri ân miễn phí
  | "easy_job_high_pay"           // Tuyển cộng tác viên, việc nhẹ lương cao
  | "romance_investment_pig"      // Lừa tình cảm, đầu tư tài chính lợn béo
  | "deepfake_video_call"         // Deepfake khuôn mặt, giọng nói mượn tiền
  | "malicious_app_link"          // Link bẫy tải ứng dụng dịch vụ công giả mạo (.apk)
  | "travel_ticket_scam"          // Vé máy bay giá rẻ, tour du lịch ảo
  | "ecommerce_fake_shipper"      // Đơn hàng 0 đồng, shipper đòi chuyển khoản gấp
  | "social_account_takeover"     // Hack Facebook, Telegram mượn tiền khẩn cấp
  | "fake_scholarship_course";    // Khóa học hè, học bổng trẻ em quốc tế

export interface MultipleChoiceOption {
  id: string;
  label: string;
  is_correct: boolean;
  explanation: string;
}

export interface BranchingNode {
  id: string;
  prompt: string;
  npc_reaction?: string;
  choices: {
    id: string;
    text: string;
    next_node_id: string | null; // null if terminal
    is_safe: boolean;
    feedback: string;
  }[];
  is_terminal?: boolean;
  final_outcome?: "safe" | "compromised" | "cautious";
}

export interface HotspotArea {
  id: string;
  title: string;
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  width: number; // percentage width
  height: number; // percentage height
  is_suspicious: boolean;
  clue: string; // Dấu hiệu bất thường tại điểm này
}

export interface StimulusData {
  type: "sms" | "chat" | "email" | "browser" | "phone_call" | "screenshot";
  sender?: string;
  sender_avatar?: string;
  timestamp?: string;
  content?: string;
  image_url?: string;
  suspicious_url?: string;
  metadata?: Record<string, string>;
}

export interface EducationalFeedback {
  core_rule: "Dừng lại" | "Kiểm tra" | "Xác minh" | "Mới hành động" | string;
  empathy_note: string; // Tinh thần không đổ lỗi: Kẻ lừa đảo thao túng tâm lý rất tinh vi...
  red_flags: string[]; // Dấu hiệu nhận biết đáng ngờ
  safe_action: string; // Hành động đúng đắn cần làm ngay
  hotline_or_official_channel?: string;
}

export interface Scenario {
  scenario_id: string;
  category: ScamCategory;
  category_name_vi: string;
  skill: string; // Kỹ năng cần rèn luyện
  difficulty: DifficultyLevel;
  question_type: QuestionType;
  context: string; // Bối cảnh tình huống thực tế
  stimulus: StimulusData; // Dữ liệu kích thích (ảnh, tin nhắn, màn hình)
  options: {
    multiple_choice?: MultipleChoiceOption[] | null;
    branching_tree?: Record<string, BranchingNode> | null;
    start_node_id?: string | null;
    hotspots?: HotspotArea[] | null;
  };
  correct_answer: string | string[]; // ID đáp án đúng hoặc danh sách hotspot IDs
  feedback: EducationalFeedback;
  consequence: {
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
  };
}

export interface UserScenarioProgress {
  scenario_id: string;
  completed: boolean;
  score: number;
  attempts: number;
  passed_safely: boolean;
  completed_at: string;
}

export interface RiskAnalysisResult {
  risk_level: "low" | "check_required" | "high" | "emergency";
  risk_score: number; // 0 - 100
  title: string;
  summary: string;
  detected_red_flags: string[];
  immediate_recommendations: string[];
  safe_verification_steps: string[];
}
