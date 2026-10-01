'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative w-full bg-[#1A1B1E] text-white overflow-hidden">
      {/* Background Graphic & Media */}
      <div className="relative w-full min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
        <Image
          src="https://mrbeast.store/cdn/shop/files/FootballCollection-Large.jpg?v=1790270516&width=3840"
          alt="MrBeast Football Collection"
          fill
          priority
          className="object-cover object-center hidden md:block"
          sizes="100vw"
        />

        {/* Mobile Background Fallback */}
        <Image
          src="https://mrbeast.store/cdn/shop/files/MB_HomepageBanner_Football_Mobile_TestB_1.jpg?v=1790281264&width=1536"
          alt="MrBeast Football Collection Mobile"
          fill
          priority
          className="object-cover object-center md:hidden"
          sizes="100vw"
        />

        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 py-16 flex flex-col justify-center items-start">
          <div className="max-w-xl space-y-4">
            {/* Division Badge */}
            <div className="inline-flex items-center gap-2 border-y border-white/40 py-1 px-2 text-[11px] font-black uppercase tracking-[0.25em] text-white/90">
              <span>FOOTBALL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FE]"></span>
              <span>MB DIVISION</span>
            </div>

            {/* Beast Retro Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-md">
              BEAST
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl font-bold uppercase tracking-tight text-white/90 max-w-md">
              The new MrBeast Football Collection has arrived.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/products?category=beast-athletics-football"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-sm tracking-widest rounded-none shadow-beast transition-transform active:scale-95"
              >
                Shop Football <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
