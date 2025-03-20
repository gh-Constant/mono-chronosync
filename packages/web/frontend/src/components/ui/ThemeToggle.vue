<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
      :aria-expanded="isOpen"
    >
      <!-- Sun icon -->
      <svg
        v-if="currentIcon === 'sun'"
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      <!-- Moon icon -->
      <svg
        v-else-if="currentIcon === 'moon'"
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>

      <!-- System icon -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <button
        v-for="option in options"
        :key="option.value"
        @click="selectTheme(option.value)"
        class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-100 dark:bg-gray-700': themeStore.theme === option.value }"
      >
        <component :is="option.icon" class="w-4 h-4 mr-2" />
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const isOpen = ref(false)

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  themeStore.initializeTheme()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const options = [
  {
    label: 'Light',
    value: 'light',
    icon: 'sun-icon',
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: 'moon-icon',
  },
  {
    label: 'System',
    value: 'system',
    icon: 'system-icon',
  },
]

const currentIcon = computed(() => {
  if (themeStore.theme === 'system') {
    return themeStore.systemTheme === 'dark' ? 'moon' : 'sun'
  }
  return themeStore.theme === 'dark' ? 'moon' : 'sun'
})

function selectTheme(theme: 'light' | 'dark' | 'system') {
  themeStore.setTheme(theme)
  isOpen.value = false
}
</script> 