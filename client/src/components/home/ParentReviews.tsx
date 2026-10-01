'use client';

import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    title: 'Sweat joggers are beautiful!',
    quote: 'The fabric is nice and thick, and the logo quality is excellent. The fabric held up perfectly, no bobbling at all and the color has stayed true over time. Definitely worth it!',
    author: 'Jacqueline C.',
    badge: 'Verified Buyer',
  },
  {
    title: 'My kid was so excited!',
    quote: 'My kiddo loves Mr.Beast and was so stoked when he opened up his hoodie. Shipping was timely and the quality was worth it.',
    author: 'Christina H.',
    badge: 'Verified Buyer',
  },
  {
    title: '8 year old boy approved!!',
    quote: 'Very good quality and has been washed and used daily for my son, he loves it! He is 8 so it takes a beating at school and it’s held up extremely well!',
    author: 'Raimey B.',
    badge: 'Verified Buyer',
  },
];

export default function ParentReviews() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-neutral-200">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <p className="text-xs font-black uppercase tracking-widest text-[#FF007A]">
          LOVED BY PARENTS
        </p>

        <div className="flex items-center justify-center gap-1.5 py-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#FFDF00] text-[#FFDF00]" />
          ))}
          <span className="text-base font-black text-black ml-2">4.9 / 5.0</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
          Trusted by Parents Worldwide
        </h2>

        <p className="text-xs sm:text-sm font-semibold text-neutral-500">
          With over 15,000 5-star reviews, MrBeast merch is engineered for real life and all-day comfort.
        </p>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review, idx) => (
          <div
            key={idx}
            className="p-6 bg-[#F7F7F8] border border-neutral-200 rounded flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFDF00] text-[#FFDF00]" />
                ))}
              </div>
              <h3 className="text-sm font-black uppercase text-black">{review.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-200/80 flex items-center justify-between">
              <span className="text-xs font-black text-black">{review.author}</span>
              <span className="text-[11px] font-bold text-green-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" /> {review.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
