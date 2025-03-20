<script setup lang="ts">
import { Home, Calendar, Settings, User2, LogOut, Menu } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const authStore = useAuthStore()
const route = useRoute()
const { state } = useSidebar()

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    to: '/dashboard'
  },
  {
    title: 'Calendar',
    icon: Calendar,
    to: '/calendar'
  },
  {
    title: 'Settings',
    icon: Settings,
    to: '/settings'
  }
]

const userName = computed(() => authStore.user?.name || 'User')
const userInitials = computed(() => {
  const name = authStore.user?.name || 'User'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function isCurrentRoute(path: string) {
  return route.path === path
}

function logout() {
  authStore.logout()
}
</script>

<template>
  <Sidebar collapsible="icon" class="border-r">
    <SidebarHeader>
      <div class="flex items-center px-2 py-2" :class="[
        state === 'expanded' ? 'justify-between' : 'justify-center'
      ]">
        <h2 class="text-lg font-semibold truncate px-2" v-if="state === 'expanded'">ChronoSync</h2>
        <SidebarTrigger class="h-8 w-8 flex items-center justify-center">
          <Menu class="h-4 w-4" />
        </SidebarTrigger>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel v-if="state === 'expanded'">Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in menuItems" :key="item.title">
              <SidebarMenuButton asChild :isActive="route.path === item.to">
                <router-link :to="item.to">
                  <component :is="item.icon" class="h-4 w-4" />
                  <span v-if="state === 'expanded'">{{ item.title }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 class="h-4 w-4" />
                <span v-if="state === 'expanded'">{{ userName }}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" class="w-48">
              <DropdownMenuItem @click="logout">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
  <ThemeToggle />
</template>

<style scoped>
:deep(.sidebar-menu-button) {
  width: 100%;
}
</style>