import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { DEMO_PRODUCTS } from '@/lib/demo-data';

interface AdminProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => Product;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  decreaseStock: (id: number, quantity: number) => void;
  resetToDefault: () => void;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
}

export const useAdminProductStore = create<AdminProductState>()(
  persist(
    (set, get) => ({
      products: DEMO_PRODUCTS,

      addProduct: (newProductData) => {
        const currentProducts = get().products;
        const newId = Math.max(...currentProducts.map((p) => p.id), 0) + 1;
        const slug = generateSlug(newProductData.name);

        const newProduct: Product = {
          ...newProductData,
          id: newId,
          slug,
        };

        set({
          products: [newProduct, ...currentProducts],
        });

        return newProduct;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      decreaseStock: (id, quantity) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id === id) {
              const newStock = Math.max(0, p.totalStock - quantity);
              return { ...p, totalStock: newStock };
            }
            return p;
          }),
        }));
      },

      resetToDefault: () => {
        set({ products: DEMO_PRODUCTS });
      },
    }),
    {
      name: 'titan_admin_products_storage',
    }
  )
);
