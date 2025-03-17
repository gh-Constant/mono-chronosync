<template>
  <div class="font-sans text-gray-900 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white min-h-screen">
    <section class="pt-32 pb-20 relative overflow-hidden min-h-screen flex items-center justify-center">
      <!-- Background gradient and effects -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.03)_0%,rgba(0,0,0,0)_100%)]"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <!-- Card Header with Logo -->
          <div class="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center">
            <h2 ref="authTitle" class="text-3xl font-bold mb-2 opacity-0 transform translate-y-4">
              Chrono<span class="font-extrabold">sync</span>
            </h2>
            <p ref="authSubtitle" class="text-blue-100 opacity-0 transform translate-y-4">
              {{ isSuccess ? 'Welcome back!' : 'Completing your authentication...' }}
            </p>
          </div>

          <!-- Card Body -->
          <div class="p-8 space-y-6">
            <!-- Success Animation -->
            <div v-if="isSuccess" ref="successAnimation" class="flex justify-center opacity-0 scale-90">
              <div class="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <!-- Loading Animation -->
            <div v-if="isLoading" class="flex justify-center">
              <div class="w-24 h-24 relative">
                <div class="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/30"></div>
                <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
              </div>
            </div>

            <!-- Status Message -->
            <div ref="statusMessage" class="text-center opacity-0 transform translate-y-4">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {{ isSuccess ? 'Authentication Successful' : 'Processing Authentication...' }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ isSuccess ? 'You are now logged in to your account.' : 'Please wait while we complete your authentication.' }}
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="error" ref="errorMessage" class="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg opacity-0 transform translate-y-4">
              <p>{{ error }}</p>
              <p class="mt-2 text-sm">
                <router-link to="/auth" class="text-purple-600 dark:text-purple-400 hover:underline">
                  Return to login page
                </router-link>
              </p>
            </div>

            <!-- Redirect Message -->
            <div v-if="isSuccess" ref="redirectMessage" class="text-center text-sm text-gray-500 dark:text-gray-400 opacity-0 transform translate-y-4">
              <p>Redirecting you to the dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/authService';
import gsap from 'gsap';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isLoading = ref(true);
const isSuccess = ref(false);
const error = ref<string | null>(null);

// Animation references
const authTitle = ref<HTMLElement | null>(null);
const authSubtitle = ref<HTMLElement | null>(null);
const statusMessage = ref<HTMLElement | null>(null);
const successAnimation = ref<HTMLElement | null>(null);
const errorMessage = ref<HTMLElement | null>(null);
const redirectMessage = ref<HTMLElement | null>(null);

// Animation function
function animateElements() {
  const timeline = gsap.timeline();
  
  // Animate title and subtitle
  timeline.to(authTitle.value, { 
    opacity: 1, 
    y: 0, 
    duration: 0.6, 
    ease: 'power2.out' 
  });
  
  timeline.to(authSubtitle.value, { 
    opacity: 1, 
    y: 0, 
    duration: 0.6, 
    ease: 'power2.out' 
  }, '-=0.4');
  
  // Animate status message
  timeline.to(statusMessage.value, { 
    opacity: 1, 
    y: 0, 
    duration: 0.6, 
    ease: 'power2.out' 
  }, '-=0.4');
  
  // If success, animate success icon
  if (isSuccess.value && successAnimation.value) {
    timeline.to(successAnimation.value, { 
      opacity: 1, 
      scale: 1, 
      duration: 0.8, 
      ease: 'elastic.out(1, 0.5)' 
    }, '-=0.2');
    
    // Animate redirect message
    timeline.to(redirectMessage.value, { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: 'power2.out' 
    }, '-=0.4');
  }
  
  // If error, animate error message
  if (error.value && errorMessage.value) {
    timeline.to(errorMessage.value, { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: 'power2.out' 
    }, '-=0.4');
  }
}

onMounted(async () => {
  try {
    // Get token from URL query parameter for OAuth or from auth store for regular auth
    const token = route.query.token as string || authService.getToken();
    
    if (!token) {
      error.value = 'Authentication failed. No token received.';
      isLoading.value = false;
      // Start animations after error is set
      setTimeout(animateElements, 100);
      return;
    }
    
    // Store the token if it came from OAuth
    if (route.query.token) {
      authService.setToken(token);
    }
    
    // Update auth store state
    authStore.checkAuth();
    
    // Set success state
    isSuccess.value = true;
    isLoading.value = false;
    
    // Start animations
    setTimeout(animateElements, 100);
    
    // Redirect to dashboard after animations complete
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  } catch (err) {
    console.error('Authentication callback error:', err);
    error.value = 'An error occurred during authentication.';
    isLoading.value = false;
    // Start animations after error is set
    setTimeout(animateElements, 100);
  }
});
</script>   