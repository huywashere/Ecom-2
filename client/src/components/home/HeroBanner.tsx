'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, ShieldCheck, Flame } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/10 my-6">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
        {/* Left column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Mở Bán Siêu Phẩm Công Nghệ 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Đột Phá <span className="text-gradient-cyan">Sức Mạnh</span>
            <br />
            Chinh Phục Đỉnh Cao
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Trải nghiệm các cỗ máy công nghệ khủng nhất hành tinh: MacBook Pro M3 Max, Laptop Gaming ROG RTX 4090, iPhone 16 Pro Max với chế độ bảo hành vàng 1 Đổi 1 trong 30 ngày.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/products"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Khám phá ngay <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products?category=laptop"
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-white font-semibold text-sm flex items-center gap-2 transition"
            >
              <Zap className="w-4 h-4 text-cyan-400" /> Laptop Gaming & Pro
            </Link>
          </div>

          {/* Quick specs highlights */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-slate-300">
            <div>
              <div className="text-cyan-400 font-bold text-lg">100%</div>
              <div className="text-slate-400">Chính hãng Apple & ASUS</div>
            </div>
            <div>
              <div className="text-cyan-400 font-bold text-lg">0%</div>
              <div className="text-slate-400">Trả góp qua thẻ tín dụng</div>
            </div>
            <div>
              <div className="text-cyan-400 font-bold text-lg">2 Giờ</div>
              <div className="text-slate-400">Giao hàng hỏa tốc</div>
            </div>
          </div>
        </div>

        {/* Right column: Visual tech showcase */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-6 border border-white/10 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-white font-mono text-xs">
                PRO MAX 2026
              </span>
              <span className="text-rose-400 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Giảm 5.000.000₫
              </span>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800"
                alt="MacBook Pro"
                className="w-4/5 h-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] hover:scale-105 transition duration-500"
              />
            </div>

            <div className="glass-panel p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">MacBook Pro 16 M3 Max</p>
                <p className="text-[11px] text-cyan-400 font-mono font-bold">Từ 89.990.000 ₫</p>
              </div>
              <Link
                href="/products/macbook-pro-16-inch-m3-max"
                className="p-2 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 transition"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
