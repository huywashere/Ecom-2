'use client';

import React from 'react';
import { ProductVariant } from '@/types';
import { formatVND } from '@/lib/formatters';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
        Chọn phiên bản cấu hình / Màu sắc:
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {variants.map((v) => {
          const isSelected = selectedVariant?.id === v.id;
          const isOutOfStock = v.stockQuantity <= 0;

          return (
            <button
              key={v.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelect(v)}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-md shadow-cyan-500/10'
                  : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-800/60'
              } ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div>
                <p className="text-xs font-semibold text-white leading-tight">{v.variantName}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-cyan-400 font-bold text-xs">{formatVND(v.price)}</span>
                  {v.originalPrice && v.originalPrice > v.price && (
                    <span className="text-[10px] text-slate-500 line-through">
                      {formatVND(v.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {isOutOfStock ? 'Hết hàng' : `Còn: ${v.stockQuantity} sản phẩm`}
                </p>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-black flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
