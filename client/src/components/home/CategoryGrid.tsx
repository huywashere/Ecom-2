import React from 'react';
import Link from 'next/link';
import { Laptop, Smartphone, Monitor, Headphones, Keyboard, Cpu, ArrowUpRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'laptop':
        return <Laptop className="w-7 h-7 text-blue-400" />;
      case 'dien-thoai':
        return <Smartphone className="w-7 h-7 text-emerald-400" />;
      case 'man-hinh':
        return <Monitor className="w-7 h-7 text-cyan-400" />;
      case 'tai-nghe':
        return <Headphones className="w-7 h-7 text-purple-400" />;
      case 'ban-phim-chuot':
        return <Keyboard className="w-7 h-7 text-amber-400" />;
      default:
        return <Cpu className="w-7 h-7 text-rose-400" />;
    }
  };

  return (
    <section className="my-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Danh Mục <span className="text-cyan-400">Nổi Bật</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Khám phá các dòng thiết bị điện tử tiên tiến nhất</p>
        </div>
        <Link href="/products" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
          Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col items-center text-center justify-between min-h-[140px] relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              {getIcon(cat.slug)}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition mt-3">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {cat.description || 'Chính hãng'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
