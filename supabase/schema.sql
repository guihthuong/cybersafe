-- ================================================================
-- CYBERSAFE QUEST - DATABASE SCHEMA FOR SUPABASE
-- Bám sát kiến trúc 11 nhóm lừa đảo & 39 tình huống mô phỏng
-- ================================================================

-- 1. Bảng lưu trữ kịch bản an toàn số (Scenarios)
CREATE TABLE IF NOT EXISTS public.scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  category_name_vi TEXT NOT NULL,
  skill TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  question_type VARCHAR(30) NOT NULL CHECK (question_type IN ('multiple_choice', 'branching_scenario', 'hotspot')),
  context TEXT NOT NULL,
  stimulus JSONB NOT NULL,
  options JSONB NOT NULL,
  correct_answer JSONB NOT NULL,
  feedback JSONB NOT NULL,
  consequence JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index tìm kiếm nhanh theo category và question_type
CREATE INDEX IF NOT EXISTS idx_scenarios_category ON public.scenarios (category);
CREATE INDEX IF NOT EXISTS idx_scenarios_type ON public.scenarios (question_type);
CREATE INDEX IF NOT EXISTS idx_scenarios_difficulty ON public.scenarios (difficulty);

-- 2. Bảng thông tin người dùng / người chơi (User Profiles)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  target_group VARCHAR(20) DEFAULT 'general' CHECK (target_group IN ('student', 'elder', 'general')),
  total_score INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bảng theo dõi tiến độ người chơi (User Progress Tracking)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  scenario_id VARCHAR(50) REFERENCES public.scenarios(scenario_id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  passed_safely BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 1,
  selected_history JSONB DEFAULT '[]'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_scenario UNIQUE (user_id, scenario_id)
);

-- 4. Bảng lưu vết phân tích Chatbot Tư vấn an toàn số
CREATE TABLE IF NOT EXISTS public.chatbot_consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  input_text TEXT NOT NULL,
  input_type VARCHAR(20) DEFAULT 'message' CHECK (input_type IN ('message', 'link', 'phone')),
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'check_required', 'high', 'emergency')),
  risk_score INTEGER NOT NULL,
  analysis_summary TEXT NOT NULL,
  detected_flags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_consultations ENABLE ROW LEVEL SECURITY;

-- Policy cho bảng scenarios: Mọi người đều có thể đọc ngân hàng câu hỏi, và cho phép nạp/đồng bộ
CREATE POLICY "Public read scenarios" ON public.scenarios
  FOR SELECT USING (true);

CREATE POLICY "Allow seed/update scenarios" ON public.scenarios
  FOR ALL USING (true) WITH CHECK (true);

-- Policy cho Chatbot Consultations: Cho phép lưu vết phân tích
CREATE POLICY "Allow public insert consultations" ON public.chatbot_consultations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read consultations" ON public.chatbot_consultations
  FOR SELECT USING (true);

-- Policy: Quản lý tiến độ và profile cá nhân
CREATE POLICY "Users can manage their own progress" ON public.user_progress
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Users can manage profile" ON public.user_profiles
  FOR ALL USING (true) WITH CHECK (true);

