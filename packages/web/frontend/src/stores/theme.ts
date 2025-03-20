import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(localStorage.getItem('theme') as Theme || 'system')
  const systemTheme = ref<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

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
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize theme
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      theme.value = savedTheme
    }
    
    if (theme.value === 'system') {
      applyTheme(systemTheme.value)
    } else {
      applyTheme(theme.value)
    }
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  return {
    theme,
    systemTheme,
    setTheme,
    initializeTheme
  }
}) 
