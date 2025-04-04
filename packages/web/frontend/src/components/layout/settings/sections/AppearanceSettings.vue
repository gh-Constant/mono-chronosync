<script setup lang="ts">
import { ref, watch } from 'vue'
import { SettingsCard } from '@/components/ui/settings'
import { ThemeSelector } from '@/components/ui/settings'
import { ToggleSwitch } from '@/components/ui/settings'
import { SettingsSection } from '@/components/ui/settings'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

// References to child components
const themeSelector = ref<{
  applyChanges: () => void
  discardChanges: () => void
} | null>(null)
const settingsSection = ref<{
  setHasChanges: (value: boolean) => void
} | null>(null)

// Font size options
const fontSizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium (Default)' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' }
]

// Animation options
const animationOptions = [
  { value: 'enabled', label: 'Enabled' },
  { value: 'reduced', label: 'Reduced' },
  { value: 'disabled', label: 'Disabled' }
]

// Form state
const initialState = {
  fontSize: 'md',
  animations: 'enabled',
  denseMode: false,
  highContrast: false
}

const fontSize = ref(initialState.fontSize)
const animations = ref(initialState.animations)
const denseMode = ref(initialState.denseMode)
const highContrast = ref(initialState.highContrast)

// Track changes
const hasUnsavedChanges = () => {
  return fontSize.value !== initialState.fontSize ||
    animations.value !== initialState.animations ||
    denseMode.value !== initialState.denseMode ||
    highContrast.value !== initialState.highContrast
}

// Watch for changes
watch([fontSize, animations, denseMode, highContrast], () => {
  if (settingsSection.value) {
    settingsSection.value.setHasChanges(hasUnsavedChanges())
  }
})

// Save preferences
const savePreferences = async () => {
  // TODO: Implement saving preferences to user settings
  // For now, we'll just simulate saving
  await new Promise(resolve => setTimeout(resolve, 500))

  // Apply font size
  document.documentElement.dataset.fontSize = fontSize.value

  // Apply animations setting
  document.documentElement.dataset.animations = animations.value

  // Apply dense mode
  if (denseMode.value) {
    document.documentElement.classList.add('dense-mode')
  } else {
    document.documentElement.classList.remove('dense-mode')
  }

  // Apply high contrast
  if (highContrast.value) {
    document.documentElement.classList.add('high-contrast')
  } else {
    document.documentElement.classList.remove('high-contrast')
  }

  // Update initial state
  initialState.fontSize = fontSize.value
  initialState.animations = animations.value
  initialState.denseMode = denseMode.value
  initialState.highContrast = highContrast.value

  // Apply theme changes if any
  if (themeSelector.value) {
    themeSelector.value.applyChanges()
  }
}

// Reset to defaults
const resetToDefaults = () => {
  fontSize.value = 'md'
  animations.value = 'enabled'
  denseMode.value = false
  highContrast.value = false
}

// Discard changes
const discardChanges = () => {
  fontSize.value = initialState.fontSize
  animations.value = initialState.animations
  denseMode.value = initialState.denseMode
  highContrast.value = initialState.highContrast

  // Discard theme changes if any
  if (themeSelector.value) {
    themeSelector.value.discardChanges()
  }
}
</script>

<template>
  <SettingsSection
    ref="settingsSection"
    sectionName="Appearance"
    @save="savePreferences"
    @discard="discardChanges"
  >
    <!-- Grid layout for responsive design -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
      <!-- Left column -->
      <div>
        <!-- Theme Settings -->
        <SettingsCard
          title="Theme"
          description="Manage your theme preferences."
          class="h-full"
        >
          <ThemeSelector ref="themeSelector" />
        </SettingsCard>
      </div>

      <!-- Right column -->
      <div>
        <!-- UI Customization -->
        <SettingsCard
          title="UI Customization"
          description="Customize the appearance of the application."
          class="h-full"
        >
          <div class="space-y-6">
            <!-- Font Size and Animations in a grid on larger screens -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Font Size -->
              <div>
                <label for="font-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size
                </label>
                <Select v-model="fontSize">
                  <SelectTrigger id="font-size" class="w-full">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in fontSizeOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Animations -->
              <div>
                <label for="animations" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Animations
                </label>
                <Select v-model="animations">
                  <SelectTrigger id="animations" class="w-full">
                    <SelectValue placeholder="Select animation preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in animationOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Reducing animations can help with motion sensitivity and improve performance.
                </p>
              </div>
            </div>

            <!-- Toggle switches in a grid on larger screens -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Dense Mode -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Dense Mode</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Compact UI with reduced spacing for more content on screen.
                  </p>
                </div>
                <ToggleSwitch
                  v-model="denseMode"
                  id="dense-mode"
                />
              </div>

              <!-- High Contrast -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">High Contrast</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Increases contrast for better readability.
                  </p>
                </div>
                <ToggleSwitch
                  v-model="highContrast"
                  id="high-contrast"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                @click="resetToDefaults"
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  </SettingsSection>
</template>
