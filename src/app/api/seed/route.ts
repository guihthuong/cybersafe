import { NextResponse } from "next/server";
import { seedScenariosToSupabase } from "@/lib/supabase";

export async function POST() {
  const result = await seedScenariosToSupabase();
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        instruction:
          "Do chính sách bảo mật RLS của Supabase, bạn có thể copy nội dung file supabase/seed_39_scenarios.sql và dán vào Supabase Dashboard -> SQL Editor -> bấm RUN để nạp toàn bộ 39 kịch bản an toàn tuyệt đối.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    count: result.count,
    message: `Đã nạp thành công ${result.count} câu hỏi vào Supabase Cloud.`,
  });
}
