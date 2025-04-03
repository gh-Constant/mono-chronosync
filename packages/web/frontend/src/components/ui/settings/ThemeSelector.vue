<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue'
import { useThemeStore, type Theme } from '@/stores/theme'
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const themeStore = useThemeStore()
const selectedTheme = ref<Theme>(themeStore.theme)
const initialTheme = ref<Theme>(themeStore.theme)

// Get hasChanges from parent SettingsSection if available
const hasChanges = inject<{ value: boolean }>('hasChanges', { value: false })

// Theme options
const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
]

// Current theme display
const currentThemeDisplay = computed(() => {
  if (selectedTheme.value === 'system') {
    return `System (${themeStore.systemTheme === 'dark' ? 'Dark' : 'Light'})`
  }
  return selectedTheme.value.charAt(0).toUpperCase() + selectedTheme.value.slice(1)
})

// Handle theme change
const changeTheme = (theme: Theme) => {
  selectedTheme.value = theme

  // Always apply theme immediately for preview
  themeStore.setTheme(theme)

  // Update hasChanges if provided by parent
  if (hasChanges && typeof hasChanges === 'object' && 'value' in hasChanges) {
    hasChanges.value = initialTheme.value !== theme
  }
}

// Watch for theme changes in the store
onMounted(() => {
  // Ensure theme store is initialized
  if (!themeStore.isInitialized) {
    themeStore.initializeTheme()
  }

  // Set initial theme for change tracking
  initialTheme.value = themeStore.theme
})

// Method to apply theme changes (called from parent)
const applyChanges = () => {
  themeStore.setTheme(selectedTheme.value)
  initialTheme.value = selectedTheme.value
}

// Method to discard changes (called from parent)
const discardChanges = () => {
  selectedTheme.value = initialTheme.value
}

// Expose methods to parent
defineExpose({
  applyChanges,
  discardChanges
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4 md:mb-6">
      <span class="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">Current theme:</span>
      <span class="text-sm md:text-base text-gray-900 dark:text-white font-medium px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{{ currentThemeDisplay }}</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
      <button
        v-for="option in themeOptions"
        :key="option.value"
        @click="changeTheme(option.value as Theme)"
        :class="[
          'flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 rounded-lg border transition-all',
          selectedTheme === option.value
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 shadow-md'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:shadow-md'
        ]"
      >
        <component :is="option.icon" class="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 mb-2 md:mb-3" />
        <span class="text-sm md:text-base font-medium">{{ option.label }}</span>
      </button>
    </div>

    <p class="mt-3 md:mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
      System theme will automatically switch between light and dark based on your device settings.
      <span class="italic">Changes are applied immediately for preview.</span>
    </p>
  </div>
</template>
