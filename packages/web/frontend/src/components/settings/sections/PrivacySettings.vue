<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { SettingsCard, SettingsSection, ToggleSwitch } from '@/components/ui/settings'
import { Button } from '@/components/ui/button'
import { Download, FileText, Shield, Lock } from 'lucide-vue-next'
import { cookieService } from '@/services/cookieService'

// References to child components
const settingsSection = ref<{
  setHasChanges: (value: boolean) => void
} | null>(null)

// Initial cookie consent state with reversed logic for analytics and marketing
const initialCookieConsent = {
  necessary: true,
  // Reversed logic - true means disabled, false means enabled
  analytics: true,  // Disabled by default
  marketing: true,  // Disabled by default
  preferences: false
}

// Cookie consent state
const cookieConsent = ref({
  ...initialCookieConsent,
  ...cookieService.getConsent()
})

// Computed properties for reversed logic
const analyticsDisabled = computed({
  get: () => cookieConsent.value.analytics,
  set: (value) => { cookieConsent.value.analytics = value }
})

const marketingDisabled = computed({
  get: () => cookieConsent.value.marketing,
  set: (value) => { cookieConsent.value.marketing = value }
})

// Track changes
const hasUnsavedChanges = () => {
  return cookieConsent.value.analytics !== initialCookieConsent.analytics ||
    cookieConsent.value.marketing !== initialCookieConsent.marketing ||
    cookieConsent.value.preferences !== initialCookieConsent.preferences
}

// Watch for changes
watch([() => cookieConsent.value.analytics, () => cookieConsent.value.marketing, () => cookieConsent.value.preferences], () => {
  if (settingsSection.value) {
    settingsSection.value.setHasChanges(hasUnsavedChanges())
  }
})

// Save cookie preferences
const saveCookiePreferences = () => {
  cookieService.saveConsent(cookieConsent.value)
  cookieService.clearNonEssentialCookies()

  // Update initial state
  initialCookieConsent.analytics = cookieConsent.value.analytics
  initialCookieConsent.marketing = cookieConsent.value.marketing
  initialCookieConsent.preferences = cookieConsent.value.preferences

  // Reset hasChanges
  if (settingsSection.value) {
    settingsSection.value.setHasChanges(false)
  }
}

// Discard changes
const discardChanges = () => {
  cookieConsent.value.analytics = initialCookieConsent.analytics
  cookieConsent.value.marketing = initialCookieConsent.marketing
  cookieConsent.value.preferences = initialCookieConsent.preferences
}

// Request data export
const requestDataExport = async () => {
  // TODO: Implement actual API call to request data export
  // For now, we'll just simulate a successful request
  await new Promise(resolve => setTimeout(resolve, 1000))
  alert('Your data export request has been submitted. You will receive an email with your data shortly.')
}

// Session management
const activeSessions = ref([
  {
    id: '1',
    device: 'Chrome on Windows',
    location: 'Paris, France',
    ip: '192.168.1.1',
    lastActive: '2023-06-15T10:30:00Z',
    current: true
  },
  {
    id: '2',
    device: 'Safari on iPhone',
    location: 'Lyon, France',
    ip: '192.168.1.2',
    lastActive: '2023-06-14T18:45:00Z',
    current: false
  }
])

// Revoke session
const revokeSession = async (sessionId: string) => {
  // TODO: Implement actual API call to revoke session
  // For now, we'll just simulate a successful revocation
  await new Promise(resolve => setTimeout(resolve, 500))
  activeSessions.value = activeSessions.value.filter(session => session.id !== sessionId)
}

// Revoke all other sessions
const revokeAllOtherSessions = async () => {
  // TODO: Implement actual API call to revoke all other sessions
  // For now, we'll just simulate a successful revocation
  await new Promise(resolve => setTimeout(resolve, 1000))
  activeSessions.value = activeSessions.value.filter(session => session.current)
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}
</script>

<template>
  <SettingsSection
    ref="settingsSection"
    sectionName="Privacy & Security"
    @save="saveCookiePreferences"
    @discard="discardChanges"
  >
    <!-- Grid layout for responsive design -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
      <!-- Left column -->
      <div class="space-y-6">
        <!-- Cookie Preferences -->
        <SettingsCard
          title="Cookie Preferences"
          description="Manage how we use cookies on this site."
        >
          <div class="space-y-4">
            <!-- Necessary Cookies -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Necessary Cookies</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  These cookies are essential for the website to function properly and cannot be disabled.
                </p>
              </div>
              <ToggleSwitch
                v-model="cookieConsent.necessary"
                id="necessary-cookies"
                disabled
              />
            </div>

            <!-- Analytics Cookies -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Analytics Cookies</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  These cookies help us understand how visitors interact with our website.
                  <span class="font-medium text-amber-600 dark:text-amber-400">Check to disable analytics tracking.</span>
                </p>
              </div>
              <ToggleSwitch
                v-model="analyticsDisabled"
                id="analytics-cookies"
              />
            </div>

            <!-- Marketing Cookies -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Marketing Cookies</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  These cookies are used to track visitors across websites for advertising purposes.
                  <span class="font-medium text-amber-600 dark:text-amber-400">Check to disable personalized ads.</span>
                </p>
              </div>
              <ToggleSwitch
                v-model="marketingDisabled"
                id="marketing-cookies"
              />
            </div>

            <!-- Preferences Cookies -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Preferences Cookies</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  These cookies allow the website to remember choices you make and provide enhanced functionality.
                </p>
              </div>
              <ToggleSwitch
                v-model="cookieConsent.preferences"
                id="preferences-cookies"
              />
            </div>
          </div>
        </SettingsCard>

        <!-- Data Management -->
        <SettingsCard
          title="Data Management"
          description="Manage your personal data."
        >
          <div class="space-y-6">
            <!-- Data Export -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Download class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">Export Your Data</h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Download a copy of your personal data in a machine-readable format.
                  This includes your profile information, preferences, and activity history.
                </p>
                <Button
                  size="sm"
                  class="mt-2"
                  @click="requestDataExport"
                >
                  Request Data Export
                </Button>
              </div>
            </div>

            <!-- Privacy Policy -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <FileText class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-3">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">Privacy Policy</h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Review our privacy policy to understand how we collect, use, and protect your data.
                </p>
                <Button
                  size="sm"
                  class="mt-2"
                  @click="$router.push('/privacy-policy')"
                >
                  View Privacy Policy
                </Button>
              </div>
            </div>
          </div>
        </SettingsCard>
      </div>

      <!-- Right column -->
      <div>
        <!-- Security Settings -->
        <SettingsCard
          title="Security"
          description="Manage your account security settings."
          class="h-full"
        >
          <div class="space-y-6">
            <!-- Two-Factor Authentication -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Shield class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-3">
                <div class="flex items-center">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <span class="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Add an extra layer of security to your account by requiring a verification code in addition to your password.
                </p>
                <Button
                  size="sm"
                  class="mt-2"
                  disabled
                >
                  Set Up Two-Factor Authentication
                </Button>
              </div>
            </div>

            <!-- Active Sessions -->
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Lock class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-3 w-full">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">Active Sessions</h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Manage devices and locations where you're currently logged in.
                </p>

                <!-- Sessions list -->
                <div class="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                  <div class="divide-y divide-gray-200 dark:divide-gray-700">
                    <div
                      v-for="session in activeSessions"
                      :key="session.id"
                      class="p-3 bg-white dark:bg-gray-800"
                    >
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="flex items-center">
                            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ session.device }}</span>
                            <span v-if="session.current" class="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                              Current
                            </span>
                          </div>
                          <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <div>Location: {{ session.location }}</div>
                            <div>IP Address: {{ session.ip }}</div>
                            <div>Last active: {{ formatDate(session.lastActive) }}</div>
                          </div>
                        </div>
                        <Button
                          v-if="!session.current"
                          size="sm"
                          class="text-white bg-red-500 hover:bg-red-600 dark:text-white dark:bg-red-500 dark:hover:bg-red-600"
                          @click="revokeSession(session.id)"
                        >
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Revoke all button -->
                <Button
                  v-if="activeSessions.filter(s => !s.current).length > 0"
                  size="sm"
                  class="mt-3"
                  @click="revokeAllOtherSessions"
                >
                  Revoke All Other Sessions
                </Button>
              </div>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  </SettingsSection>
</template>
