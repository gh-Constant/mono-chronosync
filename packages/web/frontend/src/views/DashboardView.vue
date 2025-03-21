<script setup lang="ts">
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
</script>

<template>
  <DashboardLayout>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Welcome back to your productivity hub</p>
    </div>

    <!-- Dashboard Content -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Stats Cards -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Focus</h3>
        <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">4h 32m</div>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Productive time</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks Completed</h3>
        <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">12/15</div>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Daily goals</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Focus Score</h3>
        <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">85%</div>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Weekly average</p>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div class="space-y-4">
            <!-- Activity Items -->
            <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span class="text-purple-600 dark:text-purple-400">📊</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Completed Project Analysis</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">45 minutes</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span class="text-purple-600 dark:text-purple-400">📝</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Team Meeting Notes</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">4 hours ago</p>
                </div>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">30 minutes</span>
            </div>

            <div class="flex items-center justify-between py-3">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span class="text-purple-600 dark:text-purple-400">💡</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Brainstorming Session</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">6 hours ago</p>
                </div>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">1 hour</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
/* Custom scrollbar for the main content */
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

/* For Firefox */
main {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}
</style> 