<script setup lang="ts">
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/ui/sidebar/AppSidebar.vue'
import MainContent from './MainContent.vue'
</script>

<template>
  <SidebarProvider>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar />
      <MainContent>
        <slot />
      </MainContent>
    </div>
  </SidebarProvider>
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