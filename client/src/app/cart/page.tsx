'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Truck, Gift, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useCurrencyStore } from '@/store/currency-store';
import { formatPrice } from '@/lib/formatters';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart } = useCartStore();
  const { currency } = useCurrencyStore();
  const [orderNote, setOrderNote] = useState('');

  const FREE_SHIPPING_THRESHOLD = 75;
  const FREE_GIFT_THRESHOLD = 100;

  const currentTotal = cart.totalPrice;
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - currentTotal);
  const giftRemaining = Math.max(0, FREE_GIFT_THRESHOLD - currentTotal);
  const progressPercent = Math.min(100, Math.round((currentTotal / FREE_GIFT_THRESHOLD) * 100));

  if (cart.items.length === 0) {
    return (
      <div className="py-24 max-w-lg mx-auto text-center space-y-6 px-4">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-black">Your Cart is Empty</h1>
          <p className="text-xs text-neutral-500 mt-2">
            Explore the latest MrBeast football drop, athletic tees, and Feastables chocolate bundles.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-neutral-800 transition"
        >
          Shop Best Sellers <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Your Shopping Cart
          </h1>
          <p className="text-xs font-semibold text-neutral-500 mt-1">
            You have <strong className="text-black font-extrabold">{cart.totalItems}</strong> items in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1 font-bold uppercase transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {/* Free Shipping / Free Socks Banner */}
      <div className="p-4 sm:p-5 bg-neutral-50 border border-neutral-200 rounded max-w-3xl">
        <div className="text-xs font-black uppercase tracking-tight mb-2 text-neutral-800">
          {currentTotal >= FREE_GIFT_THRESHOLD ? (
            <span className="text-[#FF007A] flex items-center gap-1.5">
              <Gift className="w-4 h-4" /> YOU UNLOCKED FREE SHIPPING & FREE MRBEAST CAMO SOCKS!
            </span>
          ) : currentTotal >= FREE_SHIPPING_THRESHOLD ? (
            <span className="text-[#00B2FE] flex items-center gap-1.5">
              <Truck className="w-4 h-4" /> YOU UNLOCKED FREE SHIPPING! Add {formatPrice(giftRemaining, currency)} more for FREE SOCKS!
            </span>
          ) : (
            <span>
              You&apos;re <strong className="text-black font-extrabold">{formatPrice(shippingRemaining, currency)}</strong> away from <strong className="text-[#00B2FE]">FREE SHIPPING</strong>!
            </span>
          )}
        </div>
        <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00B2FE] via-[#00B2FE] to-[#FF007A] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="border border-neutral-200 rounded divide-y divide-neutral-200 bg-white">
            {cart.items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                {/* Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 relative bg-neutral-100 rounded overflow-hidden shrink-0 border border-neutral-200">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="text-sm sm:text-base font-black uppercase text-black hover:text-[#00B2FE] transition truncate block"
                  >
                    {item.productName}
                  </Link>
                  {item.variantName && (
                    <p className="text-xs text-neutral-500 font-semibold mt-0.5">{item.variantName}</p>
                  )}
                  <p className="text-xs font-black text-black mt-2">
                    {formatPrice(item.price, currency)} each
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-neutral-100 text-neutral-600 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-black text-black min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-neutral-100 text-neutral-600 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right sm:min-w-[100px]">
                  <span className="text-sm font-black text-black">
                    {formatPrice(item.subtotal, currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Note */}
          <div className="p-4 bg-white border border-neutral-200 rounded space-y-2">
            <label className="text-xs font-black uppercase text-black block">
              Special Instructions / Order Note
            </label>
            <textarea
              rows={2}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Leave a note with your order (optional)..."
              className="w-full text-xs p-3 border border-neutral-200 rounded focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded p-6 space-y-6">
          <h2 className="text-base font-black uppercase text-black pb-3 border-b border-neutral-200">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs font-semibold text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-black font-black">{formatPrice(cart.totalPrice, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className={currentTotal >= FREE_SHIPPING_THRESHOLD ? 'text-green-600 font-black' : 'text-black font-black'}>
                {currentTotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : formatPrice(6.99, currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Taxes</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-between items-baseline">
            <span className="text-sm font-black uppercase text-black">Estimated Total</span>
            <span className="text-2xl font-black text-black">
              {formatPrice(currentTotal >= FREE_SHIPPING_THRESHOLD ? currentTotal : currentTotal + 6.99, currency)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-widest text-center transition flex items-center justify-center gap-2 shadow-md"
          >
            Proceed To Checkout <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="space-y-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
            <p className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-green-600" /> 100% Guaranteed Safe Checkout
            </p>
            <p className="flex items-center gap-1.5 font-bold">
              <Truck className="w-4 h-4 text-[#00B2FE]" /> Fast Worldwide Tracking Included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
