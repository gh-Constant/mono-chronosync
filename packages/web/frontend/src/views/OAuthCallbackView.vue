<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="w-full max-w-md animate-quick-fade">
      <!-- Logo -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white animate-quick-slide-down">
          Chrono<span class="text-purple-600">sync</span>
        </h1>
      </div>

      <!-- Status Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-12 animate-quick-slide-up">
        <!-- Success State -->
        <div v-if="isSuccess" class="text-center">
          <div class="w-24 h-24 mx-auto mb-8 relative animate-quick-scale">
            <div class="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30"></div>
            <svg class="absolute inset-0 w-24 h-24 text-green-600 dark:text-green-400 p-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M5 13l4 4L19 7"
                class="animate-quick-draw" 
              />
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3 animate-quick-fade">Welcome Back!</h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 animate-quick-fade">Authentication successful</p>
          <div class="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div class="h-full bg-blue-600 rounded-full animate-quick-progress"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="text-center">
          <div class="w-24 h-24 mx-auto mb-8 relative animate-quick-shake">
            <div class="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/30"></div>
            <svg class="absolute inset-0 w-24 h-24 text-red-600 dark:text-red-400 p-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>
          <p class="text-lg text-red-600 dark:text-red-400 mb-6 animate-quick-fade">{{ error }}</p>
          <router-link 
            to="/auth"
            class="inline-block px-6 py-3 text-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
          >
            Return to Login
          </router-link>
        </div>
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

const isSuccess = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const token = route.query.token as string || authService.getToken();
    
    if (!token) {
      error.value = 'Authentication failed. No token received.';
      return;
    }
    
    if (route.query.token) {
      authService.setToken(token);
    }
    
    await authStore.checkAuth();
    isSuccess.value = true;
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500); // Reduced from 2000ms to 1500ms
  } catch (err) {
    console.error('Authentication error:', err);
    error.value = 'An error occurred during authentication.';
  }
});
</script>

<style scoped>
@keyframes quick-progress {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes quick-draw {
  from { stroke-dasharray: 0 100; }
  to { stroke-dasharray: 100 100; }
}

@keyframes quick-scale {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes quick-slide-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes quick-slide-down {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes quick-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes quick-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-quick-progress {
  animation: quick-progress 1.5s linear forwards;
}

.animate-quick-draw {
  stroke-dasharray: 0 100;
  animation: quick-draw 0.5s ease-out forwards;
}

.animate-quick-scale {
  animation: quick-scale 0.3s ease-out forwards;
}

.animate-quick-slide-up {
  animation: quick-slide-up 0.3s ease-out forwards;
}

.animate-quick-slide-down {
  animation: quick-slide-down 0.3s ease-out forwards;
}

.animate-quick-shake {
  animation: quick-shake 0.3s ease-in-out;
}

.animate-quick-fade {
  animation: quick-fade 0.3s ease-out forwards;
}
</style>   