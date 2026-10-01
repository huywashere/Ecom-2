'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BRAND_LOGOS = [
  {
    name: 'Beast Athletics',
    href: '/products?category=beast-athletics',
    src: 'https://mrbeast.store/cdn/shop/files/Logo-BeastAthletics.svg?v=1788964977&width=1600',
    width: 170,
    height: 50,
  },
  {
    name: 'MrBeast Lab',
    href: '/products?category=mrbeast-lab',
    src: 'https://mrbeast.store/cdn/shop/files/Logo-MrBeastLabs.svg?v=1788964977&width=1600',
    width: 160,
    height: 50,
  },
  {
    name: 'Feastables',
    href: '/products?category=feastables',
    src: 'https://mrbeast.store/cdn/shop/files/Logo-Feastables_96d2634b-3932-49f9-a8e4-677cd7d409f2.svg?v=1788964977&width=1600',
    width: 170,
    height: 50,
  },
  {
    name: 'Beast Games',
    href: '/products',
    src: 'https://mrbeast.store/cdn/shop/files/Logo-BeastGames.svg?v=1788964977&width=1600',
    width: 165,
    height: 50,
  },
  {
    name: 'Beast by MrBeast',
    href: '/products',
    src: 'https://mrbeast.store/cdn/shop/files/Logo-BeastbyMrBeast.svg?v=1788964977&width=1600',
    width: 180,
    height: 50,
  },
];

export default function BrandLogoMarquee() {
  // Duplicate arrays to create a seamless infinite marquee scroll
  const marqueeItems = [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS];

  return (
    <section className="w-full bg-white border-y border-neutral-200 py-6 sm:py-8 overflow-hidden select-none group">
      <div className="relative w-full flex overflow-hidden">
        {/* Infinite scrolling track */}
        <div className="flex w-max items-center gap-12 sm:gap-16 lg:gap-24 animate-marquee will-change-transform group-hover:[animation-play-state:paused]">
          {marqueeItems.map((logo, index) => (
            <Link
              key={`${logo.name}-${index}`}
              href={logo.href}
              className="shrink-0 transition-opacity duration-300 hover:opacity-60 flex items-center justify-center px-2"
              aria-label={logo.name}
            >
              <div className="relative h-10 sm:h-12 w-32 sm:w-44 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-full max-w-full object-contain filter grayscale contrast-125"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
