export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  parentId?: number | null;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  variantName: string;
  price: number;
  originalPrice: number;
  stockQuantity: number;
  imageUrl?: string;
  active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  thumbnail?: string;
  warrantyMonths: number;
  featured: boolean;
  minPrice: number;
  originalPrice: number;
  totalStock: number;
  categoryName?: string;
  categorySlug?: string;
  brandName?: string;
  brandSlug?: string;
}

export interface ProductDetail extends Product {
  detailDescription?: string;
  specifications?: string; // JSON string of specs
  category?: Category;
  brand?: Brand;
  variants: ProductVariant[];
}

export interface CartItem {
  id: number;
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  variantName: string;
  sku: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface OrderItem {
  id: number;
  variantId?: number;
  productName: string;
  variantName?: string;
  sku?: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO' | 'NOVAGATE';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: number;
  orderCode: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes?: string;
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  avatarUrl?: string;
  roles: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
}
