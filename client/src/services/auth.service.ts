import { apiClient } from '@/lib/api-client';
import { ApiResponse, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponseData {
  accessToken: string;
  tokenType: string;
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: string[];
}

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    return apiClient.post('/auth/login', payload);
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> {
    return apiClient.post('/auth/register', payload);
  },

  async getMe(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/me');
  },
};
