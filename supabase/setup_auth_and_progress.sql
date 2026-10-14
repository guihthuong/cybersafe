-- ==============================================================================
-- CYBERSAFE QUEST - HỆ THỐNG XÁC THỰC (AUTH) & PHÂN TÁCH TIẾN TRÌNH TỪNG TÀI KHOẢN
-- Chạy toàn bộ file này trong Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. BẢNG HỒ SƠ TÀI KHOẢN (public.user_profiles)
-- Liên kết trực tiếp 1-1 với tài khoản Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Học Viên An Toàn Số',
  avatar_id TEXT NOT NULL DEFAULT 'guardian',
  target_group VARCHAR(20) DEFAULT 'general' CHECK (target_group IN ('student', 'elder', 'general')),
  total_score INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 1,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Nếu bảng đã tồn tại từ trước, bổ sung các cột avatar_id, streak_days và role nếu chưa có
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'avatar_id') THEN
    ALTER TABLE public.user_profiles ADD COLUMN avatar_id TEXT NOT NULL DEFAULT 'guardian';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'streak_days') THEN
    ALTER TABLE public.user_profiles ADD COLUMN streak_days INTEGER DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'role') THEN
    ALTER TABLE public.user_profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
  END IF;
END $$;

-- 2. BẢNG TIẾN TRÌNH CÂU HỎI TỪNG TÀI KHOẢN (public.user_progress)
-- Mỗi người dùng có một tiến trình riêng biệt cho 39 câu hỏi
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  scenario_id VARCHAR(50) NOT NULL REFERENCES public.scenarios(scenario_id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  passed_safely BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 1,
  stars INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_scenario UNIQUE (user_id, scenario_id)
);

-- Nếu bảng user_progress đã tồn tại, đảm bảo có cột stars
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'stars') THEN
    ALTER TABLE public.user_progress ADD COLUMN stars INTEGER DEFAULT 0;
  END IF;
END $$;

-- 3. BẢNG LƯU VẾT TƯ VẤN CHATBOT (public.chatbot_consultations)
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

-- 4. TRIGGER TỰ ĐỘNG TẠO HỒ SƠ KHI ĐĂNG KÝ TÀI KHOẢN MỚI
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_id, target_group)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', 'Học Viên An Toàn Số'),
    COALESCE(new.raw_user_meta_data->>'avatar_id', 'guardian'),
    COALESCE(new.raw_user_meta_data->>'target_group', 'general')
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_id = EXCLUDED.avatar_id,
    target_group = EXCLUDED.target_group,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn Trigger vào bảng auth.users của Supabase
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. THIẾT LẬP ROW LEVEL SECURITY (RLS) CHUẨN XÁC THEO TỪNG TÀI KHOẢN
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Scenarios: Mọi người (cả khách và thành viên) đều được đọc
DROP POLICY IF EXISTS "Public read scenarios" ON public.scenarios;
CREATE POLICY "Public read scenarios" ON public.scenarios
  FOR SELECT USING (true);

-- User Profiles: Mọi người có thể đọc profile của mình và xem thứ hạng
DROP POLICY IF EXISTS "Users can read profiles" ON public.user_profiles;
CREATE POLICY "Users can read profiles" ON public.user_profiles
  FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User Progress: Mỗi tài khoản chỉ xem và ghi tiến trình của chính mình; Admin xem được toàn bộ
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;
CREATE POLICY "Admins can view all progress" ON public.user_progress
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR (auth.jwt()->>'email' ILIKE '%admin%')
  );

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Chatbot Consultations: Cho phép ghi nhận tư vấn từ cả khách và tài khoản
DROP POLICY IF EXISTS "Allow insert consultations" ON public.chatbot_consultations;
CREATE POLICY "Allow insert consultations" ON public.chatbot_consultations
  FOR INSERT TO authenticated, anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read consultations" ON public.chatbot_consultations;
CREATE POLICY "Allow read consultations" ON public.chatbot_consultations
  FOR SELECT TO authenticated, anon USING (true);
