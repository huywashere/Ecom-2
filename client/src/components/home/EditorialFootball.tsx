'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trophy } from 'lucide-react';

export default function EditorialFootball() {
  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-8 sm:py-12">
      <div className="bg-[#111111] text-white rounded overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center border border-neutral-800">
        {/* Left Graphic */}
        <div className="lg:col-span-6 relative h-[340px] sm:h-[440px] lg:h-[500px] bg-neutral-950 order-2 lg:order-1">
          <Image
            src="https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1000&auto=format&fit=crop&q=80"
            alt="Pro Esports Tournament Gear"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#111111] via-transparent to-transparent hidden lg:block" />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-5 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B2FE] text-black text-xs font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" /> PRO ESPORTS TOURNAMENT GRADE
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Vũ Khí Thống Trị Đấu Trường
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed max-w-lg">
            Được chế tạo để chiến thắng: Chuột siêu nhẹ 54g công nghệ không dây 8000Hz, bàn phím cơ quang học Rapid Trigger 0.1mm phản xạ tức thì và tai nghe tái hiện vị trí âm thanh 3D sống động.
          </p>

          <div className="pt-2">
            <Link
              href="/products?category=mice"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs sm:text-sm tracking-widest transition"
            >
              Xem Gear Thi Đấu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
