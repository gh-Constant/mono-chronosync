<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from './Navbar.vue'

const authStore = useAuthStore()
const route = useRoute()
const isLoading = ref(true)

// Check authentication status when component mounts
onMounted(async () => {
  try {
    await authStore.checkAuth()
  } finally {
    isLoading.value = false
  }
})

// Watch for route changes to update authentication status
watch(() => route.path, async () => {
  if (route.meta.requiresAuth) {
    await authStore.checkAuth()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.bg-background {
  background-color: hsl(var(--background));
}
</style> 