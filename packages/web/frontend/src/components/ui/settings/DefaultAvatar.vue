<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  initials: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  bgColor?: string
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-10 h-10 text-sm'
    case 'lg': return 'w-24 h-24 text-2xl'
    case 'xl': return 'w-32 h-32 text-3xl'
    default: return 'w-20 h-20 text-xl'
  }
})

const bgColorClass = computed(() => {
  return props.bgColor || 'bg-gradient-to-br from-purple-500 to-indigo-600'
})
</script>

<template>
  <div :class="[sizeClass, bgColorClass, 'rounded-full flex items-center justify-center font-bold text-white overflow-hidden']">
    <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full">
      <defs>
        <pattern id="avatar-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="35" r="25" fill="rgba(255,255,255,0.1)" />
          <circle cx="50" cy="100" r="40" fill="rgba(255,255,255,0.1)" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#avatar-pattern)" />
    </svg>
    <span class="relative z-10">{{ initials }}</span>
  </div>
</template>
