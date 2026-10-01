'use client';

import React from 'react';
import Image from 'next/image';

const WILD_IMAGES = [
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=700&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&auto=format&fit=crop&q=80',
];

export default function BeastInTheWild() {
  return (
    <section className="w-full bg-[#111111] text-white py-12 sm:py-16">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <p className="text-xs font-black uppercase tracking-widest text-[#00B2FE] flex items-center justify-center gap-1.5">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @TITAN_TECH • COMMUNITY
          </p>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Battlestations in the Wild
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-neutral-400">
            Khoe góc setup của bạn cùng hashtag #TitanSetups trên Instagram & Discord để xuất hiện trên bảng vinh danh và nhận quà độc quyền.
          </p>
        </div>

        {/* Gallery Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {WILD_IMAGES.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded overflow-hidden bg-neutral-900 border border-neutral-800"
            >
              <Image
                src={src}
                alt={`Battlestation Setup ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[11px] font-black uppercase tracking-wider text-white bg-black/75 px-3 py-1 rounded border border-white/20">
                  #TitanSetups
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
