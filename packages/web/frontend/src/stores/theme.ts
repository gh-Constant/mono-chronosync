import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(false)

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    updateDocumentClass()
  }

  function setDarkMode(value: boolean) {
    isDarkMode.value = value
    updateDocumentClass()
  }

  function updateDocumentClass() {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize dark mode based on system preference
  if (typeof window !== 'undefined') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(systemPrefersDark)

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setDarkMode(e.matches)
    })
  }

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode
  }
}) 
