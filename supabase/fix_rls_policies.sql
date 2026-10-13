-- ================================================================
-- CYBERSAFE QUEST - MỞ QUYỀN GHI DỮ LIỆU (FIX RLS POLICIES)
-- Chạy script này trong Supabase Dashboard -> SQL Editor
-- để cho phép ứng dụng web ghi nhận:
-- 1. Lịch sử phân tích tin nhắn Chatbot (chatbot_consultations)
-- 2. Tiến độ hoàn thành ải của người chơi (user_progress)
-- 3. Hồ sơ người dùng (user_profiles)
-- ================================================================

-- CÁCH 1 (Khuyên dùng - Nhanh gọn nhất cho môi trường thử nghiệm):
-- 1. Tắt RLS để client-side anon key có thể INSERT / UPDATE trực tiếp
ALTER TABLE public.chatbot_consultations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Gỡ ràng buộc khóa ngoại sang bảng auth.users để cho phép lưu hồ sơ người chơi (cả Khách vãng lai và thành viên)
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;
ALTER TABLE public.user_profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- CÁCH 2 (Nếu bạn vẫn muốn BẬT RLS nhưng cấp quyền đầy đủ cho vai trò anon và authenticated):
/*
ALTER TABLE public.chatbot_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert consultations" ON public.chatbot_consultations;
DROP POLICY IF EXISTS "Allow public read consultations" ON public.chatbot_consultations;
CREATE POLICY "Allow public insert consultations" ON public.chatbot_consultations
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert progress" ON public.user_progress;
DROP POLICY IF EXISTS "Allow public read progress" ON public.user_progress;
CREATE POLICY "Allow public insert progress" ON public.user_progress
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public manage profile" ON public.user_profiles;
CREATE POLICY "Allow public manage profile" ON public.user_profiles
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
*/
