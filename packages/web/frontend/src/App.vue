<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
import { useThemeStore } from './stores/theme'
import { testApiConnection, handleApiError } from './services/authService'

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
const isDarkMode = computed(() => themeStore.theme === 'dark' || (themeStore.theme === 'system' && themeStore.systemTheme === 'dark'))

// Keep track of retry attempts
let retryCount = 0
const maxRetries = 3
const retryTimeout = ref<number | null>(null)

// Check backend connectivity with advanced error handling
const checkBackendConnection = async () => {
  try {
    retryCount++
    const timestamp = new Date().toISOString()
    errorDetails.timestamp = timestamp
    
    console.log(`[${timestamp}] Checking backend connection (attempt ${retryCount}/${maxRetries})...`)
    
    // Use the improved testApiConnection function from authService
    const isConnected = await testApiConnection()
    
    if (isConnected) {
      console.log(`[${timestamp}] Backend connectivity check successful`)
      isBackendError.value = false
      retryCount = 0
      return true
    } else {
      throw new Error('API connection test failed')
    }
  } catch (error) {
    const errorInfo = handleApiError(error)
    console.error('Backend connectivity check failed:', errorInfo)
    
    errorDetails.errorMessage = errorInfo.message
    errorDetails.attempts.push({
      url: errorInfo.details || 'unknown',
      status: errorInfo.code?.toString() || 'unknown',
      error: errorInfo.message
    })
    
    // Show the error to the user
    isBackendError.value = true
    
    // Schedule a retry if under the max retry count
    if (retryCount < maxRetries) {
      console.log(`Will retry connection in 5 seconds (attempt ${retryCount}/${maxRetries})`)
      if (retryTimeout.value) window.clearTimeout(retryTimeout.value)
      
      retryTimeout.value = window.setTimeout(() => {
        checkBackendConnection()
      }, 5000)
    } else {
      console.log('Max retries reached, giving up on automatic reconnection')
    }
    
    return false
  }
}

// Manual retry handler for user-initiated retry
const handleManualRetry = () => {
  retryCount = 0
  errorDetails.attempts = []
  checkBackendConnection()
}

// Toggle debug info display
const toggleDebugInfo = () => {
  showDebugInfo.value = !showDebugInfo.value
}

onMounted(() => {
  // Check backend connectivity on app mount
  checkBackendConnection()
  
  // Initialize theme
  themeStore.initializeTheme()
})
</script>

<template>
  <div :class="{ 'dark': isDarkMode }" class="app-container">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <!-- Backend connectivity error banner -->
      <div v-if="isBackendError" class="bg-red-600 text-white px-4 py-2 flex justify-between items-center">
        <div>
          <span class="font-semibold">Backend Connectivity Issue:</span>
          {{ errorDetails.errorMessage }}
          
          <button 
            @click="toggleDebugInfo" 
            class="ml-2 text-xs underline text-yellow-200 hover:text-yellow-100"
          >
            {{ showDebugInfo ? 'Hide Debug Info' : 'Show Debug Info' }}
          </button>
          
          <div v-if="showDebugInfo" class="mt-2 p-2 bg-gray-900 text-xs rounded overflow-x-auto">
            <div><strong>Timestamp:</strong> {{ errorDetails.timestamp }}</div>
            <div><strong>Hostname:</strong> {{ hostname }}</div>
            <div><strong>Retry Count:</strong> {{ retryCount }}/{{ maxRetries }}</div>
            <div><strong>Connection Attempts:</strong></div>
            <ul class="pl-4 list-disc">
              <li v-for="(attempt, index) in errorDetails.attempts" :key="index">
                {{ attempt.url }} - Status: {{ attempt.status }} - {{ attempt.error }}
              </li>
            </ul>
          </div>
        </div>
        
        <button 
          @click="handleManualRetry" 
          class="bg-white text-red-600 hover:bg-gray-100 px-3 py-1 rounded text-sm font-semibold"
        >
          Retry Connection
        </button>
      </div>
      
      <!-- Main App Layout -->
      <AppLayout>
        <RouterView />
      </AppLayout>
    </div>
  </div>
</template>

<style>
/* Global styles */
html {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>