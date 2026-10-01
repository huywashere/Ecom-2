'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatVND } from '@/lib/formatters';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md h-full bg-slate-950 border-l border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-white text-base">Giỏ hàng của bạn ({cart.totalItems})</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">Giỏ hàng hiện đang trống</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl transition"
              >
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white truncate">{item.productName}</h3>
                    <p className="text-xs text-slate-400 truncate">{item.variantName}</p>
                    <p className="text-sm font-bold text-cyan-400 mt-1">{formatVND(item.price)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 bg-slate-800/80 rounded-lg p-0.5 border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-cyan-400 text-slate-400 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-cyan-400 text-slate-400 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Tạm tính:</span>
              <span className="text-lg font-bold text-white">{formatVND(cart.totalPrice)}</span>
            </div>
            <p className="text-[11px] text-slate-500">Miễn phí giao hàng trên toàn quốc.</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl text-center transition"
              >
                Xem chi tiết giỏ
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
              >
                Thanh toán <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
