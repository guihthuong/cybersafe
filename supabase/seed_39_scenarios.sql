-- ================================================================
-- CYBERSAFE QUEST - SEED 39 CÂU HỎI KHOA HỌC VÀO SUPABASE
-- Bám sát 11 nhóm thủ đoạn & 39 tình huống thực tiễn
-- Hướng dẫn: Copy toàn bộ nội dung file này dán vào SQL Editor trên Supabase Dashboard và bấm RUN.
-- ================================================================

-- 1. Đảm bảo cấu trúc bảng scenarios đầy đủ và các policy
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

-- RLS & Policies
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read scenarios' AND tablename = 'scenarios') THEN
    CREATE POLICY "Public read scenarios" ON public.scenarios FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert scenarios' AND tablename = 'scenarios') THEN
    CREATE POLICY "Allow insert scenarios" ON public.scenarios FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update scenarios' AND tablename = 'scenarios') THEN
    CREATE POLICY "Allow update scenarios" ON public.scenarios FOR UPDATE USING (true);
  END IF;
END $$;

-- 2. Dữ liệu 39 tình huống mô phỏng chuẩn

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q1.1', 'fake_police_authority', 'Giả mạo cơ quan chức năng (Công an, VKS, Tòa án, Thuế)', 'Ứng phó sự cố; Quản lý cảm xúc', 'intermediate', 'branching_scenario', 'Ông Bình (68 tuổi) nhận cuộc gọi: "Tôi là cán bộ công an quận. Tài khoản của ông liên quan đến một đường dây rửa tiền. Ông phải chuyển 300 triệu vào tài khoản tạm giữ để chứng minh trong sạch. Đây là bí mật điều tra, ông không được nói với ai." Ông Bình nên làm gì?', '{"type":"phone_call","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Ông Bình (68 tuổi) nhận cuộc gọi: \"Tôi là cán bộ công an quận. Tài khoản của ông liên quan đến một đường dây rửa tiền. Ông phải chuyển 300 triệu vào tài khoản tạm giữ để chứng minh trong sạch. Đây là bí mật điều tra, ông không được nói với ai.\" Ông Bình nên làm gì?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-14, tr.23–24]; [B1]; [B7]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Ông Bình (68 tuổi) nhận cuộc gọi: \"Tôi là cán bộ công an quận. Tài khoản của ông liên quan đến một đường dây rửa tiền. Ông phải chuyển 300 triệu vào tài khoản tạm giữ để chứng minh trong sạch. Đây là bí mật điều tra, ông không được nói với ai.\" Ông Bình nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Công an làm việc bằng giấy mời, giấy triệu tập hoặc gặp trực tiếp; không có \"tài khoản tạm giữ\" nhận tiền qua điện thoại. Lời dặn \"không được nói với ai\" nhằm cô lập người nghe. D sai vì số hiển thị có thể bị giả mạo. Nhánh sau phương án A: tiền đã chuyển, người chơi phải chọn bước cứu vãn (gọi ngay ngân hàng phong tỏa giao dịch, trình báo công an). Ở Đà Nẵng, một cụ bà 68 tuổi được nhân viên ngân hàng phát hiện và giữ lại được 300 triệu."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Xác minh","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Công an làm việc bằng giấy mời, giấy triệu tập hoặc gặp trực tiếp; không có \"tài khoản tạm giữ\" nhận tiền qua điện thoại. Lời dặn \"không được nói với ai\" nhằm cô lập người nghe. D sai vì số hiển thị có thể bị giả mạo. Nhánh sau phương án A: tiền đã chuyển, người chơi phải chọn bước cứu vãn (gọi ngay ngân hàng phong tỏa giao dịch, trình báo công an). Ở Đà Nẵng, một cụ bà 68 tuổi được nhân viên ngân hàng phát hiện và giữ lại được 300 triệu.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q1.2', 'fake_police_authority', 'Giả mạo cơ quan chức năng (Công an, VKS, Tòa án, Thuế)', 'Quản lý cảm xúc', 'advanced', 'multiple_choice', 'Minh (17 tuổi) nhận cuộc gọi video từ một người mặc đồng phục công an, nói tài khoản ngân hàng của Minh bị dùng để rửa tiền. Người này yêu cầu Minh thuê phòng nghỉ ở một mình, tắt liên lạc với gia đình để "phục vụ điều tra". Chi tiết nào cho thấy rõ nhất đây là lừa đảo?', '{"type":"phone_call","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Minh (17 tuổi) nhận cuộc gọi video từ một người mặc đồng phục công an, nói tài khoản ngân hàng của Minh bị dùng để rửa tiền. Người này yêu cầu Minh thuê phòng nghỉ ở một mình, tắt liên lạc với gia đình để \"phục vụ điều tra\". Chi tiết nào cho thấy rõ nhất đây là lừa đảo?","metadata":{"Đối tượng trọng tâm":"Trẻ em & Học sinh (TE)","Nguồn nghiên cứu":"[B5]; [B6]; [B16]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Người gọi mặc đồng phục công an.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Cuộc gọi là cuộc gọi video.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_c","label":"C. Người gọi yêu cầu Minh rời nhà, ở một mình và giấu gia đình.","is_correct":true,"explanation":"Đồng phục, hình ảnh video và thông tin cá nhân đều có thể làm giả hoặc thu thập trên mạng. Yêu cầu cô lập bản thân mới là dấu hiệu đặc trưng của \"bắt cóc online\": kẻ gian dùng chính nạn nhân để dàn cảnh bị bắt cóc, rồi đòi gia đình tiền chuộc. Một sinh viên sinh năm 2006 ở Hà Nội đã bị dùng để đòi gia đình 370 triệu. Gặp yêu cầu như vậy, hãy kể ngay với bố mẹ hoặc thầy cô."},{"id":"opt_d","label":"D. Người gọi biết tên trường của Minh.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Đồng phục, hình ảnh video và thông tin cá nhân đều có thể làm giả hoặc thu thập trên mạng. Yêu cầu cô lập bản thân mới là dấu hiệu đặc trưng của \"bắt cóc online\": kẻ gian dùng chính nạn nhân để dàn cảnh bị bắt cóc, rồi đòi gia đình tiền chuộc. Một sinh viên sinh năm 2006 ở Hà Nội đã bị dùng để đòi gia đình 370 triệu. Gặp yêu cầu như vậy, hãy kể ngay với bố mẹ hoặc thầy cô.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"high"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q1.3', 'fake_police_authority', 'Giả mạo cơ quan chức năng (Công an, VKS, Tòa án, Thuế)', 'Nhận diện lừa đảo; Kiểm chứng', 'intermediate', 'hotspot', 'Tin nhắn Zalo: "Công an phường Hòa Bình thông báo: Do sắp xếp đơn vị hành chính, bà cần cập nhật định danh điện tử trước 17h hôm nay, nếu không tài khoản VNeID sẽ bị khóa. Tải ứng dụng tại: vneid-capnhat.top/app.apk". Chạm vào các chi tiết đáng ngờ.', '{"type":"chat","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Tin nhắn Zalo: \"Công an phường Hòa Bình thông báo: Do sắp xếp đơn vị hành chính, bà cần cập nhật định danh điện tử trước 17h hôm nay, nếu không tài khoản VNeID sẽ bị khóa. Tải ứng dụng tại: vneid-capnhat.top/app.apk\". Chạm vào các chi tiết đáng ngờ.","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[B4]; [B8]; [CN-9, tr.16].\n3.2. Nhóm N2. Giả mạo ngân hàng, thương hiệu, dịch vụ tài chính"}}'::jsonb, '{"multiple_choice":null,"branching_tree":null,"start_node_id":null,"hotspots":[{"id":"spot_1","title":"Điểm đáng ngờ #1","x":35,"y":42,"width":30,"height":10,"is_suspicious":true,"clue":"Điểm đúng 1: \"trước 17h hôm nay… sẽ bị khóa\" (ép thời gian)."},{"id":"spot_2","title":"Điểm đáng ngờ #2","x":50,"y":54,"width":30,"height":10,"is_suspicious":true,"clue":"Điểm đúng 2: tên miền \"vneid-capnhat.top\" (không phải kênh chính thức)."},{"id":"spot_3","title":"Điểm đáng ngờ #3","x":65,"y":66,"width":30,"height":10,"is_suspicious":true,"clue":"Điểm đúng 3: đuôi \".apk\" (cài ngoài CH Play/App Store)."},{"id":"spot_4","title":"Điểm đáng ngờ #4","x":20,"y":78,"width":30,"height":10,"is_suspicious":true,"clue":"Điểm đúng 4: thông báo gửi qua Zalo cá nhân."},{"id":"spot_distractor_5","title":"Chi tiết gây nhiễu","x":10,"y":10,"width":20,"height":10,"is_suspicious":false,"clue":"Điểm gây nhiễu: tên phường. Kẻ gian thường biết trước thông tin này, nên tên phường đúng không chứng minh tin nhắn là thật."}]}'::jsonb, '"C"'::jsonb, '{"core_rule":"Xác minh","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"VNeID chỉ tải từ CH Play hoặc App Store. Muốn cập nhật thông tin thì đến trực tiếp công an xã/phường. Ứng dụng giả thường xin quyền Trợ năng để đọc mã OTP và tự chuyển tiền.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q2.1', 'bank_otp_fraud', 'Giả mạo ngân hàng, thương hiệu, dịch vụ tài chính', 'Nhận diện lừa đảo', 'beginner', 'hotspot', 'Tin nhắn hiện tên "NganHangABC", nằm ngay dưới các tin báo số dư thật: "Tai khoan cua quy khach se bi tam khoa do chua cap nhat sinh trac hoc. Cap nhat ngay tai: nganhangabc-capnhat.xyz". Chạm vào các chi tiết đáng ngờ.', '{"type":"chat","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Tin nhắn hiện tên \"NganHangABC\", nằm ngay dưới các tin báo số dư thật: \"Tai khoan cua quy khach se bi tam khoa do chua cap nhat sinh trac hoc. Cap nhat ngay tai: nganhangabc-capnhat.xyz\". Chạm vào các chi tiết đáng ngờ.","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[CN-10, tr.19–20]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":null,"start_node_id":null,"hotspots":[{"id":"spot_1","title":"Điểm đáng ngờ #1","x":35,"y":42,"width":30,"height":10,"is_suspicious":true,"clue":"Điểm đúng: \"se bi tam khoa\" (đe dọa); \"Cap nhat ngay\" (giục); đường link đuôi \".xyz\"."},{"id":"spot_distractor_2","title":"Chi tiết gây nhiễu","x":10,"y":10,"width":20,"height":10,"is_suspicious":false,"clue":"Điểm gây nhiễu: tên hiển thị \"NganHangABC\". Tin giả vẫn có thể mang đúng tên ngân hàng và nằm chung luồng với tin thật."}]}'::jsonb, '"C"'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Kẻ gian có thể dùng trạm phát sóng giả để gửi tin mang tên thương hiệu thật. Ngân hàng không yêu cầu khách bấm link để cung cấp thông tin. Hãy tự mở ứng dụng ngân hàng hoặc gọi số tổng đài in sau thẻ.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q2.2', 'bank_otp_fraud', 'Giả mạo ngân hàng, thương hiệu, dịch vụ tài chính', 'Đánh giá thông tin số', 'advanced', 'multiple_choice', 'Địa chỉ nào không thuộc Ngân hàng ABC (trang chính thức là nganhangabc.com.vn)?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Địa chỉ nào không thuộc Ngân hàng ABC (trang chính thức là nganhangabc.com.vn)?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[CN-1, tr.8]; [CN-9, tr.16–17]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. https://nganhangabc.com.vn/dang-nhap","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. https://www.nganhangabc.com.vn","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_c","label":"C. https://nganhangabc.com.vn.xacminh-tk.cc/dang-nhap","is_correct":true,"explanation":"Tên miền thật là phần nằm ngay trước dấu \"/\" đầu tiên. Ở C, phần đó là \"xacminh-tk.cc\", đuôi \".cc\" là đuôi lạ, còn chữ \"nganhangabc.com.vn\" phía trước chỉ là phần trang trí để đánh lừa. Ổ khóa và \"https\" chỉ cho biết đường truyền được mã hóa; trang lừa đảo cũng có thể có ổ khóa."},{"id":"opt_d","label":"D. https://nganhangabc.com.vn/khuyen-mai","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Kiểm tra","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Tên miền thật là phần nằm ngay trước dấu \"/\" đầu tiên. Ở C, phần đó là \"xacminh-tk.cc\", đuôi \".cc\" là đuôi lạ, còn chữ \"nganhangabc.com.vn\" phía trước chỉ là phần trang trí để đánh lừa. Ổ khóa và \"https\" chỉ cho biết đường truyền được mã hóa; trang lừa đảo cũng có thể có ổ khóa.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"high"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q2.3', 'bank_otp_fraud', 'Giả mạo ngân hàng, thương hiệu, dịch vụ tài chính', 'An toàn tài chính; Bảo vệ thông tin', 'intermediate', 'branching_scenario', 'Cô Lan cần vay 50 triệu và thấy quảng cáo trên Facebook: "Vay tín chấp 1%/tháng, nợ xấu vẫn vay, chỉ cần CCCD". Sau khi gửi ảnh CCCD, "tư vấn viên" báo hồ sơ sai một số, cô phải nộp 3 triệu "phí sửa lỗi" thì mới được giải ngân. Cô Lan nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Cô Lan cần vay 50 triệu và thấy quảng cáo trên Facebook: \"Vay tín chấp 1%/tháng, nợ xấu vẫn vay, chỉ cần CCCD\". Sau khi gửi ảnh CCCD, \"tư vấn viên\" báo hồ sơ sai một số, cô phải nộp 3 triệu \"phí sửa lỗi\" thì mới được giải ngân. Cô Lan nên làm gì?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-7, tr.13–15].\n3.3. Nhóm N3. Lừa đảo tuyển dụng, việc làm"}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Cô Lan cần vay 50 triệu và thấy quảng cáo trên Facebook: \"Vay tín chấp 1%/tháng, nợ xấu vẫn vay, chỉ cần CCCD\". Sau khi gửi ảnh CCCD, \"tư vấn viên\" báo hồ sơ sai một số, cô phải nộp 3 triệu \"phí sửa lỗi\" thì mới được giải ngân. Cô Lan nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Kịch bản \"sai số CCCD\", \"viết thường thay vì in hoa\" rồi đòi phí là thủ đoạn quen thuộc. Kẻ gian lấy tiền, đồng thời giữ giấy tờ của nạn nhân để mở tài khoản hoặc đăng ký SIM. Muốn vay, hãy đến trực tiếp ngân hàng hoặc công ty tài chính hợp pháp."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Kịch bản \"sai số CCCD\", \"viết thường thay vì in hoa\" rồi đòi phí là thủ đoạn quen thuộc. Kẻ gian lấy tiền, đồng thời giữ giấy tờ của nạn nhân để mở tài khoản hoặc đăng ký SIM. Muốn vay, hãy đến trực tiếp ngân hàng hoặc công ty tài chính hợp pháp.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q3.1', 'easy_job_high_pay', 'Lừa đảo tuyển dụng, việc làm, cộng tác viên', 'Nhận diện lừa đảo', 'beginner', 'multiple_choice', 'Bài đăng: "Tuyển CTV làm tại nhà, chỉ cần like video, 50.000đ/nhiệm vụ, không cần kinh nghiệm. Nhắn Telegram để nhận việc." Dấu hiệu nào quan trọng nhất cho thấy đây có thể là lừa đảo?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Bài đăng: \"Tuyển CTV làm tại nhà, chỉ cần like video, 50.000đ/nhiệm vụ, không cần kinh nghiệm. Nhắn Telegram để nhận việc.\" Dấu hiệu nào quan trọng nhất cho thấy đây có thể là lừa đảo?","metadata":{"Đối tượng trọng tâm":"Trẻ em & Học sinh (TE)","Nguồn nghiên cứu":"[CN-12, tr.21–22]; [B2]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Liên hệ qua Telegram.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Thu nhập cao cho một việc rất đơn giản, không cần kỹ năng.","is_correct":true,"explanation":"Làm tại nhà hay đăng tin trên mạng không có gì sai. \"Việc nhẹ lương cao\", không cần kỹ năng là mồi nhử phổ biến nhất của lừa đảo tuyển CTV. Telegram là dấu hiệu phụ, cần cảnh giác thêm."},{"id":"opt_c","label":"C. Được làm tại nhà.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Đăng trên mạng xã hội.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Làm tại nhà hay đăng tin trên mạng không có gì sai. \"Việc nhẹ lương cao\", không cần kỹ năng là mồi nhử phổ biến nhất của lừa đảo tuyển CTV. Telegram là dấu hiệu phụ, cần cảnh giác thêm.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q3.2', 'easy_job_high_pay', 'Lừa đảo tuyển dụng, việc làm, cộng tác viên', 'An toàn tài chính', 'intermediate', 'multiple_choice', 'Xếp các bước của kịch bản "làm nhiệm vụ" theo đúng thứ tự: (a) Báo "thao tác sai", phải nạp thêm mới rút được tiền; (b) Quảng cáo việc nhẹ lương cao; (c) Chặn liên lạc, xóa nhóm; (d) Trả thưởng thật cho vài nhiệm vụ nhỏ đầu tiên; (e) Yêu cầu nạp tiền để nhận "nhiệm vụ VIP" hoa hồng cao.', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Xếp các bước của kịch bản \"làm nhiệm vụ\" theo đúng thứ tự: (a) Báo \"thao tác sai\", phải nạp thêm mới rút được tiền; (b) Quảng cáo việc nhẹ lương cao; (c) Chặn liên lạc, xóa nhóm; (d) Trả thưởng thật cho vài nhiệm vụ nhỏ đầu tiên; (e) Yêu cầu nạp tiền để nhận \"nhiệm vụ VIP\" hoa hồng cao.","metadata":{"Đối tượng trọng tâm":"Trẻ em & Học sinh (TE)","Nguồn nghiên cứu":"[CN-6, tr.12]; [CN-12, tr.21]; [B2]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Thực hiện theo yêu cầu của đối tượng","is_correct":false,"explanation":"Rất nguy hiểm! Dễ dẫn tới mất tiền hoặc lộ dữ liệu."},{"id":"opt_b","label":"B. Dừng lại: Không chuyển tiền/cung cấp thông tin, xác minh qua kênh chính thống","is_correct":true,"explanation":"Bước d, được trả tiền thật, là chiếc bẫy chính: nó làm người chơi tin rằng công việc có thật. Bài học rút ra: khoản thưởng nhỏ ban đầu không chứng minh được gì; công việc thật không bắt người làm nộp tiền."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"b → d → e → a → c."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Bước d, được trả tiền thật, là chiếc bẫy chính: nó làm người chơi tin rằng công việc có thật. Bài học rút ra: khoản thưởng nhỏ ban đầu không chứng minh được gì; công việc thật không bắt người làm nộp tiền.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q3.3', 'easy_job_high_pay', 'Lừa đảo tuyển dụng, việc làm, cộng tác viên', 'Quản lý cảm xúc', 'intermediate', 'branching_scenario', 'Sau hai nhiệm vụ được trả tiền, Hà được yêu cầu nạp 2 triệu để nhận "đơn combo" hoa hồng 30%. Hà nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Sau hai nhiệm vụ được trả tiền, Hà được yêu cầu nạp 2 triệu để nhận \"đơn combo\" hoa hồng 30%. Hà nên làm gì?","metadata":{"Đối tượng trọng tâm":"Trẻ em & Học sinh (TE)","Nguồn nghiên cứu":"[CN-12, tr.21]; [B16].\n3.4. Nhóm N4. Lừa đảo đầu tư, làm giàu nhanh"}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Sau hai nhiệm vụ được trả tiền, Hà được yêu cầu nạp 2 triệu để nhận \"đơn combo\" hoa hồng 30%. Hà nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Từ lúc bị yêu cầu nạp tiền, mọi khoản nạp sẽ không rút lại được. Kẻ gian sẽ báo \"lỗi\" để đòi nạp thêm. D còn kéo thêm bạn bè thành nạn nhân."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Từ lúc bị yêu cầu nạp tiền, mọi khoản nạp sẽ không rút lại được. Kẻ gian sẽ báo \"lỗi\" để đòi nạp thêm. D còn kéo thêm bạn bè thành nạn nhân.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q4.1', 'romance_investment_pig', 'Lừa đảo đầu tư, làm giàu nhanh, sàn ảo', 'Nhận diện lừa đảo', 'intermediate', 'multiple_choice', 'Trong nhóm Zalo "Học đầu tư cùng chuyên gia", "trợ lý" giới thiệu một mã cổ phiếu "nội bộ" lãi 777% và yêu cầu tải ứng dụng giao dịch riêng qua link. Điều nào sau đây không phải dấu hiệu lừa đảo?', '{"type":"chat","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Trong nhóm Zalo \"Học đầu tư cùng chuyên gia\", \"trợ lý\" giới thiệu một mã cổ phiếu \"nội bộ\" lãi 777% và yêu cầu tải ứng dụng giao dịch riêng qua link. Điều nào sau đây không phải dấu hiệu lừa đảo?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[B12]; [CN-11, tr.20–21]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Cam kết lợi nhuận rất cao.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Cổ phiếu \"nội bộ\" chỉ nhóm mới biết.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_c","label":"C. Ứng dụng tải qua link riêng, không có trên kho ứng dụng chính thức.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Thị trường chứng khoán có lúc lên, lúc xuống.","is_correct":true,"explanation":"D chỉ là đặc điểm bình thường của thị trường. A, B, C đều trùng với vụ một phụ nữ ở Hà Nội mất 4 tỷ đồng qua app \"AJB DIRECT\": số dư trên app tăng rất nhanh nhưng khi rút thì hệ thống ngừng phản hồi. Công an xác định đây chỉ là hệ thống mô phỏng, không kết nối với sàn được cấp phép."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"D."'::jsonb, '{"core_rule":"Xác minh","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"D chỉ là đặc điểm bình thường của thị trường. A, B, C đều trùng với vụ một phụ nữ ở Hà Nội mất 4 tỷ đồng qua app \"AJB DIRECT\": số dư trên app tăng rất nhanh nhưng khi rút thì hệ thống ngừng phản hồi. Công an xác định đây chỉ là hệ thống mô phỏng, không kết nối với sàn được cấp phép.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q4.2', 'romance_investment_pig', 'Lừa đảo đầu tư, làm giàu nhanh, sàn ảo', 'An toàn tài chính', 'intermediate', 'multiple_choice', 'Ông Tâm thấy tài khoản trên app đầu tư tăng từ 100 triệu lên 300 triệu trong một tuần. Khi rút tiền, ông được báo phải nộp 30 triệu "phí thuế" trước. Nhận định nào đúng nhất?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Ông Tâm thấy tài khoản trên app đầu tư tăng từ 100 triệu lên 300 triệu trong một tuần. Khi rút tiền, ông được báo phải nộp 30 triệu \"phí thuế\" trước. Nhận định nào đúng nhất?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-22, tr.32]; [CN-11, tr.21]; [B12]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Sắp lấy được tiền rồi, nên nộp phí.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Con số trên app có thể chỉ là số ảo do kẻ gian tạo ra; bị đòi phí trước khi rút là dấu hiệu sàn lừa đảo.","is_correct":true,"explanation":"Số dư hiển thị trên một app không rõ nguồn gốc không phải là tiền thật. \"Phí thuế\", \"phí xác minh\" khi rút tiền là bước cuối để vét thêm tiền của nạn nhân. Hỏi \"trợ lý\" (C) nghĩa là hỏi chính kẻ lừa đảo."},{"id":"opt_c","label":"C. Hỏi \"trợ lý\" trong nhóm xem có nên nộp không.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Vay thêm tiền để nộp cho nhanh.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Xác minh","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Số dư hiển thị trên một app không rõ nguồn gốc không phải là tiền thật. \"Phí thuế\", \"phí xác minh\" khi rút tiền là bước cuối để vét thêm tiền của nạn nhân. Hỏi \"trợ lý\" (C) nghĩa là hỏi chính kẻ lừa đảo.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q4.3', 'romance_investment_pig', 'Lừa đảo đầu tư, làm giàu nhanh, sàn ảo', 'Kiểm chứng', 'intermediate', 'branching_scenario', 'Bà Mai được một người quen giới thiệu sàn "đầu tư vàng online, lãi 5%/tuần". Bà hỏi ý kiến cháu. Cháu nên khuyên bà làm gì trước tiên?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Bà Mai được một người quen giới thiệu sàn \"đầu tư vàng online, lãi 5%/tuần\". Bà hỏi ý kiến cháu. Cháu nên khuyên bà làm gì trước tiên?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-11, tr.21]; [CN-15, tr.25]; [B3]; [R3].\n3.5. Nhóm N5. Lừa đảo mua bán trực tuyến"}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Bà Mai được một người quen giới thiệu sàn \"đầu tư vàng online, lãi 5%/tuần\". Bà hỏi ý kiến cháu. Cháu nên khuyên bà làm gì trước tiên?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Người quen có thể cũng đang bị lừa. Bình luận khen có thể đến từ tài khoản ảo. Nạp thử thì sàn lừa đảo vẫn thường cho rút khoản nhỏ để tạo niềm tin. Câu hỏi đặt người chơi trẻ vào vai người hỗ trợ, theo mô hình ROLESafe."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"A."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Người quen có thể cũng đang bị lừa. Bình luận khen có thể đến từ tài khoản ảo. Nạp thử thì sàn lừa đảo vẫn thường cho rút khoản nhỏ để tạo niềm tin. Câu hỏi đặt người chơi trẻ vào vai người hỗ trợ, theo mô hình ROLESafe.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q5.1', 'ecommerce_fake_shipper', 'Lừa đảo mua bán trực tuyến, shipper giả', 'Kiểm chứng', 'beginner', 'branching_scenario', 'Một người tự xưng shipper gọi: "Chị có đơn hàng 350.000đ, em để ở chỗ bảo vệ, chị chuyển khoản giúp em vào số tài khoản này nhé." Chị không nhớ đã đặt gì. Chị nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Một người tự xưng shipper gọi: \"Chị có đơn hàng 350.000đ, em để ở chỗ bảo vệ, chị chuyển khoản giúp em vào số tài khoản này nhé.\" Chị không nhớ đã đặt gì. Chị nên làm gì?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[B9]; [B10]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Một người tự xưng shipper gọi: \"Chị có đơn hàng 350.000đ, em để ở chỗ bảo vệ, chị chuyển khoản giúp em vào số tài khoản này nhé.\" Chị không nhớ đã đặt gì. Chị nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Shipper thật không yêu cầu chuyển tiền vào tài khoản cá nhân trước khi giao. Kẻ gian thường biết đúng tên, số điện thoại và địa chỉ của nạn nhân do dữ liệu bị lộ, nên việc biết những thông tin đó không chứng minh gì. Nhánh sau phương án A dẫn sang câu Q5.2."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Shipper thật không yêu cầu chuyển tiền vào tài khoản cá nhân trước khi giao. Kẻ gian thường biết đúng tên, số điện thoại và địa chỉ của nạn nhân do dữ liệu bị lộ, nên việc biết những thông tin đó không chứng minh gì. Nhánh sau phương án A dẫn sang câu Q5.2.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q5.2', 'ecommerce_fake_shipper', 'Lừa đảo mua bán trực tuyến, shipper giả', 'An toàn tài chính', 'intermediate', 'multiple_choice', 'Sau khi chuyển tiền, "shipper" báo chuyển nhầm và gửi mã QR, bảo quét bằng app ngân hàng để được "hoàn tiền". Vì sao làm vậy nguy hiểm?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Sau khi chuyển tiền, \"shipper\" báo chuyển nhầm và gửi mã QR, bảo quét bằng app ngân hàng để được \"hoàn tiền\". Vì sao làm vậy nguy hiểm?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[B10]; [B2]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Mã QR có thể làm hỏng camera.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Quét QR trong app ngân hàng để \"nhận tiền\" thực chất là tạo lệnh chuyển tiền đi.","is_correct":true,"explanation":"Muốn nhận tiền, bạn chỉ cần đưa số tài khoản; không bao giờ phải quét QR hay nhập OTP. Chị H. ở Hà Nội đã quét mã nhiều lần vì bị bảo là \"thao tác sai\", tổng cộng mất hơn 900 triệu đồng."},{"id":"opt_c","label":"C. Mã QR chỉ dùng được ở siêu thị.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Không nguy hiểm gì.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Muốn nhận tiền, bạn chỉ cần đưa số tài khoản; không bao giờ phải quét QR hay nhập OTP. Chị H. ở Hà Nội đã quét mã nhiều lần vì bị bảo là \"thao tác sai\", tổng cộng mất hơn 900 triệu đồng.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q5.3', 'ecommerce_fake_shipper', 'Lừa đảo mua bán trực tuyến, shipper giả', 'Đánh giá thông tin số', 'intermediate', 'hotspot', 'Fanpage "Homestay Đồi Thông Đà Lạt": "Giá Tết chỉ 400.000đ/đêm (thị trường 900.000đ). CHỈ CÒN 1 PHÒNG, cọc ngay 50% để giữ chỗ. Chỉ nhận chuyển khoản." Phần thông tin trang: tạo tháng trước, quản trị viên ở nước ngoài, giới thiệu "hoạt động 8 năm". Chạm vào các chi tiết đáng ngờ.', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Fanpage \"Homestay Đồi Thông Đà Lạt\": \"Giá Tết chỉ 400.000đ/đêm (thị trường 900.000đ). CHỈ CÒN 1 PHÒNG, cọc ngay 50% để giữ chỗ. Chỉ nhận chuyển khoản.\" Phần thông tin trang: tạo tháng trước, quản trị viên ở nước ngoài, giới thiệu \"hoạt động 8 năm\". Chạm vào các chi tiết đáng ngờ.","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[B11]; [CN-1, tr.7–8]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":null,"start_node_id":null,"hotspots":[{"id":"spot_1","title":"Điểm đáng ngờ #1","x":35,"y":42,"width":30,"height":10,"is_suspicious":true,"clue":"Điểm đúng: giá rẻ hơn hơn một nửa; \"CHỈ CÒN 1 PHÒNG\"; \"cọc ngay 50%\"; \"Chỉ nhận chuyển khoản\"; trang mới lập nhưng tự nhận 8 năm; quản trị viên ở nước ngoài."}]}'::jsonb, '"C"'::jsonb, '{"core_rule":"Kiểm tra","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Kiểm tra mục \"Tính minh bạch của trang\" để xem ngày tạo trang và vị trí người quản lý. Theo lời chủ một homestay từng bị làm fanpage giả: \"Không xác thực – không chuyển cọc\".","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q5.4', 'ecommerce_fake_shipper', 'Lừa đảo mua bán trực tuyến, shipper giả', 'An toàn tài chính', 'beginner', 'multiple_choice', 'Bà Hoa bán tạp hóa. Một khách mua hàng 2 triệu, đưa xem ảnh "chuyển khoản thành công" và muốn mang hàng đi ngay. Bà Hoa nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Bà Hoa bán tạp hóa. Một khách mua hàng 2 triệu, đưa xem ảnh \"chuyển khoản thành công\" và muốn mang hàng đi ngay. Bà Hoa nên làm gì?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-4, tr.10–11].\n3.6. Nhóm N6. Chiếm đoạt tài khoản mạng xã hội"}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Giao hàng vì đã có ảnh chuyển khoản.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Chờ đến khi app ngân hàng hoặc tin nhắn báo số dư cho thấy tiền đã vào tài khoản.","is_correct":true,"explanation":"Ảnh \"chuyển khoản thành công\" có thể được làm bằng phần mềm. Chuyển khoản ngân hàng hiện nay báo có gần như ngay lập tức, nên chỉ tin vào thông báo của chính ngân hàng mình."},{"id":"opt_c","label":"C. Chụp lại ảnh làm bằng chứng rồi giao hàng.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Đề nghị khách chuyển thêm tiền cho chắc.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Ảnh \"chuyển khoản thành công\" có thể được làm bằng phần mềm. Chuyển khoản ngân hàng hiện nay báo có gần như ngay lập tức, nên chỉ tin vào thông báo của chính ngân hàng mình.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q6.1', 'romance_investment_pig', 'Lừa đảo tình cảm, làm quen hẹn hò', 'Bảo vệ tài khoản', 'beginner', 'multiple_choice', 'Bạn thân nhắn Messenger: "Ê, có người bóc phốt mày nè, vào xem đi" kèm một đường link. Bấm vào thì trang yêu cầu đăng nhập lại Facebook. Điều đáng ngờ nhất là gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Bạn thân nhắn Messenger: \"Ê, có người bóc phốt mày nè, vào xem đi\" kèm một đường link. Bấm vào thì trang yêu cầu đăng nhập lại Facebook. Điều đáng ngờ nhất là gì?","metadata":{"Đối tượng trọng tâm":"Trẻ em & Học sinh (TE)","Nguồn nghiên cứu":"[CN-23, tr.34–35]; [CN-13, tr.22–23]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Bạn thân nhắn tin lúc tối muộn.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Bấm link trong tin nhắn xong lại bị yêu cầu đăng nhập Facebook.","is_correct":true,"explanation":"Trang đăng nhập giả sẽ lấy mật khẩu của bạn. Tài khoản của bạn thân có thể đã bị chiếm và đang tự động gửi link cho cả danh sách bạn bè. Hãy hỏi bạn qua kênh khác (gọi điện) và báo cho bạn biết."},{"id":"opt_c","label":"C. Tin nhắn có dùng từ lóng.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Không có gì đáng ngờ vì là bạn thân.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Trang đăng nhập giả sẽ lấy mật khẩu của bạn. Tài khoản của bạn thân có thể đã bị chiếm và đang tự động gửi link cho cả danh sách bạn bè. Hãy hỏi bạn qua kênh khác (gọi điện) và báo cho bạn biết.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q6.2', 'romance_investment_pig', 'Lừa đảo tình cảm, làm quen hẹn hò', 'Bảo vệ tài khoản', 'intermediate', 'branching_scenario', 'Lan bị mất Facebook. Một tài khoản tên "Hỗ trợ khôi phục Meta" chủ động nhắn tin, hứa lấy lại trong 30 phút, cần mật khẩu cũ, mã OTP và 500.000đ tiền cọc. Lan nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Lan bị mất Facebook. Một tài khoản tên \"Hỗ trợ khôi phục Meta\" chủ động nhắn tin, hứa lấy lại trong 30 phút, cần mật khẩu cũ, mã OTP và 500.000đ tiền cọc. Lan nên làm gì?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-21, tr.30–32]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Lan bị mất Facebook. Một tài khoản tên \"Hỗ trợ khôi phục Meta\" chủ động nhắn tin, hứa lấy lại trong 30 phút, cần mật khẩu cũ, mã OTP và 500.000đ tiền cọc. Lan nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Facebook không bao giờ chủ động nhắn tin xin mật khẩu hay tiền cọc. Sau khi lấy được tài khoản, nên bật xác thực hai yếu tố và đổi mật khẩu mạnh."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Facebook không bao giờ chủ động nhắn tin xin mật khẩu hay tiền cọc. Sau khi lấy được tài khoản, nên bật xác thực hai yếu tố và đổi mật khẩu mạnh.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q6.3', 'romance_investment_pig', 'Lừa đảo tình cảm, làm quen hẹn hò', 'Bảo vệ thông tin', 'advanced', 'multiple_choice', 'Một tài khoản Telegram tự xưng "bộ phận an ninh" nhắn: "Có 2 tài khoản đang giả mạo bạn. Hãy chụp màn hình tin nhắn mới nhất gửi cho tôi để xác minh." Vì sao không nên làm theo?', '{"type":"chat","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Một tài khoản Telegram tự xưng \"bộ phận an ninh\" nhắn: \"Có 2 tài khoản đang giả mạo bạn. Hãy chụp màn hình tin nhắn mới nhất gửi cho tôi để xác minh.\" Vì sao không nên làm theo?","metadata":{"Đối tượng trọng tâm":"Trẻ em & Học sinh (TE)","Nguồn nghiên cứu":"[CN-19, tr.29].\n3.7. Nhóm N7. Giả danh người thân, người quen"}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Ảnh chụp màn hình làm điện thoại chậm.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Trong lúc đó kẻ gian bấm \"quên mật khẩu\" bằng số của bạn; ảnh chụp sẽ chứa mã OTP vừa gửi về.","is_correct":true,"explanation":"Gửi ảnh có mã OTP cũng nguy hiểm như đọc mã OTP cho người khác. Không gửi ảnh chụp tin nhắn hệ thống cho bất kỳ ai."},{"id":"opt_c","label":"C. Telegram cấm chụp màn hình.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Không có lý do, nên làm theo.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Gửi ảnh có mã OTP cũng nguy hiểm như đọc mã OTP cho người khác. Không gửi ảnh chụp tin nhắn hệ thống cho bất kỳ ai.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"high"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q7.1', 'social_account_takeover', 'Chiếm đoạt tài khoản, giả mạo người quen', 'Kiểm chứng', 'intermediate', 'branching_scenario', 'Bà nhận tin Zalo từ tài khoản có tên và ảnh giống cháu trai: "Bà ơi cháu cần gấp 20 triệu đóng viện phí cho bạn, bà chuyển vào tài khoản này giúp cháu, đừng nói với bố mẹ cháu nhé." Bà nên làm gì?', '{"type":"chat","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Bà nhận tin Zalo từ tài khoản có tên và ảnh giống cháu trai: \"Bà ơi cháu cần gấp 20 triệu đóng viện phí cho bạn, bà chuyển vào tài khoản này giúp cháu, đừng nói với bố mẹ cháu nhé.\" Bà nên làm gì?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[B13]; [CN-13, tr.23]; [CN-2, tr.9]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Bà nhận tin Zalo từ tài khoản có tên và ảnh giống cháu trai: \"Bà ơi cháu cần gấp 20 triệu đóng viện phí cho bạn, bà chuyển vào tài khoản này giúp cháu, đừng nói với bố mẹ cháu nhé.\" Bà nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Tài khoản đó có thể đã bị chiếm hoặc là tài khoản giả. Gọi video lại tài khoản đó (B) vẫn có thể gặp hình ảnh deepfake. Hỏi câu riêng (D) là cách tốt để phát hiện, nhưng kẻ chiếm tài khoản có thể đọc được tin nhắn cũ. Chắc chắn nhất là liên lạc qua một kênh khác đã có từ trước. Lời dặn \"đừng nói với bố mẹ\" là dấu hiệu cô lập."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Tài khoản đó có thể đã bị chiếm hoặc là tài khoản giả. Gọi video lại tài khoản đó (B) vẫn có thể gặp hình ảnh deepfake. Hỏi câu riêng (D) là cách tốt để phát hiện, nhưng kẻ chiếm tài khoản có thể đọc được tin nhắn cũ. Chắc chắn nhất là liên lạc qua một kênh khác đã có từ trước. Lời dặn \"đừng nói với bố mẹ\" là dấu hiệu cô lập.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q7.2', 'social_account_takeover', 'Chiếm đoạt tài khoản, giả mạo người quen', 'Đánh giá thông tin số', 'advanced', 'hotspot', 'Mô tả cuộc gọi video từ "con gái": hình hơi mờ; khuôn mặt ít biểu cảm; khẩu hình không khớp tiếng; cuộc gọi kéo dài 10 giây rồi con báo "mạng yếu"; ngay sau đó con nhắn số tài khoản mang tên một người lạ, nhờ chuyển 15 triệu. Chạm vào các dấu hiệu deepfake hoặc lừa đảo.', '{"type":"phone_call","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Mô tả cuộc gọi video từ \"con gái\": hình hơi mờ; khuôn mặt ít biểu cảm; khẩu hình không khớp tiếng; cuộc gọi kéo dài 10 giây rồi con báo \"mạng yếu\"; ngay sau đó con nhắn số tài khoản mang tên một người lạ, nhờ chuyển 15 triệu. Chạm vào các dấu hiệu deepfake hoặc lừa đảo.","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-2, tr.8–9]; [B13]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":null,"start_node_id":null,"hotspots":[{"id":"spot_1","title":"Điểm đáng ngờ #1","x":35,"y":42,"width":30,"height":10,"is_suspicious":true,"clue":"Điểm đúng: tất cả 5 chi tiết đều là dấu hiệu theo Cẩm nang."}]}'::jsonb, '"C"'::jsonb, '{"core_rule":"Xác minh","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Nhìn thấy mặt trong cuộc gọi video không còn đủ để xác nhận danh tính. Theo Báo Văn hóa: \"Một cuộc gọi video mờ, ngắn, vội vã không thể thay thế cho xác minh trực tiếp.\" Tài khoản nhận tiền không mang tên người gọi là dấu hiệu rõ nhất.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"high"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q7.3', 'social_account_takeover', 'Chiếm đoạt tài khoản, giả mạo người quen', 'Quản lý cảm xúc', 'intermediate', 'branching_scenario', 'Giữa trưa, một người tự xưng giáo viên chủ nhiệm gọi: "Cháu Nam bị ngã cầu thang, đang mổ cấp cứu. Anh chuyển ngay 50 triệu cho bác sĩ theo số tài khoản này." Vài phút sau, một "bác sĩ" gọi tiếp để giục. Anh nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Giữa trưa, một người tự xưng giáo viên chủ nhiệm gọi: \"Cháu Nam bị ngã cầu thang, đang mổ cấp cứu. Anh chuyển ngay 50 triệu cho bác sĩ theo số tài khoản này.\" Vài phút sau, một \"bác sĩ\" gọi tiếp để giục. Anh nên làm gì?","metadata":{"Đối tượng trọng tâm":"Phụ huynh (PH)","Nguồn nghiên cứu":"[CN-5, tr.11–12]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Giữa trưa, một người tự xưng giáo viên chủ nhiệm gọi: \"Cháu Nam bị ngã cầu thang, đang mổ cấp cứu. Anh chuyển ngay 50 triệu cho bác sĩ theo số tài khoản này.\" Vài phút sau, một \"bác sĩ\" gọi tiếp để giục. Anh nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Kẻ gian thường biết tên trường, lớp, giáo viên chủ nhiệm, và thay nhau gọi để người nghe hoảng loạn. Bệnh viện không yêu cầu chuyển khoản vào tài khoản cá nhân trước khi cấp cứu."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Kẻ gian thường biết tên trường, lớp, giáo viên chủ nhiệm, và thay nhau gọi để người nghe hoảng loạn. Bệnh viện không yêu cầu chuyển khoản vào tài khoản cá nhân trước khi cấp cứu.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q7.4', 'social_account_takeover', 'Chiếm đoạt tài khoản, giả mạo người quen', 'Kiểm chứng', 'intermediate', 'multiple_choice', 'Đầu năm học, một tài khoản có ảnh và tên cô chủ nhiệm nhắn trong nhóm lớp: "Phụ huynh chuyển 1.250.000đ tiền bảo hiểm và đồng phục vào tài khoản dưới đây trước 20h hôm nay", kèm mã QR. Dấu hiệu quan trọng nhất là gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Đầu năm học, một tài khoản có ảnh và tên cô chủ nhiệm nhắn trong nhóm lớp: \"Phụ huynh chuyển 1.250.000đ tiền bảo hiểm và đồng phục vào tài khoản dưới đây trước 20h hôm nay\", kèm mã QR. Dấu hiệu quan trọng nhất là gì?","metadata":{"Đối tượng trọng tâm":"Phụ huynh (PH)","Nguồn nghiên cứu":"[B14].\n3.8. Nhóm N8. Lừa đảo tình cảm"}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Tin nhắn có kèm mã QR.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Yêu cầu chuyển vào tài khoản cá nhân, gấp trong ngày, không khớp thông báo chính thức của trường.","is_correct":true,"explanation":"Hãy đối chiếu tên chủ tài khoản và nội dung với thông báo chính thức của trường, và gọi cho giáo viên qua số đã có từ trước. Không dùng số điện thoại hay link do người lạ gửi."},{"id":"opt_c","label":"C. Số tiền có số lẻ.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Tin nhắn gửi vào buổi tối.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Hãy đối chiếu tên chủ tài khoản và nội dung với thông báo chính thức của trường, và gọi cho giáo viên qua số đã có từ trước. Không dùng số điện thoại hay link do người lạ gửi.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q8.1', 'deepfake_video_call', 'Deepfake, mạo danh khuôn mặt & giọng nói', 'Quản lý cảm xúc', 'intermediate', 'multiple_choice', 'Xếp các giai đoạn của kịch bản lừa đảo tình cảm theo đúng thứ tự: (a) Giới thiệu ứng dụng "đầu tư", cho rút ít tiền lúc đầu; (b) Kết bạn bằng hồ sơ hấp dẫn (doanh nhân, bác sĩ ở nước ngoài); (c) Báo lỗi, đòi phí, rồi chặn liên lạc; (d) Nhắn tin hằng ngày, gọi video, kể chuyện cảm động.', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Xếp các giai đoạn của kịch bản lừa đảo tình cảm theo đúng thứ tự: (a) Giới thiệu ứng dụng \"đầu tư\", cho rút ít tiền lúc đầu; (b) Kết bạn bằng hồ sơ hấp dẫn (doanh nhân, bác sĩ ở nước ngoài); (c) Báo lỗi, đòi phí, rồi chặn liên lạc; (d) Nhắn tin hằng ngày, gọi video, kể chuyện cảm động.","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[B15]; [CN-22, tr.32]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Thực hiện theo yêu cầu của đối tượng","is_correct":false,"explanation":"Rất nguy hiểm! Dễ dẫn tới mất tiền hoặc lộ dữ liệu."},{"id":"opt_b","label":"B. Dừng lại: Không chuyển tiền/cung cấp thông tin, xác minh qua kênh chính thống","is_correct":true,"explanation":"Kẻ gian thường đầu tư nhiều tuần để xây dựng tình cảm trước khi nhắc đến tiền. Đối tượng hay bị nhắm tới là phụ nữ trung niên và người sống một mình."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"b → d → a → c."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Kẻ gian thường đầu tư nhiều tuần để xây dựng tình cảm trước khi nhắc đến tiền. Đối tượng hay bị nhắm tới là phụ nữ trung niên và người sống một mình.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q8.2', 'deepfake_video_call', 'Deepfake, mạo danh khuôn mặt & giọng nói', 'An toàn tài chính', 'intermediate', 'branching_scenario', 'Ông Hùng quen một "nữ bác sĩ làm việc ở Mỹ" qua Facebook. Sau 3 tuần nhắn tin, cô báo đã gửi ông món quà trị giá 5.000 USD nhưng "hải quan" đang giữ, ông cần nộp 15 triệu tiền thuế vào một tài khoản cá nhân. Ông nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Ông Hùng quen một \"nữ bác sĩ làm việc ở Mỹ\" qua Facebook. Sau 3 tuần nhắn tin, cô báo đã gửi ông món quà trị giá 5.000 USD nhưng \"hải quan\" đang giữ, ông cần nộp 15 triệu tiền thuế vào một tài khoản cá nhân. Ông nên làm gì?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-22, tr.32–33]; [B15]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Ông Hùng quen một \"nữ bác sĩ làm việc ở Mỹ\" qua Facebook. Sau 3 tuần nhắn tin, cô báo đã gửi ông món quà trị giá 5.000 USD nhưng \"hải quan\" đang giữ, ông cần nộp 15 triệu tiền thuế vào một tài khoản cá nhân. Ông nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Cơ quan hải quan không thu thuế qua tài khoản cá nhân. Giấy tờ (B) cũng có thể bị làm giả. Người chưa từng gặp mặt mà gửi quà lớn là dấu hiệu điển hình."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Cơ quan hải quan không thu thuế qua tài khoản cá nhân. Giấy tờ (B) cũng có thể bị làm giả. Người chưa từng gặp mặt mà gửi quà lớn là dấu hiệu điển hình.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q8.3', 'deepfake_video_call', 'Deepfake, mạo danh khuôn mặt & giọng nói', 'Ứng phó sự cố', 'intermediate', 'branching_scenario', 'Một "bạn cùng tuổi" quen qua game hay khen em và tặng quà trong game. Bạn ấy xin ảnh riêng tư, hứa giữ bí mật. Sau khi có ảnh, bạn ấy dọa sẽ đăng lên mạng nếu em không chuyển tiền. Em nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Một \"bạn cùng tuổi\" quen qua game hay khen em và tặng quà trong game. Bạn ấy xin ảnh riêng tư, hứa giữ bí mật. Sau khi có ảnh, bạn ấy dọa sẽ đăng lên mạng nếu em không chuyển tiền. Em nên làm gì?","metadata":{"Đối tượng trọng tâm":"Trẻ em & Học sinh (TE)","Nguồn nghiên cứu":"[CN, tr.5]; [CN-22, tr.33]; [B16].\n3.9. Nhóm N9. Dụ cung cấp OTP, thông tin cá nhân, cài mã độc"}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Một \"bạn cùng tuổi\" quen qua game hay khen em và tặng quà trong game. Bạn ấy xin ảnh riêng tư, hứa giữ bí mật. Sau khi có ảnh, bạn ấy dọa sẽ đăng lên mạng nếu em không chuyển tiền. Em nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Không gửi ảnh riêng tư cho người quen trên mạng, dù họ hứa giữ bí mật. Nếu lỡ bị đe dọa, em không có lỗi; làm theo yêu cầu chỉ khiến người xấu đòi thêm. Người lớn và công an có thể giúp em, và tin nhắn đã lưu là bằng chứng."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Xác minh","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Không gửi ảnh riêng tư cho người quen trên mạng, dù họ hứa giữ bí mật. Nếu lỡ bị đe dọa, em không có lỗi; làm theo yêu cầu chỉ khiến người xấu đòi thêm. Người lớn và công an có thể giúp em, và tin nhắn đã lưu là bằng chứng.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q9.1', 'lottery_reward_trap', 'Lừa đảo trúng thưởng, tri ân, quà tặng 0 đồng', 'Bảo vệ thông tin', 'beginner', 'multiple_choice', 'Mã OTP ngân hàng gửi về điện thoại của bạn được phép đọc cho ai?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Mã OTP ngân hàng gửi về điện thoại của bạn được phép đọc cho ai?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[CN-4, tr.11]; [CN-10, tr.20]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Nhân viên ngân hàng gọi điện xác minh.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Cán bộ công an.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_c","label":"C. Không ai cả, chỉ mình bạn nhập mã khi chính bạn thực hiện giao dịch.","is_correct":true,"explanation":"OTP là \"chìa khóa\" của giao dịch. Ngân hàng và cơ quan nhà nước không bao giờ xin mã này. Nếu nhận được OTP mà bạn không làm giao dịch nào, có thể ai đó đang thử chiếm tài khoản của bạn."},{"id":"opt_d","label":"D. Người thân trong gia đình.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"OTP là \"chìa khóa\" của giao dịch. Ngân hàng và cơ quan nhà nước không bao giờ xin mã này. Nếu nhận được OTP mà bạn không làm giao dịch nào, có thể ai đó đang thử chiếm tài khoản của bạn.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q9.2', 'lottery_reward_trap', 'Lừa đảo trúng thưởng, tri ân, quà tặng 0 đồng', 'Bảo vệ tài khoản', 'advanced', 'hotspot', 'Theo hướng dẫn qua điện thoại, bác Tư đang cài file "DichVuCong.apk". Màn hình xin các quyền: Máy ảnh; Trợ năng (Accessibility); Đọc tin nhắn SMS; Hiển thị trên ứng dụng khác. Chạm vào quyền nguy hiểm nhất.', '{"type":"chat","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Theo hướng dẫn qua điện thoại, bác Tư đang cài file \"DichVuCong.apk\". Màn hình xin các quyền: Máy ảnh; Trợ năng (Accessibility); Đọc tin nhắn SMS; Hiển thị trên ứng dụng khác. Chạm vào quyền nguy hiểm nhất.","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[B8]; [CN-8, tr.16]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":null,"start_node_id":null,"hotspots":[{"id":"spot_1","title":"Điểm đáng ngờ #1","x":35,"y":42,"width":30,"height":10,"is_suspicious":true,"clue":"Điểm đúng: Trợ năng (Accessibility). Đọc SMS và Hiển thị trên ứng dụng khác cũng nguy hiểm."}]}'::jsonb, '"C"'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Quyền Trợ năng cho phép ứng dụng đọc màn hình và tự bấm thay bạn, kể cả trong app ngân hàng. Ngân hàng, cơ quan thuế hay các cơ quan khác đều không yêu cầu quyền này. Không cài file .apk do người lạ gửi.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"high"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q9.3', 'lottery_reward_trap', 'Lừa đảo trúng thưởng, tri ân, quà tặng 0 đồng', 'Ứng phó sự cố', 'intermediate', 'branching_scenario', 'Bác Tư lỡ cài ứng dụng lạ theo hướng dẫn của người gọi. Sau đó điện thoại tự bật màn hình và có thông báo đăng nhập ngân hàng. Việc cần làm đầu tiên là gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Bác Tư lỡ cài ứng dụng lạ theo hướng dẫn của người gọi. Sau đó điện thoại tự bật màn hình và có thông báo đăng nhập ngân hàng. Việc cần làm đầu tiên là gì?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[B4]; [CN, mục IV, tr.39–40]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Bác Tư lỡ cài ứng dụng lạ theo hướng dẫn của người gọi. Sau đó điện thoại tự bật màn hình và có thông báo đăng nhập ngân hàng. Việc cần làm đầu tiên là gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Kẻ gian có thể đang điều khiển máy từ xa, nên phải cắt kết nối ngay và khóa tài khoản ngân hàng. Sau đó mang máy đi kiểm tra, đổi mật khẩu và lưu lại bằng chứng."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Kiểm tra","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Kẻ gian có thể đang điều khiển máy từ xa, nên phải cắt kết nối ngay và khóa tài khoản ngân hàng. Sau đó mang máy đi kiểm tra, đổi mật khẩu và lưu lại bằng chứng.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q9.4', 'lottery_reward_trap', 'Lừa đảo trúng thưởng, tri ân, quà tặng 0 đồng', 'Bảo vệ thông tin', 'intermediate', 'multiple_choice', 'Một trang "nhận quà tri ân" yêu cầu gửi ảnh hai mặt CCCD và ảnh chân dung cầm CCCD. Rủi ro lớn nhất là gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Một trang \"nhận quà tri ân\" yêu cầu gửi ảnh hai mặt CCCD và ảnh chân dung cầm CCCD. Rủi ro lớn nhất là gì?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[CN-7, tr.14]; [CN-16, tr.26].\n3.10. Nhóm N10. Trúng thưởng, quà tặng, khuyến mãi"}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Ảnh bị mờ.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Giấy tờ có thể bị dùng để vay tiền, mở tài khoản ngân hàng hoặc đăng ký SIM đứng tên bạn.","is_correct":true,"explanation":"Bộ ảnh CCCD kèm ảnh chân dung đủ để kẻ gian mạo danh bạn. Chỉ cung cấp giấy tờ cho tổ chức đã xác minh, qua kênh chính thức."},{"id":"opt_c","label":"C. Mất thời gian chụp ảnh.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Không có rủi ro gì.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Xác minh","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Bộ ảnh CCCD kèm ảnh chân dung đủ để kẻ gian mạo danh bạn. Chỉ cung cấp giấy tờ cho tổ chức đã xác minh, qua kênh chính thức.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q10.1', 'fake_scholarship_course', 'Lừa đảo học bổng, trại hè, khóa học trẻ em', 'An toàn tài chính', 'beginner', 'branching_scenario', 'Bà nhận cuộc gọi từ "đài truyền hình": bà đã trúng một chiếc tủ lạnh, muốn nhận thì phải mua một hộp sản phẩm giá 900.000đ. Bà nên làm gì?', '{"type":"phone_call","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Bà nhận cuộc gọi từ \"đài truyền hình\": bà đã trúng một chiếc tủ lạnh, muốn nhận thì phải mua một hộp sản phẩm giá 900.000đ. Bà nên làm gì?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[B17]; [B1]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Bà nhận cuộc gọi từ \"đài truyền hình\": bà đã trúng một chiếc tủ lạnh, muốn nhận thì phải mua một hộp sản phẩm giá 900.000đ. Bà nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Đơn hàng đầu tiên chỉ là bước mở đầu. Ở Ba Vì, bà N. bị \"lãnh đạo đài\" gọi thúc mua tổng cộng 28 đơn, mất hơn 400 triệu đồng."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Đơn hàng đầu tiên chỉ là bước mở đầu. Ở Ba Vì, bà N. bị \"lãnh đạo đài\" gọi thúc mua tổng cộng 28 đơn, mất hơn 400 triệu đồng.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q10.2', 'fake_scholarship_course', 'Lừa đảo học bổng, trại hè, khóa học trẻ em', 'Nhận diện lừa đảo', 'beginner', 'multiple_choice', 'Bạn chưa từng tham gia chương trình nào nhưng nhận được thông báo trúng thưởng, kèm yêu cầu đóng phí để nhận giải. Kết luận nào đúng?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Bạn chưa từng tham gia chương trình nào nhưng nhận được thông báo trúng thưởng, kèm yêu cầu đóng phí để nhận giải. Kết luận nào đúng?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-22, tr.33]."}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Có thể là may mắn, nên đóng phí.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_b","label":"B. Gần như chắc chắn là lừa đảo: không ai trúng thưởng khi không tham gia, và giải thưởng thật không bắt đóng phí trước.","is_correct":true,"explanation":"Cẩm nang ghi rõ: \"không có ai trúng thưởng mà không tham gia hoặc không có cách để trúng thưởng mà không phải trả phí\". Hỏi người gọi (D) là hỏi chính kẻ lừa đảo."},{"id":"opt_c","label":"C. Nên gửi CCCD để họ kiểm tra.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."},{"id":"opt_d","label":"D. Hỏi người gọi xem có thật không.","is_correct":false,"explanation":"Lựa chọn này tiềm ẩn rủi ro hoặc chưa phải phương án phòng ngừa an toàn nhất."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Cẩm nang ghi rõ: \"không có ai trúng thưởng mà không tham gia hoặc không có cách để trúng thưởng mà không phải trả phí\". Hỏi người gọi (D) là hỏi chính kẻ lừa đảo.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q10.3', 'fake_scholarship_course', 'Lừa đảo học bổng, trại hè, khóa học trẻ em', 'Bảo vệ thông tin', 'beginner', 'branching_scenario', 'Trong game, một tài khoản tên "Admin_Official" nhắn: "Chúc mừng! Bạn được tặng skin hiếm miễn phí. Đăng nhập tại link này và nhập mã OTP gửi về điện thoại của bố mẹ để xác nhận nhé, nhanh lên kẻo hết!" Em nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Trong game, một tài khoản tên \"Admin_Official\" nhắn: \"Chúc mừng! Bạn được tặng skin hiếm miễn phí. Đăng nhập tại link này và nhập mã OTP gửi về điện thoại của bố mẹ để xác nhận nhé, nhanh lên kẻo hết!\" Em nên làm gì?","metadata":{"Đối tượng trọng tâm":"Trẻ em & Học sinh (TE)","Nguồn nghiên cứu":"[B16].\n3.11. Nhóm N11. Lừa đảo lần hai và tin giả"}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Trong game, một tài khoản tên \"Admin_Official\" nhắn: \"Chúc mừng! Bạn được tặng skin hiếm miễn phí. Đăng nhập tại link này và nhập mã OTP gửi về điện thoại của bố mẹ để xác nhận nhé, nhanh lên kẻo hết!\" Em nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Quản trị viên game thật không tặng quà qua tin nhắn riêng kèm link. Mã OTP trên điện thoại bố mẹ có thể dùng để lấy tiền trong tài khoản của bố mẹ. Thúc giục \"nhanh lên\" là dấu hiệu cần dừng lại."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Quản trị viên game thật không tặng quà qua tin nhắn riêng kèm link. Mã OTP trên điện thoại bố mẹ có thể dùng để lấy tiền trong tài khoản của bố mẹ. Thúc giục \"nhanh lên\" là dấu hiệu cần dừng lại.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q11.1', 'malicious_app_link', 'Mã độc, đường link bẫy, tệp .apk giả mạo', 'Ứng phó sự cố', 'intermediate', 'branching_scenario', 'Chú Sơn vừa bị lừa mất tiền. Chú thấy fanpage "Hỗ trợ thu hồi tiền lừa đảo – được Bộ Công an ủy quyền", cam kết lấy lại 90% với phí hồ sơ 5 triệu. Chú nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Chú Sơn vừa bị lừa mất tiền. Chú thấy fanpage \"Hỗ trợ thu hồi tiền lừa đảo – được Bộ Công an ủy quyền\", cam kết lấy lại 90% với phí hồ sơ 5 triệu. Chú nên làm gì?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[B18]; [CN-18, tr.27–28]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Chú Sơn vừa bị lừa mất tiền. Chú thấy fanpage \"Hỗ trợ thu hồi tiền lừa đảo – được Bộ Công an ủy quyền\", cam kết lấy lại 90% với phí hồ sơ 5 triệu. Chú nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Bộ Công an không ủy quyền cho tổ chức nào nhận hồ sơ thu hồi tiền trên mạng xã hội. Những trang này nhắm vào chính người vừa bị lừa, để lừa thêm lần nữa."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"B."'::jsonb, '{"core_rule":"Xác minh","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Bộ Công an không ủy quyền cho tổ chức nào nhận hồ sơ thu hồi tiền trên mạng xã hội. Những trang này nhắm vào chính người vừa bị lừa, để lừa thêm lần nữa.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q11.2', 'malicious_app_link', 'Mã độc, đường link bẫy, tệp .apk giả mạo', 'An toàn tài chính', 'intermediate', 'branching_scenario', 'Tài khoản của bạn bỗng nhận 5 triệu từ một người lạ. Sau đó có người gọi: "Em chuyển nhầm, anh chuyển lại giúp em qua link này nhé." Bạn nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Tài khoản của bạn bỗng nhận 5 triệu từ một người lạ. Sau đó có người gọi: \"Em chuyển nhầm, anh chuyển lại giúp em qua link này nhé.\" Bạn nên làm gì?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[CN-17, tr.27]; [B19]."}}'::jsonb, '{"multiple_choice":null,"branching_tree":{"node_start":{"id":"node_start","prompt":"Tài khoản của bạn bỗng nhận 5 triệu từ một người lạ. Sau đó có người gọi: \"Em chuyển nhầm, anh chuyển lại giúp em qua link này nhé.\" Bạn nên làm gì?","choices":[{"id":"c_safe","text":"Dừng lại: Không làm theo yêu cầu, xác minh qua người thân / cơ quan chức năng","next_node_id":"node_safe_end","is_safe":true,"feedback":"Kẻ gian có thể chuyển \"nhầm\" rồi giả nhân viên thu hồi nợ đòi trả cả gốc lẫn lãi cao, hoặc gửi link \"hoàn tiền\" để chiếm điện thoại. Tiêu số tiền (D) cũng có thể gây rắc rối pháp lý. Hoàn trả qua ngân hàng là an toàn nhất."},{"id":"c_unsafe","text":"Làm theo hướng dẫn của người gọi / người nhắn tin","next_node_id":"node_danger_end","is_safe":false,"feedback":"Kẻ gian tiếp tục gia tăng áp lực tâm lý để chiếm đoạt tài sản!"}]},"node_safe_end":{"id":"node_safe_end","prompt":"KẾT QUẢ AN TOÀN: Bạn đã xử lý an toàn: Không bị thao túng tâm lý và bảo vệ nguyên vẹn tài sản.","is_terminal":true,"final_outcome":"safe","choices":[]},"node_danger_end":{"id":"node_danger_end","prompt":"CẢNH BÁO NGUY HIỂM: Tài khoản hoặc thông tin của bạn đã bị kẻ gian chiếm đoạt!","is_terminal":true,"final_outcome":"compromised","choices":[]}},"start_node_id":"node_start","hotspots":null}'::jsonb, '"C."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Kẻ gian có thể chuyển \"nhầm\" rồi giả nhân viên thu hồi nợ đòi trả cả gốc lẫn lãi cao, hoặc gửi link \"hoàn tiền\" để chiếm điện thoại. Tiêu số tiền (D) cũng có thể gây rắc rối pháp lý. Hoàn trả qua ngân hàng là an toàn nhất.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'Q11.3', 'malicious_app_link', 'Mã độc, đường link bẫy, tệp .apk giả mạo', 'Đánh giá thông tin số', 'beginner', 'multiple_choice', '"Chỉ cần nghe máy một cuộc gọi lạ là điện thoại bị trừ hết tiền trong tài khoản." Đúng hay sai?', '{"type":"phone_call","sender":"Thông báo / Cuộc gọi mô phỏng","content":"\"Chỉ cần nghe máy một cuộc gọi lạ là điện thoại bị trừ hết tiền trong tài khoản.\" Đúng hay sai?","metadata":{"Đối tượng trọng tâm":"Người cao tuổi (NCT)","Nguồn nghiên cứu":"[CN-20, tr.30].\n3.12. Câu hỏi đối chứng (tình huống an toàn)"}}'::jsonb, '{"multiple_choice":[{"id":"opt_true","label":"A. ĐÚNG","is_correct":false,"explanation":"Nhận một cuộc gọi thoại thông thường không thể làm mất tiền. Rủi ro thật nằm ở việc làm theo hướng dẫn của người gọi: đọc OTP, bấm link, cài ứng dụng, chuyển tiền. Biết điều này giúp người cao tuổi bớt hoảng sợ mà vẫn giữ được cảnh giác."},{"id":"opt_false","label":"B. SAI","is_correct":true,"explanation":"Nhận một cuộc gọi thoại thông thường không thể làm mất tiền. Rủi ro thật nằm ở việc làm theo hướng dẫn của người gọi: đọc OTP, bấm link, cài ứng dụng, chuyển tiền. Biết điều này giúp người cao tuổi bớt hoảng sợ mà vẫn giữ được cảnh giác."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"Sai."'::jsonb, '{"core_rule":"Dừng lại","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Nhận một cuộc gọi thoại thông thường không thể làm mất tiền. Rủi ro thật nằm ở việc làm theo hướng dẫn của người gọi: đọc OTP, bấm link, cài ứng dụng, chuyển tiền. Biết điều này giúp người cao tuổi bớt hoảng sợ mà vẫn giữ được cảnh giác.","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'C1', 'bank_otp_fraud', 'Tình huống đối chứng (An toàn)', 'Kiểm chứng', 'beginner', 'multiple_choice', 'Bạn đặt hàng trên ứng dụng mua sắm. Shipper gọi đúng tên món hàng, giao tận tay, cho kiểm tra rồi thu tiền mặt đúng số tiền hiện trên ứng dụng. Đây có phải lừa đảo không?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Bạn đặt hàng trên ứng dụng mua sắm. Shipper gọi đúng tên món hàng, giao tận tay, cho kiểm tra rồi thu tiền mặt đúng số tiền hiện trên ứng dụng. Đây có phải lừa đảo không?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[R1]"}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Thực hiện theo yêu cầu của đối tượng","is_correct":false,"explanation":"Rất nguy hiểm! Dễ dẫn tới mất tiền hoặc lộ dữ liệu."},{"id":"opt_b","label":"B. Dừng lại: Không chuyển tiền/cung cấp thông tin, xác minh qua kênh chính thống","is_correct":true,"explanation":"Mục tiêu không phải là nghi ngờ mọi thứ, mà là biết kiểm tra qua kênh chính thức. Nghiên cứu ShieldUp! cho thấy người chơi dễ nghi ngờ quá mức ngay sau khi chơi, nên cần những câu như thế này để cân bằng [R1]."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"Không. Đơn hàng đối chiếu được trên ứng dụng, tiền chỉ trả khi đã nhận hàng."'::jsonb, '{"core_rule":"Kiểm tra","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Mục tiêu không phải là nghi ngờ mọi thứ, mà là biết kiểm tra qua kênh chính thức. Nghiên cứu ShieldUp! cho thấy người chơi dễ nghi ngờ quá mức ngay sau khi chơi, nên cần những câu như thế này để cân bằng [R1].","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'C2', 'bank_otp_fraud', 'Tình huống đối chứng (An toàn)', 'Kiểm chứng', 'beginner', 'multiple_choice', 'Ngay sau khi bạn thanh toán ở siêu thị, ngân hàng gửi tin báo trừ tiền đúng số tiền đó, không kèm link, không yêu cầu gì thêm. Bạn nên làm gì?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Ngay sau khi bạn thanh toán ở siêu thị, ngân hàng gửi tin báo trừ tiền đúng số tiền đó, không kèm link, không yêu cầu gì thêm. Bạn nên làm gì?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[R1]"}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Thực hiện theo yêu cầu của đối tượng","is_correct":false,"explanation":"Rất nguy hiểm! Dễ dẫn tới mất tiền hoặc lộ dữ liệu."},{"id":"opt_b","label":"B. Dừng lại: Không chuyển tiền/cung cấp thông tin, xác minh qua kênh chính thống","is_correct":true,"explanation":"Mục tiêu không phải là nghi ngờ mọi thứ, mà là biết kiểm tra qua kênh chính thức. Nghiên cứu ShieldUp! cho thấy người chơi dễ nghi ngờ quá mức ngay sau khi chơi, nên cần những câu như thế này để cân bằng [R1]."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"Không cần làm gì, đây là thông báo biến động số dư bình thường. Điều đáng ngờ là tin nhắn có link, có yêu cầu hoặc lời đe dọa."'::jsonb, '{"core_rule":"Kiểm tra","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Mục tiêu không phải là nghi ngờ mọi thứ, mà là biết kiểm tra qua kênh chính thức. Nghiên cứu ShieldUp! cho thấy người chơi dễ nghi ngờ quá mức ngay sau khi chơi, nên cần những câu như thế này để cân bằng [R1].","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;

INSERT INTO public.scenarios (
  scenario_id, category, category_name_vi, skill, difficulty, question_type, context, stimulus, options, correct_answer, feedback, consequence
) VALUES (
  'C3', 'bank_otp_fraud', 'Tình huống đối chứng (An toàn)', 'Kiểm chứng', 'intermediate', 'multiple_choice', 'Tại buổi họp phụ huynh trực tiếp, cô chủ nhiệm phát thông báo có dấu của trường về khoản bảo hiểm y tế, số tài khoản đứng tên trường. Có đáng tin không?', '{"type":"browser","sender":"Thông báo / Cuộc gọi mô phỏng","content":"Tại buổi họp phụ huynh trực tiếp, cô chủ nhiệm phát thông báo có dấu của trường về khoản bảo hiểm y tế, số tài khoản đứng tên trường. Có đáng tin không?","metadata":{"Đối tượng trọng tâm":"Mọi lứa tuổi","Nguồn nghiên cứu":"[R1]\nV. KẾT LUẬN VÀ CÁC VẤN ĐỀ XIN Ý KIẾN THẦY\n1. Kết luận\nBản tổng hợp ban đầu đã hệ thống hóa các hình thức lừa đảo trực tuyến thành 11 nhóm với 38 tình huống có nguồn kiểm chứng, bao phủ toàn bộ 24 hình thức trong Cẩm nang và bổ sung 8 tình huống mới từ báo chí giai đoạn 2023–2026. Trên cơ sở đó, 39 câu hỏi đã được phát triển với đủ ba bậc kỹ năng cho mỗi nhóm, gắn với bản đồ năng lực và dạng câu hỏi trong tài liệu ý tưởng, sẵn sàng làm dữ liệu đầu vào cho ngân hàng câu hỏi của nền tảng.\n2. Các vấn đề con kính xin ý kiến thầy\nTính cập nhật của Cẩm nang (06/2023). Một số khuyến cáo cần điều chỉnh. Ví dụ, Cẩm nang coi “https://” và biểu tượng ổ khóa là dấu hiệu website an toàn [CN-9, tr.16–18], trong khi trang lừa đảo hiện nay cũng có thể có ổ khóa. Vì vậy câu Q2.2 hướng dẫn người chơi đọc tên miền thay vì chỉ dựa vào ổ khóa.\nNội dung nhạy cảm đối với trẻ em. Tình huống 1.2 (“bắt cóc online”) và 8.3 (dụ gửi ảnh riêng tư) có giá trị phòng ngừa cao nhưng cần mức mô tả phù hợp lứa tuổi. Con đề xuất mỗi câu hỏi có nhãn đối tượng để hệ thống chỉ hiển thị nội dung phù hợp; tình huống 4.3 (lô đề) chỉ dành cho người lớn.\nTỉ lệ câu đối chứng. Hiện bộ câu hỏi có 3 câu tình huống an toàn (khoảng 8%). Con kính mong thầy cho ý kiến về tỉ lệ phù hợp.\n3. Hướng triển khai tiếp theo\nMở rộng ngân hàng lên 50–100 tình huống theo mức ưu tiên P0 của phiên bản đầu tiên (MVP) trong tài liệu ý tưởng, ưu tiên các nhóm có nhiều vụ việc liên quan đến người cao tuổi và trẻ em.\nChuẩn hóa toàn bộ câu hỏi theo cấu trúc dữ liệu nội dung (scenario_id, category, skill, difficulty, question_type, context, options, correct_answer, feedback, source_note, version).\nBổ sung các dạng Multiple Response, Drag & Drop, Matching và Simulation; xây dựng kịch bản rẽ nhánh đầy đủ 4–7 nút quyết định cho các tình huống trọng tâm.\nCon kính mong thầy xem xét và góp ý để con tiếp tục hoàn thiện bộ câu hỏi phục vụ nền tảng trò chơi. Con cảm ơn thầy!\nHà Nội, ngày 10 tháng 10 năm 2026\nHọc sinh\nNguyễn Anh Đức\nTÀI LIỆU THAM KHẢO\nSTT\nMã\nTài liệu\nNăm\nĐường dẫn\n1\nCN\nCục An toàn thông tin – Bộ Thông tin và Truyền thông, “Cẩm nang nhận diện và phòng chống lừa đảo trực tuyến”, Hà Nội, 06/2023, 41 trang.\n06/2023\nTài liệu PDF trong hồ sơ đề tài\n2\nB1\nLuật sư Việt Nam, “Mạo danh công an là hình thức lừa đảo phổ biến nhất năm 2025”.\n12/01/2026\nhttps://lsvn.vn/mao-danh-cong-an-la-hinh-thuc-lua-dao-pho-bien-nhat-nam-2025-a168055.html\n3\nB2\nCafeF, “Nhận diện 25 kịch bản lừa đảo trên không gian mạng năm 2026”.\n12/9/2026\nhttps://cafef.vn/nhan-dien-25-kich-ban-lua-dao-tren-khong-gian-mang-nam-2026-188260912081234057.chn\n4\nB3\nVnEconomy, “Bảo vệ người cao tuổi trước nguy cơ lừa đảo tài chính online”.\n04/02/2026\nhttps://vneconomy.vn/bao-ve-nguoi-cao-tuoi-truoc-nguy-co-lua-dao-tai-chinh-online.htm\n5\nB4\nLuật sư Việt Nam, “Bộ Công an cảnh báo thủ đoạn lừa đảo cài ứng dụng VNeID giả mạo”.\n09/7/2025\nhttps://lsvn.vn/bo-cong-an-canh-bao-thu-doan-lua-dao-cai-ung-dung-vneid-gia-mao-a160066.html\n6\nB5\nLuật sư Việt Nam, “Cảnh báo bẫy lừa đảo ‘bắt cóc online’”.\n22/7/2025\nhttps://lsvn.vn/canh-bao-bay-lua-dao-bat-coc-online-a160766.html\n7\nB6\nBáo Lào Cai, “Dù liên tục được cảnh báo nhưng nhiều thanh, thiếu niên vẫn sập bẫy ‘bắt cóc online’”.\n28/9/2025\nhttps://baolaocai.vn/du-lien-tuc-duoc-canh-bao-nhung-nhieu-thanh-thieu-nien-van-sap-bay-bat-coc-online-post883098.html\n8\nB7\nBáo Lào Cai, “Cụ bà suýt bị lừa chuyển 300 triệu đồng cho kẻ giả danh công an”.\n14/8/2025\nhttps://baolaocai.vn/cu-ba-suyt-bi-lua-chuyen-300-trieu-dong-cho-ke-gia-danh-cong-an-post879533.html\n9\nB8\nVnEconomy, “Cài đặt ứng dụng giả mạo, mất tiền tỷ trong ngân hàng”.\n08/7/2023\nhttps://vneconomy.vn/cai-dat-ung-dung-gia-mao-mat-tien-ty-trong-ngan-hang.htm\n10\nB9\nTuổi Trẻ, “Cảnh báo liên tục, vì sao nhiều người vẫn sập bẫy lừa của shipper giả?”.\n23/7/2025\nhttps://tuoitre.vn/canh-bao-lien-tuc-vi-sao-nhieu-nguoi-van-sap-bay-lua-cua-shipper-gia-20250723095809028.htm\n11\nB10\nLuật sư Việt Nam, “Hà Nội: Người phụ nữ mất hơn 900 triệu đồng khi sập bẫy thủ đoạn giả mạo shipper giao hàng”.\n14/5/2025\nhttps://lsvn.vn/ha-noi-nguoi-phu-nu-mat-hon-900-trieu-dong-khi-sap-bay-thu-doan-gia-mao-shipper-giao-hang-a157668.html\n12\nB11\nTuổi Trẻ, “Cách phòng ngừa các chiêu lừa đảo đặt phòng, vé dịp Tết”.\n24/01/2026\nhttps://tuoitre.vn/cach-phong-ngua-cac-chieu-lua-dao-dat-phong-ve-dip-tet-20260124111014596.htm\n13\nB12\nVOH, “Hà Nội: Sập bẫy chứng khoán ‘siêu lợi nhuận’, một phụ nữ mất trắng 4 tỷ đồng”.\n02/6/2025\nhttps://voh.com.vn/phap-luat/ha-noi-sap-bay-chung-khoan-sieu-loi-nhuan-mot-phu-nu-mat-trang-4-ty-dong-597625.html\n14\nB13\nBáo Văn hóa, “Cảnh giác chiêu giả người thân vay tiền qua video call”.\n01/6/2026\nhttps://baovanhoa.vn/phap-luat/canh-giac-chieu-gia-nguoi-than-vay-tien-qua-video-call-233442.html\n15\nB14\nLuật sư Việt Nam, “Cảnh báo thủ đoạn giả danh nhà trường, giáo viên lừa đảo đầu năm học mới”.\n11/9/2026\nhttps://lsvn.vn/canh-bao-thu-doan-gia-danh-nha-truong-giao-vien-lua-dao-dau-nam-hoc-moi-a178868.html\n16\nB15\nLuật sư Việt Nam, “Cảnh giác với thủ đoạn lừa đảo tình cảm qua mạng”.\n17/4/2025\nhttps://lsvn.vn/canh-giac-voi-thu-doan-lua-dao-tinh-cam-qua-mang-a156466.html\n17\nB16\nNhân Dân, “Lừa đảo công nghệ cao nhắm vào trẻ em dịp hè”.\n09/6/2026\nhttps://nhandan.vn/lua-dao-cong-nghe-cao-nham-vao-tre-em-dip-he-post968020.html\n18\nB17\nLuật sư Việt Nam, “Công an Hà Nội cảnh báo chiêu trò mạo danh đài truyền hình thông báo trúng thưởng”.\n20/12/2024\nhttps://lsvn.vn/cong-an-ha-noi-canh-bao-chieu-tro-mao-danh-dai-truyen-hinh-thong-bao-trung-thuong-a151540.html\n19\nB18\nBáo Lào Cai, “Bộ Công an cảnh báo thủ đoạn mạo danh công an, công ty luật lấy lại tiền bị lừa”.\n17/4/2024\nhttps://baolaocai.vn/bo-cong-an-canh-bao-thu-doan-mao-danh-cong-an-cong-ty-luat-lay-lai-tien-bi-lua-post382871.html\n20\nB19\nLuật sư Việt Nam, “Cảnh giác với thủ đoạn chuyển nhầm tiền vào tài khoản để ‘đòi nợ’”.\n05/11/2024\nhttps://lsvn.vn/canh-giac-voi-thu-doan-chuyen-nham-tien-vao-tai-khoan-de-doi-no-a149141.html\n21\nR1\nShieldUp!: Inoculating Users Against Online Scams Using A Game Based Intervention, arXiv:2503.12341.\n2025\nhttps://arxiv.org/abs/2503.12341\n22\nR2\nMaertens, R. và cộng sự, “Long-Term Effectiveness of Inoculation Against Misinformation”, Journal of Experimental Psychology: Applied.\n2021\nhttps://pubmed.ncbi.nlm.nih.gov/33017160/\n23\nR3\nExperiencer, Helper, or Observer: Online Fraud Intervention for Older Adults Through Role-based Simulation (ROLESafe), arXiv:2601.12324.\n2026\nhttps://arxiv.org/abs/2601.12324\n24\nR4\nCorbett, A. T. & Anderson, J. R., “Knowledge tracing: Modeling the acquisition of procedural knowledge”, User Modeling and User-Adapted Interaction 4.\n1994\nhttps://link.springer.com/article/10.1007/BF01099821\n25\nR5\nSheng, S. và cộng sự, “Anti-Phishing Phil: The Design and Evaluation of a Game That Teaches People Not to Fall for Phish”, SOUPS 2007.\n2007\nhttps://doi.org/10.1145/1280680.1280692\n26\nR6\nBan Thanh niên – Công an tỉnh Thanh Hóa, “Mô phỏng phòng chống lừa đảo” (truy cập 10/10/2026).\n2026\nhttps://gamechongluadao.vn/"}}'::jsonb, '{"multiple_choice":[{"id":"opt_a","label":"A. Thực hiện theo yêu cầu của đối tượng","is_correct":false,"explanation":"Rất nguy hiểm! Dễ dẫn tới mất tiền hoặc lộ dữ liệu."},{"id":"opt_b","label":"B. Dừng lại: Không chuyển tiền/cung cấp thông tin, xác minh qua kênh chính thống","is_correct":true,"explanation":"Mục tiêu không phải là nghi ngờ mọi thứ, mà là biết kiểm tra qua kênh chính thức. Nghiên cứu ShieldUp! cho thấy người chơi dễ nghi ngờ quá mức ngay sau khi chơi, nên cần những câu như thế này để cân bằng [R1]."}],"branching_tree":null,"start_node_id":null,"hotspots":null}'::jsonb, '"Có. Thông báo đến qua kênh chính thức và tài khoản đứng tên trường; đối chiếu với tình huống Q7.4."'::jsonb, '{"core_rule":"Kiểm tra","empathy_note":"Kẻ lừa đảo sử dụng các kịch bản tâm lý tinh vi nhắm vào nỗi sợ hãi hoặc lòng tin. Bất kỳ ai cũng có thể bối rối trong tình huống này, việc bạn bình tĩnh học hỏi là tấm khiên vững chắc nhất!","red_flags":["Tạo áp lực thời gian khẩn cấp (trong ngày, trước 17h, trong 5 phút)","Yêu cầu chuyển tiền, nộp phí, hoặc gửi mã OTP / mật khẩu","Yêu cầu cô lập bản thân, giữ bí mật tuyệt đối với người nhà"],"safe_action":"Mục tiêu không phải là nghi ngờ mọi thứ, mà là biết kiểm tra qua kênh chính thức. Nghiên cứu ShieldUp! cho thấy người chơi dễ nghi ngờ quá mức ngay sau khi chơi, nên cần những câu như thế này để cân bằng [R1].","hotline_or_official_channel":"Tổng đài Cảnh sát 113 | Phản ánh tin nhắn rác 156"}'::jsonb, '{"title":"Nguy cơ mất an toàn tài sản và thông tin cá nhân","description":"Kẻ gian lợi dụng sự sơ hở để chiếm đoạt tiền trong tài khoản hoặc sử dụng giấy tờ tùy thân của bạn vào các hoạt động phi pháp.","severity":"medium"}'::jsonb
)
ON CONFLICT (scenario_id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name_vi = EXCLUDED.category_name_vi,
  skill = EXCLUDED.skill,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  context = EXCLUDED.context,
  stimulus = EXCLUDED.stimulus,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  feedback = EXCLUDED.feedback,
  consequence = EXCLUDED.consequence;
