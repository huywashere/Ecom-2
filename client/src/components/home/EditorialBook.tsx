'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy } from 'lucide-react';

export default function EditorialBook() {
  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-8 sm:py-12">
      <div className="bg-[#111111] text-white rounded overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Text Content */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFDF00] text-black text-xs font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" /> $1,000,000 COMPETITION
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            The Book Event Of The Year
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed max-w-lg">
            Enter the competition for your chance at $1,000,000. The book is your way in. Solve clues, decode puzzles, and make history.
          </p>

          <div className="pt-2">
            <Link
              href="/products/the-most-dangerous-games-book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-neutral-200 text-black font-black uppercase text-xs sm:text-sm tracking-widest transition"
            >
              Shop The Book <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="lg:col-span-6 relative h-[320px] sm:h-[420px] lg:h-[480px] bg-neutral-900">
          <Image
            src="https://mrbeast.store/cdn/shop/files/BookImage-HP-Desktop.png?v=1788880566&width=1000"
            alt="The Most Dangerous Games Book"
            fill
            className="object-contain p-6"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
