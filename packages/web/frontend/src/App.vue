<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

// Enhanced notification state
const isBackendError = ref(false)
const showDebugInfo = ref(false)
const errorDetails = reactive({
  errorMessage: '',
  apiUrl: '',
  timestamp: '',
  attempts: [] as { url: string, status: string, error: string }[]
})

// Computed properties for safe browser API access
const hostname = computed(() => typeof window !== 'undefined' ? window.location.hostname : '')

// Keep track of retry attempts
let retryCount = 0
const maxRetries = 3
const retryTimeout = ref<number | null>(null)

// Check backend connectivity with advanced error handling
const checkBackendConnection = async () => {
  try {
    console.log('Window runtime config:', window.RUNTIME_CONFIG);
    
    // Try to connect to the backend API
    const apiUrl = window.RUNTIME_CONFIG?.API_URL || '/api';
    errorDetails.apiUrl = apiUrl;
    console.log('Initial apiUrl:', apiUrl);
    
    // If the API URL is relative (starts with '/'), prepend the current origin
    const fullUrl = apiUrl.startsWith('/') 
      ? `${window.location.origin}${apiUrl}` 
      : apiUrl;
    
    console.log('Using fullUrl for API connection:', fullUrl);
    
    // Force a relative URL if we detect localhost
    if (fullUrl.includes('localhost') && window.location.hostname !== 'localhost') {
      const relativeUrl = `${window.location.origin}/api`;
      console.log('Detected localhost in non-localhost environment, using relative instead:', relativeUrl);
      
      // Try with relative URL instead
      try {
        const response = await fetch(`${relativeUrl}/test?_=${Date.now()}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        
        errorDetails.attempts.push({ 
          url: relativeUrl, 
          status: response.status.toString(), 
          error: response.ok ? 'None' : `HTTP Error ${response.status}`
        });
        
        if (!response.ok) {
          throw new Error(`Backend returned status ${response.status}`);
        }
        
        isBackendError.value = false;
        console.log('Backend connection successful with relative URL');
        return;
      } catch (relativeError) {
        console.error('Relative URL connection failed:', relativeError);
        errorDetails.attempts.push({ 
          url: relativeUrl, 
          status: 'Failed', 
          error: relativeError instanceof Error ? relativeError.message : String(relativeError)
        });
        // Continue to try the full URL
      }
    }
    
    // Add a random query param to prevent caching
    try {
      const response = await fetch(`${fullUrl}/test?_=${Date.now()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        // Short timeout to prevent long waiting
        signal: AbortSignal.timeout(5000)
      });
      
      errorDetails.attempts.push({ 
        url: fullUrl, 
        status: response.status.toString(), 
        error: response.ok ? 'None' : `HTTP Error ${response.status}`
      });
      
      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }
      
      isBackendError.value = false;
      console.log('Backend connection successful');
    } catch (error) {
      console.error('Backend connection failed:', error);
      errorDetails.attempts.push({ 
        url: fullUrl, 
        status: 'Failed', 
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Try with a fallback if our initial attempt failed
      try {
        console.log('Trying fallback to relative API URL...');
        const fallbackUrl = `${window.location.origin}/api`;
        
        const response = await fetch(`${fallbackUrl}/test?_=${Date.now()}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(5000)
        });
        
        errorDetails.attempts.push({ 
          url: fallbackUrl, 
          status: response.status.toString(), 
          error: response.ok ? 'None' : `HTTP Error ${response.status}`
        });
        
        if (response.ok) {
          console.log('Fallback connection successful!');
          isBackendError.value = false;
          return;
        }
      } catch (fallbackError) {
        console.error('Fallback connection also failed:', fallbackError);
        errorDetails.attempts.push({ 
          url: `${window.location.origin}/api`, 
          status: 'Failed', 
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        });
      }
      
      // Set error state and details
      isBackendError.value = true;
      errorDetails.errorMessage = error instanceof Error ? error.message : String(error);
      errorDetails.timestamp = new Date().toLocaleString();
      
      // Schedule a retry if we haven't reached max attempts
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Scheduling retry ${retryCount}/${maxRetries} in 10 seconds...`);
        if (retryTimeout.value) window.clearTimeout(retryTimeout.value);
        retryTimeout.value = window.setTimeout(() => {
          checkBackendConnection();
        }, 10000); // Retry after 10 seconds
      }
    }
  } catch (unexpectedError) {
    console.error('Unexpected error during connection check:', unexpectedError);
    isBackendError.value = true;
    errorDetails.errorMessage = unexpectedError instanceof Error ? unexpectedError.message : String(unexpectedError);
    errorDetails.timestamp = new Date().toLocaleString();
  }
};

// Dismiss notification and attempt an immediate retry
const dismissAndRetry = () => {
  isBackendError.value = false;
  showDebugInfo.value = false;
  
  // Clear any pending retry timeout
  if (retryTimeout.value) {
    window.clearTimeout(retryTimeout.value);
    retryTimeout.value = null;
  }
  
  // Reset retry counter and attempt history
  retryCount = 0;
  errorDetails.attempts = [];
  
  // Retry immediately
  checkBackendConnection();
};

onMounted(() => {
  // Initial connection check
  checkBackendConnection();
  
  // Initialize theme
  themeStore.initializeTheme();
});
</script>

<template>
  <!-- Enhanced backend connection error notification -->
  <transition name="slide">
    <div v-if="isBackendError" 
         class="fixed top-4 right-4 z-50 max-w-md shadow-lg rounded-lg overflow-hidden"
         :class="[showDebugInfo ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-red-50 dark:bg-red-900']">
      <!-- Main notification -->
      <div class="p-4">
        <div class="flex items-start space-x-3">
          <!-- Icon -->
          <div class="flex-shrink-0 text-red-500 dark:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <!-- Content -->
          <div class="flex-1">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
              Backend Connection Error
            </h3>
            <div class="mt-1 text-sm text-red-700 dark:text-red-300">
              Unable to connect to the server. The application may not function correctly.
            </div>
            
            <!-- Actions -->
            <div class="mt-3 flex space-x-3">
              <button @click="dismissAndRetry" 
                      class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700 transition-colors">
                Retry connection
              </button>
              <button @click="showDebugInfo = !showDebugInfo"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
                {{ showDebugInfo ? 'Hide' : 'Show' }} details
              </button>
            </div>
          </div>
          
          <!-- Close button -->
          <button @click="isBackendError = false" class="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Debug info (expandable) -->
      <div v-if="showDebugInfo" class="px-4 pb-4 text-xs">
        <div class="bg-zinc-200 dark:bg-zinc-700 p-3 rounded-md text-gray-800 dark:text-gray-200 font-mono overflow-auto max-h-64">
          <div class="mb-2">
            <strong>Error:</strong> {{ errorDetails.errorMessage }}<br>
            <strong>Time:</strong> {{ errorDetails.timestamp }}<br>
            <strong>API URL:</strong> {{ errorDetails.apiUrl }}<br>
            <strong>Host:</strong> {{ hostname }}
          </div>
          
          <div v-if="errorDetails.attempts.length" class="mt-2">
            <strong>Connection attempts:</strong>
            <div v-for="(attempt, index) in errorDetails.attempts" :key="index" class="ml-2 mt-1 border-l-2 border-zinc-400 dark:border-zinc-500 pl-2">
              <div><strong>URL:</strong> {{ attempt.url }}</div>
              <div><strong>Status:</strong> {{ attempt.status }}</div>
              <div><strong>Error:</strong> {{ attempt.error }}</div>
            </div>
          </div>
          
          <div class="mt-3 text-xs text-gray-600 dark:text-gray-400">
            You can help by sharing this information with support.
          </div>
        </div>
      </div>
    </div>
  </transition>

  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style>
:root {
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}

@media (prefers-color-scheme: light) {
  :root {
    color-scheme: light;
  }
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* Transition effects */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>