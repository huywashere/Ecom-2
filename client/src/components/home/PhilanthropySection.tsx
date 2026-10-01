'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, ExternalLink } from 'lucide-react';

export default function PhilanthropySection() {
  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-10 sm:py-16">
      <div className="bg-[#18191C] text-white rounded overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Left Content */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B2FE] text-black text-xs font-black uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-black" /> BEAST PHILANTHROPY
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            We Give Back,<br />In a Big Way.
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-medium leading-relaxed max-w-lg">
            We are fully committed to helping alleviate suffering wherever and whenever we are able. Here are some stats on our efforts to alleviate food insecurity and world hunger:
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 py-2 border-y border-neutral-800">
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#FFDF00]">Every $40</p>
              <p className="text-xs text-neutral-400 font-bold uppercase mt-0.5">1 Week of Food Provided</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#00B2FE]">50,383,543+</p>
              <p className="text-xs text-neutral-400 font-bold uppercase mt-0.5">Pounds of Food</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#FF007A]">41,986,285+</p>
              <p className="text-xs text-neutral-400 font-bold uppercase mt-0.5">Meals Delivered</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">7,728,570+</p>
              <p className="text-xs text-neutral-400 font-bold uppercase mt-0.5">Individuals Fed</p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://www.beastphilanthropy.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-neutral-200 text-black font-black uppercase text-xs sm:text-sm tracking-widest transition"
            >
              Learn More <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="lg:col-span-6 relative h-[340px] sm:h-[440px] lg:h-[520px] bg-neutral-900">
          <Image
            src="https://mrbeast.store/cdn/shop/files/we-give-back.png?v=1788880088&width=1000"
            alt="Beast Philanthropy Giving Back"
            fill
            className="object-contain p-6"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
