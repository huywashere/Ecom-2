'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { useCartStore } from '@/store/cart-store';
import { useCurrencyStore } from '@/store/currency-store';

interface ProductCardProps {
  product: Product;
  secondaryImage?: string;
  badge?: string;
}

export default function ProductCard({ product, secondaryImage, badge }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { currency } = useCurrencyStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('YM');
  const [isAdded, setIsAdded] = useState(false);

  const isSoldOut = product.totalStock === 0;
  const isSale = product.originalPrice && product.originalPrice > product.minPrice;

  const defaultSizes = product.categorySlug === 'youth'
    ? ['YS (6/7)', 'YM (8/9)', 'YL (10/11)', 'YXL (12/13)']
    : ['SM', 'MD', 'LG', 'XL', '2XL'];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;

    addItem(
      product,
      {
        id: product.id * 100 + 1,
        sku: `${product.slug}-${selectedSize}`,
        variantName: `Size: ${selectedSize}`,
        price: product.minPrice,
        originalPrice: product.originalPrice,
        stockQuantity: product.totalStock || 20,
        active: true,
        imageUrl: product.thumbnail,
      },
      1
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div
      className="group relative flex flex-col justify-between bg-white border border-neutral-200 rounded overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-[#F7F7F8] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {isSoldOut ? (
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase tracking-wider">
              OUT OF STOCK
            </span>
          ) : badge ? (
            <span className="px-2 py-0.5 bg-[#FF007A] text-white text-[10px] font-black uppercase tracking-wider">
              {badge}
            </span>
          ) : isSale ? (
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase tracking-wider">
              SALE
            </span>
          ) : product.featured ? (
            <span className="px-2 py-0.5 bg-[#00B2FE] text-black text-[10px] font-black uppercase tracking-wider">
              NEW
            </span>
          ) : null}
        </div>

        {/* Primary Image */}
        {product.thumbnail && (
          <Image
            src={secondaryImage && isHovered ? secondaryImage : product.thumbnail}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
            {product.categoryName || 'MrBeast Official'}
          </p>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-black uppercase text-black line-clamp-2 hover:text-[#00B2FE] transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-black text-black">
              {formatPrice(product.minPrice, currency)}
            </span>
            {isSale && (
              <span className="text-xs text-neutral-400 font-bold line-through">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Quick Size Select Swatches */}
          {!isSoldOut && (
            <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar mb-2">
              {defaultSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-1.5 py-0.5 text-[10px] font-black uppercase rounded border transition shrink-0 ${
                    selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isSoldOut}
            className={`w-full py-2.5 px-3 text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
              isSoldOut
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : isAdded
                ? 'bg-green-600 text-white'
                : 'bg-black hover:bg-neutral-800 text-white'
            }`}
          >
            {isSoldOut ? (
              'Sold Out'
            ) : isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
