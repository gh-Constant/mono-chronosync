<script setup lang="ts">
import type { SidebarProps } from '.'
import { cn } from '@/lib/utils'
import { SIDEBAR_WIDTH_MOBILE, SIDEBAR_WIDTH_ICON, useSidebar } from './utils'
import SidebarTrigger from './SidebarTrigger.vue'
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SidebarProps>(), {
  side: 'left',
  variant: 'sidebar',
  collapsible: 'offcanvas',
})

const { state, isMobile, toggleSidebar } = useSidebar()

// Compute sidebar width based on state and device
const sidebarWidth = computed(() => {
  if (isMobile.value) {
    return state.value === 'expanded' ? SIDEBAR_WIDTH_MOBILE : '0'
  }
  return state.value === 'expanded' ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)'
})

// Determine if we should use overlay mode on mobile
const isOverlayMode = computed(() => isMobile.value && state.value === 'expanded')

// Determine if sidebar is completely hidden (mobile + collapsed)
const isHidden = computed(() => isMobile.value && state.value === 'collapsed')
</script>

<template>
  <!-- Sidebar with responsive behavior -->
  <div
    class="group peer"
    :data-state="state"
    :data-collapsible="state === 'collapsed' ? collapsible : ''"
    :data-variant="variant"
    :data-side="side"
    :data-mobile="isMobile ? 'true' : undefined"
  >
    <!-- Mobile backdrop overlay when sidebar is expanded -->
    <div
      v-if="isOverlayMode"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 transition-opacity duration-300"
      @click="toggleSidebar"
    />

    <!-- This handles the sidebar spacing - only apply width on desktop to prevent margin adjustment on mobile -->
    <div
      v-if="!isMobile || (isMobile && state === 'expanded')"
      :class="cn(
        'duration-200 relative h-svh bg-transparent transition-[width] ease-linear',
        'group-data-[side=right]:rotate-180',
        isMobile && state === 'expanded' ? 'w-[--sidebar-width-mobile]' : 'w-[--sidebar-width]',
        variant === 'floating' || variant === 'inset'
          ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
          : 'group-data-[collapsible=icon]:w-[--sidebar-width-icon]',
      )"
    />
    
    <!-- Mobile trigger button (only shown when sidebar is hidden) -->
    <div 
      v-if="isHidden" 
      class="fixed z-30 top-3 left-3"
    >
      <SidebarTrigger class="bg-sidebar shadow-md rounded-full" />
    </div>
    
    <!-- Main sidebar container - completely hidden on mobile collapsed -->
    <div
      v-if="!isHidden"
      :class="cn(
        'duration-200 fixed inset-y-0 z-20 h-svh transition-all ease-linear flex',
        
        // Different positioning based on device type and state
        isMobile && state === 'expanded' 
          ? side === 'left' ? 'left-0' : 'right-0' // Always at edge on mobile when expanded
          : side === 'left' ? 'left-0' : 'right-0', // Normal positioning on desktop
        
        // Width based on state and device
        state === 'expanded' 
          ? isMobile ? 'w-[--sidebar-width-mobile]' : 'w-[--sidebar-width]'
          : 'w-[--sidebar-width-icon]',
        
        // On mobile when expanded, add overlay styling
        isMobile && state === 'expanded' ? 'shadow-xl' : '',
        
        // Styling variants
        variant === 'floating' || variant === 'inset'
          ? 'p-2'
          : 'group-data-[side=left]:border-r group-data-[side=right]:border-l',
        
        props.class,
      )"
      v-bind="$attrs"
    >
      <div
        data-sidebar="sidebar"
        class="flex h-full w-full flex-col text-sidebar-foreground bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
