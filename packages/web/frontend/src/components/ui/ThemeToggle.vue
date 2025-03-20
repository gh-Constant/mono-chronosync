<template>
  <button
    @click="toggleTheme"
    type="button"
    class="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    aria-label="Toggle theme"
  >
    <!-- Sun icon -->
    <svg
      v-if="currentIcon === 'sun'"
      xmlns="http://www.w3.org/2000/svg"
      class="h-[1.2rem] w-[1.2rem]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>

    <!-- Moon icon -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="h-[1.2rem] w-[1.2rem]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const currentIcon = computed(() => {
  return themeStore.theme === 'dark' || 
    (themeStore.theme === 'system' && themeStore.systemTheme === 'dark') 
    ? 'moon' 
    : 'sun'
})

function toggleTheme() {
  const newTheme = currentIcon.value === 'sun' ? 'dark' : 'light'
  themeStore.setTheme(newTheme)
}
</script> 