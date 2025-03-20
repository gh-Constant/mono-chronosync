<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const authStore = useAuthStore()
</script>

<template>
  <nav class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <div class="w-6 h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                <div class="w-4 h-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
              </div>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">Chronosync</span>
          </router-link>
        </div>

        <!-- Right side navigation -->
        <div class="flex items-center space-x-4">
          <ThemeToggle />
          
          <template v-if="!authStore.isAuthenticated">
            <router-link
              to="/login"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Log in
            </router-link>
            <router-link
              to="/register"
              class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign up
            </router-link>
          </template>
          
          <button
            v-else
            @click="authStore.logout"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template> 