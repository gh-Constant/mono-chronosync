<script setup lang="ts">
import DashboardLayout from '@/components/layout/dashboard/DashboardLayout.vue'
import { Clock, CheckSquare, BarChart3, Activity } from 'lucide-vue-next'
import AppUsageSection from '@/components/dashboard/AppUsageSection.vue'
</script>

<template>
  <DashboardLayout>
    <div class="p-4 md:p-6 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-10 pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">Welcome back to your productivity hub</p>
      </div>

      <!-- Stats Overview -->
      <section class="mb-10">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">Overview</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <!-- Today's Focus Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center mb-3">
              <div class="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-3">
                <Clock class="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Today's Focus</h3>
            </div>
            <div class="mt-2">
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">4h 32m</div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">productive time</p>
            </div>
          </div>

          <!-- Tasks Completed Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center mb-3">
              <div class="p-2.5 rounded-lg bg-green-100 dark:bg-green-900/30 mr-3">
                <CheckSquare class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Tasks Completed</h3>
            </div>
            <div class="mt-2">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">12/15</div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">daily goals</p>
            </div>
          </div>

          <!-- Focus Score Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center mb-3">
              <div class="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
                <BarChart3 class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Focus Score</h3>
            </div>
            <div class="mt-2">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">85%</div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">weekly average</p>
            </div>
          </div>
        </div>
      </section>

      <!-- App Usage Section -->
      <AppUsageSection />

      <!-- Recent Activity Section -->
      <section class="mt-10">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <Activity class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Activity Items -->
            <div class="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <span class="text-purple-600 dark:text-purple-400">📊</span>
                </div>
                <div>
                  <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Completed Project Analysis</p>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">45 minutes</span>
            </div>

            <div class="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span class="text-blue-600 dark:text-blue-400">📝</span>
                </div>
                <div>
                  <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Team Meeting Notes</p>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">4 hours ago</p>
                </div>
              </div>
              <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">30 minutes</span>
            </div>

            <div class="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span class="text-green-600 dark:text-green-400">💡</span>
                </div>
                <div>
                  <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white">Brainstorming Session</p>
                  <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">6 hours ago</p>
                </div>
              </div>
              <span class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">1 hour</span>
            </div>
          </div>
        </div>
      </section>
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