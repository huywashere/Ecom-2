'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Shield, ArrowUpRight } from 'lucide-react';
import { Product } from '@/types';
import { formatVND } from '@/lib/formatters';
import { useCartStore } from '@/store/cart-store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const discountPercent =
    product.originalPrice && product.originalPrice > product.minPrice
      ? Math.round(((product.originalPrice - product.minPrice) / product.originalPrice) * 100)
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default variant item
    addItem(
      product,
      {
        id: product.id,
        sku: `${product.slug}-default`,
        variantName: 'Phiên bản tiêu chuẩn',
        price: product.minPrice,
        originalPrice: product.originalPrice,
        stockQuantity: product.totalStock || 10,
        active: true,
      },
      1
    );
  };

  return (
    <div className="group relative rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discountPercent > 0 && (
          <span className="px-2 py-0.5 rounded-lg bg-rose-500/90 text-white font-extrabold text-[11px] shadow-lg shadow-rose-500/30">
            -{discountPercent}%
          </span>
        )}
        {product.featured && (
          <span className="px-2 py-0.5 rounded-lg bg-cyan-400 text-black font-extrabold text-[10px] tracking-wide uppercase shadow-lg shadow-cyan-400/30">
            HOT
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 border border-white/10 text-slate-300 text-[10px] font-mono flex items-center gap-1">
          <Shield className="w-3 h-3 text-cyan-400" /> {product.warrantyMonths}T BH
        </span>
      </div>

      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="block relative pt-[75%] overflow-hidden bg-slate-900/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.thumbnail || '/placeholder.png'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5 font-medium">
            <span className="text-cyan-400 font-semibold">{product.brandName || 'Chính Hãng'}</span>
            <span>•</span>
            <span className="truncate">{product.categoryName}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 hover:text-cyan-400 transition mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Short specs highlight */}
          {product.shortDescription && (
            <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-cyan-400 font-extrabold text-base tracking-tight">
              {formatVND(product.minPrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.minPrice && (
              <span className="text-xs text-slate-500 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock bar */}
          <div className="flex items-center justify-between text-[11px] mb-3">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              {product.totalStock > 0 ? `Còn hàng (${product.totalStock})` : 'Hết hàng'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-5 gap-2 pt-1 border-t border-white/5">
            <Link
              href={`/products/${product.slug}`}
              className="col-span-3 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition"
            >
              Chi tiết <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <button
              onClick={handleQuickAdd}
              className="col-span-2 py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center justify-center gap-1 transition shadow-md shadow-cyan-500/20"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
