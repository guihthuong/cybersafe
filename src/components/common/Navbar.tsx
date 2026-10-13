"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, ArrowRight, User, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, openAuthModal, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/play", label: "Phòng Huấn Luyện", badge: "39 Tình huống" },
    { href: "/chatbot", label: "Kiểm Tra Tin Nhắn", badge: "Radar AI" },
    { href: "/guide", label: "Cẩm Nang An Toàn" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-sky-700 flex items-center justify-center shadow-xs text-white">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="font-black text-lg sm:text-2xl text-slate-900 tracking-tight flex items-center gap-1">
                CyberSafe <span className="text-sky-700">Quest</span>
              </span>
              <span className="hidden sm:block text-xs text-slate-500 font-medium">
                Nền tảng nghiên cứu giáo dục an toàn số
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
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

          {/* Desktop Right: Auth & Play CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5 bg-slate-50 p-1.5 pr-2 rounded-2xl border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900 leading-tight max-w-[120px] truncate">
                    {profile?.display_name || user.email?.split("@")[0]}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Đã đồng bộ</span>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-1"
                  title="Đăng xuất tài khoản"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("signin")}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-sky-600" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal("signin")}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Đăng Nhập
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {user && (
              <div className="p-3 mb-2 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">
                      {profile?.display_name || user.email}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold">
                      Đang đồng bộ tiến trình riêng
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600 px-2 py-1 rounded-lg bg-white border border-rose-200"
                >
                  Đăng xuất
                </button>
              </div>
            )}

            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? "text-sky-800 bg-sky-50 border border-sky-200"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {link.badge}
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
