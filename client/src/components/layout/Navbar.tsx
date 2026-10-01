'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useSearchStore } from '@/store/search-store';
import { useCurrencyStore } from '@/store/currency-store';
import { CurrencyCode, CURRENCY_RATES } from '@/lib/formatters';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, setIsOpen: setCartOpen } = useCartStore();
  const { openSearch } = useSearchStore();
  const { currency, setCurrency } = useCurrencyStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [cartBadgeBump, setCartBadgeBump] = useState(false);

  // Animate cart badge when totalItems changes
  useEffect(() => {
    if (cart.totalItems > 0) {
      setCartBadgeBump(true);
      const timer = setTimeout(() => setCartBadgeBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cart.totalItems]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const subNavLinks = [
    { label: 'New Arrivals', href: '/products?category=new' },
    { label: 'Youth Apparel', href: '/products?category=youth' },
    { label: 'Adult Apparel', href: '/products?category=adults' },
    { label: 'Sports & Fitness', href: '/products?category=beast-athletics' },
    { label: 'School & Office', href: '/products?category=school-office' },
    { label: 'Toys', href: '/products?category=mrbeast-lab' },
    { label: 'Book', href: '/products/the-most-dangerous-games-book' },
    { label: 'Feastables', href: '/products?category=feastables' },
  ];

  const currencies: CurrencyCode[] = ['USD', 'VND', 'EUR', 'GBP'];

  return (
    <header className="sticky top-0 z-40 w-full bg-white select-none">
      {/* 1. Announcement Bar */}
      <div className="bg-[#EAEAEA] text-black text-[11px] sm:text-xs font-bold uppercase tracking-wider py-1.5 px-4 border-b border-neutral-200">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4 text-neutral-600 font-semibold text-[11px]">
            <span>1% DONATED TO CHARITY</span>
            <span>•</span>
            <span>30-DAY RETURNS</span>
          </div>

          <div className="flex-1 text-center font-black">
            Free Shipping on Orders over $75
          </div>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 font-black text-[11px] px-2 py-0.5 rounded hover:bg-neutral-200 transition"
              aria-label="Select currency"
            >
              <span>{currency} ({CURRENCY_RATES[currency].symbol})</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {currencyDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCurrencyDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 z-50 w-28 bg-white border border-neutral-200 rounded shadow-xl py-1 text-xs">
                  {currencies.map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between font-bold hover:bg-neutral-100 transition ${
                        currency === curr ? 'text-black bg-neutral-50' : 'text-neutral-600'
                      }`}
                    >
                      <span>{curr} ({CURRENCY_RATES[curr].symbol})</span>
                      {currency === curr && <Check className="w-3.5 h-3.5 text-black" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 pt-2 pb-1.5">
        <div className="bg-white rounded border border-neutral-200 shadow-sm px-4 py-2 flex flex-col gap-2">
          {/* Top Row: Mobile Toggle / Logo / SHOP-LEARN-WATCH / Actions */}
          <div className="flex items-center justify-between h-11">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 lg:hidden text-black hover:bg-neutral-100 rounded transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* MrBeast BEAST Wordmark Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-black text-2xl sm:text-3xl tracking-tighter uppercase text-black group-hover:text-[#00B2FE] transition-colors">
                BEAST
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-black text-white rounded-none">
                STORE
              </span>
            </Link>

            {/* Center Pill Navigation: SHOP / LEARN / WATCH */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <Link
                href="/products"
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition ${
                  pathname.startsWith('/products') || pathname === '/'
                    ? 'bg-neutral-200 text-black'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                SHOP
              </Link>
              <a
                href="https://www.beastphilanthropy.org"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition"
              >
                LEARN
              </a>
              <a
                href="https://www.youtube.com/@MrBeast"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition"
              >
                WATCH
              </a>
            </nav>

            {/* Right Action Icons: Search / User / Cart */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => openSearch()}
                className="p-2 text-black hover:bg-neutral-100 rounded transition"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/login"
                className="p-2 text-black hover:bg-neutral-100 rounded transition hidden xs:flex"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-black hover:bg-neutral-100 rounded transition"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.totalItems > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 bg-black text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
                      cartBadgeBump ? 'scale-125 bg-[#FF007A]' : 'scale-100'
                    }`}
                  >
                    {cart.totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Sub-Navigation Bar (Desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-6 pt-1 border-t border-neutral-100 text-xs font-bold uppercase tracking-tight text-neutral-700">
            {subNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-black hover:underline underline-offset-4 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[88px] z-50 bg-white border-t border-neutral-200 overflow-y-auto p-4 flex flex-col gap-6 animate-in slide-in-from-left duration-200">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">Collections</span>
            {subNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="py-2.5 px-3 text-sm font-black uppercase text-black hover:bg-neutral-100 rounded transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-4 flex flex-col gap-2">
            <span className="text-xs font-black uppercase text-neutral-400 tracking-wider">Explore</span>
            <a
              href="https://www.beastphilanthropy.org"
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3 text-sm font-black uppercase text-black hover:bg-neutral-100 rounded transition"
            >
              LEARN (Philanthropy)
            </a>
            <a
              href="https://www.youtube.com/@MrBeast"
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3 text-sm font-black uppercase text-black hover:bg-neutral-100 rounded transition"
            >
              WATCH (YouTube)
            </a>
            <Link
              href="/login"
              className="py-2 px-3 text-sm font-black uppercase text-black hover:bg-neutral-100 rounded transition"
            >
              My Beast Army Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
