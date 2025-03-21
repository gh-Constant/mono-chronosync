<script setup lang="ts">
import { computed } from 'vue'
import { Home, Calendar, Settings, User2, LogOut, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useSidebar } from '@/components/ui/sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const authStore = useAuthStore()
const route = useRoute()
const sidebar = useSidebar()

// Detect mobile devices
const isMobile = useMediaQuery('(max-width: 767px)')

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    to: '/dashboard'
  },
  {
    title: 'Calendar',
    icon: Calendar,
    to: '/dashboard/calendar'
  },
  {
    title: 'Settings',
    icon: Settings,
    to: '/dashboard/settings'
  }
]

const userName = computed(() => authStore.user?.name || 'User')

function isCurrentRoute(path: string) {
  return route.path === path
}

function logout() {
  authStore.logout()
}

const isExpanded = computed(() => sidebar.state.value === 'expanded')

// Is sidebar completely hidden (mobile collapsed state)
const isSidebarHidden = computed(() => isMobile.value && !isExpanded.value)

// Function to toggle sidebar
function toggleSidebar() {
  sidebar.toggleSidebar()
}
</script>

<template>
  <!-- Floating trigger button when sidebar is hidden on mobile -->
  <div v-if="isSidebarHidden" class="fixed top-3 left-3 z-50">
    <button 
      class="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:bg-gray-100/90 dark:hover:bg-gray-700/90 border border-gray-200/50 dark:border-gray-700/50"
      @click="toggleSidebar"
    >
      <ChevronRight class="h-5 w-5" />
      <span class="sr-only">Open Sidebar</span>
    </button>
  </div>

  <!-- Main sidebar - hidden when in mobile collapsed state -->
  <div 
    v-if="!isSidebarHidden"
    class="fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-200/70 dark:border-gray-800/70 transition-all duration-300"
    :class="[isExpanded ? 'w-[240px]' : 'w-[64px]']"
  >
    <!-- Header -->
    <div class="flex h-16 items-center border-b border-gray-200/70 dark:border-gray-800/70 px-3">
      <div class="flex w-full items-center justify-between">
        <router-link to="/" class="flex items-center gap-2" v-if="isExpanded">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600">
            <div class="h-4 w-4 rounded-md bg-white" />
          </div>
          <span class="text-lg font-semibold">ChronoSync</span>
        </router-link>
        <SidebarTrigger class="ml-auto flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100/90 dark:hover:bg-gray-800/90">
          <ChevronLeft :class="[
            'h-5 w-5 transition-transform',
            isExpanded ? '' : 'rotate-180'
          ]" />
        </SidebarTrigger>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto py-4">
      <nav class="grid gap-1 px-2">
        <router-link
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :class="[
            'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-400 transition-colors',
            'hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80',
            isCurrentRoute(item.to) ? 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-white' : ''
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
          <span v-if="isExpanded" class="text-sm font-medium">{{ item.title }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-200/70 dark:border-gray-800/70 p-2">
      <div class="flex flex-col gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger :class="[
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400',
            'hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80'
          ]">
            <User2 class="h-5 w-5 flex-shrink-0" />
            <span v-if="isExpanded">{{ userName }}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" class="w-48">
            <DropdownMenuItem @click="logout" class="cursor-pointer">
              <LogOut class="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div :class="[
          'flex rounded-lg px-3 py-2',
          isExpanded ? 'justify-start' : 'justify-center'
        ]">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white;
}
</style> 