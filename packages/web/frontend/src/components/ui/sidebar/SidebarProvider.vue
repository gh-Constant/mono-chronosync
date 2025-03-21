<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useEventListener, useMediaQuery, useVModel } from '@vueuse/core'
import { TooltipProvider } from 'reka-ui'
import { computed, type HTMLAttributes, type Ref, ref, watch } from 'vue'
import { 
  provideSidebarContext, 
  SIDEBAR_KEYBOARD_SHORTCUT, 
  SIDEBAR_WIDTH, 
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_COOKIE_MAX_AGE 
} from './utils'

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

// Read cookie value (for desktop only)
function getCookieValue(): boolean | null {
  if (typeof document === 'undefined') return null
  
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
    ?.split('=')[1]
    
  if (cookieValue === 'expanded') return true
  if (cookieValue === 'collapsed') return false
  return null
}

// Set cookie value (for desktop only)
function setCookieValue(value: boolean): void {
  if (typeof document === 'undefined' || isMobile.value) return
  
  const state = value ? 'expanded' : 'collapsed'
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${state}; max-age=${SIDEBAR_COOKIE_MAX_AGE}; path=/; samesite=strict`
}

// Determine initial value (from cookie for desktop, props for mobile)
const initialValue = (): boolean => {
  if (!isMobile.value) {
    const cookieValue = getCookieValue()
    if (cookieValue !== null) return cookieValue
  }
  return props.defaultOpen
}

const defaultValue = initialValue()

const open = useVModel(props, 'open', emits, {
  defaultValue,
  passive: (props.open === undefined) as false,
}) as Ref<boolean>

function setOpen(value: boolean) {
  open.value = value
}

function toggleSidebar() {
  setOpen(!open.value)
}

// Update cookie when sidebar state changes (desktop only)
watch(open, (newValue) => {
  if (!isMobile.value) {
    setCookieValue(newValue)
  }
}, { immediate: true })

useEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    toggleSidebar()
  }
})

// State computed property for styling
const state = computed(() => open.value ? 'expanded' : 'collapsed')

// Mobile sidebar state (for API compatibility)
const openMobile = ref(false)
function setOpenMobile(value: boolean) {
  // Kept for API compatibility
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
