<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

// Notification state
const isBackendError = ref(false)

// Check backend connectivity
onMounted(async () => {
  try {
    console.log('Window runtime config:', window.RUNTIME_CONFIG);
    
    // Try to connect to the backend API
    const apiUrl = window.RUNTIME_CONFIG?.API_URL || '/api';
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
      const response = await fetch(`${relativeUrl}/test?_=${Date.now()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }
      
      isBackendError.value = false;
      console.log('Backend connection successful with relative URL');
      return;
    }
    
    // Add a random query param to prevent caching
    const response = await fetch(`${fullUrl}/test?_=${Date.now()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      // Short timeout to prevent long waiting
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }
    
    isBackendError.value = false;
    console.log('Backend connection successful');
  } catch (error) {
    console.error('Backend connection failed:', error);
    isBackendError.value = true;
    
    // Try with a fallback if our initial attempt failed
    try {
      console.log('Trying fallback to relative API URL...');
      const fallbackUrl = `${window.location.origin}/api`;
      
      const response = await fetch(`${fallbackUrl}/test?_=${Date.now()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        console.log('Fallback connection successful!');
        isBackendError.value = false;
      }
    } catch (fallbackError) {
      console.error('Fallback connection also failed:', fallbackError);
      // Keep error state as true
    }
  }
});

onMounted(() => {
  themeStore.initializeTheme()
})
</script>

<template>
  <!-- Backend connection error notification -->
  <div v-if="isBackendError" class="backend-error-notification">
    <div class="notification-content">
      <span class="notification-icon">⚠️</span>
      <span class="notification-text">Unable to connect to the server. Please check your internet connection and try again.</span>
      <button class="notification-close" @click="isBackendError = false">×</button>
    </div>
  </div>

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

.backend-error-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 350px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slide-in 0.3s ease-out forwards;
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.notification-icon {
  margin-right: 12px;
  font-size: 18px;
}

.notification-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #721c24;
  margin-left: 8px;
  padding: 0 4px;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>