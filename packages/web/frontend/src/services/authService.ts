/// <reference types="vite/client" />
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import axios from 'axios';

// Get API URL from runtime config (Docker), environment variable, or fallback
const getRuntimeApiUrl = (): string => {
  console.log('Window runtime config:', typeof window !== 'undefined' && window.RUNTIME_CONFIG);
  
  // Check if runtime config is available (injected by Docker)
  if (typeof window !== 'undefined' && window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.API_URL) {
    const apiUrl = window.RUNTIME_CONFIG.API_URL;
    
    // If we're in a non-localhost environment, always use relative URL for reliability
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
  
  // For local development, check if we're in a Docker environment
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Check if we're likely in a Docker container based on URL
    if (envApiUrl.includes('localhost:3005')) {
      console.log('Detected probable Docker environment, using localhost API URL:', envApiUrl);
      return envApiUrl;
    }
    // Otherwise use a relative URL which will work with the Docker Compose setup
    console.log('Using relative URL in local environment for best Docker compatibility');
    return '/api';
  }
  
  console.log('Initial apiUrl:', envApiUrl);
  return envApiUrl;
};

const API_URL = getRuntimeApiUrl();
console.log('Final API_URL used for authentication requests:', API_URL);

// Configure axios defaults
axios.defaults.withCredentials = true;  // Important for CORS with credentials
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000; // 10 second timeout

// Add a function to test backend connectivity
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log(`Testing API connection to: ${API_URL}/health`);
    const response = await axios.get(`${API_URL}/health`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    console.log('API connection test successful:', response.data);
    return true;
  } catch (error) {
    console.error('API connection test failed:', handleApiError(error));
    return false;
  }
};

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

// Enhanced error handling
export const handleApiError = (error: any): { message: string; details?: string; code?: number; type?: string; isNetworkError?: boolean } => {
  console.error('API Error:', error);
  
  // Network connectivity issues
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      message: 'Request timed out. Please check your internet connection and try again.',
      details: error.message,
      type: 'timeout',
      isNetworkError: true
    };
  }
  
  if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch') || 
      error.message?.includes('ERR_CONNECTION_REFUSED') || !error.response) {
    return {
      message: 'Cannot connect to the server. Please check your network connection or try again later.',
      details: 'The backend server might be unavailable or incorrectly configured.',
      type: 'network',
      isNetworkError: true
    };
  }
  
  // Server errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    // Common HTTP status codes
    switch (status) {
      case 400:
        return {
          message: data.message || 'Invalid request. Please check your input.',
          code: 400,
          details: JSON.stringify(data)
        };
      case 401:
        return {
          message: data.message || 'Authentication failed. Please log in again.',
          code: 401,
          type: 'auth'
        };
      case 403:
        return {
          message: data.message || 'You do not have permission to perform this action.',
          code: 403,
          type: 'auth'
        };
      case 404:
        return {
          message: data.message || 'The requested resource was not found.',
          code: 404
        };
      case 405:
        return {
          message: data.message || 'This operation is not supported.',
          code: 405,
          details: 'Method not allowed error - the endpoint might not be implemented yet.'
        };
      case 500:
        return {
          message: 'Server error. Our team has been notified.',
          code: 500,
          details: process.env.NODE_ENV !== 'production' ? JSON.stringify(data) : undefined
        };
      case 502:
        return {
          message: 'Cannot reach the application server. This may be a temporary issue.',
          code: 502,
          details: 'Bad Gateway error - the server may be unreachable or misconfigured.',
          isNetworkError: true
        };
      case 503:
        return {
          message: 'Service temporarily unavailable. Please try again later.',
          code: 503,
          isNetworkError: true
        };
      default:
        return {
          message: data.message || `Unexpected error (${status}).`,
          code: status,
          details: JSON.stringify(data)
        };
    }
  }
  
  // Default fallback error
  return {
    message: error.message || 'An unexpected error occurred',
    details: error.toString()
  };
};

// Global declaration is already in types/global.d.ts

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