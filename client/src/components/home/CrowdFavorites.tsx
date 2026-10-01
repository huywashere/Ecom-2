'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

export default function CrowdFavorites() {
  const favoriteProducts = DEMO_PRODUCTS.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
            The Crowd Favorites
          </h2>
          <p className="text-sm font-semibold text-neutral-500 mt-1">
            See what everyone is adding to their cart right now.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded transition shrink-0"
        >
          Shop Best Sellers <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Authentic MrBeast Product Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            secondaryImage={
              product.slug === 'beast-edition-plate-tee'
                ? 'https://cdn.shopify.com/s/files/1/0016/1975/5059/files/Particle_Front_1.jpg?v=1778269853&width=800'
                : product.slug === 'youth-clone-tee-black'
                ? 'https://mrbeast.store/cdn/shop/files/B2S_NoiseTee_BLK_BACK.jpg?v=1785206597&width=800'
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
