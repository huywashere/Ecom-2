'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Plus, Minus, Check } from 'lucide-react';
import PaymentIconsGroup from './PaymentIcons';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [supportOpen, setSupportOpen] = useState(true);
  const [companyOpen, setCompanyOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <footer
      className="layout-footer w-full bg-black text-white bg-no-repeat bg-right-bottom relative border-t border-neutral-900"
      style={{
        backgroundColor: '#000000',
        backgroundImage: 'url(//mrbeast.store/cdn/shop/files/footer-vector.svg?v=1783090451&width=1125)',
        backgroundSize: 'auto 80%',
      }}
    >
      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 xl:px-16 pt-16 sm:pt-20 pb-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column: Sign up & Socialize */}
          <div className="flex flex-col space-y-6 max-w-xl">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Sign up and Save
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 font-medium">
                Be the first to know about our latest drop, discounts, offers, and more!
              </p>
            </div>

            {/* Newsletter form */}
            <div className="pt-2">
              {submitted ? (
                <div className="p-3.5 bg-neutral-900 border border-green-500 rounded text-green-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" /> Cảm ơn bạn đã đăng ký nhận bản tin công nghệ & khuyến mãi từ TITAN TECH!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-white text-black px-4 py-3 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00B2FE]"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs tracking-widest transition shrink-0"
                  >
                    SUBMIT
                  </button>
                </form>
              )}
              <div className="mt-2">
                <Link
                  href="/policies/privacy-policy"
                  className="text-xs text-neutral-400 hover:text-white underline underline-offset-2"
                >
                  Privacy policy
                </Link>
              </div>
            </div>

            {/* SOCIALIZE Section */}
            <div className="pt-6 sm:pt-10 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-white">
                SOCIALIZE
              </h4>
              <ul className="flex items-center gap-4 text-white">
                {/* Facebook */}
                <li>
                  <a
                    href="https://www.facebook.com/mrbeastofficialstore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition p-1 block"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </li>
                {/* Instagram */}
                <li>
                  <a
                    href="https://www.instagram.com/mrbeaststore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition p-1 block"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </li>
                {/* YouTube */}
                <li>
                  <a
                    href="https://www.youtube.com/@mrbeast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition p-1 block"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </li>
                {/* TikTok */}
                <li>
                  <a
                    href="https://www.tiktok.com/@mrbeast.store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition p-1 block"
                    aria-label="TikTok"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                </li>
                {/* Snapchat */}
                <li>
                  <a
                    href="https://www.snapchat.com/@mrbeast.store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition p-1 block"
                    aria-label="Snapchat"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.001 0c-4.49 0-7.79 3.06-7.86 7.4-.04 2.05.7 3.96 1.15 4.8.18.34.22.48.09.68-.13.2-.42.27-.85.34-1.12.18-2.58.55-2.53 1.95.03.95.88 1.46 1.84 1.8.8.28 1.65.43 2.13.78.36.26.43.52.27.87-.29.62-1.37 2.19-2.73 2.45-.44.09-.76.36-.78.68-.02.43.43.76.99.94 1.84.58 3.8.43 5.4.15.5-.09.95-.17 1.44-.06.49-.11.94-.03 1.44.06 1.6.28 3.56.43 5.4-.15.56-.18 1.01-.51.99-.94-.02-.32-.34-.59-.78-.68-1.36-.26-2.44-1.83-2.73-2.45-.16-.35-.09-.61.27-.87.48-.35 1.33-.5 2.13-.78.96-.34 1.81-.85 1.84-1.8.05-1.4-1.41-1.77-2.53-1.95-.43-.07-.72-.14-.85-.34-.13-.2-.09-.34.09-.68.45-.84 1.19-2.75 1.15-4.8-.07-4.34-3.37-7.4-7.86-7.4z" />
                    </svg>
                  </a>
                </li>
                {/* Pinterest */}
                <li>
                  <a
                    href="https://www.pinterest.com/mrbeaststoreofficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition p-1 block"
                    aria-label="Pinterest"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.99-.12-2.51.02-3.6.14-.99.9-4.22.9-4.22s-.23-.46-.23-1.15c0-1.08.63-1.88 1.4-1.88.66 0 .98.5 0 .98 1.09 0 1.22-.78 3.05-.78 3.1 0 1.54 1.13 2.8 2.76 2.8 3.31 0 5.86-3.49 5.86-8.52 0-4.45-3.2-7.56-7.76-7.56-5.29 0-8.39 3.97-8.39 8.06 0 1.6.62 3.31 1.38 4.24.15.18.17.34.13.52-.07.3-.23.94-.26 1.08-.05.18-.16.22-.36.13-1.34-.62-2.18-2.57-2.18-4.14 0-5.74 4.17-11.02 12.04-11.02 6.32 0 11.23 4.5 11.23 10.53 0 6.28-3.96 11.34-9.46 11.34-1.85 0-3.58-.96-4.18-2.1l-1.14 4.34c-.41 1.59-1.53 3.58-2.28 4.8A12 12 0 1 0 12 0z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: SUPPORT & COMPANY Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {/* SUPPORT Column */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setSupportOpen(!supportOpen)}
                className="w-full flex items-center justify-between text-left text-base sm:text-lg font-black uppercase tracking-wider text-white border-b border-neutral-800 pb-3 sm:border-0 sm:pb-0"
              >
                <span>SUPPORT</span>
                <span className="sm:hidden text-neutral-400">
                  {supportOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              <nav className={`${supportOpen ? 'block' : 'hidden'} sm:block`}>
                <ul className="space-y-3 text-xs sm:text-sm font-bold uppercase tracking-tight text-neutral-300">
                  <li>
                    <Link href="/pages/faqs" className="hover:text-white hover:underline transition">
                      FAQS
                    </Link>
                  </li>
                  <li>
                    <Link href="/policies/shipping-policy" className="hover:text-white hover:underline transition">
                      SHIPPING AND RETURNS
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="hover:text-white hover:underline transition">
                      TRACK YOUR ORDERS
                    </Link>
                  </li>
                  <li>
                    <Link href="/policies/refund-policy" className="hover:text-white hover:underline transition">
                      START A RETURN
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/contact-us" className="hover:text-white hover:underline transition">
                      CONTACT US
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* COMPANY Column */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setCompanyOpen(!companyOpen)}
                className="w-full flex items-center justify-between text-left text-base sm:text-lg font-black uppercase tracking-wider text-white border-b border-neutral-800 pb-3 sm:border-0 sm:pb-0"
              >
                <span>COMPANY</span>
                <span className="sm:hidden text-neutral-400">
                  {companyOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              <nav className={`${companyOpen ? 'block' : 'hidden'} sm:block`}>
                <ul className="space-y-3 text-xs sm:text-sm font-bold uppercase tracking-tight text-neutral-300">
                  <li>
                    <Link
                      href="/policies/shipping-policy"
                      className="hover:text-white hover:underline transition"
                    >
                      BẢO HÀNH CHÍNH HÃNG
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?category=gaming-pc"
                      className="hover:text-white hover:underline transition"
                    >
                      CUSTOM RIGS LAB
                    </Link>
                  </li>
                  <li>
                    <Link href="/reviews" className="hover:text-white hover:underline transition">
                      REVIEWS
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/accessibility-policy" className="hover:text-white hover:underline transition">
                      TIÊU CHUẨN KỸ THUẬT
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/reseller-policy" className="hover:text-white hover:underline transition">
                      RESELLER POLICY
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-neutral-800 space-y-6">
          {/* Secure Checkout & Payment Icons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-300">
              <Lock className="w-4 h-4 text-green-500" />
              <span>Secure checkout</span>
            </div>

            {/* Authentic Payment Method Icons */}
            <PaymentIconsGroup />
          </div>

          {/* Legal Links & Copyright */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400 font-medium">
            <p>© 2026, TITAN TECH Store. All Rights Reserved. Hệ Thống Máy Tính & Thiết Bị Điện Tử Flagship.</p>

            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <li>
                <Link href="/policies/refund-policy" className="hover:text-white transition">
                  Refund policy
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy-policy" className="hover:text-white transition">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms-of-service" className="hover:text-white transition">
                  Terms of service
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping-policy" className="hover:text-white transition">
                  Shipping policy
                </Link>
              </li>
              <li>
                <Link href="/policies/contact-information" className="hover:text-white transition">
                  Contact information
                </Link>
              </li>
              <li>
                <Link href="/policies/subscription-policy" className="hover:text-white transition">
                  Cancellation policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
