'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface FlashSaleProps {
  products: Product[];
}

export default function FlashSale({ products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!products || products.length === 0) return null;

  const saleProducts = products.slice(0, 4);

  return (
    <section className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-rose-950/30 via-slate-900/60 to-slate-900/40 border border-rose-500/20 relative overflow-hidden">
      {/* Background neon hint */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/40 animate-bounce">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                FLASH SALE <span className="text-rose-400">GIÁ SỐC</span>
              </h2>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                CHỈ HÔM NAY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Số lượng có hạn, ưu đãi kết thúc sau:</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-400" />
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
            <span className="w-8 h-8 rounded-xl bg-slate-900 border border-rose-500/30 text-white flex items-center justify-center">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-rose-400">:</span>
            <span className="w-8 h-8 rounded-xl bg-slate-900 border border-rose-500/30 text-white flex items-center justify-center">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-rose-400">:</span>
            <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/40">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {saleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View more footer */}
      <div className="text-center mt-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
        >
          Xem tất cả ưu đãi Flash Sale hôm nay <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
