<script setup lang="ts">
import type { SidebarProps } from '.'
import { cn } from '@/lib/utils'
import { SIDEBAR_WIDTH_MOBILE, SIDEBAR_WIDTH_ICON, useSidebar } from './utils'
import { ChevronRight } from 'lucide-vue-next'
import { computed, unref } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SidebarProps>(), {
  side: 'left',
  variant: 'sidebar',
  collapsible: 'offcanvas',
})

const sidebar = useSidebar()

// Compute sidebar width based on state and device
const sidebarWidth = computed(() => {
  if (unref(sidebar.isMobile)) {
    return unref(sidebar.state) === 'expanded' ? SIDEBAR_WIDTH_MOBILE : '0'
  }
  return unref(sidebar.state) === 'expanded' ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)'
})

// Determine if we should use overlay mode on mobile
const isOverlayMode = computed(() => unref(sidebar.isMobile) && unref(sidebar.state) === 'expanded')

// Determine if sidebar is completely hidden (mobile + collapsed)
const isHidden = computed(() => unref(sidebar.isMobile) && unref(sidebar.state) === 'collapsed')
</script>

<template>
  <!-- Sidebar with responsive behavior -->
  <div
    class="group peer"
    :data-state="unref(sidebar.state)"
    :data-collapsible="unref(sidebar.state) === 'collapsed' ? collapsible : ''"
    :data-variant="variant"
    :data-side="side"
    :data-mobile="unref(sidebar.isMobile) ? 'true' : undefined"
  >
    <!-- Mobile backdrop overlay when sidebar is expanded -->
    <div
      v-if="isOverlayMode"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 transition-opacity duration-300"
      @click="sidebar.toggleSidebar"
    />

    <!-- This handles the sidebar spacing - only apply width on desktop to prevent margin adjustment on mobile -->
    <div
      v-if="!unref(sidebar.isMobile) || (unref(sidebar.isMobile) && unref(sidebar.state) === 'expanded')"
      :class="cn(
        'duration-200 relative h-svh bg-transparent transition-[width] ease-linear',
        'group-data-[side=right]:rotate-90 group-data-[side=right]:origin-top-right',
        unref(sidebar.isMobile) && unref(sidebar.state) === 'expanded' ? 'w-[var(--sidebar-width-mobile)]' : 'w-[var(--sidebar-width)]',
        variant === 'floating' || variant === 'inset'
          ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
          : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]',
      )"
    />

    <!-- Sidebar trigger button (always visible) -->
    <div
      class="fixed z-30 top-3"
      :class="{
        'left-3': side === 'left' && (unref(sidebar.isMobile) || unref(sidebar.state) === 'collapsed'),
        'right-3': side === 'right' && (unref(sidebar.isMobile) || unref(sidebar.state) === 'collapsed'),
        [side === 'left' ? 'left-[calc(var(--sidebar-width)+0.75rem)]' : 'right-[calc(var(--sidebar-width)+0.75rem)]']: !unref(sidebar.isMobile) && unref(sidebar.state) === 'expanded'
      }"
    >
      <button
        @click="sidebar.toggleSidebar"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md hover:shadow-purple-300/30 dark:hover:shadow-purple-900/30 hover:scale-105 transition-all duration-300 shadow-md"
      >
        <ChevronRight
          :class="[
            'h-5 w-5 transition-all duration-300',
            unref(sidebar.state) === 'expanded' ? 'rotate-180' : ''
          ]"
        />
        <span class="sr-only">Toggle Sidebar</span>
      </button>
    </div>

    <!-- Main sidebar container - completely hidden on mobile collapsed -->
    <div
      v-if="!isHidden"
      :class="cn(
        'duration-200 fixed inset-y-0 z-20 h-svh transition-all ease-linear flex',

        // Different positioning based on device type and state
        unref(sidebar.isMobile) && unref(sidebar.state) === 'expanded'
          ? side === 'left' ? 'left-0' : 'right-0' // Always at edge on mobile when expanded
          : side === 'left' ? 'left-0' : 'right-0', // Normal positioning on desktop

        // Width based on state and device
        unref(sidebar.state) === 'expanded'
          ? unref(sidebar.isMobile) ? 'w-[var(--sidebar-width-mobile)]' : 'w-[var(--sidebar-width)]'
          : 'w-[var(--sidebar-width-icon)]',

        // On mobile when expanded, add overlay styling
        unref(sidebar.isMobile) && unref(sidebar.state) === 'expanded' ? 'shadow-xl' : '',

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
