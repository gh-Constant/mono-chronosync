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
    // Try to connect to the backend API
    const apiUrl = window.RUNTIME_CONFIG?.API_URL || '/api'
    const fullUrl = apiUrl.startsWith('/') ? `${window.location.origin}${apiUrl}` : apiUrl
    
    // Add a random query param to prevent caching
    const response = await fetch(`${fullUrl}/test?_=${Date.now()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      // Short timeout to prevent long waiting
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`)
    }
    
    isBackendError.value = false
    console.log('Backend connection successful')
  } catch (error) {
    console.error('Backend connection failed:', error)
    isBackendError.value = true
  }
})

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