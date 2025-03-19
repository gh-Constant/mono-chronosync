<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SunIcon, MoonIcon, UserIcon } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

interface NavItem {
  name: string
  path: string
}

const router = useRouter()
const isOpen = ref(false)
const themeStore = useThemeStore()
const authStore = useAuthStore()

// Navigation items for authenticated users
const navItems = computed(() => {
  const items: NavItem[] = []
  
  // Add home route only for non-authenticated users
  if (!authStore.isAuthenticated) {
    items.push({ name: 'Home', path: '/' })
  }
  
  // Add authenticated-only routes
  if (authStore.isAuthenticated) {
    items.push(
      { name: 'Dashboard', path: '/dashboard' }
    )
  }
  
  return items
})

const closeMenu = () => {
  isOpen.value = false
}

// Close menu when route changes
router.afterEach(() => {
  closeMenu()
})

// Handle logout
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-900 shadow-lg fixed w-full top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link 
            to="/" 
            class="flex items-center space-x-3"
            @click="closeMenu"
          >
            <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">C</span>
            </div>
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              ChronoSync
            </span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden sm:flex sm:items-center sm:space-x-8">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
            active-class="text-indigo-600 dark:text-indigo-400 font-semibold"
          >
            {{ item.name }}
          </router-link>
          
          <!-- Dark mode toggle -->
          <button
            @click="themeStore.toggleDarkMode()"
            class="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :aria-label="themeStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <sun-icon v-if="themeStore.isDarkMode" class="w-5 h-5" />
            <moon-icon v-else class="w-5 h-5" />
          </button>

          <!-- Profile dropdown for authenticated users -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <router-link
              to="/profile"
              class="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              <user-icon class="w-5 h-5 mr-1" />
              Profile
            </router-link>
          </div>

          <!-- Logout button for authenticated users -->
          <button
            v-if="authStore.isAuthenticated"
            @click="handleLogout"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Logout
          </button>

          <!-- Login/Signup button for non-authenticated users -->
          <router-link
            v-else
            to="/auth"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Get Started
          </router-link>
        </div>

        <!-- Mobile menu button and dark mode toggle -->
        <div class="flex items-center sm:hidden">
          <!-- Dark mode toggle -->
          <button
            @click="themeStore.toggleDarkMode()"
            class="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
            :aria-label="themeStore.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <sun-icon v-if="themeStore.isDarkMode" class="w-5 h-5" />
            <moon-icon v-else class="w-5 h-5" />
          </button>

          <button
            @click="isOpen = !isOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              :class="{ 'hidden': isOpen, 'block': !isOpen }"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              :class="{ 'block': isOpen, 'hidden': !isOpen }"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      :class="{ 'block': isOpen, 'hidden': !isOpen }"
      class="sm:hidden"
    >
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          active-class="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 font-semibold"
          @click="closeMenu"
        >
          {{ item.name }}
        </router-link>
        
        <!-- Profile link for authenticated users (mobile) -->
        <router-link
          v-if="authStore.isAuthenticated"
          to="/profile"
          class="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          active-class="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 font-semibold"
          @click="closeMenu"
        >
          Profile
        </router-link>
        
        <!-- Logout button for authenticated users (mobile) -->
        <button
          v-if="authStore.isAuthenticated"
          @click="handleLogout"
          class="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Logout
        </button>
        
        <!-- Login/Signup button for non-authenticated users (mobile) -->
        <router-link
          v-else
          to="/auth"
          class="block w-full text-center px-4 py-2 mx-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="closeMenu"
        >
          Get Started
        </router-link>
      </div>
    </div>
  </nav>
</template> 