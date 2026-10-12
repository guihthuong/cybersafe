"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/play", label: "Phòng Huấn Luyện", badge: "39 Tình huống" },
    { href: "/chatbot", label: "Kiểm Tra Tin Nhắn", badge: "Radar AI" },
    { href: "/guide", label: "Cẩm Nang An Toàn" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand - Professional, Legible */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-sky-700 flex items-center justify-center shadow-xs text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-xl sm:text-2xl text-slate-900 tracking-tight flex items-center gap-1.5">
                CyberSafe <span className="text-sky-700">Quest</span>
              </span>
              <span className="hidden sm:block text-xs text-slate-500 font-medium">
                Nền tảng nghiên cứu giáo dục an toàn số
              </span>
            </div>
          </Link>

          {/* Navigation Links - Clean Typography without icon clutter */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "text-sky-700 bg-sky-50 border border-sky-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="hidden lg:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/play"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              <span>Vào Luyện Tập</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
