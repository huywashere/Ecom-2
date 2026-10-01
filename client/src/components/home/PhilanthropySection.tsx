'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function PhilanthropySection() {
  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-10 sm:py-16">
      <div className="bg-[#18191C] text-white rounded overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center border border-neutral-800">
        {/* Left Content */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B2FE] text-black text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 fill-black" /> TITAN CARE & CHÍNH SÁCH BẢO HÀNH
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Cam Kết Vàng,<br />An Tâm Tuyệt Đối.
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed max-w-lg">
            Mọi linh kiện và máy tính bán ra tại TITAN TECH đều có nguồn gốc xuất xứ chính hãng rõ ràng, bảo hành chính thức theo tiêu chuẩn toàn cầu của Apple, ASUS, NVIDIA, Sony và Razer.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 py-2 border-y border-neutral-800">
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#FFDF00]">100%</p>
              <p className="text-xs text-neutral-400 font-bold uppercase mt-0.5">Chính Hãng Full VAT</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#00B2FE]">30 Ngày</p>
              <p className="text-xs text-neutral-400 font-bold uppercase mt-0.5">1 Đổi 1 Điểm Chết & Lỗi</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#FF007A]">36 Tháng</p>
              <p className="text-xs text-neutral-400 font-bold uppercase mt-0.5">Bảo Hành Rigs Tận Nơi</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">24/7</p>
              <p className="text-xs text-neutral-400 font-bold uppercase mt-0.5">Hỗ Trợ Kỹ Thuật Pro</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/policies/shipping-policy"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-neutral-200 text-black font-black uppercase text-xs sm:text-sm tracking-widest transition"
            >
              Tìm Hiểu Dịch Vụ Titan Care <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="lg:col-span-6 relative h-[340px] sm:h-[440px] lg:h-[520px] bg-neutral-950">
          <Image
            src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1000&auto=format&fit=crop&q=80"
            alt="TITAN Tech Guarantee & Support"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#18191C] via-transparent to-transparent hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
