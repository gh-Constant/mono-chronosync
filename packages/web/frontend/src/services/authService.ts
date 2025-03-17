/// <reference types="vite/client" />
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

// Configure axios defaults
axios.defaults.withCredentials = true;  // Important for CORS with credentials
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    this.setToken(response.data.token);
    return response.data;
  },

  async signup(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, credentials);
    this.setToken(response.data.token);
    return response.data;
  },

  async getProfile(): Promise<{ user: AuthResponse['user'] }> {
    const response = await axios.get(`${API_URL}/auth/profile`);
    return response.data;
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken(): void {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}; 