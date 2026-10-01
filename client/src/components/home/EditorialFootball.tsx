'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function EditorialFootball() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="bg-[#111111] text-white rounded overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Graphic */}
        <div className="lg:col-span-6 relative h-[320px] sm:h-[420px] lg:h-[480px] bg-neutral-900 order-2 lg:order-1">
          <Image
            src="https://mrbeast.store/cdn/shop/files/football-season-is-here.png?v=1788879635&width=1000"
            alt="Football Season Drop"
            fill
            className="object-contain p-6"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-5 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B2FE] text-black text-xs font-black uppercase tracking-wider">
            BEAST ATHLETICS 2026
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Football Season Is Here
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed max-w-lg">
            Introducing our newest football drop. Everything you need to dominate the season from head to toe. Complete game jerseys, shorts, footballs, and gear.
          </p>

          <div className="pt-2">
            <Link
              href="/products?category=beast-athletics-football"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs sm:text-sm tracking-widest transition"
            >
              Shop Football <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
