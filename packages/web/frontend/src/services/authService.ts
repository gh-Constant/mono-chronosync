/// <reference types="vite/client" />
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import axios from 'axios';

// Get API URL from runtime config (Docker), environment variable, or fallback
const getRuntimeApiUrl = (): string => {
  console.log('Window runtime config:', typeof window !== 'undefined' && window.RUNTIME_CONFIG);
  
  // Check if runtime config is available (injected by Docker)
  if (typeof window !== 'undefined' && window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.API_URL) {
    const apiUrl = window.RUNTIME_CONFIG.API_URL;
    
    // If we're in a non-localhost environment, always use relative URL
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      const relativeUrl = `${window.location.origin}/api`;
      console.log('Using relative URL for non-localhost environment:', relativeUrl);
      return relativeUrl;
    }
    
    // If the API URL is relative (starts with '/'), prepend the current origin
    if (apiUrl.startsWith('/') && typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${apiUrl}`;
      console.log('Using fullUrl for API connection:', fullUrl);
      return fullUrl;
    }
    
    console.log('Using API URL from runtime config:', apiUrl);
    return apiUrl;
  }
  
  // Fallback to environment variable or default
  const envApiUrl = import.meta.env.VITE_API_URL || '/api';
  
  // Always use relative URL if not on localhost
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    const relativeUrl = `${window.location.origin}/api`;
    console.log('Using relative URL for deployed environment:', relativeUrl);
    return relativeUrl;
  }
  
  // For local development
  console.log('Initial apiUrl:', envApiUrl);
  return envApiUrl;
};

const API_URL = getRuntimeApiUrl();

// Configure axios defaults
axios.defaults.withCredentials = true;  // Important for CORS with credentials
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Global declaration is already in types/global.d.ts

// Add axios request interceptor to ensure correct API URL
axios.interceptors.request.use((config) => {
  if (!config.url) return config;
  
  // If we're in a deployed environment (not localhost)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // If the URL contains localhost, replace it with relative path
    if (config.url.includes('localhost')) {
      // Extract the path after /api/
      const apiPath = config.url.split('/api/')[1] || '';
      config.url = `${window.location.origin}/api/${apiPath}`;
      console.log('Interceptor replaced localhost URL with:', config.url);
    }
    // If the URL doesn't have proper origin, add it
    else if (config.url.startsWith('/api')) {
      config.url = `${window.location.origin}${config.url}`;
      console.log('Interceptor added origin to URL:', config.url);
    }
  }
  
  console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
  return config;
});

// Add more detailed error handling
axios.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

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