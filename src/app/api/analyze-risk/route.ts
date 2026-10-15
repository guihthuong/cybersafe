import { NextResponse } from "next/server";
import { RiskAnalysisResult } from "@/types/scenario";
import { analyzeRiskRuleBased } from "@/utils/riskAnalyzer";

const SYSTEM_PROMPT = `Bạn là CyberGuardBot, trợ lý AI chuyên về phát triển năng lực số, an toàn thông tin, phòng chống lừa đảo trực tuyến và hỗ trợ ra quyết định an toàn trên không gian mạng.
Nhiệm vụ:
1. Phân tích rủi ro: Phân tích tin nhắn, email, đường link, mã QR, thông báo, yêu cầu giao dịch hoặc tình huống do người dùng cung cấp.
2. Hỗ trợ ra quyết định: Giúp người dùng xác định dấu hiệu đáng ngờ, đánh giá rủi ro và lựa chọn hành động an toàn trước khi thực hiện thao tác có thể gây hậu quả.
3. Hình thành kiến thức: Hướng dẫn người học tự xây dựng kiến thức bằng kỹ thuật Scaffolding (giàn giáo sư phạm).

Quy tắc phong cách bắt buộc:
- Ngôn ngữ tiếng Việt rõ ràng, chuyên nghiệp, dễ hiểu.
- Ưu tiên ngắn gọn, trực tiếp, tập trung vào hành động.
- TUYỆT ĐỐI KHÔNG DÙNG EMOJI HOẶC ICON trong toàn bộ câu trả lời.
- Không hiển thị suy luận nội bộ hay điểm số rủi ro phần trăm giả tạo.
- Đánh giá mức độ rủi ro chỉ dùng 3 mức: "low" (THẤP / CHƯA THẤY DẤU HIỆU RÕ), "check_required" (TRUNG BÌNH), "high" hoặc "emergency" (CAO).

BẮT BUỘC trả về định dạng JSON thuần túy (không bọc mã markdown, không thêm text ngoài JSON) với cấu trúc sau:
{
  "risk_level": "low" | "check_required" | "high" | "emergency",
  "risk_score": 0,
  "title": "<Tiêu đề cảnh báo dứt khoát không emoji>",
  "summary": "<Đoạn phân tích sâu ngữ cảnh, bóc trần bản chất chiêu trò bằng tiếng Việt chuẩn mực, không icon>",
  "detected_red_flags": ["<Dấu hiệu bất thường 1>", "<Dấu hiệu bất thường 2>"],
  "immediate_recommendations": ["<Khuyến nghị hành động trước khi thao tác 1>", "<Khuyến nghị 2>"],
  "safe_verification_steps": [
    "Dừng lại: Tuyệt đối không bấm link, không chuyển tiền, không cung cấp OTP hay mật khẩu.",
    "Kiểm tra: Soi xét kỹ nguồn gửi, tên miền, số điện thoại và sự bất thường.",
    "Xác minh: Liên hệ kênh độc lập hoặc đường dây nóng chính thức của cơ quan có thẩm quyền.",
    "Hành động: Chỉ thực hiện khi đã kiểm chứng độc lập xác thực 100%."
  ]
}`;

export async function POST(req: Request) {
  let userText = "";
  try {
    const body = await req.json();
    userText = (body?.text || "").trim();
  } catch {
    return NextResponse.json({ error: "Dữ liệu yêu cầu không hợp lệ" }, { status: 400 });
  }

  if (!userText) {
    return NextResponse.json({ error: "Nội dung phân tích không được để trống" }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here" || apiKey.includes("placeholder")) {
    console.warn("GROQ_API_KEY chưa được cấu hình, tự động chạy Offline Fallback.");
    const fallbackResult = analyzeRiskRuleBased(userText);
    return NextResponse.json({ success: true, result: fallbackResult });
  }

  // Danh sách model ưu tiên theo thứ tự chịu tải
  const candidateModels = [
    process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
  ];

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Hãy phân tích tình huống/tin nhắn sau đây và trả về JSON:\n\n"""\n${userText}\n"""`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
          max_tokens: 2048,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Groq model ${model} trả về lỗi HTTP ${response.status}. Thử tiếp phương án dự phòng...`);
        continue;
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) continue;

      let cleaned = rawContent.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      }
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }

      const parsedJson = JSON.parse(cleaned);

      const validLevels = ["low", "check_required", "high", "emergency"];
      const riskLevel = validLevels.includes(parsedJson.risk_level) ? parsedJson.risk_level : "check_required";
      const riskScore =
        typeof parsedJson.risk_score === "number" ? Math.min(100, Math.max(0, parsedJson.risk_score)) : 50;

      const result: RiskAnalysisResult = {
        risk_level: riskLevel,
        risk_score: riskScore,
        title: parsedJson.title || "KẾT QUẢ ĐÁNH GIÁ NGUY CƠ AN TOÀN SỐ",
        summary: parsedJson.summary || "Đã phân tích nội dung được cung cấp.",
        detected_red_flags: Array.isArray(parsedJson.detected_red_flags) ? parsedJson.detected_red_flags : [],
        immediate_recommendations: Array.isArray(parsedJson.immediate_recommendations)
          ? parsedJson.immediate_recommendations
          : ["Giữ bình tĩnh và không vội vàng thực hiện giao dịch tài chính."],
        safe_verification_steps:
          Array.isArray(parsedJson.safe_verification_steps) && parsedJson.safe_verification_steps.length > 0
            ? parsedJson.safe_verification_steps
            : [
                "1. DỪNG LẠI: Không làm theo bất kỳ yêu cầu chuyển tiền hay bấm link nào.",
                "2. KIỂM TRA: Soi xét kỹ nguồn gốc, số điện thoại, tên miền và quyền ứng dụng.",
                "3. XÁC MINH: Gọi trực tiếp cho người thân hoặc liên hệ đường dây nóng chính thống.",
                "4. MỚI HÀNH ĐỘNG: Chỉ quyết định khi đã xác thực 100% bằng chứng cứ khách quan.",
              ],
        analysis_source: "ai_groq",
      };

      return NextResponse.json({ success: true, result });
    } catch (err: any) {
      console.warn(`Thử model ${model} thất bại (${err?.message}). Chuyển bước tiếp theo...`);
      continue;
    }
  }

  // Nếu tất cả model đều rớt mạng hoặc hết quota, chuyển sang Offline Rule-based engine
  console.info("Kích hoạt Offline Rule-based Regex Engine để phản hồi cho người dùng.");
  const fallbackResult = analyzeRiskRuleBased(userText);
  return NextResponse.json({ success: true, result: fallbackResult });
}
