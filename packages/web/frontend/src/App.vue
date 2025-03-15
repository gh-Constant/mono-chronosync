<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
import { useAuthStore } from './stores/auth'
import { authService } from './services/authService'

// Initialize auth service
onMounted(() => {
  authService.initializeAuth()
})
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: var(--color-text);
}

nav a.router-link-exact-active {
  font-weight: bold;
}
</style>
