import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(localStorage.getItem('theme') as Theme || 'system')
  const systemTheme = ref<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const isInitialized = ref(false)

  // Watch for system theme changes
  const setupSystemThemeWatcher = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Update system theme when it changes
    const handleChange = (e: MediaQueryListEvent) => {
      systemTheme.value = e.matches ? 'dark' : 'light'
      if (theme.value === 'system') {
        applyTheme(systemTheme.value)
      }
    }

    // Add event listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    // Initial check
    systemTheme.value = mediaQuery.matches ? 'dark' : 'light'

    // Return cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange)
      }
    }
  }

  // Watch for theme changes
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'system') {
      applyTheme(systemTheme.value)
    } else {
      applyTheme(newTheme)
    }
  })

  // Apply theme to document
  function applyTheme(mode: string) {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize theme
  function initializeTheme() {
    if (isInitialized.value) return

    // Setup system theme watcher
    setupSystemThemeWatcher()

    // Get saved theme
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      theme.value = savedTheme
    }

    // Apply theme
    if (theme.value === 'system') {
      applyTheme(systemTheme.value)
    } else {
      applyTheme(theme.value)
    }

    isInitialized.value = true
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  // Auto-initialize if in browser environment
  if (typeof window !== 'undefined') {
    initializeTheme()
  }

  return {
    theme,
    systemTheme,
    setTheme,
    initializeTheme,
    isInitialized
  }
})
