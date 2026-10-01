import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecom_token', token);
      localStorage.setItem('ecom_user', JSON.stringify(user));
    }
    set({ user, token, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecom_token');
      localStorage.removeItem('ecom_user');
    }
    set({ user: null, token: null, isLoading: false });
  },

  initAuth: async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('ecom_token');
    const storedUser = localStorage.getItem('ecom_user');

    if (token && storedUser) {
      try {
        set({ token, user: JSON.parse(storedUser), isLoading: false });
        // Refresh profile from server
        const res = await authService.getMe();
        if (res.success && res.data) {
          set({ user: res.data });
          localStorage.setItem('ecom_user', JSON.stringify(res.data));
        }
      } catch {
        // Token expired or server unreachable
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
