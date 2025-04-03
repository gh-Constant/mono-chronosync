<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  User,
  Palette,
  Shield,
  Bell,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-vue-next'

// Define tab options
const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'app', label: 'Application', icon: SettingsIcon }
]

// Get active tab from localStorage or default to 'account'
const getInitialTab = () => {
  const savedTab = localStorage.getItem('settings-active-tab')
  return savedTab && tabs.some(tab => tab.id === savedTab) ? savedTab : 'account'
}

// Active tab state
const activeTab = ref(getInitialTab())

// Save active tab to localStorage when it changes
watch(activeTab, (newTab) => {
  localStorage.setItem('settings-active-tab', newTab)
})

// For mobile view
const showMobileMenu = ref(false)

// Get current tab label
const currentTabLabel = computed(() => {
  return tabs.find(tab => tab.id === activeTab.value)?.label || 'Settings'
})

// Toggle mobile menu
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

// Set active tab and close mobile menu
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  showMobileMenu.value = false
}

// Close mobile menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (showMobileMenu.value && !target.closest('.mobile-menu-container')) {
    showMobileMenu.value = false
  }
}

// Add click outside listener
watch(showMobileMenu, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div class="w-full max-w-full mx-auto">
    <!-- Mobile tab selector (dropdown style) - Only on small screens -->
    <div class="md:hidden mb-6 mobile-menu-container">
      <button
        @click="toggleMobileMenu"
        class="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div class="flex items-center">
          <component :is="tabs.find(tab => tab.id === activeTab)?.icon" class="h-5 w-5 mr-3 text-primary" />
          <span class="font-medium text-gray-900 dark:text-white">{{ currentTabLabel }}</span>
        </div>
        <ChevronRight :class="['h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200', showMobileMenu ? 'rotate-90' : '']" />
      </button>

      <!-- Mobile dropdown menu -->
      <div
        v-if="showMobileMenu"
        class="mt-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden absolute z-20 left-0 right-0 max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="setActiveTab(tab.id)"
            class="w-full flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :class="activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300'"
          >
            <component :is="tab.icon" class="h-5 w-5 mr-3" />
            <span :class="activeTab === tab.id ? 'font-medium' : ''">
              {{ tab.label }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tablet sidebar (horizontal tabs) - Only on medium screens -->
    <div class="hidden md:block lg:hidden mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2 border border-gray-200 dark:border-gray-700">
        <nav class="flex space-x-2 overflow-x-auto pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            :class="activeTab === tab.id
              ? 'bg-primary/10 text-primary'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            <component :is="tab.icon" class="h-5 w-5 mr-2" />
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Desktop layout -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Sidebar (desktop only) - Only on large screens -->
      <div class="hidden lg:block w-64 flex-shrink-0">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-200 dark:border-gray-700 sticky top-6">
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors"
              :class="activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              <component :is="tab.icon" class="h-5 w-5 mr-3" />
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Content area - Responsive width based on screen size -->
      <div class="flex-1 min-w-0 max-w-full mx-auto lg:mx-0">
        <div v-if="activeTab === 'account'" class="animate-fadeIn">
          <slot name="account"></slot>
        </div>
        <div v-else-if="activeTab === 'appearance'" class="animate-fadeIn">
          <slot name="appearance"></slot>
        </div>
        <div v-else-if="activeTab === 'privacy'" class="animate-fadeIn">
          <slot name="privacy"></slot>
        </div>
        <div v-else-if="activeTab === 'notifications'" class="animate-fadeIn">
          <slot name="notifications"></slot>
        </div>
        <div v-else-if="activeTab === 'app'" class="animate-fadeIn">
          <slot name="app"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
