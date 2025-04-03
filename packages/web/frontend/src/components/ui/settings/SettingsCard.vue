<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  title: string
  description?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 md:p-7 lg:p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/30 dark:hover:shadow-purple-900/20 group', props.class)">
    <div class="mb-4 md:mb-6">
      <h2 class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-400">{{ description }}</p>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
