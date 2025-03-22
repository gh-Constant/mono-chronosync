/// <reference types="vite/client" />
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import axios from 'axios';

// Get API URL from runtime config (Docker), environment variable, or fallback
const getRuntimeApiUrl = (): string => {
  // Check if runtime config is available (injected by Docker)
  if (typeof window !== 'undefined' && window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.API_URL) {
    const apiUrl = window.RUNTIME_CONFIG.API_URL;
    
    // If we're not on localhost but API URL contains localhost, use relative URL instead
    if (apiUrl.includes('localhost') && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      const relativeUrl = `${window.location.origin}/api`;
      console.log('Detected localhost in non-localhost environment, using relative URL instead:', relativeUrl);
      return relativeUrl;
    }
    
    // If the API URL is relative (starts with '/'), prepend the current origin
    if (apiUrl.startsWith('/') && typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${apiUrl}`;
      console.log('Using relative API URL from runtime config:', fullUrl);
      return fullUrl;
    }
    
    console.log('Using API URL from runtime config:', apiUrl);
    return apiUrl;
  }
  
  // Fallback to environment variable or default
  const envApiUrl = import.meta.env.VITE_API_URL || '/api';
  
  // Always use relative URL in production
  if (typeof window !== 'undefined' && (import.meta.env.PROD || import.meta.env.MODE === 'production')) {
    const relativeUrl = `${window.location.origin}/api`;
    console.log('Using relative API URL in production environment:', relativeUrl);
    return relativeUrl;
  }
  
  console.log('Using API URL from environment:', envApiUrl);
  return envApiUrl;
};

const API_URL = getRuntimeApiUrl();

// Configure axios defaults
axios.defaults.withCredentials = true;  // Important for CORS with credentials
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Global declaration is already in types/global.d.ts

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