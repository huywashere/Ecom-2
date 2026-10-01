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
      <div className="flex items-center gap-2 font-black tracking-tighter">
        <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
          <path d="M8.72 17.65c-2.45-.45-4.48-2.07-5.26-4.2C3.1 12.48 3 11.52 3 10.5c0-4.14 3.36-7.5 7.5-7.5 1.5 0 2.91.44 4.09 1.2-1.2.66-2.28 1.56-3.18 2.65-.63-.22-1.3-.35-2.01-.35-3.04 0-5.5 2.46-5.5 5.5 0 1.25.42 2.4 1.12 3.32.78-1.57 2.1-2.8 3.74-3.48-.04.28-.06.56-.06.86 0 2.49 2.01 4.5 4.5 4.5.3 0 .58-.03.86-.09-.68 1.64-1.91 2.96-3.48 3.74-.92.7-2.07 1.12-3.32 1.12-1.02 0-1.98-.1-2.95-.46 2.13.78 4.16.81 5.37.37zM16.92 5.5c2.51 1.74 4.08 4.67 4.08 7.9 0 4.2-2.73 7.76-6.55 8.99-1.28.41-3.69.41-4.97 0 2.65-1.42 4.63-3.79 5.43-6.69.69.19 1.42.3 2.19.3 2.48 0 4.5-2.02 4.5-4.5 0-2.24-1.64-4.1-3.78-4.44.75-.54 1.56-.99 2.42-1.32.22-.09.46-.17.68-.24z" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="text-xl leading-none font-black tracking-widest">NVIDIA</span>
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
      <div className="flex items-center gap-2 font-black tracking-tighter">
        <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
          <path d="M12.002 2L1.87 7.85v8.3L12.002 22l10.13-5.85v-8.3L12.002 2zm0 2.31l7.85 4.53v6.32l-7.85 4.53-7.85-4.53V8.84l7.85-4.53zM7.2 10.2l4.8 2.77 4.8-2.77v3.6l-4.8 2.77-4.8-2.77v-3.6z" />
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
        <svg className="w-7 h-7 fill-current text-black" viewBox="0 0 170 170">
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
        <svg className="w-8 h-8 fill-current text-[#00FF00]" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5h-2v-5h2v5zm0-7h-2V8.5h2V10.5z" />
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
      <div className="flex items-center gap-1.5 font-black">
        <span className="text-2xl font-black tracking-tighter text-[#00B8FC]">G</span>
        <span className="text-lg font-black tracking-widest text-black">LOGITECH</span>
      </div>
    ),
  },
  {
    name: 'Corsair',
    tagline: 'PERFORMANCE',
    href: '/products?search=Corsair',
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
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
      <div className="flex items-center gap-1 font-black">
        <span className="text-xl font-black tracking-tight text-neutral-900 border-2 border-black px-2 py-0.5 rounded">KEYCHRON</span>
      </div>
    ),
  },
  {
    name: 'Samsung',
    tagline: 'ODYSSEY',
    href: '/products?search=Samsung',
    renderLogo: () => (
      <div className="flex items-center">
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
