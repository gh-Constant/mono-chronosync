<script setup lang="ts">
import { computed, ref, defineProps, defineEmits } from 'vue'

interface ApiError {
  message: string
  status: number
  details?: any
  path?: string
  timestamp?: string
  troubleshooting?: string
}

const props = defineProps<{
  error: ApiError | null
  title?: string
  dismissable?: boolean
  showDetails?: boolean
}>()

const emit = defineEmits<{
  (e: 'dismiss'): void
  (e: 'retry'): void
}>()

const showTechnicalDetails = ref(false)

const errorType = computed(() => {
  if (!props.error) return null

  const statusCode = props.error.status
  if (statusCode >= 500) return 'server'
  if (statusCode === 405) return 'method'
  if (statusCode === 401 || statusCode === 403) return 'auth'
  if (statusCode === 404) return 'notFound'
  if (statusCode === 429) return 'rateLimit'
  return 'client'
})

const errorTitle = computed(() => {
  if (props.title) return props.title
  
  switch (errorType.value) {
    case 'server': return 'Server Error'
    case 'method': return 'API Endpoint Unavailable'
    case 'auth': return 'Authentication Error'
    case 'notFound': return 'Resource Not Found'
    case 'rateLimit': return 'Rate Limit Exceeded'
    case 'client': return 'Request Error'
    default: return 'Unexpected Error'
  }
})

const errorIcon = computed(() => {
  switch (errorType.value) {
    case 'server': return 'server'
    case 'method': return 'warning'
    case 'auth': return 'lock'
    case 'notFound': return 'search'
    case 'rateLimit': return 'clock'
    default: return 'error'
  }
})

const errorColor = computed(() => {
  switch (errorType.value) {
    case 'server': return 'red'
    case 'method': return 'yellow'
    case 'auth': return 'orange'
    case 'notFound': return 'blue'
    case 'rateLimit': return 'purple'
    default: return 'red'
  }
})

// Format details for display
const formattedDetails = computed(() => {
  if (!props.error?.details) return ''
  
  if (typeof props.error.details === 'string') {
    return props.error.details
  }
  
  try {
    return JSON.stringify(props.error.details, null, 2)
  } catch (e) {
    return String(props.error.details)
  }
})
</script>

<template>
  <div v-if="error" 
       class="rounded-lg shadow-md overflow-hidden"
       :class="{
         'bg-red-50 dark:bg-red-900/20': errorColor === 'red',
         'bg-yellow-50 dark:bg-yellow-900/20': errorColor === 'yellow',
         'bg-orange-50 dark:bg-orange-900/20': errorColor === 'orange',
         'bg-blue-50 dark:bg-blue-900/20': errorColor === 'blue',
         'bg-purple-50 dark:bg-purple-900/20': errorColor === 'purple'
       }">
    <!-- Header section -->
    <div class="p-4">
      <div class="flex items-start gap-3">
        <!-- Icon based on error type -->
        <div class="flex-shrink-0 mt-0.5">
          <!-- Warning icon -->
          <svg v-if="errorIcon === 'warning'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          
          <!-- Error icon (default) -->
          <svg v-else-if="errorIcon === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          
          <!-- Server error icon -->
          <svg v-else-if="errorIcon === 'server'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
          </svg>
          
          <!-- Auth error icon -->
          <svg v-else-if="errorIcon === 'lock'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-500 dark:text-orange-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          
          <!-- Not found icon -->
          <svg v-else-if="errorIcon === 'search'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          
          <!-- Rate limit icon -->
          <svg v-else-if="errorIcon === 'clock'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <!-- Content -->
        <div class="flex-1">
          <h3 class="text-sm font-medium"
              :class="{
                'text-red-800 dark:text-red-200': errorColor === 'red',
                'text-yellow-800 dark:text-yellow-200': errorColor === 'yellow',
                'text-orange-800 dark:text-orange-200': errorColor === 'orange',
                'text-blue-800 dark:text-blue-200': errorColor === 'blue',
                'text-purple-800 dark:text-purple-200': errorColor === 'purple'
              }">
            {{ errorTitle }}
            <span v-if="error.status" class="text-xs font-normal ml-1 opacity-80">
              ({{ error.status }})
            </span>
          </h3>
          
          <div class="mt-1 text-sm"
               :class="{
                 'text-red-700 dark:text-red-300': errorColor === 'red',
                 'text-yellow-700 dark:text-yellow-300': errorColor === 'yellow',
                 'text-orange-700 dark:text-orange-300': errorColor === 'orange',
                 'text-blue-700 dark:text-blue-300': errorColor === 'blue',
                 'text-purple-700 dark:text-purple-300': errorColor === 'purple'
               }">
            {{ error.message }}
          </div>
          
          <!-- Troubleshooting tips if available -->
          <div v-if="error.troubleshooting" class="mt-2 text-sm italic"
               :class="{
                 'text-red-600 dark:text-red-400': errorColor === 'red',
                 'text-yellow-600 dark:text-yellow-400': errorColor === 'yellow',
                 'text-orange-600 dark:text-orange-400': errorColor === 'orange',
                 'text-blue-600 dark:text-blue-400': errorColor === 'blue',
                 'text-purple-600 dark:text-purple-400': errorColor === 'purple'
               }">
            {{ error.troubleshooting }}
          </div>
          
          <!-- Actions -->
          <div class="mt-3 flex flex-wrap gap-2">
            <button @click="emit('retry')" 
                    class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-800 shadow-sm border transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                    :class="{
                      'border-red-200 text-red-700 dark:border-red-800 dark:text-red-300': errorColor === 'red',
                      'border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300': errorColor === 'yellow',
                      'border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300': errorColor === 'orange',
                      'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300': errorColor === 'blue',
                      'border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300': errorColor === 'purple'
                    }">
              Try again
            </button>
            
            <button @click="showTechnicalDetails = !showTechnicalDetails" 
                    class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
              {{ showTechnicalDetails ? 'Hide' : 'Show' }} details
            </button>
          </div>
        </div>
        
        <!-- Close button if dismissable -->
        <button v-if="dismissable" 
                @click="emit('dismiss')" 
                class="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Technical details (expandable) -->
    <div v-if="showTechnicalDetails" class="px-4 pb-4 text-xs">
      <div class="bg-white dark:bg-gray-800 p-3 rounded-md text-gray-800 dark:text-gray-200 font-mono overflow-auto max-h-64 border border-gray-200 dark:border-gray-700">
        <div v-if="error.path" class="mb-1">
          <strong>Endpoint:</strong> {{ error.path }}
        </div>
        
        <div v-if="error.timestamp" class="mb-1">
          <strong>Time:</strong> {{ new Date(error.timestamp).toLocaleString() }}
        </div>
        
        <div v-if="formattedDetails" class="mt-2 whitespace-pre-wrap">
          <strong>Details:</strong>
          <div class="mt-1 ml-2 border-l-2 border-gray-300 dark:border-gray-600 pl-2">
            {{ formattedDetails }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 