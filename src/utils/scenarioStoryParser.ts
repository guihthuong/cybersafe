import { Scenario } from "@/types/scenario";

export interface ParsedScenarioStory {
  role: string;               // Ví dụ: "Bác Bình (68 tuổi)" hoặc "Minh (17 tuổi)" hoặc "Bạn"
  eventIntro: string;         // Ví dụ: "Hôm nay, bạn nhận được cuộc gọi tự xưng là cán bộ công an điều tra:"
  dialogueOrContent: string;  // Lời thoại / Tin nhắn thật hiển thị trong điện thoại
  questionPrompt: string;     // Câu hỏi hành động ngắn gọn: "Bạn sẽ xử lý như thế nào?"
  senderLabel: string;        // Nhãn người gửi (Công an quận, Ngân hàng ABC, Shipper...)
}

export function parseScenarioStory(scenario: Scenario): ParsedScenarioStory {
  const rawContext = scenario.context || "";
  const stimulusContent = scenario.stimulus?.content || "";

  // 1. Phân tích đối tượng / nhân vật (Role)
  let role = "Bạn";
  const roleMatch = rawContext.match(/^(Ông [A-ZÀ-Ỵa-zà-ỹ]+|Bà [A-ZÀ-Ỵa-zà-ỹ]+|Bác [A-ZÀ-Ỵa-zà-ỹ]+|[A-ZÀ-Ỵ][a-zà-ỹ]+)\s*\(([^)]+)\)/i);
  if (roleMatch) {
    role = `${roleMatch[1]} (${roleMatch[2]})`;
  } else if (rawContext.startsWith("Bạn là")) {
    const banLaMatch = rawContext.match(/^Bạn là\s+([^,.]+)/i);
    if (banLaMatch) {
      role = banLaMatch[1].trim();
    }
  }

  // 2. Tìm câu hỏi hành động cuối (Question Prompt)
  let questionPrompt = "Trong tình huống này, bạn sẽ xử lý như thế nào?";
  const questionMarks = rawContext.split(/(?<=[?.!])\s+/);
  const lastSentence = questionMarks[questionMarks.length - 1] || "";
  if (
    lastSentence.includes("?") ||
    lastSentence.includes("nên làm gì") ||
    lastSentence.includes("làm thế nào") ||
    lastSentence.includes("phải làm gì") ||
    lastSentence.includes("Đâu là") ||
    lastSentence.includes("Chi tiết nào")
  ) {
    questionPrompt = lastSentence.trim();
  }

  // 3. Lọc lấy nội dung lời thoại / tin nhắn (Dialogue / Content)
  let dialogueOrContent = "";
  // Nếu có trích dẫn trong ngoặc kép
  const quoteMatch = rawContext.match(/["“]([^"”]+)["”]/);
  if (quoteMatch && quoteMatch[1].length > 15) {
    dialogueOrContent = quoteMatch[1].trim();
  } else if (stimulusContent && stimulusContent.length > 10 && !stimulusContent.includes("nên làm gì?")) {
    dialogueOrContent = stimulusContent.trim();
  } else {
    // Lấy phần giữa loại bỏ câu hỏi cuối và tên nhân vật
    dialogueOrContent = rawContext
      .replace(lastSentence, "")
      .replace(/^[A-ZÀ-Ỵa-zà-ỹ\s()]+\s*(nhận|thấy|gặp|được)\s+/i, "")
      .trim();
  }

  // Dọn dẹp câu hỏi thừa trong lời thoại nếu có
  dialogueOrContent = dialogueOrContent.replace(/\s*(Ông|Bà|Bác|Bạn|Minh|Chị|Anh)?\s*nên làm gì\??$/i, "").trim();

  // 4. Lời dẫn diễn biến sự kiện (Event Intro)
  let eventIntro = "Bạn bất ngờ nhận được thông báo sau:";
  if (scenario.stimulus?.type === "phone_call" || rawContext.toLowerCase().includes("cuộc gọi")) {
    eventIntro = `Bạn bất ngờ nhận được cuộc gọi từ số lạ:`;
  } else if (scenario.stimulus?.type === "sms" || rawContext.toLowerCase().includes("tin nhắn sms")) {
    eventIntro = `Điện thoại của bạn nhận được tin nhắn SMS:`;
  } else if (scenario.stimulus?.type === "chat" || rawContext.toLowerCase().includes("zalo") || rawContext.toLowerCase().includes("facebook")) {
    eventIntro = `Bạn nhận được tin nhắn trên mạng xã hội:`;
  } else if (scenario.stimulus?.type === "email" || rawContext.toLowerCase().includes("email")) {
    eventIntro = `Hòm thư của bạn nhận được một email khẩn cấp:`;
  }

  // 5. Nhãn người gửi (Sender Label)
  let senderLabel = scenario.stimulus?.sender || "Thông báo lạ";
  if (scenario.category === "fake_police_authority") senderLabel = "Cán bộ điều tra (Số lạ)";
  else if (scenario.category === "bank_otp_fraud") senderLabel = "Hệ thống Ngân Hàng";
  else if (scenario.category === "ecommerce_fake_shipper") senderLabel = "Shipper Giao Hàng";
  else if (scenario.category === "deepfake_video_call") senderLabel = "Cuộc gọi Video (Người thân)";
  else if (scenario.category === "social_account_takeover") senderLabel = "Bạn bè / Người quen";

  return {
    role,
    eventIntro,
    dialogueOrContent: dialogueOrContent || rawContext,
    questionPrompt,
    senderLabel,
  };
}
