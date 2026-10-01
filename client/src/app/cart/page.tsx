'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatVND } from '@/lib/formatters';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCartStore();

  if (cart.items.length === 0) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-cyan-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Giỏ Hàng Của Bạn Đang Trống</h1>
          <p className="text-xs text-slate-400 mt-2">
            Hãy khám phá các thiết bị công nghệ hàng đầu như MacBook M3, ROG Strix SCAR 18 và iPhone 16 Pro Max.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-black font-extrabold text-xs hover:bg-cyan-300 transition"
        >
          Khám phá sản phẩm ngay <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Giỏ Hàng Công Nghệ
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bạn đang có <strong className="text-cyan-400">{cart.totalItems}</strong> sản phẩm trong giỏ
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl glass-panel p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <Link href={`/products/${item.productSlug}`}>
                    <h3 className="text-sm font-bold text-white hover:text-cyan-400 transition">
                      {item.productName}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-400">{item.variantName}</p>
                  <p className="text-xs text-cyan-400 font-bold sm:hidden">
                    {formatVND(item.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <span className="hidden sm:inline text-xs font-bold text-cyan-400">
                  {formatVND(item.price)}
                </span>

                {/* Counter */}
                <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-1 border border-white/10">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:text-cyan-400 text-slate-400 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:text-cyan-400 text-slate-400 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="text-sm font-extrabold text-white min-w-[100px] text-right">
                  {formatVND(item.subtotal)}
                </span>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 transition"
                  title="Xóa món hàng"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center gap-3 text-xs text-cyan-300">
            <Truck className="w-5 h-5 flex-shrink-0" />
            <span>Đơn hàng của bạn đủ điều kiện nhận <strong>Giao Hàng Hỏa Tốc Miễn Phí</strong> toàn quốc!</span>
          </div>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-6 border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white pb-3 border-b border-white/10">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Tổng tiền hàng:</span>
              <span className="text-white font-semibold">{formatVND(cart.totalPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Phí vận chuyển:</span>
              <span className="text-emerald-400 font-semibold">Miễn phí (0 ₫)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Giảm giá voucher:</span>
              <span className="text-slate-400 font-semibold">0 ₫</span>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Tổng thanh toán:</span>
              <span className="text-xl font-black text-cyan-400">{formatVND(cart.totalPrice)}</span>
            </div>
            <p className="text-[11px] text-slate-500 text-right">(Đã bao gồm thuế VAT)</p>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xl shadow-cyan-500/25"
          >
            Tiến Hành Thanh Toán <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Cam kết hàng chính hãng 100%
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Hỗ trợ đổi trả trong 30 ngày
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
