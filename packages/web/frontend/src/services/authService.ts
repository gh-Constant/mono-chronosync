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

// Enhanced error handling for auth operations
const handleApiError = (error: any) => {
  console.error('API Error:', {
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    status: error.response?.status,
    statusText: error.response?.statusText,
    headers: error.response?.headers,
    data: error.response?.data
  });

  // Define custom error messages for specific HTTP status codes
  const statusMessages: Record<number, string> = {
    400: 'Invalid request data. Please check your input and try again.',
    401: 'Authentication failed. Please check your credentials.',
    403: 'You don\'t have permission to perform this action.',
    404: 'The requested resource was not found.',
    405: 'This operation is not supported. The server may be misconfigured or the API endpoint is unavailable.',
    409: 'This account already exists. Please try logging in instead.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later or contact support.',
    502: 'Bad gateway. The server is currently unavailable.',
    503: 'Service unavailable. Please try again later.',
    504: 'Gateway timeout. Please try again later.'
  };

  // Format an error object with user-friendly messages
  const errorObj = {
    message: statusMessages[error.response?.status] || 'An unexpected error occurred.',
    status: error.response?.status || 0,
    details: typeof error.response?.data === 'string' 
      ? error.response.data.substring(0, 200) // Limit string length
      : error.response?.data || error.message || 'Unknown error',
    path: error.config?.url || '',
    timestamp: new Date().toISOString()
  };

  console.error('Auth Error:', errorObj);
  return Promise.reject(errorObj);
};

// Add axios response interceptor with enhanced error handling
axios.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    return handleApiError(error);
  }
);

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      this.setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      // Rethrow the error with the formatted error object
      throw error;
    }
  },

  async signup(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, credentials);
      this.setToken(response.data.token);
      return response.data;
    } catch (error: any) {
      // Check for specific 405 Method Not Allowed error on registration
      if (error.status === 405) {
        throw {
          ...error,
          message: 'Registration is currently unavailable. The server may be in maintenance mode or misconfigured.',
          troubleshooting: 'Please try again later or contact support for assistance.'
        };
      }
      // Rethrow the formatted error
      throw error;
    }
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