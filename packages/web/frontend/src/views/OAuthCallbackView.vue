<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isSuccess ? 'Authentication Successful' : 'Processing Authentication...' }}
        </h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ isSuccess ? 'You are now logged in.' : 'Please wait while we complete your authentication.' }}
        </p>
      </div>
      
      <div v-if="isLoading" class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
      
      <div v-if="error" class="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
        <p>{{ error }}</p>
        <p class="mt-2 text-sm">
          <router-link to="/auth" class="text-purple-600 dark:text-purple-400 hover:underline">
            Return to login page
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/authService';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isLoading = ref(true);
const isSuccess = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    // Get token from URL query parameter
    const token = route.query.token as string;
    
    if (!token) {
      error.value = 'Authentication failed. No token received.';
      isLoading.value = false;
      return;
    }
    
    // Store the token
    authService.setToken(token);
    
    // Update auth store state
    authStore.checkAuth();
    
    // Set success state
    isSuccess.value = true;
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (err) {
    console.error('OAuth callback error:', err);
    error.value = 'An error occurred during authentication.';
  } finally {
    isLoading.value = false;
  }
});
</script> 