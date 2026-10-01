'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Package,
  RotateCcw,
  ChevronDown,
  Minimize2,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Laptop,
  Keyboard,
  Headphones,
  Check,
} from 'lucide-react';
import { useAdminOrderStore } from '@/store/admin-order-store';
import { useAdminProductStore } from '@/store/admin-product-store';
import { useCartStore } from '@/store/cart-store';
import { useCurrencyStore } from '@/store/currency-store';
import { formatPrice } from '@/lib/formatters';
import { Product } from '@/types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  products?: Product[];
  orderAction?: {
    orderCode: string;
    productName: string;
    totalAmount: number;
    recipientName: string;
  };
}

export default function TechConsultantBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [hasOpened, setHasOpened] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Quick Checkout State inside Chatbot
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('COD');
  const [quantity, setQuantity] = useState(1);
  const [orderSuccessToast, setOrderSuccessToast] = useState<string | null>(null);

  const { products, decreaseStock } = useAdminProductStore();
  const { addOrder, getOrder } = useAdminOrderStore();
  const { addItem } = useCartStore();
  const { currency } = useCurrencyStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Xin chào! Tôi là **TITAN AI** – Trợ lý tư vấn công nghệ & chốt đơn thông minh của TITAN TECH.\n\nTôi có thể giúp bạn:\n• 🖥️ Tư vấn cấu hình PC Gaming / Laptop đồ họa chuẩn nhu cầu\n• ⚡ Đặt mua sản phẩm siêu tốc ngay tại khung chat này\n• 📦 Tra cứu tình trạng đơn hàng real-time\n\nBạn đang quan tâm đến dòng sản phẩm nào?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setHasOpened(true);
    }
  }, [isOpen, messages, isTyping]);

  const quickPrompts = [
    { label: '🖥️ Cấu hình PC RTX 4090', query: 'Tư vấn cấu hình PC gaming cao cấp RTX 4090' },
    { label: '💻 Laptop MacBook M3 / ROG', query: 'Tư vấn Laptop đồ họa chuyên nghiệp và Gaming mỏng nhẹ' },
    { label: '⌨️ Bàn phím cơ & Chuột', query: 'Gợi ý bàn phím cơ gõ êm và chuột esports' },
    { label: '🎧 Tai nghe chống ồn đỉnh cao', query: 'Tìm tai nghe chống ồn tốt nhất' },
    { label: '📦 Tra cứu đơn hàng', query: 'Tôi muốn kiểm tra tình trạng đơn hàng' },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    // AI Analysis & Response Engine
    setTimeout(() => {
      const lower = message.toLowerCase();
      let botResponse = '';
      let matchedProducts: Product[] = [];

      // Check for Order tracking query (e.g. TITAN-AI-12345 or user asking for tracking)
      const orderMatch = message.match(/TITAN-[A-Z0-9-]+/i);
      if (orderMatch) {
        const foundOrder = getOrder(orderMatch[0]);
        if (foundOrder) {
          const statusMap = {
            PENDING: '⏳ Chờ xác nhận',
            CONFIRMED: '✅ Đã xác nhận',
            PROCESSING: '📦 Đang đóng gói cẩn thận',
            SHIPPING: '🚚 Đang giao hàng siêu tốc',
            DELIVERED: '🎉 Đã giao thành công',
            CANCELLED: '❌ Đã hủy',
          };
          botResponse = `🔍 **KẾT QUẢ TRA CỨU ĐƠN HÀNG #${foundOrder.orderCode}**:\n\n• **Người nhận:** ${foundOrder.recipientName} (${foundOrder.recipientPhone})\n• **Địa chỉ giao:** ${foundOrder.shippingAddress}\n• **Sản phẩm:** ${foundOrder.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}\n• **Tổng tiền:** ${formatPrice(foundOrder.finalAmount, currency)}\n• **Trạng thái:** **${statusMap[foundOrder.orderStatus]}**\n• **Phương thức:** ${foundOrder.paymentMethod} (${foundOrder.paymentStatus === 'COMPLETED' ? 'Đã thanh toán' : 'Chưa thanh toán'})\n\nĐơn hàng đã được lưu và đồng bộ trên trang Admin!`;
        } else {
          botResponse = `Không tìm thấy đơn hàng với mã **${orderMatch[0]}** trong hệ thống. Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ hotline 1800-8888 để được hỗ trợ!`;
        }
      } else if (lower.includes('tra cứu') || lower.includes('kiểm tra đơn') || lower.includes('tình trạng đơn')) {
        botResponse = `Để tra cứu đơn hàng, bạn vui lòng nhập mã đơn hàng (Ví dụ: **TITAN-AI-88214** hoặc **TITAN-WEB-64912**), tôi sẽ kiểm tra trực tiếp từ hệ thống quản trị admin ngay lập tức!`;
      } else if (
        lower.includes('pc') ||
        lower.includes('cấu hình') ||
        lower.includes('rtx 4090') ||
        lower.includes('battlestation') ||
        lower.includes('máy bàn')
      ) {
        botResponse = `TITAN TECH hiện có sẵn 2 cỗ máy chiến game & đồ họa 3D/AI mạnh nhất Việt Nam hiện nay, tản nhiệt nước Custom Hardline, bảo hành tận nhà 36 tháng:\n\n1. **TITAN BEAST RTX 4090**: CPU Intel i9-14900KS + NVIDIA RTX 4090 24GB + 64GB DDR5.\n2. **CYBERPUNK ROG Hyperion**: Full hệ sinh thái ASUS ROG GR701 cao cấp nhất.\n\nBạn có thể bấm **⚡ MUA NHANH** bên dưới để chốt đơn ngay hoặc **Thêm vào giỏ**:`;
        matchedProducts = products.filter((p) => p.categorySlug === 'gaming-pc');
      } else if (
        lower.includes('laptop') ||
        lower.includes('macbook') ||
        lower.includes('rog') ||
        lower.includes('zephyrus') ||
        lower.includes('m3')
      ) {
        botResponse = `Nếu bạn cần máy tính xách tay cao cấp:\n\n• **MacBook Pro 16" M3 Max**: Sự lựa chọn số 1 cho Render video 8K, lập trình AI và thiết kế đồ họa đỉnh cao với thời lượng pin 22 giờ.\n• **ASUS ROG Zephyrus G16 OLED**: Laptop gaming mỏng nhẹ màn hình OLED 240Hz, card RTX 4090 cực mạnh.\n\nTham khảo ngay cấu hình chi tiết bên dưới:`;
        matchedProducts = products.filter((p) => p.categorySlug === 'laptops');
      } else if (
        lower.includes('màn hình') ||
        lower.includes('monitor') ||
        lower.includes('oled') ||
        lower.includes('samsung') ||
        lower.includes('g9')
      ) {
        botResponse = `Dành cho trải nghiệm thị giác không giới hạn:\n\n• **Samsung Odyssey OLED G9 49"**: Tấm nền OLED chuẩn màu 99% DCI-P3, tần số quét 240Hz, tỷ lệ 32:9 siêu rộng thay thế trọn vẹn 2 màn hình rời!`;
        matchedProducts = products.filter((p) => p.categorySlug === 'monitors');
      } else if (
        lower.includes('phím') ||
        lower.includes('chuột') ||
        lower.includes('gear') ||
        lower.includes('keyboard') ||
        lower.includes('mouse')
      ) {
        botResponse = `Bộ đôi gear chuẩn thi đấu esports được các game thủ và lập trình viên săn đón:\n\n• **Keychron Q1 Pro**: Vỏ nhôm CNC đầm chắc, switch Banana tactile êm ái, kết nối không dây 3 thiết bị.\n• **Logitech G PRO X Superlight 2**: Chuột siêu nhẹ, mắt đọc Hero 2 32.000 DPI siêu chuẩn.`;
        matchedProducts = products.filter((p) => ['keyboards', 'mice'].includes(p.categorySlug || ''));
      } else if (lower.includes('tai nghe') || lower.includes('audio') || lower.includes('sony') || lower.includes('wh-1000xm5')) {
        botResponse = `**Sony WH-1000XM5** là mẫu tai nghe chống ồn chủ động (ANC) số 1 hiện nay với 8 micro và 2 bộ xử lý âm thanh chống ồn thông minh, hỗ trợ Hi-Res Audio không dây LDAC.`;
        matchedProducts = products.filter((p) => p.categorySlug === 'audio');
      } else {
        botResponse = `Cảm ơn bạn đã liên hệ! TITAN TECH là đại lý ủy quyền chính hãng của Apple, NVIDIA, ASUS ROG, Sony, Keychron, Logitech G. Mọi sản phẩm đều nguyên seal chính hãng, bảo hành 12-36 tháng và hỗ trợ trả góp 0%.\n\nDưới đây là một số sản phẩm Flagship bán chạy nhất tuần này bạn có thể tham khảo:`;
        matchedProducts = products.slice(0, 3);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          products: matchedProducts.length > 0 ? matchedProducts : undefined,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleAddToCart = (product: Product) => {
    // Construct dummy variant for quick add
    const variant = {
      id: product.id * 100 + 1,
      sku: `${product.slug}-std`,
      variantName: 'Tiêu chuẩn Flagship',
      price: product.minPrice,
      originalPrice: product.originalPrice,
      stockQuantity: product.totalStock,
      active: true,
    };
    addItem(product, variant, 1);
    setOrderSuccessToast(`Đã thêm "${product.name.slice(0, 30)}..." vào giỏ hàng!`);
    setTimeout(() => setOrderSuccessToast(null), 3000);
  };

  const handleStartQuickBuy = (product: Product) => {
    setCheckoutProduct(product);
    setQuantity(1);
  };

  const handleSubmitQuickOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutProduct) return;
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    const totalAmount = checkoutProduct.minPrice * quantity;

    // Dispatch order to Admin Order Store with source: CHATBOT!
    const newOrder = addOrder({
      recipientName: customerName,
      recipientPhone: customerPhone,
      shippingAddress: customerAddress,
      notes: customerNote ? `[Chatbot Quick Buy] ${customerNote}` : '[Chatbot Quick Buy] Khách mua trực tiếp qua AI Bot',
      totalAmount,
      shippingFee: 0,
      discountAmount: 0,
      finalAmount: totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'BANK_TRANSFER' ? 'COMPLETED' : 'PENDING',
      orderStatus: 'PENDING',
      source: 'CHATBOT',
      items: [
        {
          id: `item-${Date.now()}`,
          productId: checkoutProduct.id,
          productName: checkoutProduct.name,
          variantName: 'Phiên bản tiêu chuẩn Flagship',
          price: checkoutProduct.minPrice,
          quantity,
          subtotal: totalAmount,
          imageUrl: checkoutProduct.thumbnail,
        },
      ],
    });

    // Deduct stock in Product Store
    decreaseStock(checkoutProduct.id, quantity);

    // Bot sends congratulatory message inside chat
    const orderSuccessMsg: ChatMessage = {
      id: `bot-order-${Date.now()}`,
      sender: 'bot',
      text: `🎉 **ĐẶT HÀNG THÀNH CÔNG SIÊU TỐC!**\n\nThông tin đơn hàng của bạn đã được chuyển thẳng về **Hệ Thống Quản Trị Admin**:\n\n• **Mã đơn hàng:** \`${newOrder.orderCode}\`\n• **Khách hàng:** ${customerName} (${customerPhone})\n• **Địa chỉ nhận:** ${customerAddress}\n• **Sản phẩm:** ${checkoutProduct.name} (Số lượng: ${quantity})\n• **Tổng thanh toán:** **${formatPrice(totalAmount, currency)}**\n• **Hình thức:** ${paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}\n\nNhân viên chăm sóc khách hàng của TITAN TECH sẽ gọi điện xác nhận trong vòng **5 - 15 phút** để xuất kho giao hàng ngay!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      orderAction: {
        orderCode: newOrder.orderCode,
        productName: checkoutProduct.name,
        totalAmount,
        recipientName: customerName,
      },
    };

    setMessages((prev) => [...prev, orderSuccessMsg]);
    setCheckoutProduct(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setCustomerNote('');
    setOrderSuccessToast(`Đơn hàng #${newOrder.orderCode} đã gửi về Admin!`);
    setTimeout(() => setOrderSuccessToast(null), 4000);
  };

  return (
    <>
      {/* Toast Notification */}
      {orderSuccessToast && (
        <div className="fixed top-20 right-6 z-[60] bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs">{orderSuccessToast}</span>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Subtle invitation chip */}
          {!hasOpened && (
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 text-cyan-300 text-xs font-bold border border-cyan-500/40 shadow-xl backdrop-blur-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cần tư vấn hoặc mua nhanh? Chat với TITAN AI</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Tech Consultant Chat"
            className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-[2px] shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {/* Glowing ring animation */}
            <span className="absolute -inset-1 rounded-full bg-cyan-400/30 blur-sm group-hover:bg-cyan-400/50 transition duration-300 animate-pulse" />

            <div className="relative w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <Bot className="w-7 h-7 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />

              {/* Online pulse dot */}
              <span className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-sm" />

              {/* Unread badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950 shadow">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[85vh] h-[640px] bg-slate-950/95 border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/80 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Bot className="w-6 h-6 text-cyan-400" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white tracking-wide">TITAN AI CONSULTANT</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Sẵn sàng tư vấn &amp; chốt đơn
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/admin"
                title="Mở Trang Quản Trị Admin"
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-cyan-400 transition text-[11px] flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 text-[11px] font-medium transition"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%]`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-xs font-medium'
                        : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* If Bot recommended products */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400/60 transition space-y-2"
                        >
                          <div className="flex gap-2.5 items-center">
                            <div className="relative w-14 h-14 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                              {prod.thumbnail && (
                                <Image
                                  src={prod.thumbnail}
                                  alt={prod.name}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white text-[11px] truncate">{prod.name}</h4>
                              <p className="text-[10px] text-cyan-400 font-mono">
                                {prod.brandName} • Còn {prod.totalStock} chiếc
                              </p>
                              <div className="text-xs font-black text-white mt-0.5">
                                {formatPrice(prod.minPrice, currency)}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons for this product */}
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                            <button
                              onClick={() => handleAddToCart(prod)}
                              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center justify-center gap-1 transition"
                            >
                              <ShoppingBag className="w-3 h-3 text-cyan-400" />
                              Thêm Giỏ
                            </button>
                            <button
                              onClick={() => handleStartQuickBuy(prod)}
                              className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-[10px] font-black flex items-center justify-center gap-1 transition"
                            >
                              <Zap className="w-3 h-3" />
                              ⚡ MUA NHANH
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* If Message contains Order Action Result */}
                  {msg.orderAction && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-bold">Mã Đơn: #{msg.orderAction.orderCode}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                          ĐÃ LƯU ADMIN
                        </span>
                      </div>
                      <Link
                        href="/admin"
                        className="block w-full text-center py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition"
                      >
                        👉 Mở Xem Đơn Hàng Trên Trang Admin
                      </Link>
                    </div>
                  )}

                  <div className="text-[9px] text-slate-500 px-1">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1 bg-slate-900 border border-white/10 px-3 py-2 rounded-2xl">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-slate-400 ml-1">TITAN AI đang phản hồi...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Buy Overlay Form inside Chat Window */}
          {checkoutProduct && (
            <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl z-20 flex flex-col p-5 overflow-y-auto animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-black text-white uppercase">MUA NHANH TRỰC TIẾP QUA CHAT</h4>
                </div>
                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selected Product Summary */}
              <div className="py-3 flex items-center gap-3 border-b border-white/10">
                <div className="relative w-12 h-12 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0">
                  {checkoutProduct.thumbnail && (
                    <Image
                      src={checkoutProduct.thumbnail}
                      alt={checkoutProduct.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{checkoutProduct.name}</p>
                  <p className="text-xs font-black text-cyan-400 mt-0.5">
                    {formatPrice(checkoutProduct.minPrice * quantity, currency)}
                  </p>
                </div>
                <div className="flex items-center border border-white/20 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 text-slate-300 hover:text-white text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-mono text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-1 text-slate-300 hover:text-white text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmitQuickOrder} className="space-y-3 pt-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Họ và tên người nhận <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Số điện thoại nhận hàng <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0912345678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Địa chỉ nhận hàng chi tiết <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, TP"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-2 text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Hình thức thanh toán</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold text-center transition ${
                          paymentMethod === 'COD'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-900 border-white/10 text-slate-400'
                        }`}
                      >
                        Thanh toán khi nhận (COD)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('BANK_TRANSFER')}
                        className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold text-center transition ${
                          paymentMethod === 'BANK_TRANSFER'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-900 border-white/10 text-slate-400'
                        }`}
                      >
                        Chuyển khoản (Banking)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Ghi chú giao hàng</label>
                    <input
                      type="text"
                      placeholder="Giờ giao thuận tiện, gọi trước khi tới..."
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      className="w-full bg-slate-900 border border-white/15 focus:border-cyan-400 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Tổng đơn hàng:</span>
                    <span className="text-cyan-400 text-base font-black">
                      {formatPrice(checkoutProduct.minPrice * quantity, currency)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Xác Nhận Đặt Hàng &amp; Gửi Về Admin
                  </button>
                  <p className="text-[10px] text-center text-slate-500">
                    Đơn hàng sẽ ngay lập tức xuất hiện trên trang Quản Trị Admin của TITAN TECH.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Footer Input */}
          <div className="p-3 bg-slate-900 border-t border-cyan-500/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập câu hỏi, cấu hình cần tư vấn hoặc mã đơn..."
                className="flex-1 bg-slate-950 border border-white/10 focus:border-cyan-400 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 disabled:opacity-40 disabled:pointer-events-none transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
