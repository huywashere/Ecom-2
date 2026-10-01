import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/types';

export type OrderSource = 'CHATBOT' | 'CHECKOUT' | 'MANUAL';

export interface AdminOrderItem {
  id: string | number;
  productId?: number;
  productName: string;
  variantName?: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
}

export interface AdminOrder {
  id: string;
  orderCode: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes?: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod | 'CARD';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  source: OrderSource;
  items: AdminOrderItem[];
}

interface AdminOrderState {
  orders: AdminOrder[];
  addOrder: (order: Omit<AdminOrder, 'id' | 'orderCode' | 'createdAt'> & { orderCode?: string }) => AdminOrder;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  updateOrder: (id: string, updates: Partial<AdminOrder>) => void;
  deleteOrder: (id: string) => void;
  getOrder: (codeOrId: string) => AdminOrder | undefined;
  resetToDefault: () => void;
}

const DEFAULT_ORDERS: AdminOrder[] = [
  {
    id: 'ord-1001',
    orderCode: 'TITAN-AI-88214',
    recipientName: 'Nguyễn Văn An',
    recipientPhone: '0912345678',
    shippingAddress: 'Tòa nhà Landmark 81, P. 22, Q. Bình Thạnh, TP. Hồ Chí Minh',
    notes: 'Khách yêu cầu giao gấp buổi chiều, hỗ trợ cài đặt macOS và phần mềm đồ họa.',
    totalAmount: 3499.00,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 3499.00,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'COMPLETED',
    orderStatus: 'SHIPPING',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    source: 'CHATBOT',
    items: [
      {
        id: 'item-1',
        productId: 1,
        productName: 'Apple MacBook Pro 16" (M3 Max, 36GB RAM, 1TB SSD, Space Black)',
        variantName: 'Space Black / 36GB / 1TB SSD',
        price: 3499.00,
        quantity: 1,
        subtotal: 3499.00,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'ord-1002',
    orderCode: 'TITAN-WEB-64912',
    recipientName: 'Trần Minh Quân',
    recipientPhone: '0988776655',
    shippingAddress: 'Số 18 Đường Láng, Q. Đống Đa, Hà Nội',
    notes: 'Giao trong giờ hành chính, đóng gói chống sốc kỹ.',
    totalAmount: 4299.00,
    shippingFee: 0,
    discountAmount: 100.00,
    finalAmount: 4199.00,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'PROCESSING',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    source: 'CHECKOUT',
    items: [
      {
        id: 'item-2',
        productId: 3,
        productName: 'TITAN BEAST RTX 4090 Custom Watercooled Gaming PC Rig',
        variantName: 'Core i9-14900KS / RTX 4090 / 64GB DDR5 / 2TB NVMe Gen5',
        price: 4299.00,
        quantity: 1,
        subtotal: 4299.00,
        imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'ord-1003',
    orderCode: 'TITAN-AI-39481',
    recipientName: 'Lê Hoàng Phúc',
    recipientPhone: '0934112233',
    shippingAddress: 'Khu Đô Thị Ecopark, Văn Giang, Hưng Yên',
    notes: 'Tư vấn bot chốt đơn trong 2 phút. Khách thanh toán cọc trước.',
    totalAmount: 1499.99,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 1499.99,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'COMPLETED',
    orderStatus: 'CONFIRMED',
    createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    source: 'CHATBOT',
    items: [
      {
        id: 'item-3',
        productId: 5,
        productName: 'Samsung Odyssey OLED G9 49" Curved Dual QHD 240Hz Monitor',
        variantName: '49 inch Dual QHD 240Hz 0.03ms OLED G95SC',
        price: 1499.99,
        quantity: 1,
        subtotal: 1499.99,
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'ord-1004',
    orderCode: 'TITAN-WEB-11920',
    recipientName: 'Phạm Thu Hương',
    recipientPhone: '0977224466',
    shippingAddress: '246 Nguyễn Hữu Thọ, Q. 7, TP. Hồ Chí Minh',
    notes: 'Gọi điện trước khi giao hàng 30 phút.',
    totalAmount: 768.99,
    shippingFee: 0,
    discountAmount: 0,
    finalAmount: 768.99,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    orderStatus: 'DELIVERED',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    source: 'CHECKOUT',
    items: [
      {
        id: 'item-4',
        productId: 7,
        productName: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        variantName: 'Midnight Black ANC Flagship',
        price: 399.99,
        quantity: 1,
        subtotal: 399.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'item-5',
        productId: 6,
        productName: 'Keychron Q1 Pro QMK/VIA Wireless Custom Mechanical Keyboard',
        variantName: 'Carbon Black / Banana Tactile Switch',
        price: 219.00,
        quantity: 1,
        subtotal: 219.00,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'item-6',
        productId: 8,
        productName: 'Logitech G PRO X Superlight 2 Wireless Gaming Mouse',
        variantName: 'Magenta Superlight / Hero 2 Sensor 32K DPI',
        price: 159.00,
        quantity: 1,
        subtotal: 159.00,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
];

export const useAdminOrderStore = create<AdminOrderState>()(
  persist(
    (set, get) => ({
      orders: DEFAULT_ORDERS,

      addOrder: (orderData) => {
        const prefix = orderData.source === 'CHATBOT' ? 'TITAN-AI' : 'TITAN-WEB';
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const orderCode = orderData.orderCode || `${prefix}-${randomNum}`;
        const newId = `ord-${Date.now()}`;

        const newOrder: AdminOrder = {
          ...orderData,
          id: newId,
          orderCode,
          createdAt: new Date().toISOString(),
          paymentStatus: orderData.paymentStatus || 'PENDING',
          orderStatus: orderData.orderStatus || 'PENDING',
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, orderStatus: status } : o)),
        }));
      },

      updatePaymentStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o)),
        }));
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
        }));
      },

      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        }));
      },

      getOrder: (codeOrId) => {
        const { orders } = get();
        return orders.find(
          (o) =>
            o.id === codeOrId ||
            o.orderCode.toLowerCase() === codeOrId.toLowerCase()
        );
      },

      resetToDefault: () => {
        set({ orders: DEFAULT_ORDERS });
      },
    }),
    {
      name: 'titan_admin_orders_storage',
    }
  )
);
