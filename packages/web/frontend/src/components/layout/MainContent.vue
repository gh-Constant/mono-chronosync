<script setup lang="ts">
import { computed } from 'vue'
import { useSidebar, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from '@/components/ui/sidebar'

const sidebar = useSidebar()
const isExpanded = computed(() => sidebar.state.value === 'expanded')
const isMobile = computed(() => sidebar.isMobile.value)

// Compute left padding based on sidebar state
const contentPadding = computed(() => {
  if (isMobile.value) return '0'
  return isExpanded.value ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)'
})
</script>

<template>
  <main
    :style="{
      '--sidebar-width': SIDEBAR_WIDTH,
      '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
      paddingLeft: contentPadding
    }"
    class="transition-all duration-300"
  >
    <div class="container mx-auto px-6 py-8">
      <slot />
    </div>
  </main>
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