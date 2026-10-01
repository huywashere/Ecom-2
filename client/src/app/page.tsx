import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';
import HeroBanner from '@/components/home/HeroBanner';
import FlashSale from '@/components/home/FlashSale';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductCard from '@/components/product/ProductCard';
import { productService } from '@/services/product.service';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '@/lib/demo-data';

export default async function HomePage() {
  let featuredProducts = DEMO_PRODUCTS;
  let categories = DEMO_CATEGORIES;

  try {
    const [featRes, catRes] = await Promise.allSettled([
      productService.getFeaturedProducts(),
      productService.getCategories(),
    ]);

    if (featRes.status === 'fulfilled' && featRes.value?.data?.length > 0) {
      featuredProducts = featRes.value.data;
    }
    if (catRes.status === 'fulfilled' && catRes.value?.data?.length > 0) {
      categories = catRes.value.data;
    }
  } catch {
    // Graceful fallback to demo data
  }

  return (
    <div className="space-y-12">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Category Grid */}
      <CategoryGrid categories={categories} />

      {/* 3. Flash Sale */}
      <FlashSale products={featuredProducts} />

      {/* 4. Featured Tech Products */}
      <section className="my-14">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Sparkles className="w-4 h-4" /> Tuyển Chọn Tinh Hoa
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sản Phẩm <span className="text-gradient-cyan">Bán Chạy Nhất</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              Xem tất cả ({featuredProducts.length}+) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Technology Experience & Build PC Banner */}
      <section className="rounded-3xl glass-panel p-8 sm:p-12 border border-white/10 relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-cyan-950/40">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
            DỊCH VỤ CHUYÊN NGHIỆP
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Xây Dựng Cấu Hình PC & Workstation Theo Yêu Cầu
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Đội ngũ chuyên gia E-TECH hỗ trợ tư vấn cấu hình dựng hình 3D, kiến trúc, AI training, livestream với linh kiện tuyển chọn 100% chính hãng, bảo hành tận nơi 24 tháng.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/products?category=laptop"
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-400/20"
            >
              <Zap className="w-4 h-4" /> Tư vấn cấu hình
            </Link>
            <a
              href="tel:18006868"
              className="px-6 py-3 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-semibold text-xs transition"
            >
              Gọi hotline: 1800 6868
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
