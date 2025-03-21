<script setup lang="ts">
import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardSidebar from '@/components/layout/dashboard/DashboardSidebar.vue'
import DashboardContent from '@/components/layout/dashboard/DashboardContent.vue'
</script>

<template>
  <SidebarProvider>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      <DashboardContent>
        <slot />
      </DashboardContent>
    </div>
  </SidebarProvider>
</template> 