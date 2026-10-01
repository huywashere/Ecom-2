'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Gift, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useCurrencyStore } from '@/store/currency-store';
import { formatPrice } from '@/lib/formatters';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem } = useCartStore();
  const { currency } = useCurrencyStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Thresholds in USD
  const FREE_SHIPPING_THRESHOLD = 100;
  const FREE_GIFT_THRESHOLD = 250;

  const currentTotal = cart.totalPrice;
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - currentTotal);
  const giftRemaining = Math.max(0, FREE_GIFT_THRESHOLD - currentTotal);

  const progressPercent = Math.min(100, Math.round((currentTotal / FREE_GIFT_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="text-base font-black uppercase tracking-tight text-black">
                Giỏ Hàng ({cart.totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-neutral-200 rounded-full text-neutral-500 hover:text-black transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TITAN Free Shipping & Free Tech Gift Progress Bar */}
          <div className="p-4 bg-neutral-100/70 border-b border-neutral-200">
            <div className="text-xs font-black uppercase tracking-tight mb-2 text-center text-neutral-800">
              {currentTotal >= FREE_GIFT_THRESHOLD ? (
                <span className="text-[#FF007A] flex items-center justify-center gap-1.5">
                  <Gift className="w-4 h-4" /> ĐÃ MỞ KHÓA FREE SHIP & LÓT CHUỘT TITAN PRO!
                </span>
              ) : currentTotal >= FREE_SHIPPING_THRESHOLD ? (
                <span className="text-[#00B2FE] flex items-center justify-center gap-1.5">
                  <Truck className="w-4 h-4" /> ĐÃ MỞ KHÓA FREE SHIP! Thêm {formatPrice(giftRemaining, currency)} nhận Lót Chuột Pro!
                </span>
              ) : (
                <span>
                  Thêm <strong className="text-black font-extrabold">{formatPrice(shippingRemaining, currency)}</strong> để nhận <strong className="text-[#00B2FE]">FREE SHIPPING</strong>!
                </span>
              )}
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#00B2FE] via-[#00B2FE] to-[#FF007A] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-500 mt-1.5">
              <span>$100 FREE SHIP</span>
              <span>$250 PRO MOUSEPAD</span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-100">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-black">Giỏ Hàng Đang Trống</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    Khám phá ngay MacBook Pro M3, Custom RTX 4090 Rigs, và Màn hình OLED đỉnh cao!
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-wider transition"
                >
                  Xem Sản Phẩm Bán Chạy
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="pt-3 first:pt-0 flex gap-3.5">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 relative bg-neutral-100 rounded shrink-0 overflow-hidden border border-neutral-200">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <Link
                            href={`/products/${item.productSlug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-black uppercase text-black hover:text-[#00B2FE] transition truncate"
                          >
                            {item.productName}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-500 transition p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.variantName && (
                          <p className="text-[11px] text-neutral-500 font-semibold mt-0.5">
                            {item.variantName}
                          </p>
                        )}
                        <p className="text-xs font-black text-black mt-1">
                          {formatPrice(item.price, currency)}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-neutral-300 rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-black text-black min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-100 text-neutral-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-neutral-500 ml-auto">
                          Subtotal: {formatPrice(item.subtotal, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Free Tech Mousepad Bonus Card if unlocked */}
                {currentTotal >= FREE_GIFT_THRESHOLD && (
                  <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center gap-3">
                    <div className="w-12 h-12 relative bg-neutral-200 rounded overflow-hidden shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&auto=format&fit=crop&q=80"
                        alt="TITAN Pro Gaming Mousepad"
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase text-[#FF007A] bg-pink-100 px-1.5 py-0.5 rounded">
                        QUÀ TẶNG ĐỘC QUYỀN
                      </span>
                      <p className="text-xs font-black text-black uppercase truncate mt-0.5">Lót Chuột TITAN Pro Speed (900x400mm)</p>
                      <p className="text-xs font-bold text-green-600">MIỄN PHÍ (Trị giá $35.00)</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Checkout Button */}
          {cart.items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-white space-y-3">
              <div className="flex items-center justify-between text-sm font-black uppercase text-black">
                <span>Estimated Subtotal</span>
                <span>{formatPrice(cart.totalPrice, currency)}</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Taxes and shipping calculated at checkout.
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-widest text-center transition flex items-center justify-center gap-2"
                >
                  Checkout • {formatPrice(cart.totalPrice, currency)} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black font-bold uppercase text-xs tracking-wider text-center transition"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
