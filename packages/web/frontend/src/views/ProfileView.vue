<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = ref(authStore.user)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <!-- Profile header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h1 class="text-2xl font-bold">Your Profile</h1>
          <p class="text-white/80">Manage your account settings</p>
        </div>
        
        <!-- Profile content -->
        <div class="p-6">
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
              {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ user?.name || 'User' }}</h2>
              <p class="text-gray-600 dark:text-gray-400">{{ user?.email || 'user@example.com' }}</p>
            </div>
          </div>
          
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-white">Account Information</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input 
                  type="text" 
                  :value="user?.name"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  :value="user?.email"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button 
              @click="authStore.logout()"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 