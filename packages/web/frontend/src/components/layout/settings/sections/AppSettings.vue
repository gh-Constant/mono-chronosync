<script setup lang="ts">
import { ref, watch } from 'vue'
import { SettingsCard, SettingsSection, ToggleSwitch } from '@/components/ui/settings'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

// References to child components
const settingsSection = ref<{
  setHasChanges: (value: boolean) => void
} | null>(null)

// Language options
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' }
]

// Timezone options (simplified list)
const timezoneOptions = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (UTC+01:00)' },
  { value: 'Europe/London', label: 'Europe/London (UTC+00:00)' },
  { value: 'America/New_York', label: 'America/New_York (UTC-05:00)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (UTC-08:00)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+09:00)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+10:00)' }
]

// Date format options
const dateFormatOptions = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (Europe)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' }
]

// Time format options
const timeFormatOptions = [
  { value: '12h', label: '12-hour (AM/PM)' },
  { value: '24h', label: '24-hour' }
]

// Default view options
const defaultViewOptions = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'tasks', label: 'Tasks' }
]

// Week start options
const weekStartOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
]

// Initial form state
const initialState = {
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  defaultView: 'dashboard',
  weekStartsOn: 'monday'
}

// Form state
const language = ref(initialState.language)
const timezone = ref(initialState.timezone)
const dateFormat = ref(initialState.dateFormat)
const timeFormat = ref(initialState.timeFormat)
const defaultView = ref(initialState.defaultView)
const weekStartsOn = ref(initialState.weekStartsOn)

// Track changes
const hasUnsavedChanges = () => {
  return language.value !== initialState.language ||
    timezone.value !== initialState.timezone ||
    dateFormat.value !== initialState.dateFormat ||
    timeFormat.value !== initialState.timeFormat ||
    defaultView.value !== initialState.defaultView ||
    weekStartsOn.value !== initialState.weekStartsOn
}

// Watch for changes
watch(
  [
    () => language.value,
    () => timezone.value,
    () => dateFormat.value,
    () => timeFormat.value,
    () => defaultView.value,
    () => weekStartsOn.value
  ],
  () => {
    if (settingsSection.value) {
      settingsSection.value.setHasChanges(hasUnsavedChanges())
    }
  }
)

// Save preferences
const savePreferences = async () => {
  // TODO: Implement saving preferences to user settings
  // For now, we'll just simulate saving
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Update initial state
  initialState.language = language.value
  initialState.timezone = timezone.value
  initialState.dateFormat = dateFormat.value
  initialState.timeFormat = timeFormat.value
  initialState.defaultView = defaultView.value
  initialState.weekStartsOn = weekStartsOn.value

  // Reset hasChanges
  if (settingsSection.value) {
    settingsSection.value.setHasChanges(false)
  }
}

// Discard changes
const discardChanges = () => {
  language.value = initialState.language
  timezone.value = initialState.timezone
  dateFormat.value = initialState.dateFormat
  timeFormat.value = initialState.timeFormat
  defaultView.value = initialState.defaultView
  weekStartsOn.value = initialState.weekStartsOn
}
</script>

<template>
  <SettingsSection
    ref="settingsSection"
    sectionName="Application"
    @save="savePreferences"
    @discard="discardChanges"
  >
    <!-- Grid layout for responsive design -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
      <!-- Left column -->
      <div class="space-y-6">
        <!-- Language & Region -->
        <SettingsCard
          title="Language & Region"
          description="Manage your language and regional preferences."
        >
          <div class="space-y-6">
            <!-- Language and Timezone in a grid on larger screens -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Language -->
              <div>
                <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <Select v-model="language">
                  <SelectTrigger id="language" class="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in languageOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Timezone -->
              <div>
                <label for="timezone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <Select v-model="timezone">
                  <SelectTrigger id="timezone" class="w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in timezoneOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SettingsCard>

        <!-- Application Preferences -->
        <SettingsCard
          title="Application Preferences"
          description="Customize your application experience."
        >
          <div class="space-y-6">
            <!-- Default View -->
            <div>
              <label for="default-view" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default View
              </label>
              <Select v-model="defaultView">
                <SelectTrigger id="default-view" class="w-full">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in defaultViewOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This is the view that will be shown when you first log in.
              </p>
            </div>
          </div>
        </SettingsCard>
      </div>

      <!-- Right column -->
      <div>
        <!-- Date & Time Format -->
        <SettingsCard
          title="Date & Time Format"
          description="Customize how dates and times are displayed."
          class="h-full"
        >
          <div class="space-y-6">
            <!-- Date and Time Format in a grid on larger screens -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Date Format -->
              <div>
                <label for="date-format" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <Select v-model="dateFormat">
                  <SelectTrigger id="date-format" class="w-full">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in dateFormatOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Time Format -->
              <div>
                <label for="time-format" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Format
                </label>
                <Select v-model="timeFormat">
                  <SelectTrigger id="time-format" class="w-full">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in timeFormatOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <!-- Week Starts On -->
            <div>
              <label for="week-start" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Week Starts On
              </label>
              <Select v-model="weekStartsOn">
                <SelectTrigger id="week-start" class="w-full">
                  <SelectValue placeholder="Select first day of week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in weekStartOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Choose which day your week should start with for calendars and schedules.
              </p>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  </SettingsSection>
</template>
