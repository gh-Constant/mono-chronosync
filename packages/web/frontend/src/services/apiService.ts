import axios from 'axios';
import { authService } from './authService';

// Get the API URL from environment variables or use the default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to automatically add the token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    
    // If unauthorized, redirect to login
    if (status === 401) {
      authService.removeToken();
      // Optional: could redirect to login here
    }
    
    return Promise.reject(error);
  }
);

// Export the preconfigured API client
export default apiClient; 