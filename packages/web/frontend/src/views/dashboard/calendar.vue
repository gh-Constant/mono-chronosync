<script setup lang="ts">
import DashboardLayout from '@/components/layout/dashboard/DashboardLayout.vue'
</script>

<template>
  <DashboardLayout>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Manage your schedule and events</p>
    </div>

    <!-- Calendar Content -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Calendar</h2>
      <p class="text-gray-600 dark:text-gray-400">Calendar implementation goes here</p>
    </div>
  </DashboardLayout>
</template> 