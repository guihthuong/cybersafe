# CyberSafe Quest — Nền Tảng Giáo Dục Phòng Ngừa & Nhận Diện Lừa Đảo Trực Tuyến

> **Dự án Nghiên cứu Khoa học Kỹ thuật (KHKT)**  
> **Tác giả:** Nguyễn Anh Đức (Lớp 11E2, THPT Chuyên Ngoại Ngữ - ĐHQGHN)  
> **Giáo viên Hướng dẫn:** ThS. Phạm Phúc Đức Anh  
> **Khẩu hiệu cốt lõi:** `1. Dừng lại` ➔ `2. Kiểm tra` ➔ `3. Xác minh` ➔ `4. Mới hành động`

---

## 1. Giới thiệu dự án

**CyberSafe Quest** là nền tảng web tương tác kết hợp giữa **Phòng Huấn Luyện Thực Nghiệm** và **Trợ Lý Tư Vấn Rủi Ro (Radar An Toàn)** nhằm trang bị năng lực tự vệ số cho người dùng mạng, đặc biệt là nhóm đối tượng dễ bị tổn thương như **người cao tuổi** và **học sinh, sinh viên**.

Hệ thống được thiết kế theo triết lý giáo dục: **Đồng cảm & Không đổ lỗi nạn nhân**, giúp người dùng hiểu rõ các thủ thuật thao túng tâm lý tinh vi (kỹ thuật xã hội - Social Engineering) của tội phạm mạng.

---

## 2. Các tính năng chính

### 2.1. Phòng Huấn Luyện Thực Chiến (39 Tình huống thực nghiệm)
Mô phỏng chân thực màn hình thiết bị (Cuộc gọi thoại đe dọa, SMS giả mạo ngân hàng, Tin nhắn Zalo mạo danh công an, Trình duyệt lừa đảo) với 3 hình thức tương tác:
1. **Branching Scenario (Cây quyết định rẽ nhánh):** Người chơi đối mặt với 4-7 bước ra quyết định liên hoàn, trải nghiệm hệ quả trực tiếp từ lựa chọn của mình.
2. **Hotspot Detection (Vùng nguy hại):** Bấm trực tiếp lên các chi tiết đáng ngờ trên ảnh tin nhắn (link lạ `.top`, tệp cài đặt `.apk`, nội dung đe dọa).
3. **Multiple Choice (Trắc nghiệm nhận diện URL):** Rèn luyện kỹ năng soi tên miền phụ (subdomain) và tên miền gốc cấp cao nhất (`.cc`, `.gov.vn`, `.com.vn`).

### 2.2. Radar Tư Vấn Nhận Diện Nguy Cơ (Offline-Ready)
* Công cụ phân tích tin nhắn, số điện thoại hoặc đường link khả nghi bằng công nghệ Regex & Keyword Matching theo thời gian thực.
* Phân loại theo 4 mức độ rủi ro: **Thấp**, **Cần kiểm chứng**, **Cao**, **Khẩn cấp**.
* Cung cấp phân tích các dấu hiệu nhận diện (Red Flags) và hướng dẫn xử lý khẩn cấp.
* Hoạt động offline 100%, bảo mật tuyệt đối, không thu thập dữ liệu cá nhân hay mã OTP của người dùng.

### 2.3. Cẩm Nang 11 Chiêu Thức Lừa Đảo Phổ Biến
Hệ thống hóa 11 nhóm thủ đoạn lừa đảo trực tuyến phổ biến nhất tại Việt Nam (theo Cục An toàn thông tin - Bộ TT&TT):
* `N01:` Giả mạo Công an / Viện kiểm sát / Tòa án (dọa rửa tiền, lệnh bắt tạm giam)
* `N02:` Giả mạo ngân hàng / Chiếm đoạt mã OTP & sinh trắc học
* `N03:` Lừa đảo trúng thưởng / Quà tri ân 0 đồng
* `N04:` Việc nhẹ lương cao / Cộng tác viên Shopee, TikTok
* `N05:` Bẫy tình cảm / Đầu tư sàn tài chính ảo
* `N06:` Deepfake khuôn mặt & Giọng nói người thân
* `N07:` Mã độc dịch vụ công / Cài file .APK giả chiếm quyền điều khiển
* `N08:` Vé máy bay giá rẻ / Combo du lịch ảo
* `N09:` Giả danh shipper giao hàng / Đơn 0 đồng
* `N10:` Chiếm đoạt tài khoản Facebook, Zalo vay mượn tiền
* `N11:` Học bổng trại hè / Khóa học kỹ năng trẻ em

---

## 3. Công nghệ sử dụng

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript
* **Styling:** Tailwind CSS, Lucide Icons, Canvas Confetti
* **Backend & Database:** Supabase (PostgreSQL) kết hợp cơ chế Offline Repository tự động dự phòng
* **Giao diện:** 100% Light Mode, độ tương phản cao, phông chữ lớn thân thiện với người lớn tuổi và trẻ nhỏ

---

## 4. Hướng dẫn cài đặt và chạy thử nghiệm

### Yêu cầu môi trường
* Node.js version 18.17 hoặc mới hơn
* npm / yarn / pnpm

### Cài đặt dependencies
```bash
npm install
```

### Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

### Xây dựng bản phát hành (Production Build)
```bash
npm run build
npm run start
```

---

## 5. Đường dây nóng hỗ trợ khẩn cấp

* **113:** Trực ban Cảnh sát Hình sự (Trình báo ngay khi vừa chuyển tiền)
* **156:** Tổng đài tiếp nhận phản ánh cuộc gọi rác, tin nhắn rác (Miễn phí)
* **1800 1096:** Cổng Dịch vụ công Quốc gia (Hỗ trợ tài khoản VNeID và thủ tục hành chính)

---

## 6. Bản quyền & Giấy phép
Dự án được xây dựng phục vụ nghiên cứu khoa học kỹ thuật và phổ biến kiến thức an toàn thông tin cộng đồng. Mọi thông tin mô phỏng trong nền tảng đều nhằm mục đích giáo dục phòng ngừa rủi ro.
