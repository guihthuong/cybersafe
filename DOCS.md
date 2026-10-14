# TÀI LIỆU KỸ THUẬT & KIẾN TRÚC DỰ ÁN (CYBERSAFE QUEST DOCS)

> **Tên dự án:** CyberSafe Quest — Nền Tảng Học & Rèn Luyện An Toàn Số Thân Thiện  
> **Lĩnh vực:** Nghiên cứu Khoa học Kỹ thuật (KHKT) — Giáo dục An toàn Không gian mạng  
> **Phiên bản:** 1.0.0 (Release Edition)  
> **Khẩu hiệu cốt lõi:** `1. Dừng lại` ➔ `2. Kiểm tra` ➔ `3. Xác minh` ➔ `4. Mới hành động`

---

## MỤC LỤC
1. [Giới Thiệu & Mục Tiêu Dự Án](#1-giới-thiệu--mục-tiêu-dự-án)
2. [Chi Tiết Công Nghệ Sử Dụng (Technology Stack)](#2-chi-tiết-công-nghệ-sử-dụng-technology-stack)
3. [Kiến Trúc Hệ Thống & Luồng Dữ Liệu](#3-kiến-trúc-hệ-thống--luồng-dữ-liệu)
4. [Cấu Trúc Thư Mục Dự Án](#4-cấu-trúc-thư-mục-dự-án)
5. [Các Mô-đun Tính Năng Chính](#5-các-mô-đun-tính-năng-chính)
6. [Cơ Sở Dữ Liệu & Thiết Kế Bảng (Database Schema)](#6-cơ-sở-dữ-liệu--thiết-kế-bảng-database-schema)
7. [Hướng Dẫn Cài Đặt & Triển Khai (Deployment Guide)](#7-hướng-dẫn-cài-đặt--triển-khai-deployment-guide)

---

## 1. GIỚI THIỆU & MỤC TIÊU DỰ ÁN

### 1.1. Bối cảnh & Tính cấp thiết
Lừa đảo trực tuyến tại Việt Nam ngày càng diễn biến phức tạp với nhiều thủ đoạn thao túng tâm lý (Social Engineering), công nghệ giả mạo tinh vi (Deepfake, mã độc APK mạo danh VNeID/Dịch vụ công, chiếm đoạt OTP). Đối tượng dễ bị tổn thương nhất là **học sinh, sinh viên** và **người cao tuổi**.

### 1.2. Mục tiêu nghiên cứu
* Xây dựng nền tảng tương tác giúp người học hình thành **phản xạ số tự nhiên** trước các tình huống lừa đảo.
* Ứng dụng mô hình **Gamification (Trò chơi hóa)**: lộ trình bản đồ hành trình uốn lượn, phân cấp bậc bảo vệ, tính điểm sao và tích lũy kinh nghiệm (XP).
* Đánh giá định lượng năng lực an toàn số qua **4 Trụ Cột Năng Lực Cốt Lõi**:
  1. **Detection** (Nhận diện dấu hiệu bất thường, tên miền giả mạo).
  2. **Verification** (Kiểm chứng nguồn tin qua cổng chính thống, hotline).
  3. **Account Protection** (Nguyên tắc bảo vệ mật khẩu, mã OTP, sinh trắc học).
  4. **Incident Response** (Phản ứng nhanh khi có sự cố: khóa thẻ, báo cơ quan chức năng).

---

## 2. CHI TIẾT CÔNG NGHỆ SỬ DỤNG (TECHNOLOGY STACK)

### 2.1. Frontend Core
* **Next.js 15 (App Router)**:
  * Khung ứng dụng React chuẩn doanh nghiệp, hỗ trợ kiến trúc lai Server Components (SSR) và Client Components (`"use client"`).
  * Dynamic Routing linh hoạt: định tuyến động theo từng chương/đề tài (`/play/[chapterId]`), trang quản trị (`/admin`), trang tra cứu (`/quiz`).
* **React 19**:
  * Sử dụng các Hooks tiên tiến (`useState`, `useEffect`, `useMemo`, `useCallback`) tối ưu hóa re-render trong các màn hình giải đố phức tạp.
* **TypeScript 5.7**:
  * Kiểm soát kiểu dữ liệu tĩnh nghiêm ngặt (Strict Mode), định nghĩa interface chuẩn cho kịch bản (`Scenario`), lựa chọn (`Choice`), tiến độ người chơi (`LevelProgress`), và danh mục (`CategoryMeta`).

### 2.2. Giao Diện & Trải Nghiệm Người Dùng (UI / UX)
* **Tailwind CSS v4**:
  * Utility-first CSS thế hệ mới, tối ưu hóa kích thước bundle và tốc độ biên dịch.
  * Thiết kế theo phong cách Light Mode thân thiện, độ tương phản cao, phông chữ to rõ ràng, không gây mỏi mắt cho người lớn tuổi.
* **Lucide React**:
  * Bộ thư viện icon vector phong phú, chuẩn hóa toàn bộ biểu tượng cảnh báo, bảo mật và tương tác người dùng.
* **Framer Motion**:
  * Quản lý hoạt ảnh mượt mà cho các thông báo trúng thưởng, modal xác nhận và chuyển đổi giữa các câu hỏi.
* **Canvas Confetti**:
  * Hiệu ứng pháo giấy chúc mừng trực quan khi người học hoàn thành xuất sắc ải thử thách hoặc đạt điểm sao tối đa.
* **Thuật Toán Vẽ Bản Đồ SVG Vector (Winding Journey Trail)**:
  * Sử dụng đường cong Bezier bậc 3 (`C controlX1 controlY1, controlX2 controlY2, endX endY`) để vẽ lộ trình uốn lượn xuyên suốt giữa các trạm ải.
  * Tọa độ động co giãn độc lập qua hệ quy chiếu `viewBox="0 0 1000 ${totalHeight}" preserveAspectRatio="none"`.

### 2.3. Backend & Cơ Sở Dữ Liệu (BaaS)
* **Supabase (PostgreSQL Cloud)**:
  * Hệ quản trị cơ sở dữ liệu quan hệ PostgreSQL chuẩn hóa.
  * Hỗ trợ lưu trữ kịch bản động, bộ câu hỏi và danh sách quản trị viên.
  * Bảo mật tầng dữ liệu với **Row Level Security (RLS)**: người dùng chỉ đọc kịch bản công khai, tài khoản có cờ `is_admin = true` mới có quyền chỉnh sửa/thêm mới.
* **Mô Hình Đồng Bộ Kép (Hybrid Offline-Online Repository Pattern)**:
  * Nền tảng ưu tiên truy vấn dữ liệu từ Supabase Cloud.
  * Nếu mất kết nối mạng, hệ thống tự động fallback về bộ dữ liệu offline tích hợp sẵn (`offlineScenarios.ts`) và lưu tiến trình vào `LocalStorage`, đảm bảo ứng dụng luôn hoạt động trơn tru 100%.

---

## 3. KIẾN TRÚC HỆ THỐNG & LUỒNG DỮ LIỆU

```
+-------------------------------------------------------------------------------+
|                               TRÌNH DUYỆT (CLIENT)                            |
|                                                                               |
|  [ Trang Chủ / ]     [ Phòng Huấn Luyện /play ]     [ Trang Quản Trị /admin ] |
|  - 11 Chiêu Thức      - Bản Đồ Lộ Trình Ải           - Thêm/Sửa Kịch Bản      |
|  - 4 Bước Phản Xạ     - Giải Đố Thiết Bị Ảo          - Quản Lý Dữ Liệu SQL    |
+---------------------------------------+---------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+--------------------------------+           +----------------------------------+
|    TẦNG QUẢN LÝ DỮ LIỆU CỤC BỘ |           |     SUPABASE BAAS (POSTGRESQL)   |
|         (LOCAL STORAGE)        |           |                                  |
| - Tiến độ 39 ải (Pass / Stars) | <=======> | - Bảng `scenarios` (39 kịch bản) |
| - XP, Danh hiệu, Chuỗi ngày    | Đồng bộ   | - Bảng `profiles` (is_admin)     |
| - Dữ liệu dự phòng Offline     | khi Online| - RLS Policies (Bảo mật quyền)   |
+--------------------------------+           +----------------------------------+
```

---

## 4. CẤU TRÚC THƯ MỤC DỰ ÁN

```bash
CyberSafe Quest/
├── public/                     # Tài nguyên tĩnh
│   ├── images/                 # 13 ảnh minh họa thủ đoạn lừa đảo chuẩn vẽ tay
│   └── favicon.ico
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── admin/page.tsx      # Cổng quản trị kịch bản KHKT (Admin Portal)
│   │   ├── play/
│   │   │   ├── page.tsx        # Hub trung tâm 11 đề tài & Bản đồ hành trình
│   │   │   └── [chapterId]/    # Tuyến làm bài thực nghiệm theo từng đề tài riêng
│   │   ├── quiz/page.tsx       # Công cụ kiểm tra phản xạ & tin nhắn khả nghi
│   │   ├── layout.tsx          # Layout toàn cục, nạp Navbar và Footer
│   │   └── page.tsx            # Trang chủ (Hero, 4 Bước chuẩn, 11 Nhóm thủ đoạn)
│   ├── components/             # Các thành phần giao diện tái sử dụng
│   │   ├── common/             # Navbar, Footer, Modal, Button
│   │   ├── game/               # PuzzleJourneyMap (Bản đồ SVG), DeviceSimulator
│   │   └── home/               # CategoryGrid (Lưới 11 chiêu thức), ProcessSteps
│   ├── data/                   # Dữ liệu tĩnh dự phòng (Offline Scenarios)
│   ├── lib/                    # Supabase Client, Helper functions
│   └── types/                  # Khai báo kiểu dữ liệu TypeScript (database.ts)
├── supabase/
│   └── admin_setup.sql         # Script thiết lập bảng, phân quyền Admin & RLS
├── DOCS.md                     # Tài liệu kỹ thuật chi tiết này
├── README.md                   # Giới thiệu tổng quan dự án
├── package.json                # Danh sách thư viện và dependencies
└── tsconfig.json               # Cấu hình TypeScript compiler
```

---

## 5. CÁC MÔ-ĐUN TÍNH NĂNG CHÍNH

### 5.1. Hub Chọn Đề Tài & Bản Đồ Hành Trình (`/play`)
* **11 Đề tài khoa học độc lập (`DT01` đến `DT11` + Đề tài đối chứng `DTC`)**:
  * Mỗi đề tài có tranh minh họa full uncropped (`object-contain`), mã số đề tài, số lượng ải và số sao tối đa (`0/9★`).
* **Bản đồ hành trình uốn lượn (Journey Map)**:
  * Trục đường uốn lượn liên kết các trạm ải.
  * Mỗi ải có tranh minh họa độc lập (không trùng lặp), trạng thái: **Đã hoàn thành**, **Đang mở (Ải tiếp theo)**, **Bị khóa**.
  * **Cơ chế mở khóa tuần tự (Sequential Progression)**: Bắt buộc hoàn thành ải hiện tại mới mở khóa ải kế tiếp, nghiêm cấm nhảy cóc (skip).

### 5.2. Mô Phỏng Thiết Bị Thực Nghiệm (`/play/[chapterId]`)
* Mô phỏng chân thực giao diện điện thoại thông minh: Cuộc gọi thoại dọa nạt, SMS mạo danh thương hiệu, ứng dụng chat Zalo, thông báo thuế điện tử.
* Phân tích câu trả lời:
  * Đưa ra giải thích chi tiết vì sao đúng/sai theo góc nhìn tâm lý học tội phạm mạng.
  * Chỉ dẫn quy tắc vàng: tra cứu tên miền `.gov.vn`, cúp máy gọi ngay người thân, liên hệ tổng đài ngân hàng.

### 5.3. Radar Phân Tích Tin Nhắn Rủi Ro (`/quiz`)
* Cho phép người dùng nhập đoạn tin nhắn hoặc đường link nhận được trên mạng xã hội.
* Hệ thống phân tích đối sánh biểu thức chính quy (Regex) và từ khóa nhạy cảm (`OTP`, `tạm giữ`, `bắt giam`, `chuyển khoản gấp`, `trúng thưởng`).
* Phân loại mức độ rủi ro kèm hướng dẫn ứng xử khẩn cấp.

### 5.4. Cổng Quản Trị Hệ Thống (`/admin`)
* Cho phép ban giám khảo và ban quản trị:
  * Xem danh sách toàn bộ 39 kịch bản lấy trực tiếp từ database Supabase.
  * Thêm kịch bản mới, chỉnh sửa nội dung câu hỏi, đáp án đúng/sai, độ khó và danh mục.
  * Kiểm tra trạng thái kết nối Cloud / Offline.

---

## 6. CƠ SỞ DỮ LIỆU & THIẾT KẾ BẢNG (DATABASE SCHEMA)

### 6.1. Bảng `scenarios` (Kịch bản kiểm chuẩn)
| Cột | Kiểu Dữ Liệu | Ràng Buộc | Mô Tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Khóa chính tự sinh (`gen_random_uuid()`) |
| `scenario_id` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | Mã định danh ải (VD: `Q1.1`, `Q2.3`) |
| `title` | `TEXT` | `NOT NULL` | Tên tình huống mô phỏng |
| `description` | `TEXT` | `NULL` | Tóm tắt bối cảnh tình huống |
| `category_id` | `VARCHAR(100)` | `NOT NULL` | Mã nhóm chiêu thức (`fake_police`, `bank_otp`...) |
| `difficulty_level`| `VARCHAR(20)` | `DEFAULT 'trung_binh'` | Độ khó: `de`, `trung_binh`, `kho` |
| `scenario_type` | `VARCHAR(50)` | `NOT NULL` | Loại mô phỏng: `call`, `sms`, `social`, `url` |
| `context_data` | `JSONB` | `NOT NULL` | Dữ liệu ngữ cảnh thiết bị mô phỏng |
| `choices` | `JSONB` | `NOT NULL` | Mảng danh sách các phương án xử lý |
| `correct_choice_id`| `VARCHAR(50)` | `NOT NULL` | Mã phương án an toàn chính xác |
| `is_published` | `BOOLEAN` | `DEFAULT TRUE` | Trạng thái phát hành |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Thời điểm tạo bản ghi |

### 6.2. Phân Quyền & Bảo Mật Row Level Security (RLS)
* **Quyền Đọc (SELECT)**: Công khai (`true`) cho mọi người học duyệt kịch bản đã phát hành.
* **Quyền Ghi/Sửa/Xóa (INSERT / UPDATE / DELETE)**: Chỉ người dùng được xác thực có cờ `is_admin = true` trong metadata hoặc bảng hồ sơ admin.

---

## 7. HƯỚNG DẪN CÀI ĐẶT & TRIỂN KHAI (DEPLOYMENT GUIDE)

### 7.1. Yêu Cầu Môi Trường
* **Node.js**: Phiên bản 18.17.0 trở lên (khuyến nghị Node v20 LTS).
* **Package Manager**: `npm` hoặc `pnpm`.
* **Trình duyệt**: Google Chrome, Microsoft Edge, Safari, Firefox phiên bản hiện đại.

### 7.2. Cấu Hình Biến Môi Trường (`.env`)
Tạo tệp `.env` tại thư mục gốc với các thông số:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 7.3. Cài Đặt Dependencies
```bash
npm install
```

### 7.4. Khởi Chạy Môi Trường Phát Triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ hoạt động tại: `http://localhost:3000`

### 7.5. Xây Dựng Bản Phát Hành (Production Build)
```bash
npm run build
npm run start
```

---

## 8. ĐƯỜNG DÂY NÓNG HỖ TRỢ KHẨN CẤP ĐƯỢC TÍCH HỢP
* **113**: Trực ban Cảnh sát Hình sự (Trình báo ngay khi phát hiện bị lừa đảo/chuyển tiền).
* **156**: Tổng đài tiếp nhận phản ánh tin nhắn rác, cuộc gọi rác và cuộc gọi có dấu hiệu lừa đảo (Cục Viễn thông - Miễn phí).
* **1800 1096**: Cổng Dịch vụ công Quốc gia (Hỗ trợ định danh VNeID và thủ tục hành chính).

---
*Tài liệu được biên soạn phục vụ công tác báo cáo khoa học kỹ thuật và bảo trì phát triển dự án.*
