import React from 'react';
import Link from 'next/link';
import { Cpu, ShieldCheck, Truck, RefreshCw, Headphones, CreditCard, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 mt-20 text-slate-400 text-sm">
      {/* 4 Feature Badges */}
      <div className="border-b border-white/10 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Chính Hãng</h4>
              <p className="text-xs text-slate-500">Cam kết bảo hành tới 24 tháng</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Giao Hỏa Tốc 2H</h4>
              <p className="text-xs text-slate-500">Miễn phí giao hàng toàn quốc</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">1 Đổi 1 Trong 30 Ngày</h4>
              <p className="text-xs text-slate-500">Lỗi từ nhà sản xuất đổi ngay</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Hỗ Trợ Kỹ Thuật 24/7</h4>
              <p className="text-xs text-slate-500">Đội ngũ kỹ thuật viên chuyên sâu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand & info */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-black font-bold" />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white">
              E<span className="text-cyan-400">-TECH</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Hệ thống bán lẻ thiết bị công nghệ, laptop gaming, điện thoại cao cấp và linh kiện điện tử hàng đầu Việt Nam. Nơi thỏa mãn đam mê công nghệ đỉnh cao.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400" /> Tầng 12, Tòa nhà Bitexco / Landmark 81, TP.HCM & Hà Nội
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-cyan-400" /> 1800 6868 - 0988 888 888 (Tư vấn 24/7)
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400" /> cskh@e-tech.vn
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3.5">Danh Mục Hot</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products?category=laptop" className="hover:text-cyan-400 transition">MacBook Pro & Air M3</Link></li>
            <li><Link href="/products?category=laptop" className="hover:text-cyan-400 transition">Laptop Gaming ROG / Alienware</Link></li>
            <li><Link href="/products?category=dien-thoai" className="hover:text-cyan-400 transition">iPhone 16 Series</Link></li>
            <li><Link href="/products?category=dien-thoai" className="hover:text-cyan-400 transition">Samsung Galaxy S24 Ultra</Link></li>
            <li><Link href="/products?category=tai-nghe" className="hover:text-cyan-400 transition">Tai nghe Sony Hi-Res Audio</Link></li>
            <li><Link href="/products?category=ban-phim-chuot" className="hover:text-cyan-400 transition">Bàn phím cơ Custom Keychron</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3.5">Chính Sách & Hỗ Trợ</h3>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-cyan-400 transition">Chính sách bảo hành vàng</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Chính sách đổi trả 30 ngày</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Hướng dẫn mua trả góp 0%</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Tra cứu tiến độ bảo hành</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Bảng giá thu cũ đổi mới (Trade-in)</a></li>
          </ul>
        </div>

        {/* Payments */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3.5">Phương Thức Thanh Toán</h3>
          <p className="text-xs text-slate-400 mb-3">Hỗ trợ đa dạng phương thức thanh toán an toàn tiện lợi:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-white/10 font-mono">VietQR</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-white/10 font-mono">COD</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-white/10 font-mono">VNPAY</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-white/10 font-mono">MoMo</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-white/10 font-mono">Visa/Master</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        © 2026 E-TECH Electronics Commerce Inc. All rights reserved. Thiết kế với Next.js & Spring Boot.
      </div>
    </footer>
  );
}
