'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Home, Truck, ShieldCheck } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderCode = params?.orderCode as string;

  return (
    <div className="py-16 max-w-xl mx-auto text-center space-y-8 px-4">
      <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-widest">
          ORDER CONFIRMED
        </span>
        <h1 className="text-3xl font-black uppercase text-black">Thank You for Your Order!</h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto font-medium">
          Your order has been received by the official MrBeast store fulfillment warehouse. You will receive a shipment notification with live tracking once it leaves our facility.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="rounded border border-neutral-200 bg-white p-6 text-left space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <span className="text-xs font-bold text-neutral-500 uppercase">Order Number:</span>
          <span className="text-sm font-mono font-black text-black">#{orderCode}</span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <span className="text-xs font-bold text-neutral-500 uppercase">Status:</span>
          <span className="px-2.5 py-0.5 rounded bg-green-100 text-green-800 text-[11px] font-black uppercase">
            Paid &amp; Processing
          </span>
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <span className="text-xs font-bold text-neutral-500 uppercase">Estimated Delivery:</span>
          <span className="text-xs font-black text-black">3 - 5 Business Days</span>
        </div>

        <div className="p-4 rounded bg-neutral-50 border border-neutral-200 flex items-center gap-3">
          <Truck className="w-5 h-5 text-[#00B2FE] shrink-0" />
          <div className="text-xs">
            <p className="font-black uppercase text-black">Fast Dispatch Guaranteed</p>
            <p className="text-neutral-500 text-[11px]">We ship directly from Greenville, NC with official Beast packaging.</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Link
          href="/"
          className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-wider rounded transition flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
        <Link
          href="/products"
          className="px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-black font-black uppercase text-xs tracking-wider rounded transition flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
