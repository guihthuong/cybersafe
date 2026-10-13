import { NextResponse } from "next/server";
import { checkSupabaseHealth } from "@/lib/supabase";

export async function GET() {
  const health = await checkSupabaseHealth();
  return NextResponse.json(health);
}
