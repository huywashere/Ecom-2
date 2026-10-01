'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

export default function HalloweenSection() {
  const specialDrops = DEMO_PRODUCTS.slice(4, 8);

  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-10 sm:py-16 border-t border-neutral-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FF007A] text-white text-[10px] font-black uppercase tracking-widest mb-2">
            <Flame className="w-3.5 h-3.5" /> FLASH DEALS & LIMITED DROPS
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Siêu Phẩm Công Nghệ Giới Hạn 2026
          </h2>
          <p className="text-sm font-semibold text-neutral-500 mt-1">
            Màn hình OLED cong 240Hz, bàn phím cơ vỏ nhôm CNC nguyên khối và âm thanh phòng thu.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded transition shrink-0"
        >
          Săn Ngay Deals Hot <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {specialDrops.map((product) => (
          <ProductCard key={product.id} product={product} badge="HOT DROP" />
        ))}
      </div>
    </section>
  );
}
