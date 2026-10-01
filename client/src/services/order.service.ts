import { apiClient } from '@/lib/api-client';
import { ApiResponse, DashboardStats, Order, PageResponse, PaymentMethod } from '@/types';

export interface CheckoutPayload {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items?: { variantId: number; quantity: number }[];
}

export const orderService = {
  async checkout(payload: CheckoutPayload): Promise<ApiResponse<Order>> {
    return apiClient.post('/orders', payload);
  },

  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get('/orders/my-orders');
  },

  async getOrderByCode(code: string): Promise<ApiResponse<Order>> {
    return apiClient.get(`/orders/${code}`);
  },

  async adminGetStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get('/admin/stats');
  },

  async adminGetAllOrders(page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<Order>>> {
    return apiClient.get('/admin/orders', { params: { page, size } });
  },

  async adminUpdateStatus(
    orderId: number,
    orderStatus?: string,
    paymentStatus?: string
  ): Promise<ApiResponse<Order>> {
    return apiClient.put(`/admin/orders/${orderId}/status`, { orderStatus, paymentStatus });
  },
};
