<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const authStore = useAuthStore()
const route = useRoute()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Only show navbar on home and auth pages
const showNavbar = computed(() => {
  return route.path === '/' || route.path === '/auth'
})
</script>

<template>
  <nav v-if="showNavbar" class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
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
            <span class="text-xl font-bold text-gray-900 dark:text-white">Chrono<span class="text-purple-600">sync</span></span>
          </router-link>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          
          <template v-if="!authStore.isAuthenticated && route.path === '/'">
            <router-link
              to="/auth?tab=signup"
              class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center"
            >
              <span>Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
            <router-link
              to="/auth?tab=login"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Log in
            </router-link>
          </template>
          
          <button
            v-else-if="authStore.isAuthenticated"
            @click="authStore.logout"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Log out
          </button>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button 
            @click="toggleMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Icon when menu is closed -->
            <svg 
              v-if="!isMenuOpen" 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Icon when menu is open -->
            <svg 
              v-else 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu, show/hide based on menu state -->
    <div v-if="isMenuOpen" class="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div class="px-2 pt-2 pb-3 space-y-3 sm:px-3">
        <template v-if="!authStore.isAuthenticated && route.path === '/'">
          <router-link
            to="/auth?tab=signup"
            class="block text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-md text-base font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-md mx-2 flex items-center justify-center"
            @click="isMenuOpen = false"
          >
            <span>Get Started</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
          <router-link
            to="/auth?tab=login"
            class="block text-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium mt-2"
            @click="isMenuOpen = false"
          >
            Log in
          </router-link>
        </template>
        
        <button
          v-else-if="authStore.isAuthenticated"
          @click="() => { authStore.logout(); isMenuOpen = false; }"
          class="block w-full text-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium"
        >
          Log out
        </button>
      </div>
    </div>
  </nav>
</template> 