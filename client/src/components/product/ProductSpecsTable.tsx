'use client';

import React from 'react';
import { parseSpecs } from '@/lib/formatters';
import { Cpu, HardDrive, Monitor, Battery, Zap, Layers, Sparkles } from 'lucide-react';

interface ProductSpecsTableProps {
  specificationsJson?: string;
  warrantyMonths?: number;
}

export default function ProductSpecsTable({ specificationsJson, warrantyMonths }: ProductSpecsTableProps) {
  const specs = parseSpecs(specificationsJson);
  const specEntries = Object.entries(specs);

  const getSpecIcon = (key: string) => {
    const lower = key.toLowerCase();
    if (lower.includes('cpu') || lower.includes('chip')) return <Cpu className="w-4 h-4 text-cyan-400" />;
    if (lower.includes('ram') || lower.includes('bộ nhớ') || lower.includes('ổ cứng') || lower.includes('ssd'))
      return <HardDrive className="w-4 h-4 text-purple-400" />;
    if (lower.includes('màn hình') || lower.includes('display')) return <Monitor className="w-4 h-4 text-blue-400" />;
    if (lower.includes('pin') || lower.includes('battery')) return <Battery className="w-4 h-4 text-emerald-400" />;
    if (lower.includes('gpu') || lower.includes('vga') || lower.includes('đồ họa')) return <Zap className="w-4 h-4 text-amber-400" />;
    return <Layers className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="rounded-2xl glass-panel p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <h3 className="font-bold text-white text-base">Thông Số Kỹ Thuật Chi Tiết</h3>
      </div>

      <div className="divide-y divide-white/5">
        {specEntries.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">Đang cập nhật thông số kỹ thuật chi tiết...</p>
        ) : (
          specEntries.map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 py-3 text-xs sm:text-sm hover:bg-white/[0.02] transition rounded-lg px-2">
              <span className="text-slate-400 flex items-center gap-2 font-medium">
                {getSpecIcon(key)} {key}
              </span>
              <span className="col-span-2 text-slate-200 font-normal leading-relaxed">
                {value}
              </span>
            </div>
          ))
        )}

        {warrantyMonths && (
          <div className="grid grid-cols-3 py-3 text-xs sm:text-sm hover:bg-white/[0.02] transition rounded-lg px-2">
            <span className="text-slate-400 flex items-center gap-2 font-medium">
              <Zap className="w-4 h-4 text-cyan-400" /> Thời gian bảo hành
            </span>
            <span className="col-span-2 text-cyan-400 font-semibold">
              {warrantyMonths} tháng chính hãng (1 đổi 1 trong 30 ngày)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
