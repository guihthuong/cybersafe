import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "CyberSafe Quest — Nền Tảng Học & Rèn Luyện An Toàn Số Thân Thiện",
  description: "Trang bị kỹ năng nhận diện lừa đảo trên không gian mạng qua 11 nhóm hình thức, 39 tình huống mô phỏng và trợ lý AI tư vấn an toàn số.",
  keywords: ["an toàn thông tin", "phòng chống lừa đảo mạng", "khoa học kỹ thuật", "edtech", "an toàn số người cao tuổi", "bảo vệ trẻ em trên mạng"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-sky-200 selection:text-sky-900">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
