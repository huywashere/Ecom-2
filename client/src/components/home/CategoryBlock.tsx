'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'LAPTOPS & MAC',
    subtitle: 'M3 Max, ROG Zephyrus & Workstations',
    href: '/products?category=laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'CUSTOM GAMING PC',
    subtitle: 'RTX 4090 Liquid Cooled Battlestations',
    href: '/products?category=gaming-pc',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'OLED MONITORS',
    subtitle: '4K QD-OLED & UltraWide 240Hz Displays',
    href: '/products?category=monitors',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'PRO GEAR & AUDIO',
    subtitle: 'Mechanical Keyboards, Mice & Hi-Fi',
    href: '/products?category=keyboards',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
  },
];

export default function CategoryBlock() {
  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-8 sm:py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            href={cat.href}
            className="group relative rounded overflow-hidden aspect-[4/5] bg-neutral-900 flex flex-col justify-end p-5 border border-neutral-800"
          >
            {/* Category Image */}
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
              sizes="(max-width: 640px) 50vw, 25vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:opacity-80" />

            {/* Content Box */}
            <div className="relative z-10 w-full flex flex-col items-start gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-neutral-300 line-clamp-1">
                {cat.subtitle}
              </span>
              <span className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white text-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-md group-hover:bg-[#00B2FE] group-hover:text-black transition-colors flex items-center gap-1.5">
                {cat.title} <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
