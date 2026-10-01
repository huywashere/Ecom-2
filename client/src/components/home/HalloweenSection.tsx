'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Ghost } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

export default function HalloweenSection() {
  const halloweenProducts = DEMO_PRODUCTS.filter((p) =>
    p.slug.includes('halloween') || p.slug.includes('glow')
  ).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 border-t border-neutral-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FF007A] text-white text-[10px] font-black uppercase tracking-widest mb-2">
            <Ghost className="w-3.5 h-3.5" /> LIMITED HALLOWEEN DROP
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
            HALLOWEEN 2026 ARE YOU READY?
          </h2>
          <p className="text-sm font-semibold text-neutral-500 mt-1">
            Exclusive Halloween King Size chocolate bundles & Jack-O-Lantern peanut butter cups.
          </p>
        </div>

        <Link
          href="/products?category=feastables"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded transition shrink-0"
        >
          Shop Halloween <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {halloweenProducts.map((product) => (
          <ProductCard key={product.id} product={product} badge="SPOOKY DROP" />
        ))}
      </div>
    </section>
  );
}
