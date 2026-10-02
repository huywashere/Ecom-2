'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Lock,
  Loader2,
  Check,
  Tag,
  ArrowLeft,
  Truck,
  Gift,
  QrCode,
  Sparkles,
  CheckCircle2,
  X,
  Clock,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useCurrencyStore } from '@/store/currency-store';
import { useAdminOrderStore } from '@/store/admin-order-store';
import { useAdminProductStore } from '@/store/admin-product-store';
import { formatPrice, formatVND } from '@/lib/formatters';
import { orderService } from '@/services/order.service';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { currency } = useCurrencyStore();
  const { addOrder, updatePaymentStatus, updateOrderStatus } = useAdminOrderStore();
  const { decreaseStock } = useAdminProductStore();

  // Contact & Shipping Form
  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.fullName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.fullName?.split(' ').slice(1).join(' ') || '');
  const [address, setAddress] = useState(user?.address || '');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState(user?.phoneNumber || '');

  // Payment & Discount
  const [paymentMethod, setPaymentMethod] = useState<'NOVAGATE' | 'CARD' | 'COD' | 'TRANSFER'>('NOVAGATE');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NovaGate Interactive Payment Modal State
  const [showNovaGateModal, setShowNovaGateModal] = useState(false);
  const [activePendingOrder, setActivePendingOrder] = useState<{
    orderId: string;
    orderCode: string;
    amountVnd: number;
    paymentCode: string;
    finalTotal: number;
  } | null>(null);
  const [paymentSimulating, setPaymentSimulating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (cart.items.length === 0) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4 px-4">
        <h2 className="text-2xl font-black uppercase text-black">Your Cart is Empty</h2>
        <p className="text-xs text-neutral-500">There are no items to check out.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-wider rounded"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  const FREE_SHIPPING_THRESHOLD = 75;
  const isFreeShipping = cart.totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : 6.99;

  const discountAmount = discountApplied ? Math.round(cart.totalPrice * 0.1 * 100) / 100 : 0;
  const finalTotal = Math.max(0, cart.totalPrice - discountAmount + shippingFee);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'BEAST10') {
      setDiscountApplied(true);
      setError(null);
    } else {
      setError('Invalid discount code. Try using BEAST10 for 10% off!');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !phone) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng và liên hệ.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const generatedOrderCode = `TITAN-WEB-${randomDigits}`;

    // Handle NovaGate Gateway Flow
    if (paymentMethod === 'NOVAGATE') {
      const paymentCode = `PAY${randomDigits}`;
      const amountVnd = Math.round(finalTotal * 25400);

      const newOrder = addOrder({
        orderCode: generatedOrderCode,
        recipientName: `${firstName} ${lastName}`,
        recipientPhone: phone,
        shippingAddress: `${address}, ${apartment ? apartment + ', ' : ''}${city} ${postalCode}`,
        notes: `Email: ${email} | Cổng NovaGate (VietQR Napas) | Mã GD: ${paymentCode}${discountApplied ? ' | Coupon: BEAST10 (-10%)' : ''}`,
        totalAmount: cart.totalPrice,
        shippingFee,
        discountAmount,
        finalAmount: finalTotal,
        paymentMethod: 'NOVAGATE',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        source: 'CHECKOUT',
        items: cart.items.map((i) => ({
          id: `item-${Date.now()}-${i.id}`,
          productId: i.productId,
          productName: i.productName,
          variantName: i.variantName,
          price: i.price,
          quantity: i.quantity,
          subtotal: i.subtotal,
          imageUrl: i.imageUrl,
        })),
      });

      cart.items.forEach((item) => {
        decreaseStock(item.productId, item.quantity);
      });

      setActivePendingOrder({
        orderId: newOrder.id,
        orderCode: generatedOrderCode,
        amountVnd,
        paymentCode,
        finalTotal,
      });
      setShowNovaGateModal(true);
      setSubmitting(false);
      return;
    }

    // 1. Save to Centralized Admin Order Store
    addOrder({
      orderCode: generatedOrderCode,
      recipientName: `${firstName} ${lastName}`,
      recipientPhone: phone,
      shippingAddress: `${address}, ${apartment ? apartment + ', ' : ''}${city} ${postalCode}`,
      notes: `Email: ${email} | Thanh toán: ${paymentMethod}${discountApplied ? ' | Coupon: BEAST10 (-10%)' : ''}`,
      totalAmount: cart.totalPrice,
      shippingFee,
      discountAmount,
      finalAmount: finalTotal,
      paymentMethod: paymentMethod === 'CARD' ? 'VNPAY' : paymentMethod === 'TRANSFER' ? 'BANK_TRANSFER' : 'COD',
      paymentStatus: paymentMethod === 'TRANSFER' ? 'COMPLETED' : 'PENDING',
      orderStatus: 'PENDING',
      source: 'CHECKOUT',
      items: cart.items.map((i) => ({
        id: `item-${Date.now()}-${i.id}`,
        productId: i.productId,
        productName: i.productName,
        variantName: i.variantName,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.subtotal,
        imageUrl: i.imageUrl,
      })),
    });

    // 2. Deduct inventory in Admin Product Store
    cart.items.forEach((item) => {
      decreaseStock(item.productId, item.quantity);
    });

    try {
      await orderService.checkout({
        recipientName: `${firstName} ${lastName}`,
        recipientPhone: phone,
        shippingAddress: `${address}, ${apartment ? apartment + ', ' : ''}${city} ${postalCode}`,
        notes: `Email: ${email} | Payment: ${paymentMethod}`,
        paymentMethod: paymentMethod === 'CARD' ? 'VNPAY' : 'COD',
      });
    } catch {
      // Graceful local handling
    }

    clearCart();
    setSubmitting(false);
    router.push(`/order-success/${generatedOrderCode}`);
  };

  const handleConfirmNovaGatePayment = async () => {
    if (!activePendingOrder) return;
    setPaymentSimulating(true);

    try {
      await fetch('http://localhost:8080/v1/open_banking/webhook/sepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: 'ACB',
          amountIn: activePendingOrder.amountVnd,
          transactionContent: activePendingOrder.paymentCode,
          referenceNumber: `ACBDEMO${Date.now()}`,
        }),
      }).catch(() => {});
    } catch {
      // Fallback
    }

    updatePaymentStatus(activePendingOrder.orderId, 'COMPLETED');
    updateOrderStatus(activePendingOrder.orderId, 'CONFIRMED');

    clearCart();
    setPaymentSimulating(false);
    setShowNovaGateModal(false);
    router.push(`/order-success/${activePendingOrder.orderCode}`);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-16">
      {/* Top Header */}
      <div className="bg-slate-950 border-b border-cyan-500/20 py-4 px-6 sm:px-12">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-black text-2xl tracking-tighter uppercase text-white">TITAN<span className="text-cyan-400">TECH</span></span>
            <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-cyan-400 text-slate-950 rounded">
              CHECKOUT
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Thanh Toán Bảo Mật 256-bit SSL</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Form: Contact, Shipping, Payment */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
            {/* Express Checkout */}
            <div className="bg-white p-6 rounded border border-neutral-200 shadow-xs space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500 block text-center">
                Express Checkout
              </span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="py-3 bg-[#5A31F4] hover:bg-[#4b27d4] text-white font-black text-xs uppercase tracking-wider rounded transition"
                >
                  Shop Pay
                </button>
                <button
                  type="button"
                  className="py-3 bg-[#FFC439] hover:bg-[#e0ab32] text-[#003087] font-black text-xs uppercase tracking-wider rounded transition"
                >
                  PayPal
                </button>
                <button
                  type="button"
                  className="py-3 bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider rounded transition"
                >
                  Apple Pay
                </button>
              </div>
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-[11px] font-black uppercase text-neutral-400">OR</span>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 rounded border border-neutral-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-wider text-black">Contact Information</h3>
                <Link href="/login" className="text-xs text-[#00B2FE] font-bold hover:underline">
                  Log in
                </Link>
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="beast@example.com"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Delivery / Shipping Address */}
            <div className="bg-white p-6 rounded border border-neutral-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-black">Shipping Address</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-600 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-600 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Beast Blvd"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-600 block mb-1">Apartment / Suite</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt 4B"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-600 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Greenville"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-600 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="27858"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">Phone Number (for delivery tracking) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white p-6 rounded border border-neutral-200 shadow-xs space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-black">Shipping Method</h3>
              <div className="p-3.5 border-2 border-black rounded bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#00B2FE]" />
                  <div>
                    <p className="text-xs font-black uppercase text-black">Standard Official Beast Shipping</p>
                    <p className="text-[11px] text-neutral-500 font-medium">Delivers in 3 - 5 business days with full tracking</p>
                  </div>
                </div>
                <span className="text-xs font-black text-black">
                  {isFreeShipping ? 'FREE' : formatPrice(shippingFee, currency)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded border border-neutral-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-black">Payment</h3>

              <div className="space-y-3">
                {/* NovaGate Recommended Option */}
                <label
                  onClick={() => setPaymentMethod('NOVAGATE')}
                  className={`p-4 border-2 rounded-lg flex flex-col gap-2.5 cursor-pointer transition relative overflow-hidden ${
                    paymentMethod === 'NOVAGATE'
                      ? 'border-cyan-500 bg-slate-950 text-white shadow-md shadow-cyan-500/10'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-xs">
                        NG
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black uppercase tracking-wider ${paymentMethod === 'NOVAGATE' ? 'text-white' : 'text-slate-950'}`}>
                            Cổng NovaGate (VietQR Napas 24/7)
                          </span>
                          <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-cyan-400 text-slate-950 rounded">
                            KHUYÊN DÙNG
                          </span>
                        </div>
                        <p className={`text-[11px] ${paymentMethod === 'NOVAGATE' ? 'text-slate-400' : 'text-neutral-500'}`}>
                          Quét mã QR mọi App ngân hàng • Tự động xác nhận giao dịch trong 3 giây
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-1 rounded">
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                      0% PHÍ
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3.5 border rounded flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'CARD' ? 'border-black bg-neutral-50 font-bold' : 'border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-black" />
                    <span className="text-xs font-bold">Thẻ Quốc Tế (Visa / Mastercard)</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 text-[10px] font-black">
                    <span>VISA</span> • <span>MC</span> • <span>AMEX</span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3.5 border rounded flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'COD' ? 'border-black bg-neutral-50 font-bold' : 'border-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold">Thanh Toán Khi Nhận Hàng (COD)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-500">Thanh toán tiền mặt cho shipper</span>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-widest transition flex items-center justify-center gap-2 shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                  </>
                ) : (
                  <>Complete Order • {formatPrice(finalTotal, currency)}</>
                )}
              </button>
            </div>
          </form>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5 bg-white p-6 rounded border border-neutral-200 shadow-xs space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-black pb-3 border-b border-neutral-200">
              Order Summary ({cart.totalItems})
            </h3>

            {/* Items List */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                  <div className="relative w-16 h-16 bg-neutral-100 rounded overflow-hidden shrink-0 border border-neutral-200">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="64px" />
                    )}
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase text-black truncate">{item.productName}</p>
                    <p className="text-[11px] text-neutral-500 font-semibold">{item.variantName}</p>
                  </div>
                  <span className="text-xs font-black text-black">
                    {formatPrice(item.subtotal, currency)}
                  </span>
                </div>
              ))}

              {/* Free Gift Preview if qualified */}
              {cart.totalPrice >= 100 && (
                <div className="flex items-center gap-3 p-2 bg-pink-50 border border-pink-200 rounded">
                  <Gift className="w-5 h-5 text-[#FF007A]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase text-black truncate">MrBeast Camo Socks</p>
                    <p className="text-[10px] font-bold text-[#FF007A]">FREE GIFT WITH PURCHASE</p>
                  </div>
                  <span className="text-xs font-bold text-green-700">FREE</span>
                </div>
              )}
            </div>

            {/* Discount Code Input */}
            <form onSubmit={handleApplyDiscount} className="flex gap-2 pt-2 border-t border-neutral-100">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Discount code (try BEAST10)"
                className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded uppercase font-bold focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-black uppercase tracking-wider rounded transition"
              >
                Apply
              </button>
            </form>

            {discountApplied && (
              <div className="flex items-center justify-between text-xs font-bold text-green-700 bg-green-50 p-2 rounded">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> BEAST10 (-10%)
                </span>
                <span>-{formatPrice(discountAmount, currency)}</span>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-200 text-xs font-semibold text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-black text-black">{formatPrice(cart.totalPrice, currency)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={isFreeShipping ? 'text-green-700 font-bold' : 'font-black text-black'}>
                  {isFreeShipping ? 'FREE' : formatPrice(shippingFee, currency)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="text-sm font-black uppercase text-black">Total</span>
              <span className="text-2xl font-black text-black">{formatPrice(finalTotal, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NovaGate FinTech VietQR Interactive Modal */}
      {showNovaGateModal && activePendingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/30 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Top close */}
            <button
              onClick={() => setShowNovaGateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20">
                NG
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-wider text-white flex items-center gap-2">
                  NovaGate FinTech Gateway
                  <span className="px-1.5 py-0.5 text-[9px] bg-cyan-400 text-slate-950 font-black rounded">
                    SECURE
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  VietQR Napas 24/7 • Tự động khớp lệnh tức thời
                </p>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="relative p-2.5 bg-white rounded-xl shadow-md">
                {/* Dynamic VietQR code */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=00020101021238570010A00000072701270006970416011312345666880208QRIBFTTA53037045406${activePendingOrder.amountVnd}5802VN62${activePendingOrder.paymentCode}6304`}
                  alt="NovaGate VietQR"
                  className="w-48 h-48 rounded"
                />
              </div>

              {/* Status pulse */}
              <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-cyan-950/80 border border-cyan-500/30 rounded-full text-cyan-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Đang chờ chuyển khoản...</span>
                <span className="text-slate-400 font-mono text-[11px] ml-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 14:59
                </span>
              </div>
            </div>

            {/* Banking Details */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>Ngân hàng thụ hưởng:</span>
                <span className="font-bold text-white font-sans">ACB - TMCP Á Châu</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Chủ tài khoản:</span>
                <span className="font-bold text-white">NOVAGATE - TITAN TECH</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Số tài khoản:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-cyan-400 text-sm">1234566688</span>
                  <button
                    onClick={() => copyToClipboard('1234566688', 'acc')}
                    className="p-1 hover:text-white transition"
                  >
                    {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Số tiền thanh toán:</span>
                <span className="font-bold text-green-400 text-sm">{formatVND(activePendingOrder.amountVnd)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-2">
                <span>Nội dung chuyển khoản:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {activePendingOrder.paymentCode}
                  </span>
                  <button
                    onClick={() => copyToClipboard(activePendingOrder.paymentCode, 'code')}
                    className="p-1 hover:text-white transition"
                  >
                    {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Simulation & Confirm Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmNovaGatePayment}
                disabled={paymentSimulating}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black uppercase text-xs tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                {paymentSimulating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    Khớp Lệnh Sổ Cái NovaGate...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Mô Phỏng Quét QR Thành Công (Sandbox IPN)
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleConfirmNovaGatePayment}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                Tôi đã chuyển khoản qua App ngân hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
