

import { User, UserRole } from '@/src/entities/user/types/user.types';
import { api } from '@/src/shared/api/api-instanse';


export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data; // Server returns {token} directly
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  verifyResetToken: async (token: string) => {
    const response = await api.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: { 
    bio?: string; 
    username?: string;
    phone?: string;
    address?: string;
    sosialLinks?: { 
      twitter?: string; 
      facebook?: string; 
      instagram?: string 
    } 
  }) => {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  },
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users/all');
    // Server returns { data: User[] }
    return response.data?.data ?? [];
  },
  changeUserRole: async (userId: string, role: UserRole): Promise<User> => {
    const response = await api.patch('/users/role', { userId, role });
    // Server returns { message, data: User }
    return response.data?.data ?? response.data;
  },
};

export default api;
