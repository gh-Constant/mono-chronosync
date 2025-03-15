<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './Navbar.vue'
import { useAuthStore } from '@/stores/auth'

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
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
    
    <!-- Only show navbar if user is authenticated -->
    <Navbar v-if="authStore.isAuthenticated" />
    
    <!-- Main content -->
    <main :class="{ 'pt-16': authStore.isAuthenticated }">
      <slot></slot>
    </main>
  </div>
</template> 