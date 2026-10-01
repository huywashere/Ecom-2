'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Package,
  ExternalLink,
  ChevronDown,
  Lock,
  ArrowRight,
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
    { label: '🖥️ CẤU HÌNH PC RTX 4090', query: 'Tư vấn cấu hình PC gaming cao cấp RTX 4090' },
    { label: '💻 LAPTOP MACBOOK / ROG', query: 'Tư vấn Laptop đồ họa chuyên nghiệp và Gaming mỏng nhẹ' },
    { label: '⌨️ BÀN PHÍM CƠ & GEAR', query: 'Gợi ý bàn phím cơ gõ êm và chuột esports' },
    { label: '🎧 TAI NGHE CHỐNG ỒN', query: 'Tìm tai nghe chống ồn tốt nhất' },
    { label: '📦 TRA CỨU ĐƠN HÀNG', query: 'Tôi muốn kiểm tra tình trạng đơn hàng' },
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

    setTimeout(() => {
      const lower = message.toLowerCase();
      let botResponse = '';
      let matchedProducts: Product[] = [];

      const orderMatch = message.match(/TITAN-[A-Z0-9-]+/i);
      if (orderMatch) {
        const foundOrder = getOrder(orderMatch[0]);
        if (foundOrder) {
          const statusMap = {
            PENDING: '⏳ Chờ xác nhận',
            CONFIRMED: '✅ Đã xác nhận',
            PROCESSING: '📦 Đang đóng gói',
            SHIPPING: '🚚 Đang giao hàng',
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
    setOrderSuccessToast(`Đã thêm "${product.name.slice(0, 25)}..." vào giỏ!`);
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

    decreaseStock(checkoutProduct.id, quantity);

    const orderSuccessMsg: ChatMessage = {
      id: `bot-order-${Date.now()}`,
      sender: 'bot',
      text: `🎉 **ĐẶT HÀNG THÀNH CÔNG!**\n\nThông tin đơn hàng đã được chuyển thẳng về **Hệ Thống Quản Trị Admin**:\n\n• **Mã đơn hàng:** \`${newOrder.orderCode}\`\n• **Khách hàng:** ${customerName} (${customerPhone})\n• **Địa chỉ nhận:** ${customerAddress}\n• **Sản phẩm:** ${checkoutProduct.name} (Số lượng: ${quantity})\n• **Tổng thanh toán:** **${formatPrice(totalAmount, currency)}**\n• **Hình thức:** ${paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}\n\nNhân viên chăm sóc khách hàng của TITAN TECH sẽ gọi điện xác nhận trong vòng **5 - 15 phút** để xuất kho giao hàng ngay!`,
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
        <div className="fixed top-20 right-6 z-[60] bg-black text-white font-black text-xs uppercase px-4 py-3 rounded border-2 border-[#00B2FE] shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#00B2FE]" />
          <span>{orderSuccessToast}</span>
        </div>
      )}

      {/* Floating Trigger Button - matching Homepage TITAN TECH high-energy theme */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          {/* Invitation chip */}
          {!hasOpened && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded border border-[#00B2FE] shadow-[3px_3px_0px_#00B2FE]">
              <Sparkles className="w-3.5 h-3.5 text-[#00B2FE]" />
              <span>Tư Vấn &amp; Mua Nhanh: Chat AI</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Tech Consultant Chat"
            className="group relative w-14 h-14 rounded-full bg-black border-2 border-[#00B2FE] shadow-[0_0_15px_rgba(0,178,254,0.4)] hover:shadow-[0_0_25px_rgba(0,178,254,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            <Bot className="w-7 h-7 text-[#00B2FE] group-hover:rotate-12 transition-transform" />

            {/* Online Green Indicator */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF007A] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Window - Styled in Authentic TITAN TECH Homepage Style */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[85vh] h-[640px] bg-white border-2 border-black rounded-lg shadow-[8px_8px_0px_#000000] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header - Pitch Black with White & #00B2FE branding */}
          <div className="px-4 py-3 bg-black text-white flex items-center justify-between border-b-2 border-black shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#00B2FE] text-black flex items-center justify-center font-black">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black uppercase tracking-tight text-white">
                    TITAN <span className="text-[#00B2FE]">AI</span>
                  </h3>
                  <span className="px-1.5 py-0.2 bg-[#00B2FE] text-black font-black uppercase text-[9px] rounded-xs">
                    FLAGSHIP
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Trợ Lý Tư Vấn 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/admin"
                title="Mở Trang Quản Trị Admin"
                className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-[#00B2FE] font-black text-[10px] uppercase rounded border border-neutral-700 flex items-center gap-1 transition"
              >
                <ExternalLink className="w-3 h-3" /> Admin
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-neutral-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-neutral-100 border-b border-neutral-200 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-black hover:text-white text-black font-black uppercase text-[10px] tracking-wider rounded border border-black shadow-[1px_1px_0px_#000] transition shrink-0"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded bg-black text-[#00B2FE] flex items-center justify-center shrink-0 mt-0.5 border border-black">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="space-y-2 max-w-[85%]">
                  <div
                    className={`p-3 rounded leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-black text-white font-bold rounded-tr-none shadow-sm'
                        : 'bg-white border border-neutral-200 text-neutral-900 font-medium rounded-tl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Recommended Products in Homepage Card Aesthetic */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-2.5 bg-white border-2 border-black rounded shadow-[3px_3px_0px_#000] space-y-2"
                        >
                          <div className="flex gap-2.5 items-center">
                            <div className="relative w-14 h-14 rounded bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
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
                              <span className="px-1.5 py-0.5 bg-[#00B2FE] text-black font-black uppercase text-[9px] rounded-xs inline-block mb-0.5">
                                {prod.brandName}
                              </span>
                              <h4 className="font-black text-black text-[11px] truncate uppercase tracking-tight">
                                {prod.name}
                              </h4>
                              <div className="text-xs font-black text-black mt-0.5">
                                {formatPrice(prod.minPrice, currency)}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-100">
                            <button
                              onClick={() => handleAddToCart(prod)}
                              className="py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-black border border-black font-black uppercase text-[10px] tracking-wider rounded flex items-center justify-center gap-1 transition"
                            >
                              <ShoppingBag className="w-3 h-3" /> Thêm Giỏ
                            </button>
                            <button
                              onClick={() => handleStartQuickBuy(prod)}
                              className="py-1.5 px-2 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-[10px] tracking-wider rounded flex items-center justify-center gap-1 transition shadow-xs"
                            >
                              <Zap className="w-3 h-3" /> Mua Nhanh
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order Result Banner */}
                  {msg.orderAction && (
                    <div className="p-3 bg-neutral-900 text-white rounded border-2 border-[#00B2FE] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-black text-[#00B2FE]">#{msg.orderAction.orderCode}</span>
                        <span className="px-1.5 py-0.5 bg-green-500 text-black font-black uppercase text-[9px] rounded-xs">
                          ĐÃ LƯU ADMIN
                        </span>
                      </div>
                      <Link
                        href="/admin"
                        className="block w-full text-center py-2 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs tracking-wider rounded transition"
                      >
                        Mở Xem Đơn Hàng Trong Admin <ArrowRight className="w-3 h-3 inline ml-1" />
                      </Link>
                    </div>
                  )}

                  <div className="text-[9px] text-neutral-400 font-bold px-1">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-neutral-500 text-xs">
                <div className="w-5 h-5 rounded bg-black text-[#00B2FE] flex items-center justify-center">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="bg-white border border-neutral-200 px-3 py-1.5 rounded text-[11px] font-bold">
                  TITAN AI đang phản hồi...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Buy Overlay Form inside Chat Window */}
          {checkoutProduct && (
            <div className="absolute inset-0 bg-white z-20 flex flex-col p-5 overflow-y-auto animate-in slide-in-from-bottom duration-150">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-[#00B2FE] text-black font-black text-[10px] uppercase rounded-xs">
                    EXPRESS
                  </span>
                  <h4 className="text-xs font-black uppercase tracking-tight text-black">
                    MUA NHANH TRỰC TIẾP QUA CHAT
                  </h4>
                </div>
                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="p-1 text-black hover:opacity-70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selected Product Summary */}
              <div className="py-3 flex items-center gap-3 border-b border-neutral-200">
                <div className="relative w-12 h-12 rounded bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
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
                  <p className="text-xs font-black uppercase text-black truncate">{checkoutProduct.name}</p>
                  <p className="text-xs font-black text-[#00B2FE] mt-0.5">
                    {formatPrice(checkoutProduct.minPrice * quantity, currency)}
                  </p>
                </div>
                <div className="flex items-center border border-black rounded">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-0.5 text-black font-black text-xs hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-mono font-black text-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-0.5 text-black font-black text-xs hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmitQuickOrder} className="space-y-3 pt-3 flex-1 flex flex-col justify-between text-xs">
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                      Họ và tên người nhận <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium placeholder-neutral-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                      Số điện thoại nhận hàng <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0912345678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium placeholder-neutral-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                      Địa chỉ nhận hàng chi tiết <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, TP"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-white border border-neutral-300 focus:border-black rounded px-3 py-2 text-black font-medium placeholder-neutral-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                      Hình thức thanh toán
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`py-2 px-2 text-[10px] font-black uppercase tracking-wider rounded border text-center transition ${
                          paymentMethod === 'COD'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        Nhận hàng (COD)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('BANK_TRANSFER')}
                        className={`py-2 px-2 text-[10px] font-black uppercase tracking-wider rounded border text-center transition ${
                          paymentMethod === 'BANK_TRANSFER'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        Chuyển khoản (CK)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-black mb-1">
                      Ghi chú đơn hàng
                    </label>
                    <input
                      type="text"
                      placeholder="Giờ giao thuận tiện, gọi trước khi tới..."
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      className="w-full bg-white border border-neutral-300 focus:border-black rounded px-3 py-1.5 text-black font-medium placeholder-neutral-400 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-black space-y-2">
                  <div className="flex items-center justify-between font-black uppercase text-xs">
                    <span>Tổng Đơn:</span>
                    <span className="text-base text-black font-black">
                      {formatPrice(checkoutProduct.minPrice * quantity, currency)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs tracking-wider rounded border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Xác Nhận Đặt Hàng &amp; Gửi Admin
                  </button>
                  <p className="text-[10px] text-center text-neutral-500 font-bold uppercase tracking-wider">
                    Đơn hàng sẽ ngay lập tức xuất hiện trên trang Admin TITAN TECH.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Footer Input */}
          <div className="p-3 bg-white border-t-2 border-black shrink-0">
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
                className="flex-1 bg-neutral-100 border border-neutral-300 focus:border-black rounded px-3 py-2 text-xs text-black placeholder-neutral-400 outline-none font-medium"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-black hover:bg-neutral-800 text-[#00B2FE] disabled:opacity-40 disabled:pointer-events-none rounded transition"
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
