'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Flame } from 'lucide-react';
import { useSearchStore } from '@/store/search-store';
import { DEMO_PRODUCTS } from '@/lib/demo-data';
import { useCurrencyStore } from '@/store/currency-store';
import { formatPrice } from '@/lib/formatters';

const POPULAR_SEARCHES = ['MacBook', 'RTX 4090', 'OLED', 'Keychron', 'Gaming PC', 'Sony XM5', 'Razer', 'DDR5'];

export default function PredictiveSearch() {
  const { isOpen, query, setQuery, closeSearch } = useSearchStore();
  const { currency } = useCurrencyStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSearch]);

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? DEMO_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName?.toLowerCase().includes(query.toLowerCase()) ||
          p.brandName?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Search Drawer Panel */}
      <div className="bg-white border-b border-neutral-200 shadow-2xl w-full max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col">
          {/* Top Bar with Input & Close */}
          <div className="flex items-center gap-3 border-b-2 border-black pb-3">
            <Search className="w-6 h-6 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm MacBook, RTX 4090, Màn hình OLED, Bàn phím cơ..."
              className="w-full text-base sm:text-xl font-bold placeholder:text-neutral-400 focus:outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-neutral-100 rounded-full transition"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            )}
            <button
              onClick={closeSearch}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-black uppercase tracking-wider rounded transition"
            >
              ESC / Close
            </button>
          </div>

          {/* Quick Suggestions Tags */}
          <div className="py-4 flex flex-wrap items-center gap-2 border-b border-neutral-100">
            <span className="text-xs font-black uppercase text-neutral-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#FF007A]" /> Popular:
            </span>
            {POPULAR_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-neutral-100 hover:bg-black hover:text-white transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results Area */}
          <div className="overflow-y-auto max-h-[50vh] py-4">
            {query.trim() === '' ? (
              <div className="text-center py-8 text-neutral-400 text-sm">
                Nhập từ khóa để tìm kiếm máy tính, laptop, linh kiện & đồ điện tử chính hãng...
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-black uppercase text-neutral-500">
                  <span>Sản phẩm ({filteredProducts.length})</span>
                  <Link
                    href={`/products?search=${encodeURIComponent(query)}`}
                    onClick={closeSearch}
                    className="text-[#00B2FE] hover:underline flex items-center gap-1 font-bold"
                  >
                    Xem Tất Cả <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-2 rounded border border-neutral-100 hover:border-black hover:shadow-md transition bg-neutral-50/50"
                    >
                      <div className="w-16 h-16 relative shrink-0 bg-neutral-100 rounded overflow-hidden">
                        {product.thumbnail && (
                          <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-black uppercase truncate">{product.name}</p>
                        <p className="text-xs text-neutral-500 font-semibold">{product.categoryName}</p>
                        <p className="text-xs font-black text-black mt-1">
                          {formatPrice(product.minPrice, currency)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm font-bold text-neutral-700">Không tìm thấy sản phẩm phù hợp với &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-neutral-400 mt-1">Thử tìm kiếm với: MacBook, RTX 4090, OLED, Keychron, hoặc Sony.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div className="flex-1 cursor-pointer" onClick={closeSearch} />
    </div>
  );
}
