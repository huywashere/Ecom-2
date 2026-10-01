'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  Cpu, 
  Laptop, 
  Smartphone, 
  Headphones, 
  Keyboard, 
  ShieldCheck, 
  ChevronDown,
  LogOut,
  PackageCheck,
  LayoutDashboard
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, initAuth } = useAuthStore();
  const { cart, fetchCart, setIsOpen } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    initAuth();
    fetchCart();
  }, [initAuth, fetchCart]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 py-1.5 px-4 text-xs text-slate-300 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Chính hãng bảo hành tới 24 tháng
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">Giao hỏa tốc 2 giờ nội thành</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Hotline: <strong className="text-white">1800 6868</strong> (Miễn phí)</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider text-white">
                E<span className="text-cyan-400">-TECH</span>
              </span>
              <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-mono">Premium Store</span>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm Laptop, iPhone, Màn hình, Bàn phím cơ..."
                className="w-full bg-slate-900/90 text-slate-200 placeholder-slate-400 text-sm rounded-xl pl-11 pr-24 py-2.5 border border-white/10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs rounded-lg transition"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 hover:text-cyan-400 transition flex items-center gap-2"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold">Giỏ hàng</span>
              {cart.totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-400 text-black font-extrabold text-[11px] rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cart.totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl border border-white/10 z-50 text-sm"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="font-semibold text-white truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Trang Quản Trị Admin
                      </Link>
                    )}

                    <Link
                      href="/cart"
                      className="flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-800 rounded-xl transition"
                    >
                      <PackageCheck className="w-4 h-4" /> Đơn hàng của tôi
                    </Link>

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition text-left"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition"
              >
                <UserIcon className="w-4 h-4" />
                <span>Đăng nhập</span>
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category horizontal sub-bar */}
        <div className="hidden md:flex items-center gap-8 py-2.5 text-xs font-medium text-slate-300 border-t border-white/5 overflow-x-auto">
          <Link href="/products" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Tất cả sản phẩm
          </Link>
          <Link href="/products?category=laptop" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-blue-400" /> Laptop & MacBook
          </Link>
          <Link href="/products?category=dien-thoai" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Điện thoại & Tablet
          </Link>
          <Link href="/products?category=tai-nghe" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-purple-400" /> Tai nghe & Audio
          </Link>
          <Link href="/products?category=ban-phim-chuot" className="hover:text-cyan-400 transition flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-amber-400" /> Bàn phím cơ & Gear
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm điện tử..."
                className="w-full bg-slate-900 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2 border border-white/10"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </form>
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-1">
              Tất cả sản phẩm
            </Link>
            <Link href="/products?category=laptop" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-1">
              Laptop & MacBook
            </Link>
            <Link href="/products?category=dien-thoai" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-1">
              Điện thoại & Tablet
            </Link>
            <Link href="/products?category=tai-nghe" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-1">
              Tai nghe & Audio
            </Link>
            <Link href="/products?category=ban-phim-chuot" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-cyan-400 py-1">
              Bàn phím cơ & Gear
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
