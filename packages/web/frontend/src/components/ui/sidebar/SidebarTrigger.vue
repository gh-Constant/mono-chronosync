<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar, state } = useSidebar()

// Compute the icon rotation based on the sidebar state
const iconRotation = computed(() => {
  return state.value === 'expanded' ? 180 : 0
})
</script>

<template>
  <Button
    data-sidebar="trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-10 w-10 min-w-10 min-h-10 bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md hover:shadow-purple-300/30 dark:hover:shadow-purple-900/30 hover:scale-110 hover:rotate-[360deg] transition-all duration-500', props.class)"
    @click="toggleSidebar"
  >
    <ChevronRight
      :class="[
        'transition-transform duration-500',
        { 'transform rotate-180': iconRotation === 180 },
        'animate-pulse'
      ]"
    />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>

<style scoped>
.min-w-10 {
  min-width: 2.5rem;
}

.min-h-10 {
  min-height: 2.5rem;
}
</style>
