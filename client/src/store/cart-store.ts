import { create } from 'zustand';
import { Cart, CartItem, Product, ProductVariant } from '@/types';
import { cartService } from '@/services/cart.service';

interface CartState {
  cart: Cart;
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: (open: boolean) => void;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { totalItems, totalPrice };
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: initialCart,
  isOpen: false,
  isLoading: false,

  setIsOpen: (open) => set({ isOpen: open }),

  fetchCart: async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('ecom_token');

    if (token) {
      try {
        set({ isLoading: true });
        const res = await cartService.getCart();
        if (res.success && res.data) {
          set({ cart: res.data, isLoading: false });
          return;
        }
      } catch {
        // Fallback to local
      }
    }

    // Load from local storage
    const local = localStorage.getItem('ecom_local_cart');
    if (local) {
      try {
        set({ cart: JSON.parse(local), isLoading: false });
      } catch {
        set({ cart: initialCart, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  addItem: async (product, variant, quantity = 1) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ecom_token') : null;

    if (token) {
      try {
        const res = await cartService.addToCart(variant.id, quantity);
        if (res.success && res.data) {
          set({ cart: res.data, isOpen: true });
          return;
        }
      } catch {
        // fallback
      }
    }

    // Local cart update
    const current = get().cart;
    const existingIndex = current.items.findIndex((i) => i.variantId === variant.id);
    let updatedItems: CartItem[];

    if (existingIndex > -1) {
      updatedItems = [...current.items];
      const newQty = updatedItems[existingIndex].quantity + quantity;
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: newQty,
        subtotal: variant.price * newQty,
      };
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantName: variant.variantName,
        sku: variant.sku,
        imageUrl: variant.imageUrl || product.thumbnail,
        price: variant.price,
        quantity,
        stockQuantity: variant.stockQuantity,
        subtotal: variant.price * quantity,
      };
      updatedItems = [...current.items, newItem];
    }

    const totals = calculateTotals(updatedItems);
    const newCart: Cart = {
      items: updatedItems,
      ...totals,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('ecom_local_cart', JSON.stringify(newCart));
    }

    set({ cart: newCart, isOpen: true });
  },

  updateQuantity: async (itemId, quantity) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ecom_token') : null;

    if (token) {
      try {
        const res = await cartService.updateQuantity(itemId, quantity);
        if (res.success && res.data) {
          set({ cart: res.data });
          return;
        }
      } catch {
        // fallback
      }
    }

    const current = get().cart;
    let updatedItems: CartItem[];

    if (quantity <= 0) {
      updatedItems = current.items.filter((i) => i.id !== itemId);
    } else {
      updatedItems = current.items.map((i) =>
        i.id === itemId
          ? {
              ...i,
              quantity,
              subtotal: i.price * quantity,
            }
          : i
      );
    }

    const totals = calculateTotals(updatedItems);
    const newCart = { items: updatedItems, ...totals };

    if (typeof window !== 'undefined') {
      localStorage.setItem('ecom_local_cart', JSON.stringify(newCart));
    }

    set({ cart: newCart });
  },

  removeItem: async (itemId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ecom_token') : null;

    if (token) {
      try {
        const res = await cartService.removeItem(itemId);
        if (res.success && res.data) {
          set({ cart: res.data });
          return;
        }
      } catch {
        // fallback
      }
    }

    const current = get().cart;
    const updatedItems = current.items.filter((i) => i.id !== itemId);
    const totals = calculateTotals(updatedItems);
    const newCart = { items: updatedItems, ...totals };

    if (typeof window !== 'undefined') {
      localStorage.setItem('ecom_local_cart', JSON.stringify(newCart));
    }

    set({ cart: newCart });
  },

  clearCart: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ecom_token') : null;
    if (token) {
      try {
        await cartService.clearCart();
      } catch {
        // ignore
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecom_local_cart');
    }
    set({ cart: initialCart });
  },
}));
