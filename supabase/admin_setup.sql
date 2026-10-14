-- ==============================================================================
-- HƯỚNG DẪN CẤP QUYỀN QUẢN TRỊ VIÊN (ADMIN) TRONG SUPABASE
-- ==============================================================================
-- Bạn chỉ cần copy đoạn SQL bên dưới và Paste vào:
-- Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Bổ sung cột role vào bảng user_profiles (nếu chưa có)
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- 2. Cập nhật quyền Admin xem toàn bộ tiến trình người học phục vụ nghiên cứu KHKT
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

-- 3. CẤP QUYỀN ADMIN CHO TÀI KHOẢN CỦA BẠN:
-- Cách A: Cấp quyền cho tài khoản theo email (Ví dụ: admin@cybersafe.vn hoặc email của bạn):
-- UPDATE public.user_profiles 
-- SET role = 'admin' 
-- WHERE id IN (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@gmail.com');

-- Cách B: Cấp quyền cho toàn bộ tài khoản có tên chứa 'admin' hoặc email chứa 'admin':
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE display_name ILIKE '%admin%' 
   OR id IN (SELECT id FROM auth.users WHERE email ILIKE '%admin%');
