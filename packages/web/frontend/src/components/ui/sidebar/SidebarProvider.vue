<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useEventListener, useMediaQuery, useVModel } from '@vueuse/core'
import { TooltipProvider } from 'reka-ui'
import { computed, type HTMLAttributes, type Ref, ref } from 'vue'
import { provideSidebarContext, SIDEBAR_KEYBOARD_SHORTCUT, SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON } from './utils'

const props = withDefaults(defineProps<{
  defaultOpen?: boolean
  open?: boolean
  class?: HTMLAttributes['class']
}>(), {
  defaultOpen: false,
  open: undefined,
})

const emits = defineEmits<{
  'update:open': [open: boolean]
}>()

// Detect mobile devices for responsive behavior
const isMobile = useMediaQuery('(max-width: 767px)')

// Remove cookie functions and always use defaultOpen
const defaultValue = props.defaultOpen ?? false

const open = useVModel(props, 'open', emits, {
  defaultValue,
  passive: (props.open === undefined) as false,
}) as Ref<boolean>

function setOpen(value: boolean) {
  open.value = value // emits('update:open', value)
  // Remove cookie setting
}

// Simple toggle function
function toggleSidebar() {
  setOpen(!open.value)
}

useEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    toggleSidebar()
  }
})

// This makes it easier to style the sidebar with Tailwind classes
const state = computed(() => open.value ? 'expanded' : 'collapsed')

// Mobile sidebar state (for compatibility)
const openMobile = ref(false)
function setOpenMobile(value: boolean) {
  // No longer actively used, but kept for API compatibility
}

provideSidebarContext({
  state,
  open,
  setOpen,
  isMobile,
  openMobile,
  setOpenMobile,
  toggleSidebar,
})
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <div
      :style="{
        '--sidebar-width': SIDEBAR_WIDTH,
        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
      }"
      :class="cn('group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar', props.class)"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </TooltipProvider>
</template>
