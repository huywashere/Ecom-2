'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'TOYS',
    subtitle: 'MrBeast Lab Mutators',
    href: '/products?category=mrbeast-lab',
    image: 'https://mrbeast.store/cdn/shop/files/Single_4x_Category_-_toys.png?v=1788878774&width=800',
  },
  {
    title: 'APPAREL',
    subtitle: 'Youth & Adult Styles',
    href: '/products?category=youth',
    image: 'https://mrbeast.store/cdn/shop/files/Single_4x_Category_-_apparel.png?v=1788878774&width=800',
  },
  {
    title: 'ATHLETICS',
    subtitle: 'Jerseys, Shorts & Gear',
    href: '/products?category=beast-athletics',
    image: 'https://mrbeast.store/cdn/shop/files/Single_4x_Category_-_athletics.png?v=1788878774&width=800',
  },
  {
    title: 'FEASTABLES',
    subtitle: 'Chocolate, Gummies & Cups',
    href: '/products?category=feastables',
    image: 'https://mrbeast.store/cdn/shop/files/Single_4x_Category_-_feastables.png?v=1788878774&width=800',
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
            className="group relative rounded overflow-hidden aspect-[4/5] bg-neutral-100 flex flex-col justify-end p-4 border border-neutral-200"
          >
            {/* Category Image */}
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, 25vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

            {/* Content Button */}
            <div className="relative z-10 w-full flex items-center justify-between">
              <span className="px-4 py-2 bg-white text-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-md group-hover:bg-[#00B2FE] transition-colors flex items-center gap-1">
                {cat.title} <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
