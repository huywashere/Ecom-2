'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  Search,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Filter,
  X,
  RefreshCw,
  Bot,
  Globe,
  ExternalLink,
  ShieldCheck,
  Check,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useAdminOrderStore, AdminOrder, OrderSource } from '@/store/admin-order-store';
import { useAdminProductStore } from '@/store/admin-product-store';
import { useCurrencyStore } from '@/store/currency-store';
import { formatPrice, formatDate } from '@/lib/formatters';
import { OrderStatus, PaymentStatus, Product } from '@/types';
import { DEMO_CATEGORIES, DEMO_BRANDS } from '@/lib/demo-data';

export default function AdminDashboardPage() {
  const { currency } = useCurrencyStore();
  const {
    orders,
    addOrder,
    updateOrderStatus,
    updatePaymentStatus,
    updateOrder,
    deleteOrder,
    resetToDefault: resetOrders,
  } = useAdminOrderStore();

  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefault: resetProducts,
  } = useAdminProductStore();

  // Navigation tab: 'orders' | 'products' | 'analytics'
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');

  // Order Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSourceFilter, setOrderSourceFilter] = useState<string>('ALL');

  // Product Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('ALL');

  // Order Modals
  const [viewingOrder, setViewingOrder] = useState<AdminOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // Product Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  // Success Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==================== MANUAL ORDER CREATION FORM STATE ====================
  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderPhone, setNewOrderPhone] = useState('');
  const [newOrderAddress, setNewOrderAddress] = useState('');
  const [newOrderSelectedProdId, setNewOrderSelectedProdId] = useState<number>(products[0]?.id || 1);
  const [newOrderQty, setNewOrderQty] = useState(1);
  const [newOrderPayment, setNewOrderPayment] = useState<'COD' | 'BANK_TRANSFER'>('COD');
  const [newOrderNotes, setNewOrderNotes] = useState('');

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === Number(newOrderSelectedProdId)) || products[0];
    if (!prod) return;

    const total = prod.minPrice * newOrderQty;
    const created = addOrder({
      recipientName: newOrderCustomer,
      recipientPhone: newOrderPhone,
      shippingAddress: newOrderAddress,
      notes: newOrderNotes ? `[Thủ Công Admin] ${newOrderNotes}` : '[Thủ Công Admin] Đơn tạo bởi Admin',
      totalAmount: total,
      shippingFee: 0,
      discountAmount: 0,
      finalAmount: total,
      paymentMethod: newOrderPayment,
      paymentStatus: newOrderPayment === 'BANK_TRANSFER' ? 'COMPLETED' : 'PENDING',
      orderStatus: 'CONFIRMED',
      source: 'MANUAL',
      items: [
        {
          id: `item-${Date.now()}`,
          productId: prod.id,
          productName: prod.name,
          variantName: 'Tiêu chuẩn',
          price: prod.minPrice,
          quantity: newOrderQty,
          subtotal: total,
          imageUrl: prod.thumbnail,
        },
      ],
    });

    setIsCreateOrderOpen(false);
    setNewOrderCustomer('');
    setNewOrderPhone('');
    setNewOrderAddress('');
    setNewOrderNotes('');
    setNewOrderQty(1);
    showToast(`Đã tạo thành công đơn hàng #${created.orderCode}!`);
  };

  // ==================== EDIT ORDER SUBMIT ====================
  const handleEditOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    updateOrder(editingOrder.id, {
      recipientName: editingOrder.recipientName,
      recipientPhone: editingOrder.recipientPhone,
      shippingAddress: editingOrder.shippingAddress,
      notes: editingOrder.notes,
      orderStatus: editingOrder.orderStatus,
      paymentStatus: editingOrder.paymentStatus,
    });

    setEditingOrder(null);
    showToast(`Đã cập nhật đơn hàng #${editingOrder.orderCode}`);
  };

  // ==================== NEW PRODUCT FORM STATE ====================
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('laptops');
  const [newProdBrand, setNewProdBrand] = useState('Apple');
  const [newProdPrice, setNewProdPrice] = useState('1499.00');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('1699.00');
  const [newProdStock, setNewProdStock] = useState('25');
  const [newProdWarranty, setNewProdWarranty] = useState('24');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdThumb, setNewProdThumb] = useState(
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
  );

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = DEMO_CATEGORIES.find((c) => c.slug === newProdCategory);
    const created = addProduct({
      name: newProdName,
      categorySlug: newProdCategory,
      categoryName: cat?.name || 'Điện tử',
      brandName: newProdBrand,
      brandSlug: newProdBrand.toLowerCase().replace(/\s+/g, '-'),
      minPrice: parseFloat(newProdPrice) || 999,
      originalPrice: parseFloat(newProdOrigPrice) || 1099,
      totalStock: parseInt(newProdStock) || 10,
      warrantyMonths: parseInt(newProdWarranty) || 12,
      featured: true,
      thumbnail: newProdThumb,
      shortDescription: newProdDesc,
    });

    setIsCreateProductOpen(false);
    setNewProdName('');
    setNewProdDesc('');
    showToast(`Đã thêm sản phẩm "${created.name.slice(0, 30)}..." vào danh mục!`);
  };

  // ==================== EDIT PRODUCT SUBMIT ====================
  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      minPrice: Number(editingProduct.minPrice),
      originalPrice: Number(editingProduct.originalPrice),
      totalStock: Number(editingProduct.totalStock),
      warrantyMonths: Number(editingProduct.warrantyMonths),
      shortDescription: editingProduct.shortDescription,
      thumbnail: editingProduct.thumbnail,
    });

    setEditingProduct(null);
    showToast(`Đã cập nhật sản phẩm "${editingProduct.name.slice(0, 25)}..."`);
  };

  // ==================== FILTERED DATA ====================
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderCode.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.recipientName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.recipientPhone.includes(orderSearch) ||
        o.items.some((i) => i.productName.toLowerCase().includes(orderSearch.toLowerCase()));

      const matchStatus = orderStatusFilter === 'ALL' || o.orderStatus === orderStatusFilter;
      const matchSource = orderSourceFilter === 'ALL' || o.source === orderSourceFilter;

      return matchSearch && matchStatus && matchSource;
    });
  }, [orders, orderSearch, orderStatusFilter, orderSourceFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brandName?.toLowerCase().includes(productSearch.toLowerCase());
      const matchCategory = productCategoryFilter === 'ALL' || p.categorySlug === productCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // ==================== DASHBOARD STATS ====================
  const stats = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
    const chatbotOrders = orders.filter((o) => o.source === 'CHATBOT').length;
    const checkoutOrders = orders.filter((o) => o.source === 'CHECKOUT').length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING').length;
    const totalInventory = products.reduce((sum, p) => sum + (p.totalStock || 0), 0);
    const lowStockCount = products.filter((p) => p.totalStock < 10).length;

    return {
      totalRev,
      totalOrders: orders.length,
      chatbotOrders,
      checkoutOrders,
      pendingOrders,
      totalProducts: products.length,
      totalInventory,
      lowStockCount,
    };
  }, [orders, products]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" /> Chờ xử lý
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 border border-blue-300">
            <Check className="w-3 h-3 text-blue-600" /> Đã duyệt
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-2.5 py-1 rounded bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 border border-purple-300">
            <Package className="w-3 h-3 text-purple-600" /> Đóng gói
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="px-2.5 py-1 rounded bg-[#00B2FE]/15 text-[#0074A6] text-[11px] font-black uppercase tracking-wider flex items-center gap-1 border border-[#00B2FE]/40">
            <Truck className="w-3 h-3 text-[#0074A6]" /> Đang giao
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 rounded bg-green-100 text-green-800 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 border border-green-300">
            <CheckCircle2 className="w-3 h-3 text-green-600" /> Thành công
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 border border-rose-300">
            <X className="w-3 h-3 text-rose-600" /> Đã hủy
          </span>
        );
    }
  };

  const getSourceBadge = (source: OrderSource) => {
    switch (source) {
      case 'CHATBOT':
        return (
          <span className="px-2 py-0.5 bg-black text-[#00B2FE] border border-[#00B2FE] text-[10px] font-black uppercase tracking-wider rounded flex items-center gap-1">
            <Bot className="w-3 h-3 text-[#00B2FE]" /> Chatbot AI
          </span>
        );
      case 'CHECKOUT':
        return (
          <span className="px-2 py-0.5 bg-neutral-100 text-black border border-black text-[10px] font-black uppercase tracking-wider rounded flex items-center gap-1">
            <Globe className="w-3 h-3" /> Web Checkout
          </span>
        );
      case 'MANUAL':
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider rounded flex items-center gap-1">
            <Edit3 className="w-3 h-3" /> Thủ Công
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white font-black text-xs uppercase tracking-wider px-4 py-3 rounded border-2 border-[#00B2FE] shadow-[4px_4px_0px_#000] flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#00B2FE]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header - White with Black Brand and #00B2FE Accent */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tighter uppercase text-black">
                TITAN<span className="text-[#00B2FE]">TECH</span>
              </span>
            </Link>
            <div className="h-6 w-px bg-neutral-200" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xs">
                  ADMIN CONTROL
                </span>
                <span className="text-xs font-black uppercase text-neutral-600 hidden sm:inline">
                  Hệ Thống Quản Trị Đơn Hàng &amp; Kho Sản Phẩm
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs - matching homepage brutalist buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded border border-neutral-200">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded transition flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black hover:bg-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Đơn Hàng ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded transition flex items-center gap-1.5 ${
                  activeTab === 'products'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black hover:bg-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" /> Sản Phẩm ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded transition flex items-center gap-1.5 ${
                  activeTab === 'analytics'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black hover:bg-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" /> Doanh Thu
              </button>
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-white hover:bg-neutral-100 text-black border border-neutral-300 text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00B2FE]" /> Xem Cửa Hàng
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* 4 Stats Cards - High contrast White with Black & Neon tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-neutral-200 rounded shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                Tổng Doanh Thu
              </span>
              <div className="w-8 h-8 rounded bg-black text-[#00B2FE] flex items-center justify-center font-black">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {formatPrice(stats.totalRev, currency)}
            </div>
            <p className="text-[11px] font-bold text-neutral-500 mt-1 uppercase tracking-wider">
              {stats.totalOrders} đơn hàng ghi nhận trong hệ thống
            </p>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                Nguồn Đơn Chốt
              </span>
              <div className="w-8 h-8 rounded bg-black text-[#00B2FE] flex items-center justify-center font-black">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {stats.chatbotOrders} Chatbot / {stats.checkoutOrders} Web
            </div>
            <p className="text-[11px] font-bold text-[#0074A6] mt-1 uppercase tracking-wider">
              Trợ lý AI đóng góp {Math.round((stats.chatbotOrders / (stats.totalOrders || 1)) * 100)}% tổng số đơn
            </p>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                Đơn Chờ Xử Lý
              </span>
              <div className="w-8 h-8 rounded bg-amber-500 text-white flex items-center justify-center font-black">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {stats.pendingOrders} Đơn Mới
            </div>
            <p className="text-[11px] font-bold text-amber-700 mt-1 uppercase tracking-wider">
              Cần liên hệ xác nhận xuất kho
            </p>
          </div>

          <div className="p-5 bg-white border border-neutral-200 rounded shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                Tồn Kho Sản Phẩm
              </span>
              <div className="w-8 h-8 rounded bg-green-600 text-white flex items-center justify-center font-black">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              {stats.totalInventory} Chiếc
            </div>
            <p className="text-[11px] font-bold text-green-700 mt-1 uppercase tracking-wider">
              {stats.totalProducts} mã hàng ({stats.lowStockCount} mã sắp hết)
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: ORDER MANAGEMENT CRUD                                 */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="p-4 bg-white border border-neutral-200 rounded flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative min-w-[260px] flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Tìm theo Mã đơn, Khách hàng, SĐT, Sản phẩm..."
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded pl-9 pr-4 py-2 text-xs text-black placeholder-neutral-400 outline-none font-medium"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter by Status */}
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-neutral-50 border border-neutral-300 text-xs text-black rounded px-3 py-2 outline-none font-bold uppercase"
                >
                  <option value="ALL">TẤT CẢ TRẠNG THÁI</option>
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="CONFIRMED">Đã duyệt</option>
                  <option value="PROCESSING">Đang đóng gói</option>
                  <option value="SHIPPING">Đang giao hàng</option>
                  <option value="DELIVERED">Đã giao thành công</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>

                {/* Filter by Source */}
                <select
                  value={orderSourceFilter}
                  onChange={(e) => setOrderSourceFilter(e.target.value)}
                  className="bg-neutral-50 border border-neutral-300 text-xs text-black rounded px-3 py-2 outline-none font-bold uppercase"
                >
                  <option value="ALL">TẤT CẢ NGUỒN</option>
                  <option value="CHATBOT">🤖 TỪ CHATBOT AI</option>
                  <option value="CHECKOUT">🛒 TỪ WEB CHECKOUT</option>
                  <option value="MANUAL">✍️ TẠO THỦ CÔNG</option>
                </select>
              </div>

              {/* Order Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setIsCreateOrderOpen(true)}
                  className="px-5 py-2.5 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs tracking-wider rounded border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Plus className="w-4 h-4" /> Thêm Đơn Hàng Mới
                </button>
                <button
                  onClick={resetOrders}
                  title="Khôi phục dữ liệu đơn mẫu"
                  className="p-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-neutral-200 rounded overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-black text-white font-black uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Mã Đơn / Ngày</th>
                      <th className="py-3.5 px-4">Nguồn Đơn</th>
                      <th className="py-3.5 px-4">Khách Hàng</th>
                      <th className="py-3.5 px-4">Sản Phẩm Đặt</th>
                      <th className="py-3.5 px-4">Tổng Tiền</th>
                      <th className="py-3.5 px-4">Thanh Toán</th>
                      <th className="py-3.5 px-4">Trạng Thái Đơn</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác CRUD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-neutral-500 font-bold uppercase text-xs">
                          <ShoppingBag className="w-8 h-8 mx-auto text-neutral-400 mb-2 opacity-50" />
                          Không tìm thấy đơn hàng nào phù hợp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-neutral-50 transition">
                          {/* Order Code */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <button
                              onClick={() => setViewingOrder(order)}
                              className="font-mono font-black text-black hover:text-[#00B2FE] hover:underline block text-left"
                            >
                              #{order.orderCode}
                            </button>
                            <div className="text-[10px] text-neutral-500 font-bold mt-0.5">
                              {formatDate(order.createdAt)}
                            </div>
                          </td>

                          {/* Source */}
                          <td className="py-4 px-4 whitespace-nowrap">{getSourceBadge(order.source)}</td>

                          {/* Customer */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <p className="font-black uppercase text-black">{order.recipientName}</p>
                            <p className="text-[11px] text-neutral-500 font-mono font-bold">{order.recipientPhone}</p>
                          </td>

                          {/* Items summary */}
                          <td className="py-4 px-4 max-w-[280px]">
                            <div className="space-y-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 truncate">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FE] shrink-0" />
                                  <span className="text-neutral-800 font-bold uppercase text-[11px] truncate">
                                    {item.productName}
                                  </span>
                                  <span className="text-[10px] text-neutral-500 font-mono font-black shrink-0">
                                    x{item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total */}
                          <td className="py-4 px-4 font-black text-black whitespace-nowrap text-sm">
                            {formatPrice(order.finalAmount, currency)}
                          </td>

                          {/* Payment */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-black font-black uppercase text-[10px] rounded-xs block w-fit">
                                {order.paymentMethod}
                              </span>
                              <span
                                className={`text-[10px] font-bold ${
                                  order.paymentStatus === 'COMPLETED' ? 'text-green-700' : 'text-amber-700'
                                }`}
                              >
                                {order.paymentStatus === 'COMPLETED' ? '● Đã thanh toán' : '○ Chờ thu tiền'}
                              </span>
                            </div>
                          </td>

                          {/* Order Status Select */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="bg-white border-2 border-black text-xs text-black rounded px-2.5 py-1.5 focus:border-[#00B2FE] outline-none font-black uppercase cursor-pointer"
                            >
                              <option value="PENDING">⏳ Chờ xử lý</option>
                              <option value="CONFIRMED">✅ Đã duyệt</option>
                              <option value="PROCESSING">📦 Đóng gói</option>
                              <option value="SHIPPING">🚚 Đang giao</option>
                              <option value="DELIVERED">🎉 Giao thành công</option>
                              <option value="CANCELLED">❌ Hủy đơn</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingOrder(order)}
                                title="Xem chi tiết đơn"
                                className="p-2 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 rounded transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingOrder(order)}
                                title="Sửa thông tin đơn"
                                className="p-2 bg-neutral-100 hover:bg-blue-50 text-blue-600 border border-neutral-300 rounded transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingOrderId(order.id)}
                                title="Xóa đơn hàng"
                                className="p-2 bg-neutral-100 hover:bg-rose-50 text-rose-600 border border-neutral-300 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PRODUCT MANAGEMENT CRUD                               */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Product Action Bar */}
            <div className="p-4 bg-white border border-neutral-200 rounded flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative min-w-[260px] flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Tìm theo Tên sản phẩm, Thương hiệu..."
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded pl-9 pr-4 py-2 text-xs text-black placeholder-neutral-400 outline-none font-medium"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-neutral-50 border border-neutral-300 text-xs text-black rounded px-3 py-2 outline-none font-bold uppercase"
                >
                  <option value="ALL">TẤT CẢ DANH MỤC</option>
                  {DEMO_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setIsCreateProductOpen(true)}
                  className="px-5 py-2.5 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs tracking-wider rounded border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
                </button>
                <button
                  onClick={resetProducts}
                  title="Khôi phục danh sách sản phẩm mặc định"
                  className="p-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-600 hover:text-black rounded transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-neutral-200 rounded overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-black text-white font-black uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Ảnh &amp; Tên Sản Phẩm</th>
                      <th className="py-3.5 px-4">Danh Mục</th>
                      <th className="py-3.5 px-4">Hãng</th>
                      <th className="py-3.5 px-4">Giá Bán</th>
                      <th className="py-3.5 px-4">Tồn Kho</th>
                      <th className="py-3.5 px-4">Bảo Hành</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác CRUD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-neutral-500 font-bold uppercase text-xs">
                          <Package className="w-8 h-8 mx-auto text-neutral-400 mb-2 opacity-50" />
                          Không tìm thấy sản phẩm nào.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-neutral-50 transition">
                          {/* Image & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3 max-w-[360px]">
                              <div className="relative w-12 h-12 rounded bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                                {product.thumbnail && (
                                  <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/products/${product.slug}`}
                                  target="_blank"
                                  className="font-black uppercase text-black hover:text-[#00B2FE] transition truncate block tracking-tight"
                                >
                                  {product.name}
                                </Link>
                                <span className="text-[10px] text-neutral-400 font-mono font-bold">
                                  SKU: #{product.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-black font-black uppercase text-[10px] rounded-xs">
                              {product.categoryName || product.categorySlug}
                            </span>
                          </td>

                          {/* Brand */}
                          <td className="py-3.5 px-4 whitespace-nowrap font-black uppercase text-black">
                            <span className="px-1.5 py-0.5 bg-[#00B2FE] text-black font-black text-[10px] rounded-xs">
                              {product.brandName}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <p className="font-black text-black text-sm">{formatPrice(product.minPrice, currency)}</p>
                            {product.originalPrice > product.minPrice && (
                              <p className="text-[10px] text-neutral-400 line-through font-bold">
                                {formatPrice(product.originalPrice, currency)}
                              </p>
                            )}
                          </td>

                          {/* Stock */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {product.totalStock <= 5 ? (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-black uppercase">
                                Sắp hết: {product.totalStock} cái
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-300 text-[11px] font-black uppercase">
                                Còn {product.totalStock} cái
                              </span>
                            )}
                          </td>

                          {/* Warranty */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-neutral-600 font-black uppercase text-xs">
                            {product.warrantyMonths} Tháng
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                title="Xem trên website"
                                className="p-2 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 rounded transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => setEditingProduct(product)}
                                title="Chỉnh sửa sản phẩm"
                                className="p-2 bg-neutral-100 hover:bg-blue-50 text-blue-600 border border-neutral-300 rounded transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingProductId(product.id)}
                                title="Xóa sản phẩm"
                                className="p-2 bg-neutral-100 hover:bg-rose-50 text-rose-600 border border-neutral-300 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ANALYTICS & INSIGHTS                                  */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-neutral-200 rounded shadow-xs space-y-4">
              <h3 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#00B2FE]" /> Hiệu Suất Trợ Lý AI Chatbot vs Website
              </h3>
              <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                Tỷ lệ khách hàng được tư vấn và chốt đơn tự động qua khung Chatbot AI ở góc phải màn hình so với đặt hàng truyền thống qua trang Checkout.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-1.5">
                    <span className="text-black">🤖 Chốt Qua Chatbot AI ({stats.chatbotOrders} đơn)</span>
                    <span className="text-[#00B2FE] font-black">
                      {Math.round((stats.chatbotOrders / (stats.totalOrders || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                    <div
                      className="h-full bg-[#00B2FE] rounded-full"
                      style={{
                        width: `${Math.round((stats.chatbotOrders / (stats.totalOrders || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-1.5">
                    <span className="text-black">🛒 Website Checkout ({stats.checkoutOrders} đơn)</span>
                    <span className="text-black font-black">
                      {Math.round((stats.checkoutOrders / (stats.totalOrders || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{
                        width: `${Math.round((stats.checkoutOrders / (stats.totalOrders || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-neutral-200 rounded shadow-xs space-y-4">
              <h3 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Cảnh Báo Tồn Kho Cần Nhập Thêm
              </h3>
              <div className="space-y-2.5">
                {products
                  .filter((p) => p.totalStock < 15)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-between text-xs"
                    >
                      <div className="truncate pr-2">
                        <p className="font-black uppercase text-black truncate">{p.name}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase">{p.brandName} • {p.categoryName}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-black uppercase shrink-0">
                        Còn {p.totalStock} cái
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: VIEW ORDER DETAILS                                      */}
      {/* ============================================================== */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border-2 border-black rounded-lg p-6 shadow-[8px_8px_0px_#000] space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-black text-black">#{viewingOrder.orderCode}</span>
                {getSourceBadge(viewingOrder.source)}
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 text-black hover:opacity-70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded border border-neutral-200">
              <div>
                <span className="text-neutral-500 block font-black uppercase text-[10px] mb-0.5">Khách Hàng:</span>
                <p className="font-black uppercase text-black text-sm">{viewingOrder.recipientName}</p>
                <p className="text-black font-mono font-bold mt-0.5">{viewingOrder.recipientPhone}</p>
              </div>
              <div>
                <span className="text-neutral-500 block font-black uppercase text-[10px] mb-0.5">Địa Chỉ Giao:</span>
                <p className="text-neutral-800 font-medium leading-snug">{viewingOrder.shippingAddress}</p>
              </div>
            </div>

            {/* Notes */}
            {viewingOrder.notes && (
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <span className="text-neutral-500 font-black uppercase text-[10px] block mb-0.5">Ghi Chú Đơn:</span>
                <p className="text-neutral-800 font-medium italic">{viewingOrder.notes}</p>
              </div>
            )}

            {/* Items */}
            <div className="space-y-2">
              <h4 className="font-black uppercase text-neutral-500 tracking-wider text-[11px]">Sản Phẩm Trong Đơn</h4>
              <div className="divide-y divide-neutral-200 border border-neutral-200 rounded p-2 bg-neutral-50">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 px-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.imageUrl && (
                        <div className="relative w-10 h-10 rounded bg-white overflow-hidden shrink-0 border border-neutral-200">
                          <Image src={item.imageUrl} alt={item.productName} fill sizes="40px" className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-black uppercase text-black truncate">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-[10px] text-neutral-500 truncate">{item.variantName}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-black">{formatPrice(item.price, currency)}</p>
                      <p className="text-[11px] text-neutral-500 font-mono font-bold">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="pt-2 border-t-2 border-black flex items-center justify-between text-sm">
              <span className="font-black uppercase text-neutral-700">Tổng Thanh Toán:</span>
              <span className="text-xl font-black text-black">{formatPrice(viewingOrder.finalAmount, currency)}</span>
            </div>

            {/* Status Change Selector inside Modal */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
              <span className="font-black uppercase text-neutral-600 text-xs">Cập nhật trạng thái:</span>
              <select
                value={viewingOrder.orderStatus}
                onChange={(e) => {
                  const newStatus = e.target.value as OrderStatus;
                  updateOrderStatus(viewingOrder.id, newStatus);
                  setViewingOrder({ ...viewingOrder, orderStatus: newStatus });
                  showToast(`Đã đổi trạng thái đơn #${viewingOrder.orderCode}`);
                }}
                className="bg-white border-2 border-black text-xs text-black rounded px-3 py-1.5 focus:border-[#00B2FE] outline-none font-black uppercase cursor-pointer"
              >
                <option value="PENDING">Chờ xử lý</option>
                <option value="CONFIRMED">Đã duyệt</option>
                <option value="PROCESSING">Đang đóng gói</option>
                <option value="SHIPPING">Đang giao hàng</option>
                <option value="DELIVERED">Giao thành công</option>
                <option value="CANCELLED">Hủy đơn</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE ORDER (MANUAL)                                   */}
      {/* ============================================================== */}
      {isCreateOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateOrderSubmit}
            className="w-full max-w-lg bg-white border-2 border-black rounded-lg p-6 shadow-[8px_8px_0px_#000] space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <h3 className="text-sm font-black uppercase text-black flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#00B2FE]" /> Tạo Đơn Hàng Mới Cho Khách
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOrderOpen(false)}
                className="p-1 text-black hover:opacity-70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">
                  Chọn Sản Phẩm Trong Kho <span className="text-rose-600">*</span>
                </label>
                <select
                  value={newOrderSelectedProdId}
                  onChange={(e) => setNewOrderSelectedProdId(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatPrice(p.minPrice, currency)} (Còn: {p.totalStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Số Lượng</label>
                  <input
                    type="number"
                    min={1}
                    value={newOrderQty}
                    onChange={(e) => setNewOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Hình Thức Thanh Toán</label>
                  <select
                    value={newOrderPayment}
                    onChange={(e) => setNewOrderPayment(e.target.value as 'COD' | 'BANK_TRANSFER')}
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold outline-none"
                  >
                    <option value="COD">Thanh toán khi nhận (COD)</option>
                    <option value="BANK_TRANSFER">Chuyển khoản (Đã CK)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">
                  Họ Tên Khách Hàng <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Minh Trí"
                  value={newOrderCustomer}
                  onChange={(e) => setNewOrderCustomer(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium placeholder-neutral-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">
                  Số Điện Thoại <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0988112233"
                  value={newOrderPhone}
                  onChange={(e) => setNewOrderPhone(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium placeholder-neutral-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">
                  Địa Chỉ Giao Hàng <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, đường, quận/huyện, tỉnh thành..."
                  value={newOrderAddress}
                  onChange={(e) => setNewOrderAddress(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium placeholder-neutral-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Ghi Chú</label>
                <input
                  type="text"
                  placeholder="Yêu cầu kiểm tra máy, quà tặng..."
                  value={newOrderNotes}
                  onChange={(e) => setNewOrderNotes(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium placeholder-neutral-400 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateOrderOpen(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 font-black uppercase text-xs rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs tracking-wider rounded border border-black shadow-[2px_2px_0px_#000]"
              >
                Lưu Đơn Hàng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT ORDER                                              */}
      {/* ============================================================== */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleEditOrderSubmit}
            className="w-full max-w-lg bg-white border-2 border-black rounded-lg p-6 shadow-[8px_8px_0px_#000] space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <h3 className="text-sm font-black uppercase text-black flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-600" /> Sửa Thông Tin Đơn #{editingOrder.orderCode}
              </h3>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="p-1 text-black hover:opacity-70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Tên Người Nhận</label>
                <input
                  type="text"
                  required
                  value={editingOrder.recipientName}
                  onChange={(e) => setEditingOrder({ ...editingOrder, recipientName: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Số Điện Thoại</label>
                <input
                  type="tel"
                  required
                  value={editingOrder.recipientPhone}
                  onChange={(e) => setEditingOrder({ ...editingOrder, recipientPhone: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Địa Chỉ Nhận Hàng</label>
                <input
                  type="text"
                  required
                  value={editingOrder.shippingAddress}
                  onChange={(e) => setEditingOrder({ ...editingOrder, shippingAddress: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Trạng Thái Đơn</label>
                  <select
                    value={editingOrder.orderStatus}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, orderStatus: e.target.value as OrderStatus })
                    }
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold uppercase outline-none"
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="CONFIRMED">Đã duyệt</option>
                    <option value="PROCESSING">Đang đóng gói</option>
                    <option value="SHIPPING">Đang giao hàng</option>
                    <option value="DELIVERED">Đã giao thành công</option>
                    <option value="CANCELLED">Hủy đơn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Trạng Thái Thanh Toán</label>
                  <select
                    value={editingOrder.paymentStatus}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, paymentStatus: e.target.value as PaymentStatus })
                    }
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold uppercase outline-none"
                  >
                    <option value="PENDING">Chờ thanh toán</option>
                    <option value="COMPLETED">Đã thanh toán</option>
                    <option value="FAILED">Thất bại</option>
                    <option value="REFUNDED">Đã hoàn tiền</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Ghi Chú</label>
                <textarea
                  rows={2}
                  value={editingOrder.notes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 font-black uppercase text-xs rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-wider rounded"
              >
                Cập Nhật Đơn Hàng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DELETE ORDER CONFIRMATION                               */}
      {/* ============================================================== */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border-2 border-black rounded-lg p-6 shadow-[8px_8px_0px_#000] space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-300">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black uppercase text-black">Xác Nhận Xóa Đơn Hàng?</h4>
            <p className="text-xs text-neutral-600 font-medium leading-relaxed">
              Bạn có chắc chắn muốn xóa đơn hàng này khỏi hệ thống? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingOrderId(null)}
                className="px-4 py-2 bg-neutral-100 text-black border border-neutral-300 font-black uppercase text-xs rounded hover:bg-neutral-200"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  deleteOrder(deletingOrderId);
                  setDeletingOrderId(null);
                  showToast('Đã xóa đơn hàng thành công');
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-xs rounded"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE PRODUCT                                          */}
      {/* ============================================================== */}
      {isCreateProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProductSubmit}
            className="w-full max-w-lg bg-white border-2 border-black rounded-lg p-6 shadow-[8px_8px_0px_#000] space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <h3 className="text-sm font-black uppercase text-black flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#00B2FE]" /> Thêm Sản Phẩm Mới Vào Kho
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateProductOpen(false)}
                className="p-1 text-black hover:opacity-70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">
                  Tên Sản Phẩm <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Card Đồ Họa ASUS ROG Matrix RTX 4090 Platinum"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Danh Mục</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold uppercase outline-none"
                  >
                    {DEMO_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Thương Hiệu</label>
                  <select
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold uppercase outline-none"
                  >
                    {DEMO_BRANDS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Giá Bán ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Giá Gốc ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdOrigPrice}
                    onChange={(e) => setNewProdOrigPrice(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Tồn Kho</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Link Ảnh Thumbnail (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newProdThumb}
                  onChange={(e) => setNewProdThumb(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Mô Tả Sản Phẩm</label>
                <textarea
                  rows={2}
                  placeholder="Thông số, tính năng nổi bật..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateProductOpen(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 font-black uppercase text-xs rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs tracking-wider rounded border border-black shadow-[2px_2px_0px_#000]"
              >
                Thêm Vào Kho
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT PRODUCT                                            */}
      {/* ============================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleEditProductSubmit}
            className="w-full max-w-lg bg-white border-2 border-black rounded-lg p-6 shadow-[8px_8px_0px_#000] space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <h3 className="text-sm font-black uppercase text-black flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-600" /> Sửa Sản Phẩm #{editingProduct.id}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 text-black hover:opacity-70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Tên Sản Phẩm</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Giá Bán ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.minPrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, minPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Giá Gốc ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-black font-black uppercase text-[11px] mb-1">Tồn Kho</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.totalStock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, totalStock: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Link Ảnh Thumbnail (URL)</label>
                <input
                  type="url"
                  value={editingProduct.thumbnail || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-black font-black uppercase text-[11px] mb-1">Mô Tả Ngắn</label>
                <textarea
                  rows={3}
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t-2 border-black flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 font-black uppercase text-xs rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-black uppercase text-xs tracking-wider rounded"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION                             */}
      {/* ============================================================== */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border-2 border-black rounded-lg p-6 shadow-[8px_8px_0px_#000] space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-300">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black uppercase text-black">Xác Nhận Xóa Sản Phẩm?</h4>
            <p className="text-xs text-neutral-600 font-medium leading-relaxed">
              Sản phẩm này sẽ bị xóa khỏi hệ thống quản trị và danh sách bán trên cửa hàng.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 bg-neutral-100 text-black border border-neutral-300 font-black uppercase text-xs rounded hover:bg-neutral-200"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  deleteProduct(deletingProductId);
                  setDeletingProductId(null);
                  showToast('Đã xóa sản phẩm khỏi kho');
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-xs rounded"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
