<script setup lang="ts">
import DashboardLayout from '@/components/layout/dashboard/DashboardLayout.vue'
import SettingsLayout from '@/components/settings/SettingsLayout.vue'
import AccountSettings from '@/components/settings/sections/AccountSettings.vue'
import AppearanceSettings from '@/components/settings/sections/AppearanceSettings.vue'
import PrivacySettings from '@/components/settings/sections/PrivacySettings.vue'
import NotificationSettings from '@/components/settings/sections/NotificationSettings.vue'
import AppSettings from '@/components/settings/sections/AppSettings.vue'
</script>

<template>
  <DashboardLayout>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
    </div>

    <!-- Settings Content -->
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
  </DashboardLayout>
</template>
