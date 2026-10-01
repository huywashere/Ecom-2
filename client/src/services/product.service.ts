import { apiClient } from '@/lib/api-client';
import { ApiResponse, Brand, Category, PageResponse, Product, ProductDetail } from '@/types';

export interface ProductFilterParams {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export const productService = {
  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return apiClient.get('/products/featured');
  },

  async getProducts(params: ProductFilterParams = {}): Promise<ApiResponse<PageResponse<Product>>> {
    return apiClient.get('/products', { params });
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<ProductDetail>> {
    return apiClient.get(`/products/${slug}`);
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get('/categories');
  },

  async getBrands(): Promise<ApiResponse<Brand[]>> {
    return apiClient.get('/brands');
  },
};
