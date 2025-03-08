<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>

  <RouterView />
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
