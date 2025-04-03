<script setup lang="ts">
import { computed } from 'vue'
import { Home, Calendar, Settings, User2, LogOut, ChevronLeft } from 'lucide-vue-next'
import { useSidebar } from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const authStore = useAuthStore()
const route = useRoute()
const sidebar = useSidebar()

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    to: '/dashboard'
  },
  {
    title: 'Calendar',
    icon: Calendar,
    to: '/calendar'
  },
  {
    title: 'Settings',
    icon: Settings,
    to: '/settings'
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
</script>

<template>
  <div class="fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800"
       :class="[isExpanded ? 'w-[240px]' : 'w-[64px]']">
    <!-- Header -->
    <div class="flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-3">
      <div class="flex w-full items-center justify-between">
        <router-link to="/" class="flex items-center gap-2" v-if="isExpanded">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600">
            <div class="h-4 w-4 rounded-md bg-white" />
          </div>
          <span class="text-lg font-semibold">Chrono<span class="text-purple-600">sync</span></span>
        </router-link>
        <button
          @click="sidebar.toggleSidebar"
          class="ml-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md hover:shadow-purple-300/30 dark:hover:shadow-purple-900/30 hover:scale-105 transition-all duration-300"
        >
          <ChevronLeft :class="[
            'h-5 w-5 transition-all duration-300',
            isExpanded ? '' : 'rotate-180'
          ]" />
          <span class="sr-only">Toggle Sidebar</span>
        </button>
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
            'flex items-center gap-3 rounded-lg px-4 py-3 text-gray-500 dark:text-gray-400 transition-all duration-300 my-1 min-h-[3rem]',
            'hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 hover:shadow-sm hover:shadow-purple-200/20 dark:hover:shadow-purple-900/20',
            isCurrentRoute(item.to) ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 shadow-sm shadow-purple-200/20 dark:shadow-purple-900/20' : '',
            isExpanded ? 'justify-start' : 'justify-center'
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'flex-shrink-0 transition-all duration-500',
              isExpanded ? 'h-6 w-6' : 'h-8 w-8 mx-auto'
            ]"
          />
          <span v-if="isExpanded" class="text-base font-medium">{{ item.title }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Footer -->
    <div class="border-t border-gray-200 dark:border-gray-800 p-2">
      <div class="flex flex-col gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger :class="[
            'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-500 dark:text-gray-400 transition-all duration-300 min-h-[3rem]',
            'hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 hover:shadow-sm hover:shadow-purple-200/20 dark:hover:shadow-purple-900/20',
            isExpanded ? 'justify-start' : 'justify-center'
          ]">
            <User2 :class="['flex-shrink-0', isExpanded ? 'h-6 w-6' : 'h-7 w-7 mx-auto']" />
            <span v-if="isExpanded" class="text-base">{{ userName }}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" class="w-48">
            <DropdownMenuItem @click="logout" class="cursor-pointer">
              <LogOut class="mr-2 h-5 w-5" />
              <span class="text-base">Logout</span>
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
  @apply bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 shadow-sm shadow-purple-200/20 dark:shadow-purple-900/20;
}

/* Ensure icons are properly centered in collapsed state */
.router-link-active svg,
.router-link svg {
  @apply mx-auto;
}

/* Hover animations for Dashboard icon */
.router-link-active:hover svg,
.router-link:hover svg {
  @apply scale-110;
}

/* Dashboard icon hover animation - bounce */
.router-link-active:has([to="/dashboard"]):hover svg,
.router-link:has([to="/dashboard"]):hover svg {
  animation: bounce 1s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) scale(1.1);
  }
  50% {
    transform: translateY(-3px) scale(1.1);
  }
}

/* Calendar icon hover animation - slide */
.router-link-active:has([to="/calendar"]):hover svg,
.router-link:has([to="/calendar"]):hover svg {
  animation: slideInOut 1.5s infinite ease-in-out;
}

@keyframes slideInOut {
  0%, 100% {
    transform: translateX(0) scale(1.1);
  }
  50% {
    transform: translateX(3px) scale(1.1);
  }
}

/* Settings icon hover animation - rotation */
.router-link-active:has([to="/settings"]):hover svg,
.router-link:has([to="/settings"]):hover svg {
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1.1);
  }
}
</style>