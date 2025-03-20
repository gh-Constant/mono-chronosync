<template>
  <div class="min-h-screen">
    <!-- Navbar with proper z-index -->
    <div class="relative z-50">
      <Navbar />
    </div>

    <!-- Main content with background -->
    <div class="relative">
      <!-- Background gradients with lower z-index -->
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-600 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>

      <!-- Hero content with proper z-index -->
      <div class="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Master Your Digital Time
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Across All Devices
            </span>
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Transform your productivity with AI-powered time tracking, smart task management, and distraction blocking across all your devices.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <router-link
              to="/auth?tab=signup"
              class="rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up for free
            </router-link>
            <router-link
              to="/auth?tab=login"
              class="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
            >
              Log in <span aria-hidden="true">→</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Bottom gradient with lower z-index -->
      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-600 to-indigo-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-geist: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.font-sans {
  font-family: var(--font-geist);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-geist);
}
</style>

