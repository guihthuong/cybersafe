import { RiskAnalysisResult } from "@/types/scenario";

export interface ScamSignalRule {
  id: string;
  category: string;
  name: string;
  regex: RegExp;
  weight: number;
  advice: string;
}

// Bộ từ khóa & Regex nhận diện các dấu hiệu lừa đảo phổ biến tại Việt Nam
export const SCAM_RULES: ScamSignalRule[] = [
  // 1. Dấu hiệu khẩn cấp đe dọa tính mạng / viện phí cấp cứu
  {
    id: "emergency_hospital",
    category: "Gây sốc tâm lý",
    name: "Cấp cứu / Tai nạn / Nhập viện khẩn cấp",
    regex: /(cấp cứu|tai nạn|nhập viện|bệnh viện|phẫu thuật gấp|nguy kịch|chợ rẫy|việt đức|chấn thương|hôn mê)/i,
    weight: 40,
    advice: "Kẻ gian thường dựng chuyện con cháu bị tai nạn cấp cứu để buộc gia đình chuyển tiền trong lúc hoảng loạn.",
  },
  {
    id: "demand_money_transfer",
    category: "Yêu cầu tài chính",
    name: "Yêu cầu chuyển tiền / Đòi chuyển khoản gấp",
    regex: /(chuyển tiền|chuyển khoản|nạp tiền|bắn tiền|gửi tiền|đặt cọc|chuyển gấp|chuyển ngay|stk|số tài khoản|chuyển trước)/i,
    weight: 35,
    advice: "Luôn gọi điện thoại trực tiếp bằng số di động thông thường hoặc gặp mặt để xác nhận trước khi chuyển bất kỳ khoản tiền nào.",
  },

  // 2. Chiếm đoạt mã OTP / Mật khẩu ngân hàng
  {
    id: "otp_credential_theft",
    category: "Bảo mật tài khoản",
    name: "Đòi cung cấp mã OTP / Mật khẩu",
    regex: /(mã otp|mã xác thực|mật khẩu|pass|smart otp|hủy lệnh trừ tiền|xác thực tài khoản|sinh trắc học|nâng cấp hạn mức)/i,
    weight: 45,
    advice: "Mã OTP là chìa khóa mở két sắt tiền của bạn. Không một nhân viên ngân hàng nào được phép hỏi mã OTP của khách hàng.",
  },

  // 3. Giả danh cơ quan công quyền / Pháp luật
  {
    id: "police_court_threat",
    category: "Uy quyền giả mạo",
    name: "Đe dọa bắt tạm giam / Rửa tiền / Công an / Viện kiểm sát",
    regex: /(công an|viện kiểm sát|tòa án|bộ công an|bắt giam|lệnh bắt|khởi tố|rửa tiền|ma túy|tài khoản tạm giữ|áp giải|thanh tra bộ)/i,
    weight: 45,
    advice: "Công an Việt Nam không bao giờ làm việc qua điện thoại, không gửi lệnh bắt qua Zalo và không yêu cầu chuyển tiền vào tài khoản cá nhân.",
  },

  // 4. Mã độc dịch vụ công / File cài đặt APK lạ
  {
    id: "fake_vneid_apk",
    category: "Mã độc thiết bị",
    name: "Cập nhật VNeID / Tải file cài đặt .APK ngoài",
    regex: /(vneid|định danh mức 2|dịch vụ công|đồng bộ cư trú|\.apk|cài đặt app|trợ năng|accessibility|link tải app)/i,
    weight: 40,
    advice: "Chỉ cài đặt ứng dụng từ Google Play hoặc Apple App Store chính thống. Tệp .APK tải từ link lạ sẽ chiếm quyền điều khiển điện thoại.",
  },

  // 5. Đường link URL và tên miền bất thường
  {
    id: "suspicious_domains",
    category: "Đường dẫn nguy hại",
    name: "Tên miền quốc tế lạ (.top, .xyz, .cc, .vip...)",
    regex: /(\.top|\.xyz|\.vip|\.cc|\.club|\.online|\.site|\.app|\.buzz|\.icu|\.work|\.link|\.live|\.kim)/i,
    weight: 30,
    advice: "Cơ quan nhà nước chỉ dùng tên miền .gov.vn, ngân hàng lớn tại Việt Nam chỉ dùng .com.vn hoặc .vn.",
  },
  {
    id: "ip_address_link",
    category: "Đường dẫn nguy hại",
    name: "Liên kết chứa địa chỉ IP dạng số",
    regex: /(https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i,
    weight: 35,
    advice: "Địa chỉ IP số thường là máy chủ ẩn danh của tội phạm mạng nhằm tránh sự phát hiện của cơ quan chức năng.",
  },

  // 6. Trúng thưởng ảo / Quà tri ân / Việc nhẹ lương cao
  {
    id: "lottery_reward",
    category: "Bẫy lòng tham",
    name: "Trúng thưởng quà tri ân / Quà tặng 0 đồng",
    regex: /(trúng thưởng|quà tri ân|tặng miễn phí|nhận quà|xe sh|iphone 16|vé quay thưởng|đóng thuế nhận giải)/i,
    weight: 25,
    advice: "Không có bữa trưa nào miễn phí. Yêu cầu nộp 'phí vận chuyển' hoặc 'thuế nhận thưởng' là cái bẫy để lừa tiền đặt cọc.",
  },
  {
    id: "easy_job_high_salary",
    category: "Bẫy việc làm",
    name: "Việc nhẹ lương cao / Cộng tác viên hoa hồng",
    regex: /(việc nhẹ lương cao|cộng tác viên shopee|tiktok|thả tim kiếm tiền|hoa hồng 20%|nhiệm vụ đơn hàng|làm việc tại nhà)/i,
    weight: 30,
    advice: "Mô hình nạp tiền làm nhiệm vụ giật đơn hàng hoàn tiền hoa hồng là bẫy đa cấp lừa đảo kinh điển.",
  },

  // 7. Mượn tiền qua mạng xã hội / Deepfake
  {
    id: "borrow_money_social",
    category: "Mạo danh người thân",
    name: "Nhờ mượn tiền gấp qua Facebook / Zalo / Telegram",
    regex: /(cho mượn tạm|kẹt tiền|vay gấp|chuyển hộ|tài khoản con bị khóa|đổi số điện thoại|gọi video chập chờn)/i,
    weight: 25,
    advice: "Tài khoản mạng xã hội của người thân có thể đã bị chiếm quyền. Hãy gọi trực tiếp bằng số điện thoại di động thông thường để nghe rõ giọng nói.",
  },
];

/**
 * Thuật toán Rule-based Regex dự phòng (Offline Fallback Engine)
 * Đảm bảo hệ thống luôn phân tích được ngay cả khi rớt mạng hoặc không có API key.
 */
export function analyzeRiskRuleBased(input: string): RiskAnalysisResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      risk_level: "low",
      risk_score: 5,
      title: "Chưa đủ dữ liệu phân tích",
      summary: "Vui lòng nhập nội dung tin nhắn, số điện thoại hoặc đường link bạn nghi ngờ để hệ thống kiểm tra.",
      detected_red_flags: [],
      immediate_recommendations: [
        "Hãy dán toàn bộ đoạn tin nhắn hoặc đường link bạn nhận được vào ô bên dưới."
      ],
      safe_verification_steps: [
        "Nguyên tắc vàng: Luôn bình tĩnh, không vội vàng làm theo bất kỳ chỉ dẫn nào."
      ],
      analysis_source: "offline_rules",
    };
  }

  let totalScore = 0;
  const detectedFlags: string[] = [];
  const recommendations: string[] = [];
  const matchedRules: ScamSignalRule[] = [];

  for (const rule of SCAM_RULES) {
    if (rule.regex.test(trimmed)) {
      matchedRules.push(rule);
      totalScore += rule.weight;
      detectedFlags.push(`[${rule.category}] ${rule.name}: ${rule.advice}`);
      if (!recommendations.includes(rule.advice)) {
        recommendations.push(rule.advice);
      }
    }
  }

  // Phân loại cấp độ rủi ro theo thang điểm
  let riskLevel: "low" | "check_required" | "high" | "emergency";
  let title: string;
  let summary: string;

  if (totalScore >= 70 || (matchedRules.some(r => r.id === "emergency_hospital") && matchedRules.some(r => r.id === "demand_money_transfer"))) {
    riskLevel = "emergency";
    title = "NGUY CƠ KHẨN CẤP: DẤU HIỆU LỪA ĐẢO TỐI NGUY HIỂM";
    summary = "Hệ thống phát hiện sự kết hợp của chiêu trò gây sốc tâm lý (tai nạn, cấp cứu, đe dọa pháp luật) và đòi hỏi chuyển tiền khẩn cấp. Khả năng cao đây là bẫy lừa đảo tinh vi nhắm vào người thân!";
  } else if (totalScore >= 45) {
    riskLevel = "high";
    title = "NGUY CƠ CAO: CẢNH BÁO BẪY CHIẾM ĐOẠT TÀI SẢN";
    summary = "Nội dung chứa nhiều dấu hiệu bất thường về bảo mật ngân hàng, OTP, yêu cầu cài đặt ứng dụng ngoài hoặc liên kết độc hại.";
  } else if (totalScore >= 20) {
    riskLevel = "check_required";
    title = "CẦN KIỂM CHỨNG: CÓ DẤU HIỆU BẤT THƯỜNG";
    summary = "Nội dung có một số từ khóa đáng ngờ thường xuất hiện trong các chiến dịch spam trúng thưởng, mượn tiền hoặc tuyển cộng tác viên.";
  } else {
    riskLevel = "low";
    title = "NGUY CƠ THẤP: CHƯA PHÁT HIỆN TỪ KHÓA BẤT THƯỜNG";
    summary = "Hệ thống chưa tìm thấy các mẫu câu lừa đảo điển hình. Tuy nhiên, vẫn luôn duy trì cảnh giác nếu có yêu cầu tài chính phát sinh sau đó.";
  }

  // Chuẩn hóa điểm 0 - 100
  const normalizedScore = Math.min(100, Math.max(5, totalScore));

  // Checklist 4 bước hành động chuẩn
  const safeVerificationSteps = [
    "Dừng lại: Tuyệt đối không bấm link, không chuyển tiền, không cung cấp OTP hay mật khẩu cho bất kỳ ai.",
    "Kiểm tra: Soi kỹ số điện thoại, tài khoản người gửi, tên miền trang web có đuôi bất thường hay không.",
    "Xác minh: Gọi điện thoại trực tiếp bằng số di động thông thường cho người thân hoặc liên hệ đơn vị cung cấp chính thức.",
    "Hành động an toàn: Chỉ xử lý sau khi đã kiểm chứng độc lập xác thực thông tin."
  ];

  return {
    risk_level: riskLevel,
    risk_score: normalizedScore,
    title,
    summary,
    detected_red_flags: detectedFlags.length > 0 ? detectedFlags : ["Chưa phát hiện từ khóa bẫy lừa đảo đặc thù."],
    immediate_recommendations: recommendations.length > 0 ? recommendations : [
      "Luôn giữ thói quen bảo mật hai lớp và kiểm tra tính xác thực của nguồn tin."
    ],
    safe_verification_steps: safeVerificationSteps,
    analysis_source: "offline_rules",
  };
}

/**
 * Hàm phân tích rủi ro HYBRID (AI LLM + Offline Fallback)
 * 1. Gọi Next.js API /api/analyze-risk (tích hợp Groq Llama 3.3 siêu tốc).
 * 2. Nếu rớt mạng, mất kết nối, hoặc chưa cấu hình API key -> tự động fallback sang Rule-based Regex.
 * Đảm bảo an toàn 100%, không bao giờ crash ứng dụng.
 */
export async function analyzeRisk(input: string): Promise<RiskAnalysisResult> {
  const trimmed = input.trim();
  if (!trimmed) {
    return analyzeRiskRuleBased(input);
  }

  try {
    const res = await fetch("/api/analyze-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.result) {
        return {
          ...data.result,
          analysis_source: "ai_groq",
        };
      }
    }

    console.warn("API AI phản hồi không hợp lệ hoặc kích hoạt fallback. Đang chuyển sang Rule-based engine.");
    return analyzeRiskRuleBased(trimmed);
  } catch (err) {
    console.warn("Lỗi mạng khi gọi LLM API, tự động kích hoạt Offline Fallback Regex:", err);
    return analyzeRiskRuleBased(trimmed);
  }
}
