'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Cpu } from 'lucide-react';

export default function EditorialBook() {
  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-8 sm:py-12">
      <div className="bg-[#111111] text-white rounded overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center border border-neutral-800">
        {/* Left Text Content */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFDF00] text-black text-xs font-black uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" /> TITAN LABS • HARDLINE LIQUID COOLING
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Cỗ Máy Chiến Game Tối Thượng 2026
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed max-w-lg">
            Mỗi hệ thống TITAN BEAST được chế tác thủ công bởi các kỹ sư hàng đầu: tản nhiệt nước Custom Hardline kép, linh kiện tuyển chọn có binning cao nhất và bảo hành tận nơi 36 tháng.
          </p>

          <div className="pt-2">
            <Link
              href="/products/titan-beast-rtx-4090-custom-rig"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-neutral-200 text-black font-black uppercase text-xs sm:text-sm tracking-widest transition"
            >
              Cấu Hình Máy Ngay <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="lg:col-span-6 relative h-[340px] sm:h-[440px] lg:h-[500px] bg-neutral-950">
          <Image
            src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1000&auto=format&fit=crop&q=80"
            alt="TITAN Custom Hardline PC Rig"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-transparent to-transparent hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
