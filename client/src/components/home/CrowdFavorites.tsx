'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

export default function CrowdFavorites() {
  const favoriteProducts = DEMO_PRODUCTS.slice(0, 8);

  const getSecondaryImage = (slug: string) => {
    switch (slug) {
      case 'macbook-pro-16-m3-max':
        return 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&auto=format&fit=crop&q=80';
      case 'titan-beast-rtx-4090-custom-rig':
        return 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=1000&auto=format&fit=crop&q=80';
      case 'keychron-q1-pro-wireless-custom-keyboard':
        return 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=1000&auto=format&fit=crop&q=80';
      case 'sony-wh-1000xm5-wireless-anc-headphones':
        return 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&auto=format&fit=crop&q=80';
      default:
        return undefined;
    }
  };

  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-10 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
            The Crowd Favorites
          </h2>
          <p className="text-sm font-semibold text-neutral-500 mt-1">
            Top sản phẩm công nghệ bán chạy và được săn đón nhiều nhất tuần này.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded transition shrink-0"
        >
          Xem Sản Phẩm Bán Chạy <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Authentic Tech Product Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            secondaryImage={getSecondaryImage(product.slug)}
          />
        ))}
      </div>
    </section>
  );
}
