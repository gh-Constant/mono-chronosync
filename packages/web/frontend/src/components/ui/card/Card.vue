<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'rounded-xl border bg-card text-card-foreground shadow transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/30 dark:hover:shadow-purple-900/20 group',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
