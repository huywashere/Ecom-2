'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

const TABS = [
  { id: 'HALLOWEEN', label: 'HALLOWEEN', categorySlug: 'feastables' },
  { id: 'GLOW', label: 'GLOW-IN-THE-DARK', categorySlug: 'school-office' },
  { id: 'FEASTABLES', label: 'FEASTABLES', categorySlug: 'feastables' },
  { id: 'FOOTBALL', label: 'FOOTBALL', categorySlug: 'beast-athletics-football' },
  { id: 'ATHLETICS', label: 'ATHLETICS', categorySlug: 'beast-athletics' },
];

export default function BringOnTheChill() {
  const [activeTab, setActiveTab] = useState('FOOTBALL');

  const activeCategory = TABS.find((t) => t.id === activeTab)?.categorySlug;
  const filteredProducts = DEMO_PRODUCTS.filter((p) => p.categorySlug === activeCategory).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 border-t border-neutral-100">
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Bring On The Chill
          </h2>
          <p className="text-sm font-semibold text-neutral-500 mt-1">
            Gear up for fall adventures with the coolest arrivals of the season.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:text-[#00B2FE] transition shrink-0"
        >
          Shop All Collections <ArrowRight className="w-3.5 h-3.5" />
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
