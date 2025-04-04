<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { SettingsCard, SettingsSection, ToggleSwitch } from '@/components/ui/settings'
import { Button } from '@/components/ui/button'

// References to child components
const settingsSection = ref<{
  setHasChanges: (value: boolean) => void
} | null>(null)

// Initial notification preferences
const initialEmailNotifications = {
  accountUpdates: true,
  securityAlerts: true,
  productUpdates: true, // Reversed - true means disabled
  newsletter: true,     // Reversed - true means disabled
  tips: true            // Reversed - true means disabled
}

const initialAppNotifications = {
  newFeatures: true,
  reminders: true,
  mentions: true,
  comments: false,      // Reversed - false means enabled
  updates: false        // Reversed - false means enabled
}

// Notification preferences
const emailNotifications = ref({
  ...initialEmailNotifications
})

const appNotifications = ref({
  ...initialAppNotifications
})

// Computed properties for reversed logic
const productUpdatesDisabled = computed({
  get: () => emailNotifications.value.productUpdates,
  set: (value: boolean) => { emailNotifications.value.productUpdates = value }
})

const newsletterDisabled = computed({
  get: () => emailNotifications.value.newsletter,
  set: (value: boolean) => { emailNotifications.value.newsletter = value }
})

const tipsDisabled = computed({
  get: () => emailNotifications.value.tips,
  set: (value: boolean) => { emailNotifications.value.tips = value }
})

const commentsEnabled = computed({
  get: () => !appNotifications.value.comments,
  set: (value: boolean) => { appNotifications.value.comments = !value }
})

const updatesEnabled = computed({
  get: () => !appNotifications.value.updates,
  set: (value: boolean) => { appNotifications.value.updates = !value }
})

// Track changes
const hasUnsavedChanges = () => {
  return emailNotifications.value.accountUpdates !== initialEmailNotifications.accountUpdates ||
    emailNotifications.value.securityAlerts !== initialEmailNotifications.securityAlerts ||
    emailNotifications.value.productUpdates !== initialEmailNotifications.productUpdates ||
    emailNotifications.value.newsletter !== initialEmailNotifications.newsletter ||
    emailNotifications.value.tips !== initialEmailNotifications.tips ||
    appNotifications.value.newFeatures !== initialAppNotifications.newFeatures ||
    appNotifications.value.reminders !== initialAppNotifications.reminders ||
    appNotifications.value.mentions !== initialAppNotifications.mentions ||
    appNotifications.value.comments !== initialAppNotifications.comments ||
    appNotifications.value.updates !== initialAppNotifications.updates
}

// Watch for changes
watch(
  [
    () => emailNotifications.value.accountUpdates,
    () => emailNotifications.value.securityAlerts,
    () => emailNotifications.value.productUpdates,
    () => emailNotifications.value.newsletter,
    () => emailNotifications.value.tips,
    () => appNotifications.value.newFeatures,
    () => appNotifications.value.reminders,
    () => appNotifications.value.mentions,
    () => appNotifications.value.comments,
    () => appNotifications.value.updates
  ],
  () => {
    if (settingsSection.value) {
      settingsSection.value.setHasChanges(hasUnsavedChanges())
    }
  }
)

// Save notification preferences
const saveNotificationPreferences = async () => {
  // TODO: Implement actual API call to save notification preferences
  // For now, we'll just simulate a successful save
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Update initial state
  initialEmailNotifications.accountUpdates = emailNotifications.value.accountUpdates
  initialEmailNotifications.securityAlerts = emailNotifications.value.securityAlerts
  initialEmailNotifications.productUpdates = emailNotifications.value.productUpdates
  initialEmailNotifications.newsletter = emailNotifications.value.newsletter
  initialEmailNotifications.tips = emailNotifications.value.tips

  initialAppNotifications.newFeatures = appNotifications.value.newFeatures
  initialAppNotifications.reminders = appNotifications.value.reminders
  initialAppNotifications.mentions = appNotifications.value.mentions
  initialAppNotifications.comments = appNotifications.value.comments
  initialAppNotifications.updates = appNotifications.value.updates

  // Reset hasChanges
  if (settingsSection.value) {
    settingsSection.value.setHasChanges(false)
  }
}

// Discard changes
const discardChanges = () => {
  emailNotifications.value.accountUpdates = initialEmailNotifications.accountUpdates
  emailNotifications.value.securityAlerts = initialEmailNotifications.securityAlerts
  emailNotifications.value.productUpdates = initialEmailNotifications.productUpdates
  emailNotifications.value.newsletter = initialEmailNotifications.newsletter
  emailNotifications.value.tips = initialEmailNotifications.tips

  appNotifications.value.newFeatures = initialAppNotifications.newFeatures
  appNotifications.value.reminders = initialAppNotifications.reminders
  appNotifications.value.mentions = initialAppNotifications.mentions
  appNotifications.value.comments = initialAppNotifications.comments
  appNotifications.value.updates = initialAppNotifications.updates
}
</script>

<template>
  <SettingsSection
    ref="settingsSection"
    sectionName="Notifications"
    @save="saveNotificationPreferences"
    @discard="discardChanges"
  >
    <!-- Grid layout for responsive design -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
      <!-- Left column -->
      <div>
        <!-- Email Notifications -->
        <SettingsCard
          title="Email Notifications"
          description="Manage the emails you receive from us."
          class="h-full"
        >
          <div class="space-y-4">
            <!-- Account Updates -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Account Updates</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Receive emails about your account activity and security.
                </p>
              </div>
              <ToggleSwitch
                v-model="emailNotifications.accountUpdates"
                id="account-updates"
              />
            </div>

            <!-- Security Alerts -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Security Alerts</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Receive emails about suspicious activity and security events.
                </p>
              </div>
              <ToggleSwitch
                v-model="emailNotifications.securityAlerts"
                id="security-alerts"
              />
            </div>

            <!-- Product Updates -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Product Updates</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Emails about new features and improvements.
                  <span class="font-medium text-amber-600 dark:text-amber-400">Check to disable these notifications.</span>
                </p>
              </div>
              <ToggleSwitch
                v-model="productUpdatesDisabled"
                id="product-updates"
              />
            </div>

            <!-- Newsletter -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Newsletter</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Our monthly newsletter with tips, updates, and company news.
                  <span class="font-medium text-amber-600 dark:text-amber-400">Check to disable newsletter emails.</span>
                </p>
              </div>
              <ToggleSwitch
                v-model="newsletterDisabled"
                id="newsletter"
              />
            </div>

            <!-- Tips & Tutorials -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Tips & Tutorials</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Emails with tips, tutorials, and best practices.
                  <span class="font-medium text-amber-600 dark:text-amber-400">Check to disable these emails.</span>
                </p>
              </div>
              <ToggleSwitch
                v-model="tipsDisabled"
                id="tips"
              />
            </div>
          </div>
        </SettingsCard>
      </div>

      <!-- Right column -->
      <div>
        <!-- In-App Notifications -->
        <SettingsCard
          title="In-App Notifications"
          description="Manage the notifications you see within the application."
          class="h-full"
        >
          <div class="space-y-4">
            <!-- New Features -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">New Features</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Get notified when new features are available.
                </p>
              </div>
              <ToggleSwitch
                v-model="appNotifications.newFeatures"
                id="new-features"
              />
            </div>

            <!-- Reminders -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Reminders</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Get reminders about upcoming events and tasks.
                </p>
              </div>
              <ToggleSwitch
                v-model="appNotifications.reminders"
                id="reminders"
              />
            </div>

            <!-- Mentions -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Mentions</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Get notified when someone mentions you.
                </p>
              </div>
              <ToggleSwitch
                v-model="appNotifications.mentions"
                id="mentions"
              />
            </div>

            <!-- Comments -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Comments</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Get notified when someone comments on your items.
                  <span class="font-medium text-green-600 dark:text-green-400">Enabled by default for better collaboration.</span>
                </p>
              </div>
              <ToggleSwitch
                v-model="commentsEnabled"
                id="comments"
              />
            </div>

            <!-- Updates -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Updates</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Get notified about updates to items you're following.
                  <span class="font-medium text-green-600 dark:text-green-400">Enabled by default to keep you informed.</span>
                </p>
              </div>
              <ToggleSwitch
                v-model="updatesEnabled"
                id="updates"
              />
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  </SettingsSection>
</template>
