import { createClient } from "@supabase/supabase-js";
import { MOCK_SCENARIOS } from "@/data/mockScenarios";
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
// DATA ACCESS LAYER (Repository Pattern với Fallback an toàn)
// ============================================================================

export async function fetchAllScenarios(): Promise<Scenario[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("scenarios").select("*");
      if (error) {
        console.warn("Supabase fetch failed, falling back to local dataset:", error.message);
        return MOCK_SCENARIOS;
      }
      if (data && data.length > 0) {
        return data as Scenario[];
      }
    } catch (err) {
      console.warn("Supabase connection error, using local fallback:", err);
      return MOCK_SCENARIOS;
    }
  }
  return MOCK_SCENARIOS;
}

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
      console.warn("Supabase fetch failed, using mock data for ID:", id, err);
    }
  }
  const found = MOCK_SCENARIOS.find((s) => s.scenario_id === id);
  return found || null;
}
