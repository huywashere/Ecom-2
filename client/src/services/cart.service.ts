import { apiClient } from '@/lib/api-client';
import { ApiResponse, Cart } from '@/types';

export const cartService = {
  async getCart(): Promise<ApiResponse<Cart>> {
    return apiClient.get('/cart');
  },

  async addToCart(variantId: number, quantity: number = 1): Promise<ApiResponse<Cart>> {
    return apiClient.post('/cart', { variantId, quantity });
  },

  async updateQuantity(itemId: number, quantity: number): Promise<ApiResponse<Cart>> {
    return apiClient.put(`/cart/${itemId}`, null, { params: { quantity } });
  },

  async removeItem(itemId: number): Promise<ApiResponse<Cart>> {
    return apiClient.delete(`/cart/${itemId}`);
  },

  async clearCart(): Promise<ApiResponse<void>> {
    return apiClient.delete('/cart/clear');
  },
};
