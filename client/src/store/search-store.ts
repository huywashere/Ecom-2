import { create } from 'zustand';

interface SearchState {
  isOpen: boolean;
  query: string;
  setIsOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  openSearch: (initialQuery?: string) => void;
  closeSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: '',
  setIsOpen: (isOpen) => set({ isOpen }),
  setQuery: (query) => set({ query }),
  openSearch: (initialQuery = '') => set({ isOpen: true, query: initialQuery }),
  closeSearch: () => set({ isOpen: false, query: '' }),
}));
