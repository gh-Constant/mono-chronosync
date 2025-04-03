<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <h3
    :class="
      cn('font-semibold leading-none tracking-tight transition-colors duration-300 group-hover:text-purple-700 dark:group-hover:text-purple-400', props.class)
    "
  >
    <slot />
  </h3>
</template>
