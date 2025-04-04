<script setup lang="ts">
import SettingsLayout from '@/components/layout/settings/SettingsLayout.vue'
import AccountSettings from '@/components/layout/settings/sections/AccountSettings.vue'
import AppearanceSettings from '@/components/layout/settings/sections/AppearanceSettings.vue'
import AppSettings from '@/components/layout/settings/sections/AppSettings.vue'
import NotificationSettings from '@/components/layout/settings/sections/NotificationSettings.vue'
import PrivacySettings from '@/components/layout/settings/sections/PrivacySettings.vue'
import DashboardLayout from '@/components/layout/dashboard/DashboardLayout.vue'
</script>

<template>
  <DashboardLayout>
    <div class="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>
      <SettingsLayout>
        <template #account>
          <AccountSettings />
        </template>
        <template #appearance>
          <AppearanceSettings />
        </template>
        <template #privacy>
          <PrivacySettings />
        </template>
        <template #notifications>
          <NotificationSettings />
        </template>
        <template #app>
          <AppSettings />
        </template>
      </SettingsLayout>
    </div>
  </DashboardLayout>
</template>

<style scoped>
/* Add any specific styles for this view if needed */
</style> 