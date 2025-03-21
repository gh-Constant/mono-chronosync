<script setup lang="ts">
import { computed } from 'vue'
import { useSidebar } from '@/components/ui/sidebar'

const sidebar = useSidebar()
const isExpanded = computed(() => sidebar.state.value === 'expanded')
</script>

<template>
  <main :class="[
    'min-h-screen transition-[padding] duration-300',
    isExpanded ? 'pl-[240px]' : 'pl-[64px]'
  ]">
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div class="mx-auto max-w-6xl">
        <slot />
      </div>
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