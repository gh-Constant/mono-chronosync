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
    :class="cn('h-7 w-7', props.class)"
    @click="toggleSidebar"
  >
    <ChevronRight 
      :class="[
        'transition-transform duration-300',
        { 'transform rotate-180': iconRotation === 180 }
      ]"
    />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
  