import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AuthResponse } from '@/types/auth';
import { authService } from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthResponse['user'] | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function handleError(err: any): string {
    console.error('Auth Error:', {
      status: err.response?.status,
      data: err.response?.data,
      error: err
    });

    if (err.response?.data?.errors) {
      // Handle validation errors
      return err.response.data.errors
        .map((e: any) => e.message)
        .join('\n');
    }
    
    // Handle specific error messages
    const errorMessage = err.response?.data?.message;
    switch (errorMessage) {
      case 'Email already in use':
        return 'This email is already registered. Please try logging in or use a different email.';
      case 'Invalid email or password':
        return 'The email or password you entered is incorrect. Please try again.';
      case 'Network Error':
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      default:
        if (!err.response) {
          return 'Unable to connect to the server. Please check your internet connection and try again.';
        }
        if (err.response.status === 500) {
          return 'Server error. Our team has been notified and is working on it.';
        }
        return errorMessage || 'An unexpected error occurred. Please try again later.';
    }
  }

  async function login(email: string, password: string, rememberMe: boolean) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login({ email, password, rememberMe });
      user.value = response.user;
      isAuthenticated.value = true;
      authService.setToken(response.token);
      return true;
    } catch (err: any) {
      error.value = handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function signup(name: string, email: string, password: string) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await authService.signup({
        name,
        email,
        password
      });
      user.value = response.user;
      isAuthenticated.value = true;
      authService.setToken(response.token);
      return true;
    } catch (err: any) {
      error.value = handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
    authService.removeToken();
  }

  async function checkAuth() {
    const token = authService.getToken();
    if (token) {
      try {
        // Fetch user profile
        const userProfile = await authService.getProfile();
        user.value = userProfile.user;
        isAuthenticated.value = true;
        return true;
      } catch (err) {
        // Token might be invalid or expired
        console.error('Error fetching user profile:', err);
        logout(); // Clear invalid token
        return false;
      }
    } else {
      isAuthenticated.value = false;
      return false;
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    checkAuth
  };
}); 