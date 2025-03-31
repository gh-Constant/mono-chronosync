<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useInfiniteScroll, useIntersectionObserver } from '@vueuse/core'
import { Smartphone, Calendar } from 'lucide-vue-next'
import axios from 'axios'

interface AppUsage {
  app_id: number
  app_name: string
  package_name: string
  total_duration: number // in seconds
  session_count: number
}

interface CachedData {
  data: AppUsage[]
  timestamp: number
  timeRange: string
  totalItems: number
}

interface DateRange {
  start: string
  end: string
}

const appUsageData = ref<AppUsage[]>([])
const isLoading = ref(true)
const hasError = ref(false)
const error = ref<Error | null>(null)

// Constants
const TIME_RANGE_STORAGE_KEY = 'app_usage_time_range'
const cacheExpiryTime = 5 * 60 * 1000 // 5 minutes in milliseconds

// Get saved time range or default to daily
const savedTimeRange = localStorage.getItem(TIME_RANGE_STORAGE_KEY) || 'daily'
const selectedTimeRange = ref(savedTimeRange)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)
const totalItems = ref(0)
const loadingMore = ref(false)
const loadMoreTrigger = ref<HTMLDivElement | null>(null)
const hasMoreItems = computed(() => appUsageData.value.length < totalItems.value)

// Use both IntersectionObserver and infinite scroll for better control
useIntersectionObserver(
  loadMoreTrigger,
  ([entry]) => {
    if (entry?.isIntersecting && !isLoading.value && !loadingMore.value && hasMoreItems.value) {
      loadAppUsageData(false, true)
    }
  },
  { threshold: 0.1 }
)

useInfiniteScroll(
  loadMoreTrigger,
  () => {
    if (!isLoading.value && !loadingMore.value && hasMoreItems.value) {
      console.log('Infinite scroll triggered, loading more items')
      loadAppUsageData(false, true)
    }
  },
  { 
    distance: 50, // Reduced distance to trigger earlier
    throttle: 300  // Throttle the scroll event to improve performance
  }
)

// Function to get cache key based on time range
const getCacheKey = (timeRange: string) => `app_usage_${timeRange}`

// Function to check if cache is valid
const isCacheValid = (cache: CachedData | null): boolean => {
  if (!cache) return false
  
  const now = Date.now()
  const isExpired = now - cache.timestamp > cacheExpiryTime
  const isSameTimeRange = cache.timeRange === selectedTimeRange.value
  
  return !isExpired && isSameTimeRange  
}

// Format seconds into a readable format (Xh Ym)
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

const isCustomRangeDialogOpen = ref(false)
const customDateRange = ref<DateRange>({
  start: new Date().toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

// Format date for API
function formatDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split('T')[0]
}

// Get API endpoint based on time range
function getApiEndpoint(): string {
  if (selectedTimeRange.value === 'custom') {
    return `/api/app-usage/custom?startDate=${formatDate(customDateRange.value.start)}&endDate=${formatDate(customDateRange.value.end)}`
  }
  return `/api/app-usage/${selectedTimeRange.value}`
}

// Load app usage data based on selected time range
async function loadAppUsageData(forceRefresh = false, loadMore = false) {
  // If loading more, don't check cache and don't reset current data
  if (!loadMore) {
    // Reset pagination if not loading more
    if (!forceRefresh) {
      currentPage.value = 1
      appUsageData.value = []
    }

    // Check cache first
    const cacheKey = getCacheKey(selectedTimeRange.value)
    const cachedDataString = localStorage.getItem(cacheKey)
    const cachedData: CachedData | null = cachedDataString ? JSON.parse(cachedDataString) : null
    
    // If we have valid cache and don't force refresh, use it
    if (!forceRefresh && isCacheValid(cachedData)) {
      console.log(`Using cached data for ${selectedTimeRange.value}`)
      appUsageData.value = cachedData!.data
      totalItems.value = cachedData!.totalItems || appUsageData.value.length
      isLoading.value = false
      return
    }
  }
  
  // If no valid cache or forced refresh, fetch from API
  if (loadMore) {
    loadingMore.value = true
  } else {
    isLoading.value = true
    hasError.value = false
  }
  
  try {
    const params = {
      page: loadMore ? currentPage.value + 1 : 1,
      limit: itemsPerPage.value
    }

    const apiUrl = getApiEndpoint()
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('Authentication token not found')
    }
    
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params,
      timeout: 10000, // 10 second timeout
      validateStatus: (status) => status >= 200 && status < 300
    })
    
    const newItems = response.data.data || []
    
    if (loadMore) {
      // Append new items to existing data
      appUsageData.value = [...appUsageData.value, ...newItems]
      currentPage.value++
    } else {
      // Replace existing data
      appUsageData.value = newItems
      // Reset pagination
      currentPage.value = 1
    }
    
    // Set total items count from response
    totalItems.value = response.data.total || newItems.length
    
    // Only cache initial data, not additional loaded pages
    if (!loadMore) {
      // Save to cache
      const cacheData: CachedData = {
        data: appUsageData.value,
        timestamp: Date.now(),
        timeRange: selectedTimeRange.value,
        totalItems: totalItems.value
      }
      
      localStorage.setItem(getCacheKey(selectedTimeRange.value), JSON.stringify(cacheData))
      console.log(`Cached data for ${selectedTimeRange.value}`)
    }
  } catch (err: any) {
    console.error('Error fetching app usage data:', err)
    if (!loadMore) {
      hasError.value = true
      appUsageData.value = [] // Ensure it's always an array on regular load
      
      // Check for specific error types
      if (err.code === 'ERR_NETWORK') {
        error.value = new Error('Unable to connect to the server. Please check your internet connection and try again.')
      } else if (err.response?.status === 401) {
        error.value = new Error('Your session has expired. Please log in again.')
      } else if (err.message === 'Authentication token not found') {
        error.value = new Error('Please log in to view app usage data.')
      } else {
        error.value = new Error('An error occurred while fetching app usage data. Please try again later.')
      }
    }
  } finally {
    if (loadMore) {
      loadingMore.value = false
    } else {
      isLoading.value = false
    }
  }
}

// Watch for time range changes and save to localStorage
watch(selectedTimeRange, (newValue) => {
  localStorage.setItem(TIME_RANGE_STORAGE_KEY, newValue)
})

// Change time range and reload data
function changeTimeRange(range: string) {
  selectedTimeRange.value = range
  currentPage.value = 1 // Reset pagination
  appUsageData.value = [] // Clear current data
  loadAppUsageData() // Load new data
}

// Function to force refresh data
function refreshData() {
  // Reset pagination when refreshing
  currentPage.value = 1
  appUsageData.value = []
  loadAppUsageData(true)
  
  // Check if we need to load more after refresh
  setTimeout(() => {
    if (loadMoreTrigger.value) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !loadingMore.value && hasMoreItems.value) {
            loadAppUsageData(false, true)
          }
          observer.disconnect()
        },
        { threshold: 0.1 }
      )
      observer.observe(loadMoreTrigger.value)
    }
  }, 100) // Small delay to ensure content has updated
}

// Apply custom date range
function applyCustomRange() {
  if (!customDateRange.value.start || !customDateRange.value.end) {
    return // Don't proceed if dates are missing
  }

  const startDate = new Date(customDateRange.value.start)
  const endDate = new Date(customDateRange.value.end)

  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    alert('Please enter valid dates')
    return
  }

  if (startDate > endDate) {
    alert('Start date must be before end date')
    return
  }

  // Force refresh if we're already in custom mode and changing dates
  const forceRefresh = selectedTimeRange.value === 'custom'
  
  selectedTimeRange.value = 'custom'
  isCustomRangeDialogOpen.value = false
  currentPage.value = 1
  appUsageData.value = []
  loadAppUsageData(forceRefresh) // Pass forceRefresh to bypass cache when changing dates
}

// Format date range for display
function formatCustomRange(): string {
  if (selectedTimeRange.value !== 'custom') return ''
  
  const start = new Date(customDateRange.value.start).toLocaleDateString()
  const end = new Date(customDateRange.value.end).toLocaleDateString()
  return `${start} - ${end}`
}

// Load data on mount
loadAppUsageData()
</script>

<template>
  <section class="mb-10">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- Header section -->
      <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Title and refresh row -->
          <div class="flex items-center justify-between sm:justify-start sm:w-auto">
            <div class="flex items-center">
              <Smartphone class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">App Usage</h2>
            </div>
            
            <button 
              @click="refreshData" 
              class="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors sm:ml-4"
              title="Refresh data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9"></path><path d="M3 12a9 9 0 0 1 9-9"></path><path d="m3 8 4 4-4 4"></path><path d="M21 16V8"></path></svg>
            </button>
          </div>
          
          <!-- Time range selector -->
          <div class="flex flex-wrap sm:flex-nowrap gap-2 text-sm w-full sm:w-auto">
            <div class="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto justify-start">
              <button 
                v-for="range in ['daily', 'weekly', 'monthly', 'yearly']"
                :key="range"
                @click="changeTimeRange(range)" 
                class="flex-1 sm:flex-none px-3 py-1.5 sm:py-1 rounded-md transition-colors text-center min-w-[80px]"
                :class="selectedTimeRange === range 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                {{ range.charAt(0).toUpperCase() + range.slice(1) }}
              </button>
              
              <!-- Custom range button -->
              <button 
                @click="isCustomRangeDialogOpen = true"
                class="flex-1 sm:flex-none px-3 py-1.5 sm:py-1 rounded-md transition-colors flex items-center justify-center gap-1 min-w-[80px]"
                :class="selectedTimeRange === 'custom'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                <Calendar class="h-4 w-4" />
                <span v-if="selectedTimeRange === 'custom'">{{ formatCustomRange() }}</span>
                <span v-else>Custom</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading state (initial load) -->
      <div v-if="isLoading" class="p-6 flex justify-center items-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="hasError" class="p-6 text-center">
        <div class="flex flex-col items-center space-y-4">
          <div class="text-red-500 dark:text-red-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-lg font-medium">Failed to load app usage data</p>
          </div>
          <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm">
            {{ error?.message || 'An unexpected error occurred. Please try again.' }}
          </p>
          <button 
            @click="refreshData"
            class="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="appUsageData && appUsageData.length === 0" class="p-6 text-center">
        <p class="text-gray-500 dark:text-gray-400">No app usage data available for this time period.</p>
      </div>
      
      <!-- Data display -->
      <div v-else>
        <!-- App usage list -->
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="app in appUsageData" 
            :key="app.app_id"
            class="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div class="flex items-center space-x-4">
              <div 
                class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-indigo-600 dark:text-indigo-400">
                  {{ app.app_name.substring(0, 1).toUpperCase() }}
                </span>
              </div>
              <div>
                <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{{ app.app_name }}</p>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ app.session_count }} sessions</p>
              </div>
            </div>
            
            <!-- Duration badge -->
            <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
              {{ formatDuration(app.total_duration) }}
            </span>
          </div>
        </div>
        
        <!-- Load more trigger for infinite scroll -->
        <div 
          ref="loadMoreTrigger" 
          class="p-4 flex justify-center items-center"
          v-if="hasMoreItems"
        >
          <!-- Loading indicator when loading more -->
          <div v-if="loadingMore" class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          
          <!-- Subtle loading indicator when not actively loading -->
          <div v-else class="flex flex-col items-center">
            <div class="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
              <span>Scroll for more</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Pagination info -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          Showing {{ appUsageData.length }} of {{ totalItems }} apps
        </div>
      </div>
    </div>

    <!-- Custom Range Dialog -->
    <div v-if="isCustomRangeDialogOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Date Range</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input 
              type="date" 
              v-model="customDateRange.start"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input 
              type="date" 
              v-model="customDateRange.end"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="isCustomRangeDialogOpen = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="applyCustomRange"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Existing styles */

/* Date picker custom styles */
input[type="date"] {
  color-scheme: light dark;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
}

.dark input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style> 