import { userApi, setAuthToken } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export const authService = {
  async login(data: LoginData) {
    const response = await userApi.post('/users/login', data);
    const { token, user } = response.data.data;
    setAuthToken(token);
    return { token, user };
  },

  async register(data: RegisterData) {
    const response = await userApi.post('/users/register', data);
    const { token, user } = response.data.data;
    setAuthToken(token);
    return { token, user };
  },

  async getCurrentUser() {
    const response = await userApi.get('/users/profile');
    return response.data.data.user;
  },

  async updateProfile(data: Partial<RegisterData>) {
    const response = await userApi.put('/users/profile', data);
    return response.data.data.user;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}; 