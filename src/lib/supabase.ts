import { createClient } from "@supabase/supabase-js";
import { OFFICIAL_QUESTION_BANK } from "@/data/officialQuestionBank";
import { Scenario } from "@/types/scenario";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "your_supabase_url_here" &&
  !supabaseUrl.includes("placeholder")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// ============================================================================
// DATA ACCESS LAYER (Supabase Cloud + Offline Resilient Fallback)
// ============================================================================

/**
 * Kiểm tra trạng thái kết nối và số lượng kịch bản trên Supabase Cloud
 */
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  scenarioCount: number;
  message: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      scenarioCount: OFFICIAL_QUESTION_BANK.length,
      message: "Chưa cấu hình Supabase URL / Anon Key (Đang dùng dữ liệu chuẩn Offline)",
    };
  }

  try {
    const { count, error } = await supabase
      .from("scenarios")
      .select("*", { count: "exact", head: true });

    if (error) {
      return {
        connected: false,
        scenarioCount: OFFICIAL_QUESTION_BANK.length,
        message: `Lỗi kết nối Supabase: ${error.message}`,
      };
    }

    return {
      connected: true,
      scenarioCount: count ?? 0,
      message: (count ?? 0) > 0 
        ? `Đã kết nối Supabase Cloud: ${count} ải dữ liệu trực tuyến.` 
        : "Đã kết nối Supabase Cloud nhưng bảng scenarios chưa có dữ liệu (Cần nạp seed).",
    };
  } catch (err: any) {
    return {
      connected: false,
      scenarioCount: OFFICIAL_QUESTION_BANK.length,
      message: `Không thể kết nối đến Supabase: ${err?.message || err}`,
    };
  }
}

/**
 * Lấy toàn bộ 39 kịch bản an toàn số từ Supabase (có fallback sang OFFICIAL_QUESTION_BANK)
 */
export async function fetchAllScenarios(): Promise<Scenario[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .order("scenario_id", { ascending: true });

      if (error) {
        console.warn("Supabase fetch failed, falling back to local dataset:", error.message);
        return OFFICIAL_QUESTION_BANK;
      }

      if (data && data.length > 0) {
        return data as Scenario[];
      }
    } catch (err) {
      console.warn("Supabase connection error, using local fallback:", err);
      return OFFICIAL_QUESTION_BANK;
    }
  }
  return OFFICIAL_QUESTION_BANK;
}

/**
 * Lấy một kịch bản theo ID (ví dụ: "Q1.1")
 */
export async function fetchScenarioById(id: string): Promise<Scenario | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("scenario_id", id)
        .single();

      if (!error && data) {
        return data as Scenario;
      }
    } catch (err) {
      console.warn("Supabase fetch failed, using fallback for ID:", id, err);
    }
  }
  const found = OFFICIAL_QUESTION_BANK.find((s) => s.scenario_id === id);
  return found || null;
}

/**
 * Nạp trực tiếp 39 câu hỏi vào Supabase (nếu có quyền write/upsert)
 */
export async function seedScenariosToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, count: 0, error: "Chưa cấu hình Supabase" };
  }

  try {
    const payload = OFFICIAL_QUESTION_BANK.map((s) => ({
      scenario_id: s.scenario_id,
      category: s.category,
      category_name_vi: s.category_name_vi,
      skill: s.skill,
      difficulty: s.difficulty,
      question_type: s.question_type,
      context: s.context,
      stimulus: s.stimulus,
      options: s.options,
      correct_answer: s.correct_answer,
      feedback: s.feedback,
      consequence: s.consequence,
    }));

    const { error } = await supabase
      .from("scenarios")
      .upsert(payload, { onConflict: "scenario_id" });

    if (error) {
      return { success: false, count: 0, error: error.message };
    }

    return { success: true, count: payload.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || String(err) };
  }
}

/**
 * Lưu lịch sử tư vấn chatbot vào Supabase
 */
export async function saveChatbotConsultation(data: {
  inputText: string;
  inputType?: "message" | "link" | "phone";
  riskLevel: string;
  riskScore: number;
  analysisSummary: string;
  detectedFlags?: any[];
}) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { error } = await supabase.from("chatbot_consultations").insert({
      input_text: data.inputText,
      input_type: data.inputType || "message",
      risk_level: data.riskLevel,
      risk_score: data.riskScore,
      analysis_summary: data.analysisSummary,
      detected_flags: data.detectedFlags || [],
    });

    if (error) {
      console.warn("Lỗi lưu lịch sử tư vấn Chatbot:", error.message);
    }
  } catch (err) {
    console.warn("Không thể gửi dữ liệu Chatbot lên Supabase:", err);
  }
}

/**
 * Đồng bộ kết quả hoàn thành ải của người chơi lên Supabase Cloud
 */
export async function saveUserProgressToSupabase(progress: {
  scenarioId: string;
  score: number;
  passedSafely: boolean;
  attempts?: number;
  userId?: string;
}) {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const payload: any = {
      scenario_id: progress.scenarioId,
      score: progress.score,
      passed_safely: progress.passedSafely,
      attempts: progress.attempts || 1,
      completed_at: new Date().toISOString(),
    };
    if (progress.userId) {
      payload.user_id = progress.userId;
    }

    const { error } = await supabase.from("user_progress").insert(payload);

    if (error) {
      console.warn("Lỗi lưu tiến độ lên Supabase:", error.message);
    }
  } catch (err) {
    console.warn("Không thể đồng bộ tiến độ lên Supabase:", err);
  }
}

/**
 * Đồng bộ hoặc cập nhật thông tin hồ sơ người chơi lên bảng user_profiles
 */
export async function syncUserProfileToSupabase(profileData: {
  id: string;
  displayName: string;
  targetGroup?: "student" | "elder" | "general";
  totalScore?: number;
  badges?: any[];
}) {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { error } = await supabase.from("user_profiles").upsert(
      {
        id: profileData.id,
        display_name: profileData.displayName,
        target_group: profileData.targetGroup || "general",
        total_score: profileData.totalScore || 0,
        badges: profileData.badges || [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.warn("Lỗi lưu hồ sơ user_profiles lên Supabase:", error.message);
    }
  } catch (err) {
    console.warn("Không thể gửi hồ sơ lên Supabase:", err);
  }
}

