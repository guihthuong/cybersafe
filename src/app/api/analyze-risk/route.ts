import { NextResponse } from "next/server";
import { RiskAnalysisResult } from "@/types/scenario";
import { analyzeRiskRuleBased } from "@/utils/riskAnalyzer";

const SYSTEM_PROMPT = `Bạn là Chuyên Gia An Toàn Thông Tin & Phân Tích Lừa Đảo Trực Tuyến Cấp Cao (Senior Cyber Safety Expert) tại Việt Nam thuộc dự án CyberSafe Quest.
Nhiệm vụ của bạn là phân tích ngữ cảnh sâu sắc các tình huống, tin nhắn SMS/Zalo/Telegram, cuộc gọi, đường link URL hoặc số điện thoại mà người dân nghi ngờ là lừa đảo.

Hãy soi xét kỹ các thủ đoạn thao túng tâm lý:
1. Gây sợ hãi, hoảng loạn tột độ (con cấp cứu, dọa khởi tố vụ án rửa tiền ma túy, dọa khóa tài khoản/mã VNeID).
2. Kích thích lòng tham (trúng thưởng xe SH, quà tri ân 0 đồng, việc nhẹ lương cao, nạp đơn hàng hoa hồng).
3. Đòi hỏi cấp bách (yêu cầu chuyển tiền ngay lập tức, đòi mã OTP, hướng dẫn cài tệp .APK lạ có mã độc).
4. Giả danh mạo nhận (cán bộ công an, kiểm sát viên, nhân viên ngân hàng, người thân mượn tiền qua video deepfake).

BẮT BUỘC trả về định dạng JSON thuần túy (không bọc mã markdown, không thêm text ngoài JSON) với cấu trúc sau:
{
  "risk_level": "low" | "check_required" | "high" | "emergency",
  "risk_score": <số nguyên từ 0 đến 100>,
  "title": "<Tiêu đề cảnh báo ngắn gọn, dứt khoát bằng tiếng Việt>",
  "summary": "<Đoạn phân tích sâu ngữ cảnh, bóc trần bản chất chiêu trò và tâm lý kẻ gian bằng tiếng Việt dễ hiểu>",
  "detected_red_flags": ["<Dấu hiệu bất thường 1>", "<Dấu hiệu bất thường 2>", ...],
  "immediate_recommendations": ["<Khuyến nghị hành động cấp bách 1>", "<Khuyến nghị 2>", ...],
  "safe_verification_steps": [
    "1. DỪNG LẠI: Không làm theo bất kỳ yêu cầu chuyển tiền hay bấm link nào.",
    "2. KIỂM TRA: Soi xét kỹ nguồn gốc, số điện thoại, tên miền và quyền ứng dụng.",
    "3. XÁC MINH: Gọi trực tiếp cho người thân hoặc liên hệ đường dây nóng chính thống.",
    "4. MỚI HÀNH ĐỘNG: Chỉ quyết định khi đã xác thực 100% bằng chứng cứ khách quan."
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
