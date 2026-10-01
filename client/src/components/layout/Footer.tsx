'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="w-full bg-[#111111] text-white border-t border-neutral-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. Value Props Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-neutral-800 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-6 h-6 text-[#00B2FE]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Free US Shipping $75+</h4>
            <p className="text-[11px] text-neutral-400">Fast worldwide delivery available</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RotateCcw className="w-6 h-6 text-[#FF007A]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">30-Day Returns</h4>
            <p className="text-[11px] text-neutral-400">Hassle-free return policy</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#FFDF00]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">100% Official Merch</h4>
            <p className="text-[11px] text-neutral-400">The ONLY official store worldwide</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Heart className="w-6 h-6 text-[#00B2FE]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">1% Donated</h4>
            <p className="text-[11px] text-neutral-400">Supporting Beast Philanthropy</p>
          </div>
        </div>

        {/* 2. Newsletter & Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Newsletter Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-block px-2 py-0.5 bg-[#FF007A] text-white text-[10px] font-black uppercase tracking-widest">
              BEAST ARMY EXCLUSIVE
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">
              GET 10% OFF YOUR FIRST DROP
            </h3>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
              Sign up for early access to limited merch drops, secret restocks, and exclusive Beast giveaways.
            </p>

            {subscribed ? (
              <div className="p-3 bg-neutral-900 border border-green-500/50 rounded flex items-center gap-2 text-green-400 text-xs font-bold">
                <Check className="w-4 h-4" /> Welcome to the Beast Army! Code BEAST10 has been applied.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-neutral-900 border border-neutral-700 px-4 py-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-black uppercase tracking-wider transition flex items-center gap-1 shrink-0"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Nav Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Shop */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-white">Shop</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><Link href="/products?category=new" className="hover:text-white transition">New Arrivals</Link></li>
                <li><Link href="/products?category=youth" className="hover:text-white transition">Youth Apparel</Link></li>
                <li><Link href="/products?category=adults" className="hover:text-white transition">Adult Apparel</Link></li>
                <li><Link href="/products?category=beast-athletics-football" className="hover:text-white transition">Football Collection</Link></li>
                <li><Link href="/products?category=beast-athletics" className="hover:text-white transition">Sports & Fitness</Link></li>
                <li><Link href="/products?category=feastables" className="hover:text-white transition">Feastables</Link></li>
                <li><Link href="/products?category=mrbeast-lab" className="hover:text-white transition">MrBeast Lab</Link></li>
              </ul>
            </div>

            {/* Column 2: Help & Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-white">Help & Info</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><Link href="/policies/shipping-policy" className="hover:text-white transition">Shipping Policy</Link></li>
                <li><Link href="/policies/refund-policy" className="hover:text-white transition">Refund & Returns</Link></li>
                <li><Link href="/policies/terms-of-service" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/policies/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/policies/contact-information" className="hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 3: The Beast Universe */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-white">The Beast Universe</h4>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li>
                  <a href="https://www.beastphilanthropy.org" target="_blank" rel="noreferrer" className="hover:text-white transition">
                    Beast Philanthropy
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@MrBeast" target="_blank" rel="noreferrer" className="hover:text-white transition">
                    MrBeast YouTube
                  </a>
                </li>
                <li>
                  <a href="https://feastables.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
                    Feastables Store
                  </a>
                </li>
                <li>
                  <Link href="/products/the-most-dangerous-games-book" className="hover:text-white transition">
                    $1,000,000 Book Game
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026, MrBeast.store Powered by Shopify. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">SECURE CHECKOUT</span>
            <div className="flex items-center gap-2 opacity-80">
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-black text-neutral-300">VISA</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-black text-neutral-300">MC</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-black text-neutral-300">AMEX</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-black text-neutral-300">PAYPAL</span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-black text-neutral-300">APPLE PAY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
