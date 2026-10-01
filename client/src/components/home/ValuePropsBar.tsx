'use client';

import React from 'react';
import { Truck, RotateCcw, Heart } from 'lucide-react';

export default function ValuePropsBar() {
  return (
    <section className="w-full bg-[#111111] text-white border-y border-neutral-800 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 divide-x divide-neutral-800 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B2FE] shrink-0" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
              FREE SHIP $75+
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF007A] shrink-0" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
              30-DAY RETURNS
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFDF00] shrink-0" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
              1% DONATED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
