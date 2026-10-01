'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, Home, Truck, ShieldCheck, ExternalLink, Package } from 'lucide-react';
import { useAdminOrderStore } from '@/store/admin-order-store';
import { useCurrencyStore } from '@/store/currency-store';
import { formatPrice, formatDate } from '@/lib/formatters';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderCode = params?.orderCode as string;
  const { getOrder } = useAdminOrderStore();
  const { currency } = useCurrencyStore();

  const order = getOrder(orderCode);

  return (
    <div className="py-16 max-w-2xl mx-auto space-y-8 px-4 font-sans">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xl animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider">
            XÁC NHẬN ĐƠN HÀNG THÀNH CÔNG
          </span>
          <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight">
            Cảm Ơn Bạn Đã Mua Sắm Tại TITAN TECH!
          </h1>
          <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
            Đơn hàng của bạn đã được ghi nhận và gửi trực tiếp về trung tâm điều phối &amp; trang quản trị Admin của TITAN TECH. Đội ngũ kỹ thuật sẽ chuẩn bị hàng và xuất kho trong thời gian sớm nhất.
          </p>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-left space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Mã Đơn Hàng</span>
            <div className="text-lg font-mono font-black text-cyan-600">#{orderCode}</div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Trạng Thái Đơn</span>
            <div className="mt-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                {order?.orderStatus || 'Đang Xử Lý & Đóng Gói'}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping info */}
        {order && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-100">
            <div>
              <span className="font-bold text-neutral-500 block mb-0.5">Người Nhận Hàng:</span>
              <p className="font-bold text-neutral-900">{order.recipientName}</p>
              <p className="text-neutral-600 font-mono">{order.recipientPhone}</p>
            </div>
            <div>
              <span className="font-bold text-neutral-500 block mb-0.5">Địa Chỉ Giao:</span>
              <p className="text-neutral-800 leading-snug">{order.shippingAddress}</p>
            </div>
          </div>
        )}

        {/* Items List */}
        {order?.items && order.items.length > 0 && (
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Sản Phẩm Đã Đặt:</h4>
            <div className="divide-y divide-neutral-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.imageUrl && (
                      <div className="relative w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                        <Image src={item.imageUrl} alt={item.productName} fill sizes="40px" className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900 truncate">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-[11px] text-neutral-500 truncate">{item.variantName}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-neutral-900">{formatPrice(item.price, currency)}</p>
                    <p className="text-[11px] text-neutral-400 font-mono">SL: x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total info */}
        {order && (
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-sm">
            <span className="font-bold text-neutral-700">Tổng thanh toán:</span>
            <span className="text-lg font-black text-neutral-900">{formatPrice(order.finalAmount, currency)}</span>
          </div>
        )}

        {/* Delivery Guarantee Banner */}
        <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center gap-3">
          <Truck className="w-5 h-5 text-cyan-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-cyan-950">Giao Hàng Siêu Tốc &amp; Kiểm Tra Trước Khi Nhận</p>
            <p className="text-cyan-800 text-[11px]">
              Sản phẩm được đóng thùng chống sốc chuyên dụng TITAN Flagship, giao hỏa tốc 2 - 4 ngày toàn quốc.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          href="/admin"
          className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 border border-slate-700"
        >
          <ExternalLink className="w-4 h-4 text-cyan-400" /> Xem Trong Trang Admin
        </Link>
        <Link
          href="/"
          className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase text-xs tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <Home className="w-4 h-4" /> Về Trang Chủ
        </Link>
        <Link
          href="/products"
          className="px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold uppercase text-xs tracking-wider rounded-xl transition flex items-center justify-center gap-2"
        >
          Tiếp Tục Mua Sắm <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
