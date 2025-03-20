<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = ref(authStore.user)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <p class="text-blue-700 dark:text-blue-300">
            Welcome to your dashboard, {{ user?.name || 'User' }}! This page is only visible to authenticated users.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Dashboard cards would go here -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 class="font-medium mb-2">Tasks</h3>
            <p class="text-gray-600 dark:text-gray-300">You have 0 pending tasks</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 class="font-medium mb-2">Calendar</h3>
            <p class="text-gray-600 dark:text-gray-300">No upcoming events</p>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 class="font-medium mb-2">Analytics</h3>
            <p class="text-gray-600 dark:text-gray-300">View your productivity stats</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 