<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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

// Track the previous route to detect navigation changes
const previousPath = ref(route.path)

// Watch for route changes to collapse sidebar on navigation (mobile only)
watch(() => route.path, (newPath) => {
  if (isMobile.value && newPath !== previousPath.value && sidebar.state.value === 'expanded') {
    // Close the sidebar on mobile when navigating between pages
    sidebar.toggleSidebar()
  }
  previousPath.value = newPath
})

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

// Swipe detection for mobile
const touchStartX = ref(0)
const touchEndX = ref(0)
const MIN_SWIPE_DISTANCE = 50
const EDGE_THRESHOLD = 50 // Distance from edge to detect swipe

function handleTouchStart(e: TouchEvent) {
  touchStartX.value = e.changedTouches[0].screenX
}

function handleTouchEnd(e: TouchEvent) {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

function handleSwipe() {
  const swipeDistance = touchStartX.value - touchEndX.value
  const isNearRightEdge = window.innerWidth - touchStartX.value < EDGE_THRESHOLD
  
  // If swiping left from right edge and sidebar is hidden
  if (swipeDistance > MIN_SWIPE_DISTANCE && isNearRightEdge && isSidebarHidden.value) {
    toggleSidebar()
  }
}

onMounted(() => {
  if (isMobile.value) {
    document.addEventListener('touchstart', handleTouchStart, false)
    document.addEventListener('touchend', handleTouchEnd, false)
  }
})

onUnmounted(() => {
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <!-- Overlay for closing sidebar when clicking outside -->
  <transition name="fade">
    <div 
      v-if="isMobile && isExpanded" 
      class="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
      @click="toggleSidebar"
    ></div>
  </transition>

  <!-- Floating trigger button when sidebar is hidden on mobile -->
  <div v-if="isSidebarHidden" class="fixed top-3 right-3 z-50">
    <button 
      class="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:bg-gray-100/90 dark:hover:bg-gray-700/90 border border-gray-200/50 dark:border-gray-700/50"
      @click="toggleSidebar"
    >
      <ChevronRight class="h-5 w-5 transition-transform duration-300" />
      <span class="sr-only">Open Sidebar</span>
    </button>
  </div>

  <!-- Main sidebar - hidden when in mobile collapsed state -->
  <transition name="slide-fade">
    <div 
      v-if="!isSidebarHidden"
      class="fixed inset-y-0 z-50 flex h-screen flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300"
      :class="[
        // Position based on device
        isMobile ? 'right-0 border-l border-gray-200/70 dark:border-gray-800/70' : 'left-0 border-r border-gray-200/70 dark:border-gray-800/70',
        // Width based on expansion state
        isExpanded ? 'w-[240px]' : 'w-[64px]'
      ]"
    >
      <!-- Header -->
      <div class="flex h-16 items-center border-b border-gray-200/70 dark:border-gray-800/70 px-3">
        <div class="flex w-full items-center justify-between">
          <router-link v-if="isExpanded && !isMobile" to="/" class="flex items-center gap-2">
            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600">
              <div class="h-4 w-4 rounded-md bg-white" />
            </div>
            <span class="text-lg font-semibold">ChronoSync</span>
          </router-link>

          <!-- Mobile header with title on left and trigger on right -->
          <div v-if="isMobile && isExpanded" class="flex-1 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600">
                <div class="h-4 w-4 rounded-md bg-white" />
              </div>
              <span class="text-lg font-semibold">ChronoSync</span>
            </div>
            
            <SidebarTrigger class="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100/90 dark:hover:bg-gray-800/90">
              <ChevronLeft class="h-5 w-5 transition-transform duration-300" />
            </SidebarTrigger>
          </div>

          <!-- Desktop or collapsed mobile state -->
          <SidebarTrigger v-if="!isMobile || !isExpanded" :class="[
            'flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100/90 dark:hover:bg-gray-800/90',
            !isMobile ? 'ml-auto' : 'mx-auto'
          ]">
            <ChevronLeft :class="[
              'h-5 w-5 transition-transform duration-300',
              !isExpanded && !isMobile ? 'rotate-180' : '',
              isMobile ? 'rotate-180' : ''
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
              isCurrentRoute(item.to) ? 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-white' : '',
              isMobile ? 'justify-start' : ''
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
              'hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80',
              isMobile ? 'justify-start' : ''
            ]">
              <User2 class="h-5 w-5 flex-shrink-0" />
              <span v-if="isExpanded">{{ userName }}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              :side="isMobile ? 'left' : 'right'" 
              align="start" 
              class="w-48"
            >
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
  </transition>
</template>

<style scoped>
.router-link-active {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white;
}

/* Slide animation for sidebar */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

/* Fade animation for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 