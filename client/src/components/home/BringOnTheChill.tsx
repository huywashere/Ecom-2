'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

const TABS = [
  { id: 'LAPTOPS', label: 'LAPTOPS & MAC', categorySlug: 'laptops' },
  { id: 'GAMING_PC', label: 'GAMING RIGS', categorySlug: 'gaming-pc' },
  { id: 'MONITORS', label: 'MÀN HÌNH OLED', categorySlug: 'monitors' },
  { id: 'KEYBOARDS', label: 'BÀN PHÍM CƠ', categorySlug: 'keyboards' },
  { id: 'MICE', label: 'CHUỘT ESPORTS', categorySlug: 'mice' },
  { id: 'AUDIO', label: 'HI-END AUDIO', categorySlug: 'audio' },
];

export default function BringOnTheChill() {
  const [activeTab, setActiveTab] = useState('LAPTOPS');

  const activeCategory = TABS.find((t) => t.id === activeTab)?.categorySlug;
  const filteredProducts = DEMO_PRODUCTS.filter((p) => p.categorySlug === activeCategory).slice(0, 4);

  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-10 sm:py-16 border-t border-neutral-100">
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Khám Phá Kho Vũ Khí Công Nghệ
          </h2>
          <p className="text-sm font-semibold text-neutral-500 mt-1">
            Thiết bị máy tính, phần cứng flagship và phụ kiện thi đấu đỉnh cao thế hệ mới nhất.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:text-[#00B2FE] transition shrink-0"
        >
          Xem Tất Cả Danh Mục <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded transition shrink-0 ${
              activeTab === tab.id
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of 4 Items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
