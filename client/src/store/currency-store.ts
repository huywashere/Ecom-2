import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrencyCode } from '@/lib/formatters';

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'beast-currency-storage',
    }
  )
);
