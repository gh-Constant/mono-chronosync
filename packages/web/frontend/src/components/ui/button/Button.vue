<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type ButtonVariants, buttonVariants } from '.'
import { computed, ref } from 'vue'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  loading?: boolean
  iconOnly?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  size: 'default',
  loading: false,
  iconOnly: false,
  disabled: false,
  type: 'button',
  compact: false
})

// Ripple effect
const buttonRef = ref<HTMLElement | null>(null)

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return

  const button = buttonRef.value
  if (!button) return

  // Create ripple element
  const ripple = document.createElement('span')
  const rect = button.getBoundingClientRect()

  const size = Math.max(rect.width, rect.height) * 2
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  // Position and style the ripple
  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.classList.add('ripple')

  // Remove existing ripples
  const existingRipples = button.querySelectorAll('.ripple')
  existingRipples.forEach(r => r.remove())

  // Add new ripple
  button.appendChild(ripple)

  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove()
  }, 600)

  // Emit click event
  emit('click', event)
}

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// Computed classes
const buttonClasses = computed(() => {
  return cn(
    buttonVariants({ variant: props.variant, size: props.size }),
    props.loading && 'relative cursor-wait',
    props.iconOnly && 'p-0 flex items-center justify-center',
    props.compact && 'px-2 py-1 h-auto min-h-[28px]',
    props.class
  )
})

// Determine spinner size based on button size
const spinnerSize = computed(() => {
  switch(props.size) {
    case 'xs': return 'h-3 w-3'
    case 'sm': return 'h-3.5 w-3.5'
    case 'lg': return 'h-5 w-5'
    case 'xl': return 'h-5 w-5'
    default: return 'h-4 w-4'
  }
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
    ref="buttonRef"
  >
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
      <svg :class="`animate-spin ${spinnerSize}`" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <span :class="{ 'opacity-0': loading, 'flex items-center justify-center': true }">
      <slot />
    </span>
  </Primitive>
</template>

<style scoped>
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
  background-color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

:deep(.dark) .ripple {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
