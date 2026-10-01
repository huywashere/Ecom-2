'use client';

import React from 'react';
import Link from 'next/link';

interface TechBrand {
  name: string;
  tagline: string;
  href: string;
  renderLogo: () => React.ReactNode;
}

const TECH_BRANDS: TechBrand[] = [
  {
    name: 'NVIDIA',
    tagline: 'GEFORCE RTX',
    href: '/products?search=NVIDIA',
    renderLogo: () => (
      <div className="flex items-center gap-2.5">
        <svg className="w-9 h-8" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M48.2 68.2C35.1 66.8 24.3 58.1 19.8 45.4C18.4 41.5 18.2 38.6 18.2 30.2C18.2 18.4 25.1 8.2 35.8 4.2C38.9 3 43.1 2.2 46.2 2.2C48.6 2.2 49 2.5 47.4 3.7C41.7 8.2 37.8 14.1 36.2 20.8C35.1 25.3 35.3 34.3 36.6 38.7C39.6 48.9 47.9 56.4 58.2 58.2C64.3 59.2 71.9 57.6 77 54.2C78.4 53.3 78.7 53.5 78.2 54.9C75.2 62.7 68.3 68.1 59.8 69.4C56.6 69.8 51.3 69.4 48.2 68.2ZM62.9 44.5C57.4 43.5 53.1 39.5 51.4 34.1C50.2 30.1 50.9 25.2 53.4 21.6C55.4 18.7 58.7 16.7 62.2 16.2C64 15.9 67.5 16.5 69.3 17.5C73.4 19.8 75.9 23.9 76.1 28.6C76.3 34.3 72.8 39.7 67.4 42.1C65.5 43 64.4 43.2 62.9 44.5ZM86.7 13.9C85.5 14.3 84.8 14 85.3 13.3C93.3 1.9 107.5 -2.7 119.8 2.2C121 2.7 121.1 3 120.3 3.6C112.9 8.8 107.4 16.1 104.9 24.8C103.1 31.4 103.5 41.5 105.8 48C108.5 55.4 113.8 62.1 120.3 66.2C121.2 66.8 121.1 67.1 119.8 67.6C108.9 71.9 96.6 68.6 88.5 59.4C83.9 54.2 81.3 48.2 80.4 41.1C79.8 36.4 80.4 30.7 82 25.4C83.7 20 86.4 15.2 86.7 13.9Z"
            fill="#76B900"
          />
        </svg>
        <div className="flex flex-col text-left">
          <span className="text-xl leading-none font-black tracking-widest text-black">NVIDIA</span>
          <span className="text-[9px] font-bold text-neutral-500 tracking-wider">GEFORCE RTX</span>
        </div>
      </div>
    ),
  },
  {
    name: 'ASUS ROG',
    tagline: 'REPUBLIC OF GAMERS',
    href: '/products?search=ASUS',
    renderLogo: () => (
      <div className="flex items-center gap-2.5">
        {/* Authentic ASUS Republic of Gamers Eye Logo */}
        <svg className="w-10 h-8" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M96.5 24.2C92.4 20.1 84.2 17.5 72.5 18.2C58.1 19.1 46.2 27.2 38.4 37.1C32.1 45.1 28.2 54.2 25.1 64.2C27.2 62.1 32.1 60.2 38.1 60.2C48.2 60.2 58.1 66.1 65.2 72.1C75.1 64.2 84.1 52.2 90.1 40.2C94.2 32.1 96.5 26.2 96.5 24.2ZM62.2 52.1C56.1 52.1 50.1 48.1 46.2 42.1C52.1 36.1 60.1 32.1 68.2 32.1C72.1 32.1 76.1 34.1 80.1 36.1C76.1 44.1 70.1 50.1 62.2 52.1Z"
            fill="#FF0055"
          />
          <path
            d="M22.1 40.1C20.1 34.1 16.1 30.1 10.1 28.1C6.1 27.1 3.1 27.1 2.1 28.1C6.1 36.1 12.1 50.1 18.1 60.1C19.1 54.1 20.1 47.1 22.1 40.1Z"
            fill="#FF0055"
          />
        </svg>
        <div className="flex flex-col text-left">
          <span className="text-xl leading-none font-black tracking-widest text-[#FF0055]">ROG</span>
          <span className="text-[8px] font-extrabold text-neutral-500 tracking-widest">REPUBLIC OF GAMERS</span>
        </div>
      </div>
    ),
  },
  {
    name: 'Apple',
    tagline: 'SILICON',
    href: '/products?search=Apple',
    renderLogo: () => (
      <div className="flex items-center gap-2 font-black">
        {/* Authentic Apple Silhouette */}
        <svg className="w-7 h-7 fill-current text-black" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.8-11.89-14.28-5.74-8.8-10.28-18.77-13.62-29.91-3.34-11.14-5.01-21.75-5.01-31.84 0-14.33 3.69-26.23 11.07-35.7 7.38-9.47 16.59-14.3 27.63-14.49 4.35 0 9.28 1.14 14.78 3.42 5.51 2.28 9.28 3.51 11.32 3.7 1.84-.2 5.86-1.5 12.06-3.9 6.2-2.4 11.55-3.47 16.06-3.21 12.22.65 21.94 4.96 29.17 12.93-10.66 6.42-15.89 15.17-15.69 26.25.2 8.6 3.48 15.93 9.85 22 6.37 6.07 14.15 9.47 23.34 10.2-2.22 6.53-4.94 13.43-8.15 20.7zM119.22 33.15c0-6.93 2.5-13.51 7.5-19.74 5-6.23 11.23-10.54 18.69-12.93.87 3.92.79 7.9-.24 11.95-1.03 4.05-2.91 8.01-5.64 11.89-2.83 3.92-6.19 6.94-10.09 9.07-3.9 2.13-7.51 3.22-10.83 3.28-.22-1.15-.33-2.32-.39-3.52z" />
        </svg>
        <span className="text-xl font-bold tracking-tight text-black">Apple</span>
      </div>
    ),
  },
  {
    name: 'Sony',
    tagline: 'AUDIO',
    href: '/products?search=Sony',
    renderLogo: () => (
      <div className="flex items-center">
        <span className="text-2xl font-serif font-black tracking-[0.25em] text-black">SONY</span>
      </div>
    ),
  },
  {
    name: 'Razer',
    tagline: 'FOR GAMERS',
    href: '/products?search=Razer',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        {/* Authentic Razer Triple-Headed Snake Logo */}
        <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Authentic Razer Triple-Headed Triskelion Snake vector in Razer Chroma Green */}
          <path
            d="M50 12C48.2 12 46.5 12.8 45.4 14.2L32 30.5C30.2 32.7 29.8 35.8 30.9 38.4C32.1 41.1 34.6 42.8 37.5 42.8H42V58H34.5C31.5 58 28.9 59.8 27.8 62.6C26.7 65.3 27.3 68.4 29.4 70.4L42.5 83.5C44.5 85.5 47.6 86.1 50.3 85C53.1 83.9 54.9 81.3 54.9 78.3V66H63.5C66.5 66 69.1 64.2 70.2 61.4C71.3 58.7 70.7 55.6 68.6 53.6L55.5 40.5C53.5 38.5 50.4 37.9 47.7 39C45 40.1 43.1 42.7 43.1 45.7V50H51V34H43.5C40.5 34 37.9 32.2 36.8 29.4C35.7 26.7 36.3 23.6 38.4 21.6L46.5 13.5C47.5 12.5 48.7 12 50 12Z"
            fill="#00FF00"
          />
          <path
            d="M50 2C23.5 2 2 23.5 2 50C2 76.5 23.5 98 50 98C76.5 98 98 76.5 98 50C98 23.5 76.5 2 50 2ZM50 8C73.2 8 92 26.8 92 50C92 73.2 73.2 92 50 92C26.8 92 8 73.2 8 50C8 26.8 26.8 8 50 8Z"
            fill="#00FF00"
            opacity="0.15"
          />
          {/* Distinctive Snake Curves */}
          <path
            d="M50 20C42 20 34 26 34 34C34 42 42 46 48 50C54 54 58 58 58 64C58 72 50 78 42 78M50 20C58 20 66 26 66 34C66 42 58 46 52 50C46 54 42 58 42 64C42 72 50 78 58 78"
            stroke="#00FF00"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-2xl font-black tracking-widest text-black">RAZER</span>
      </div>
    ),
  },
  {
    name: 'Logitech G',
    tagline: 'PRO GAMING',
    href: '/products?search=Logitech',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        {/* Authentic Logitech G Esports Mark */}
        <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 12C29 12 12 29 12 50C12 71 29 88 50 88C71 88 88 71 88 50H48V63H72C67.5 73.5 58 76.5 50 76.5C35.5 76.5 24.5 64.5 24.5 50C24.5 35.5 35.5 23.5 50 23.5C60.5 23.5 68 28.5 72.5 35.5L82 24.5C74.5 16.5 63 12 50 12Z"
            fill="#00B8FC"
          />
        </svg>
        <div className="flex flex-col text-left">
          <span className="text-lg font-black tracking-widest text-black leading-none">LOGITECH</span>
          <span className="text-[10px] font-black text-[#00B8FC] tracking-wider">G PRO</span>
        </div>
      </div>
    ),
  },
  {
    name: 'Corsair',
    tagline: 'PERFORMANCE',
    href: '/products?search=Corsair',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        {/* Authentic Corsair Wind Sails Logo */}
        <svg className="w-8 h-8" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top Sail */}
          <path
            d="M48 6C48 6 52 26 70 38C52 38 48 22 48 6Z"
            fill="#000000"
          />
          {/* Middle Sail */}
          <path
            d="M20 26C20 26 36 44 68 50C48 54 28 42 20 26Z"
            fill="#000000"
          />
          {/* Bottom Hull Sail */}
          <path
            d="M10 56C10 56 36 72 90 64C56 82 24 76 10 56Z"
            fill="#000000"
          />
        </svg>
        <span className="text-xl font-black tracking-widest text-black">CORSAIR</span>
      </div>
    ),
  },
  {
    name: 'Keychron',
    tagline: 'MECHANICAL',
    href: '/products?search=Keychron',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        {/* Authentic Keychron Mechanical Keycap & Switch Stem */}
        <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="36" height="36" rx="8" fill="#18181B" stroke="#000000" strokeWidth="1.5" />
          <rect x="7" y="7" width="26" height="26" rx="5" fill="#27272A" />
          {/* MX Stem Cross in Keychron Accent Orange */}
          <rect x="18" y="11" width="4" height="18" rx="1.5" fill="#FF5E00" />
          <rect x="11" y="18" width="18" height="4" rx="1.5" fill="#FF5E00" />
        </svg>
        <span className="text-2xl font-black tracking-tight text-black">Keychron</span>
      </div>
    ),
  },
  {
    name: 'Samsung',
    tagline: 'ODYSSEY',
    href: '/products?search=Samsung',
    renderLogo: () => (
      <div className="flex items-center">
        {/* Authentic Samsung Oval Badge & Wordmark */}
        <span className="text-2xl font-black tracking-[0.2em] text-[#034EA2]">SAMSUNG</span>
      </div>
    ),
  },
];

export default function BrandLogoMarquee() {
  // Duplicate arrays to create a seamless infinite marquee scroll
  const marqueeItems = [...TECH_BRANDS, ...TECH_BRANDS, ...TECH_BRANDS, ...TECH_BRANDS];

  return (
    <section className="w-full bg-white border-y border-neutral-200 py-6 sm:py-8 overflow-hidden select-none group">
      <div className="relative w-full flex overflow-hidden">
        {/* Infinite scrolling track */}
        <div className="flex w-max items-center gap-12 sm:gap-16 lg:gap-24 animate-marquee will-change-transform group-hover:[animation-play-state:paused]">
          {marqueeItems.map((brand, index) => (
            <Link
              key={`${brand.name}-${index}`}
              href={brand.href}
              className="shrink-0 transition-opacity duration-300 hover:opacity-60 flex items-center justify-center px-4"
              aria-label={brand.name}
            >
              <div className="h-10 sm:h-12 flex items-center justify-center">
                {brand.renderLogo()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
