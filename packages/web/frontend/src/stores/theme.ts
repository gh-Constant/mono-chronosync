import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'system')
  const systemTheme = ref(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

  // Watch for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    systemTheme.value = e.matches ? 'dark' : 'light'
    if (theme.value === 'system') {
      applyTheme(systemTheme.value)
    }
  })

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
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize theme
  function initializeTheme() {
    if (theme.value === 'system') {
      applyTheme(systemTheme.value)
    } else {
      applyTheme(theme.value)
    }
  }

  // Toggle theme
  function setTheme(newTheme: 'light' | 'dark' | 'system') {
    theme.value = newTheme
  }

  return {
    theme,
    systemTheme,
    setTheme,
    initializeTheme
  }
}) 
