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
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check,
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
          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Chờ xử lý
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-bold flex items-center gap-1">
            <Check className="w-3 h-3" /> Đã duyệt
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1">
            <Package className="w-3 h-3" /> Đang đóng gói
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold flex items-center gap-1">
            <Truck className="w-3 h-3" /> Đang giao
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Giao thành công
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-1">
            <X className="w-3 h-3" /> Đã hủy
          </span>
        );
    }
  };

  const getSourceBadge = (source: OrderSource) => {
    switch (source) {
      case 'CHATBOT':
        return (
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1">
            <Bot className="w-3 h-3" /> Chatbot AI
          </span>
        );
      case 'CHECKOUT':
        return (
          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1">
            <Globe className="w-3 h-3" /> Web Checkout
          </span>
        );
      case 'MANUAL':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
            <Edit3 className="w-3 h-3" /> Tạo Thủ Công
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  TITAN CONTROL CENTER
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                  ADMIN PRO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hệ thống Quản Trị Đơn Hàng CRUD &amp; Quản Lý Kho Sản Phẩm TITAN TECH
              </p>
            </div>
          </div>

          {/* Quick Actions & Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900 p-1 rounded-2xl border border-white/10 flex items-center">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'orders'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Quản Lý Đơn Hàng ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'products'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" /> Quản Lý Sản Phẩm ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'analytics'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" /> Báo Cáo &amp; Doanh Thu
              </button>
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Xem Shop
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Doanh Thu Tổng Đơn</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{formatPrice(stats.totalRev, currency)}</div>
            <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {stats.totalOrders} đơn hàng ghi nhận
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Nguồn Đơn Chốt</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{stats.chatbotOrders} Chatbot / {stats.checkoutOrders} Web</div>
            <p className="text-[11px] text-purple-300 mt-1 font-mono">
              Trợ lý AI đóng góp {Math.round((stats.chatbotOrders / (stats.totalOrders || 1)) * 100)}% tổng số đơn
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Đơn Chờ Xử Lý</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{stats.pendingOrders} đơn mới</div>
            <p className="text-[11px] text-amber-400 mt-1 font-mono">Cần liên hệ xác nhận xuất kho</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Tồn Kho Sản Phẩm</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{stats.totalInventory} chiếc</div>
            <p className="text-[11px] text-emerald-400 mt-1 font-mono">
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
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative min-w-[260px] flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Tìm theo Mã đơn, Khách hàng, SĐT, Sản phẩm..."
                    className="w-full bg-slate-950 border border-white/10 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter by Status */}
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-white/10 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="PROCESSING">Đang đóng gói</option>
                  <option value="SHIPPING">Đang giao hàng</option>
                  <option value="DELIVERED">Đã giao thành công</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>

                {/* Filter by Source */}
                <select
                  value={orderSourceFilter}
                  onChange={(e) => setOrderSourceFilter(e.target.value)}
                  className="bg-slate-950 border border-white/10 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
                >
                  <option value="ALL">Tất cả nguồn đơn</option>
                  <option value="CHATBOT">🤖 Từ Chatbot AI</option>
                  <option value="CHECKOUT">🛒 Từ Web Checkout</option>
                  <option value="MANUAL">✍️ Tạo Thủ Công</option>
                </select>
              </div>

              {/* Order Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setIsCreateOrderOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Thêm Đơn Hàng Mới
                </button>
                <button
                  onClick={resetOrders}
                  title="Khôi phục dữ liệu đơn mẫu"
                  className="p-2 rounded-xl bg-slate-950 border border-white/10 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Mã Đơn / Ngày</th>
                      <th className="py-3.5 px-4">Nguồn</th>
                      <th className="py-3.5 px-4">Khách Hàng</th>
                      <th className="py-3.5 px-4">Sản Phẩm Đặt</th>
                      <th className="py-3.5 px-4">Tổng Tiền</th>
                      <th className="py-3.5 px-4">Thanh Toán</th>
                      <th className="py-3.5 px-4">Trạng Thái Đơn</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác CRUD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <ShoppingBag className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
                          Không tìm thấy đơn hàng nào phù hợp với bộ lọc tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.03] transition">
                          {/* Order Code */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <button
                              onClick={() => setViewingOrder(order)}
                              className="font-mono font-black text-cyan-400 hover:underline block text-left"
                            >
                              #{order.orderCode}
                            </button>
                            <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                              {formatDate(order.createdAt)}
                            </div>
                          </td>

                          {/* Source */}
                          <td className="py-4 px-4 whitespace-nowrap">{getSourceBadge(order.source)}</td>

                          {/* Customer */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <p className="font-bold text-white">{order.recipientName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{order.recipientPhone}</p>
                          </td>

                          {/* Items summary */}
                          <td className="py-4 px-4 max-w-[260px]">
                            <div className="space-y-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 truncate">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                  <span className="text-slate-200 font-medium truncate">{item.productName}</span>
                                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                    x{item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total */}
                          <td className="py-4 px-4 font-black text-white whitespace-nowrap">
                            {formatPrice(order.finalAmount, currency)}
                          </td>

                          {/* Payment */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-slate-300 font-mono text-[10px] block w-fit">
                                {order.paymentMethod}
                              </span>
                              <span
                                className={`text-[10px] font-bold ${
                                  order.paymentStatus === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'
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
                              className="bg-slate-950 border border-white/15 text-xs text-white rounded-xl px-2.5 py-1.5 focus:border-cyan-400 outline-none font-bold cursor-pointer"
                            >
                              <option value="PENDING">⏳ Chờ xử lý</option>
                              <option value="CONFIRMED">✅ Đã duyệt</option>
                              <option value="PROCESSING">📦 Đang đóng gói</option>
                              <option value="SHIPPING">🚚 Đang giao hàng</option>
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
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingOrder(order)}
                                title="Sửa thông tin đơn"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 transition"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingOrderId(order.id)}
                                title="Xóa đơn hàng"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
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
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative min-w-[260px] flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Tìm theo Tên sản phẩm, Thương hiệu..."
                    className="w-full bg-slate-950 border border-white/10 focus:border-cyan-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-white/10 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
                >
                  <option value="ALL">Tất cả danh mục</option>
                  {DEMO_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setIsCreateProductOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Thêm Sản Phẩm Mới
                </button>
                <button
                  onClick={resetProducts}
                  title="Khôi phục danh sách sản phẩm mặc định"
                  className="p-2 rounded-xl bg-slate-950 border border-white/10 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Ảnh &amp; Tên Sản Phẩm</th>
                      <th className="py-3.5 px-4">Danh Mục</th>
                      <th className="py-3.5 px-4">Thương Hiệu</th>
                      <th className="py-3.5 px-4">Giá Bán</th>
                      <th className="py-3.5 px-4">Tồn Kho</th>
                      <th className="py-3.5 px-4">Bảo Hành</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác CRUD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Package className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
                          Không tìm thấy sản phẩm nào.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-white/[0.03] transition">
                          {/* Image & Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3 max-w-[340px]">
                              <div className="relative w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
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
                                  className="font-bold text-white hover:text-cyan-400 transition truncate block"
                                >
                                  {product.name}
                                </Link>
                                <span className="text-[10px] text-slate-500 font-mono">ID: #{product.id}</span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-md bg-slate-950 border border-white/10 text-slate-300 font-medium text-[11px]">
                              {product.categoryName || product.categorySlug}
                            </span>
                          </td>

                          {/* Brand */}
                          <td className="py-3.5 px-4 whitespace-nowrap font-bold text-cyan-300">
                            {product.brandName}
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <p className="font-black text-white">{formatPrice(product.minPrice, currency)}</p>
                            {product.originalPrice > product.minPrice && (
                              <p className="text-[10px] text-slate-500 line-through">
                                {formatPrice(product.originalPrice, currency)}
                              </p>
                            )}
                          </td>

                          {/* Stock */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {product.totalStock <= 5 ? (
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
                                Sắp hết: {product.totalStock} cái
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                                Còn {product.totalStock} cái
                              </span>
                            )}
                          </td>

                          {/* Warranty */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono">
                            {product.warrantyMonths} Tháng
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/products/${product.slug}`}
                                target="_blank"
                                title="Xem trên website"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => setEditingProduct(product)}
                                title="Chỉnh sửa sản phẩm"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 transition"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingProductId(product.id)}
                                title="Xóa sản phẩm"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
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
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" /> Hiệu Suất Trợ Lý AI Chatbot vs Website
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tỷ lệ khách hàng được tư vấn và chốt đơn tự động qua khung Chatbot AI ở góc phải màn hình so với đặt hàng truyền thống qua trang Checkout.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-cyan-300">🤖 Chốt Qua Chatbot AI ({stats.chatbotOrders} đơn)</span>
                    <span className="text-white font-mono">
                      {Math.round((stats.chatbotOrders / (stats.totalOrders || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{
                        width: `${Math.round((stats.chatbotOrders / (stats.totalOrders || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-purple-300">🛒 Website Checkout ({stats.checkoutOrders} đơn)</span>
                    <span className="text-white font-mono">
                      {Math.round((stats.checkoutOrders / (stats.totalOrders || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      style={{
                        width: `${Math.round((stats.checkoutOrders / (stats.totalOrders || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" /> Cảnh Báo Tồn Kho Cần Nhập Thêm
              </h3>
              <div className="space-y-2.5">
                {products
                  .filter((p) => p.totalStock < 15)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.brandName} • {p.categoryName}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold shrink-0">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-black text-cyan-400">#{viewingOrder.orderCode}</span>
                {getSourceBadge(viewingOrder.source)}
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-900 p-4 rounded-2xl border border-white/10">
              <div>
                <span className="text-slate-400 block font-bold mb-0.5">Khách Hàng:</span>
                <p className="font-black text-white text-sm">{viewingOrder.recipientName}</p>
                <p className="text-cyan-400 font-mono mt-0.5">{viewingOrder.recipientPhone}</p>
              </div>
              <div>
                <span className="text-slate-400 block font-bold mb-0.5">Địa Chỉ Giao:</span>
                <p className="text-slate-200 leading-snug">{viewingOrder.shippingAddress}</p>
              </div>
            </div>

            {/* Notes */}
            {viewingOrder.notes && (
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs">
                <span className="text-slate-400 font-bold block mb-0.5">Ghi Chú Đơn Hàng:</span>
                <p className="text-slate-300 italic">{viewingOrder.notes}</p>
              </div>
            )}

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh Sách Sản Phẩm</h4>
              <div className="divide-y divide-white/5 border border-white/10 rounded-2xl p-2 bg-slate-900">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 px-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.imageUrl && (
                        <div className="relative w-10 h-10 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                          <Image src={item.imageUrl} alt={item.productName} fill sizes="40px" className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-[10px] text-slate-400 truncate">{item.variantName}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-white">{formatPrice(item.price, currency)}</p>
                      <p className="text-[11px] text-cyan-400 font-mono">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-300">Tổng Thanh Toán:</span>
              <span className="text-xl font-black text-cyan-400">{formatPrice(viewingOrder.finalAmount, currency)}</span>
            </div>

            {/* Status Change Selector inside Modal */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-slate-400">Cập nhật trạng thái:</span>
              <select
                value={viewingOrder.orderStatus}
                onChange={(e) => {
                  const newStatus = e.target.value as OrderStatus;
                  updateOrderStatus(viewingOrder.id, newStatus);
                  setViewingOrder({ ...viewingOrder, orderStatus: newStatus });
                  showToast(`Đã đổi trạng thái đơn #${viewingOrder.orderCode}`);
                }}
                className="bg-slate-900 border border-white/20 text-xs text-white rounded-xl px-3 py-1.5 focus:border-cyan-400 outline-none font-bold"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateOrderSubmit}
            className="w-full max-w-lg bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" /> Tạo Đơn Hàng Mới Cho Khách
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOrderOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Chọn Sản Phẩm Trong Kho <span className="text-rose-400">*</span>
                </label>
                <select
                  value={newOrderSelectedProdId}
                  onChange={(e) => setNewOrderSelectedProdId(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
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
                  <label className="block text-slate-300 font-bold mb-1">Số Lượng</label>
                  <input
                    type="number"
                    min={1}
                    value={newOrderQty}
                    onChange={(e) => setNewOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Hình Thức Thanh Toán</label>
                  <select
                    value={newOrderPayment}
                    onChange={(e) => setNewOrderPayment(e.target.value as 'COD' | 'BANK_TRANSFER')}
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="COD">Thanh toán khi nhận (COD)</option>
                    <option value="BANK_TRANSFER">Chuyển khoản (Đã thanh toán)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Họ Tên Khách Hàng <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Minh Trí"
                  value={newOrderCustomer}
                  onChange={(e) => setNewOrderCustomer(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Số Điện Thoại <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0988112233"
                  value={newOrderPhone}
                  onChange={(e) => setNewOrderPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Địa Chỉ Giao Hàng <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, đường, quận/huyện, tỉnh thành..."
                  value={newOrderAddress}
                  onChange={(e) => setNewOrderAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ghi Chú</label>
                <input
                  type="text"
                  placeholder="Yêu cầu kiểm tra máy, quà tặng..."
                  value={newOrderNotes}
                  onChange={(e) => setNewOrderNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateOrderOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleEditOrderSubmit}
            className="w-full max-w-lg bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" /> Sửa Thông Tin Đơn #{editingOrder.orderCode}
              </h3>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên Người Nhận</label>
                <input
                  type="text"
                  required
                  value={editingOrder.recipientName}
                  onChange={(e) => setEditingOrder({ ...editingOrder, recipientName: e.target.value })}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Số Điện Thoại</label>
                <input
                  type="tel"
                  required
                  value={editingOrder.recipientPhone}
                  onChange={(e) => setEditingOrder({ ...editingOrder, recipientPhone: e.target.value })}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Địa Chỉ Nhận Hàng</label>
                <input
                  type="text"
                  required
                  value={editingOrder.shippingAddress}
                  onChange={(e) => setEditingOrder({ ...editingOrder, shippingAddress: e.target.value })}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Trạng Thái Đơn</label>
                  <select
                    value={editingOrder.orderStatus}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, orderStatus: e.target.value as OrderStatus })
                    }
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="CONFIRMED">Đã xác nhận</option>
                    <option value="PROCESSING">Đang đóng gói</option>
                    <option value="SHIPPING">Đang giao hàng</option>
                    <option value="DELIVERED">Đã giao thành công</option>
                    <option value="CANCELLED">Hủy đơn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Trạng Thái Thanh Toán</label>
                  <select
                    value={editingOrder.paymentStatus}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, paymentStatus: e.target.value as PaymentStatus })
                    }
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="PENDING">Chờ thanh toán</option>
                    <option value="COMPLETED">Đã thanh toán</option>
                    <option value="FAILED">Thất bại</option>
                    <option value="REFUNDED">Đã hoàn tiền</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ghi Chú</label>
                <textarea
                  rows={2}
                  value={editingOrder.notes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider"
              >
                Cập Nhật
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DELETE ORDER CONFIRMATION                               */}
      {/* ============================================================== */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Xác Nhận Xóa Đơn Hàng?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn có chắc chắn muốn xóa đơn hàng này khỏi hệ thống? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingOrderId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  deleteOrder(deletingOrderId);
                  setDeletingOrderId(null);
                  showToast('Đã xóa đơn hàng thành công');
                }}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black shadow-lg shadow-rose-500/20"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProductSubmit}
            className="w-full max-w-lg bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" /> Thêm Sản Phẩm Mới Vào Kho
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateProductOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Tên Sản Phẩm <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Card Đồ Họa ASUS ROG Matrix RTX 4090 Platinum"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Danh Mục</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {DEMO_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Thương Hiệu</label>
                  <select
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {DEMO_BRANDS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giá Bán ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giá Gốc ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdOrigPrice}
                    onChange={(e) => setNewProdOrigPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tồn Kho (Số lượng)</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Link Ảnh Thumbnail (URL)</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newProdThumb}
                  onChange={(e) => setNewProdThumb(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Mô Tả Sản Phẩm</label>
                <textarea
                  rows={2}
                  placeholder="Thông số, tính năng nổi bật..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateProductOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider"
              >
                Thêm Vào Danh Mục
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT PRODUCT                                            */}
      {/* ============================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleEditProductSubmit}
            className="w-full max-w-lg bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" /> Sửa Sản Phẩm #{editingProduct.id}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên Sản Phẩm</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giá Bán ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.minPrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, minPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giá Gốc ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tồn Kho</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.totalStock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, totalStock: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Link Ảnh Thumbnail (URL)</label>
                <input
                  type="url"
                  value={editingProduct.thumbnail || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Mô Tả Ngắn</label>
                <textarea
                  rows={3}
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Xác Nhận Xóa Sản Phẩm?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sản phẩm này sẽ bị xóa khỏi hệ thống quản trị và danh sách bán trên cửa hàng.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  deleteProduct(deletingProductId);
                  setDeletingProductId(null);
                  showToast('Đã xóa sản phẩm khỏi kho');
                }}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black shadow-lg shadow-rose-500/20"
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
