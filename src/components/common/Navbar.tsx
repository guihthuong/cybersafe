"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, ArrowRight, User, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, isAdmin, openAuthModal, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Trang Chủ" },
    { href: "/play", label: "Phòng Huấn Luyện" },
    { href: "/chatbot", label: "Kiểm Tra Tin Nhắn" },
    { href: "/guide", label: "Cẩm Nang An Toàn" },
    { href: "/#ve-chung-toi", label: "Về Chúng Tôi" },
    ...(isAdmin ? [{ href: "/admin", label: "Quản Trị KHKT", isAdminOnly: true }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight flex items-center gap-1">
                CyberSafe <span className="text-sky-600">Quest</span>
              </span>
              <span className="hidden sm:block text-[11px] text-slate-400 font-medium -mt-0.5">
                Giáo dục an toàn số vì cộng đồng
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Clean, Spacious, No Bulky Badges */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              const isAdminLink = (link as any).isAdminOnly;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isAdminLink
                      ? isActive
                        ? "text-indigo-700 bg-indigo-50 font-bold border border-indigo-200"
                        : "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/60 font-semibold border border-indigo-100"
                      : isActive
                      ? "text-sky-700 bg-sky-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right: Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5 bg-slate-50 py-1 px-2.5 rounded-xl border border-slate-200">
                <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs ${isAdmin ? "bg-indigo-600" : "bg-sky-600"}`}>
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 max-w-[120px] truncate leading-tight">
                    {profile?.display_name || user.email?.split("@")[0]}
                  </div>
                  <div className={`text-[10px] font-medium ${isAdmin ? "text-indigo-600 font-bold" : "text-emerald-600"}`}>
                    {isAdmin ? "Quản Trị Viên" : "Đã đồng bộ Cloud"}
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-1"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("signin")}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-300" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>

          {/* Mobile Toggle Button */}
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
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Đăng Nhập
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {user && (
              <div className="p-3 mb-2 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {profile?.display_name || user.email}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      Đang đồng bộ tiến trình
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-medium text-rose-600 px-2 py-1 rounded-md bg-white border border-rose-200"
                >
                  Đăng xuất
                </button>
              </div>
            )}

            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "text-sky-700 bg-sky-50 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
