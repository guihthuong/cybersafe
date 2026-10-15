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
    { href: "/play", label: "Sản phẩm" },
    { href: "/about", label: "Về chúng tôi" },
    { href: "/guide", label: "Cẩm Nang An Toàn" },
    ...(isAdmin ? [{ href: "/admin", label: "Quản Trị KHKT", isAdminOnly: true }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-1">
                CyberSafe <span className="text-sky-400">Quest</span>
              </span>
              <span className="hidden sm:block text-[11px] text-slate-400 font-medium -mt-0.5">
                Giáo dục an toàn số vì cộng đồng
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Clean, Spacious */}
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
                        ? "text-indigo-300 bg-indigo-950 font-bold border border-indigo-700"
                        : "text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/60 font-semibold border border-indigo-900"
                      : isActive
                      ? "text-sky-300 bg-sky-950/80 border border-sky-800 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
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
              <div className="flex items-center gap-2.5 bg-slate-900 py-1 px-2.5 rounded-xl border border-slate-800">
                <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs ${isAdmin ? "bg-indigo-600" : "bg-sky-600"}`}>
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                    {profile?.display_name || user.email?.split("@")[0]}
                  </div>
                  <div className={`text-[10px] font-medium ${isAdmin ? "text-indigo-400 font-bold" : "text-emerald-400"}`}>
                    {isAdmin ? "Quản Trị Viên" : "Đã đồng bộ Cloud"}
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer ml-1"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("signin")}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <LogIn className="w-3.5 h-3.5 text-sky-200" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal("signin")}
                className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-semibold text-xs"
              >
                Đăng Nhập
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
              aria-label="Mở Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
