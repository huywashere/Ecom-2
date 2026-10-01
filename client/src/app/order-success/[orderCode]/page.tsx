'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, PackageCheck, ArrowRight, Home, Phone, QrCode } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderCode = params?.orderCode as string;

  return (
    <div className="py-16 max-w-xl mx-auto text-center space-y-8">
      <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/30 animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
          ĐẶT HÀNG THÀNH CÔNG
        </span>
        <h1 className="text-3xl font-black text-white">Cảm Ơn Bạn Đã Mua Sắm!</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Đơn hàng của bạn đã được ghi nhận vào hệ thống E-TECH. Nhân viên chăm sóc khách hàng sẽ liên hệ xác nhận trong ít phút.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="rounded-3xl glass-panel p-6 border border-white/10 text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs text-slate-400">Mã đơn hàng:</span>
          <span className="text-sm font-mono font-bold text-cyan-400">{orderCode}</span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs text-slate-400">Trạng thái:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">
            Chờ xác nhận & đóng gói
          </span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs text-slate-400">Thời gian giao dự kiến:</span>
          <span className="text-xs font-semibold text-white">Trong vòng 2 giờ (Nội thành)</span>
        </div>

        {/* VietQR Mock preview */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center flex-shrink-0">
            <QrCode className="w-12 h-12 text-black" />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-bold text-white">Quét VietQR tự động qua App Ngân hàng</p>
            <p className="text-slate-400">Nội dung CK: <span className="text-cyan-400 font-mono font-bold">{orderCode}</span></p>
            <p className="text-[10px] text-slate-500">Ngân hàng MBBank - STK: 0988888888</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
        >
          <Home className="w-4 h-4" /> Về trang chủ
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-400/20"
        >
          Tiếp tục mua sắm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="pt-4 text-xs text-slate-400 flex items-center justify-center gap-2">
        <Phone className="w-3.5 h-3.5 text-cyan-400" /> Cần hỗ trợ gấp? Gọi ngay hotline: <strong className="text-white">1800 6868</strong>
      </div>
    </div>
  );
}
