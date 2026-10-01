'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative w-full bg-[#0D0E12] text-white overflow-hidden">
      {/* Background Graphic & Media */}
      <div className="relative w-full min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] flex items-center">
        {/* Desktop Hero Image */}
        <Image
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&auto=format&fit=crop&q=85"
          alt="Next-Gen Gaming PC & Tech Battlestation"
          fill
          priority
          className="object-cover object-center hidden md:block opacity-65"
          sizes="100vw"
        />

        {/* Mobile Background Fallback */}
        <Image
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=85"
          alt="Tech Setup Mobile"
          fill
          priority
          className="object-cover object-center md:hidden opacity-60"
          sizes="100vw"
        />

        {/* Radial Dark Gradient Overlays for High Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-1" />

        {/* Content Overlay */}
        <div className="relative z-10 max-w-[1920px] mx-auto w-full px-6 sm:px-10 lg:px-16 py-16 flex flex-col justify-center items-start">
          <div className="max-w-2xl space-y-5">
            {/* Division Badge */}
            <div className="inline-flex items-center gap-2 border-y border-[#00B2FE]/50 py-1 px-3 text-[11px] font-black uppercase tracking-[0.25em] text-[#00B2FE] bg-black/40 backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5 fill-[#00B2FE]" />
              <span>NEXT-GEN HARDWARE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF007A]"></span>
              <span>FLAGSHIP 2026</span>
            </div>

            {/* Beast Retro Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-md leading-none">
              TITAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B2FE] to-[#FF007A]">TECH</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl font-bold uppercase tracking-tight text-white/95 max-w-xl leading-relaxed">
              Trải nghiệm sức mạnh vô song của RTX 4090, Apple M3 Max, OLED 240Hz và Gear Esports đỉnh cao.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-neutral-300">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Bảo Hành Chính Hãng 12-36 Tháng
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded backdrop-blur-xs">
                ⚡ Giao Siêu Tốc 2 Giờ
              </span>
            </div>

            {/* CTA Button */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href="/products?category=gaming-pc"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-sm tracking-widest rounded-none shadow-beast transition-transform active:scale-95"
              >
                Khám Phá Custom Rigs <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-sm tracking-widest rounded-none border border-white/20 transition backdrop-blur-xs"
              >
                Xem Toàn Bộ Sản Phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
