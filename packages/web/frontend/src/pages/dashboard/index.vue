<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUpRight } from 'lucide-vue-next'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

const timeFrames = ['Hourly', 'Daily', 'Weekly', 'Monthly']
const selectedTimeFrame = ref('Hourly')

// Sample data for charts
const salesData = {
  labels: Array.from({ length: 12 }, (_, i) => 'Day ' + (i + 1)),
  data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 150, 200, 190]
}

const customersData = {
  labels: Array.from({ length: 12 }, (_, i) => 'Day ' + (i + 1)),
  data: [20, 30, 25, 40, 39, 50, 60, 81, 115, 140, 190, 180]
}

const ordersData = {
  labels: Array.from({ length: 12 }, (_, i) => 'Day ' + (i + 1)),
  data: [10, 20, 15, 30, 29, 40, 50, 71, 105, 130, 180, 170]
}

const overviewData = {
  labels: Array.from({ length: 12 }, (_, i) => 'Month ' + (i + 1)),
  data: [65, 85, 75, 90, 89, 100, 110, 131, 165, 190, 240, 230]
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">E-Commerce Dashboard</h1>
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-full">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Sales Rate Card -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-sm font-medium">Sales Rate</CardTitle>
          <Select v-model="selectedTimeFrame">
            <SelectTrigger class="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="frame in timeFrames" :key="frame" :value="frame">
                {{ frame }}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">$256,137.48</div>
          <div class="flex items-center pt-1 space-x-2">
            <ArrowUpRight class="w-4 h-4 text-green-500" />
            <p class="text-xs text-green-500">+24% from last month</p>
          </div>
          <div class="mt-4 h-[80px]">
            <LineChart :data="salesData.data" :labels="salesData.labels" color="#22C55E" />
          </div>
        </CardContent>
      </Card>

      <!-- New Customers Card -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-sm font-medium">New Customers</CardTitle>
          <Select v-model="selectedTimeFrame">
            <SelectTrigger class="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="frame in timeFrames" :key="frame" :value="frame">
                {{ frame }}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">17,435</div>
          <div class="flex items-center pt-1 space-x-2">
            <ArrowUpRight class="w-4 h-4 text-green-500" />
            <p class="text-xs text-green-500">+12% from last month</p>
          </div>
          <div class="mt-4 h-[80px]">
            <LineChart :data="customersData.data" :labels="customersData.labels" color="#8B5CF6" />
          </div>
        </CardContent>
      </Card>

      <!-- Average Monthly Order Card -->
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle class="text-sm font-medium">AVG. Monthly Order</CardTitle>
          <Select v-model="selectedTimeFrame">
            <SelectTrigger class="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="frame in timeFrames" :key="frame" :value="frame">
                {{ frame }}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">32,048</div>
          <div class="flex items-center pt-1 space-x-2">
            <ArrowUpRight class="w-4 h-4 text-green-500" />
            <p class="text-xs text-green-500">+40% from last month</p>
          </div>
          <div class="mt-4 h-[80px]">
            <LineChart :data="ordersData.data" :labels="ordersData.labels" color="#3B82F6" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Overview Section -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle class="text-base font-medium">E-Commerce Overview</CardTitle>
          <p class="text-sm text-gray-500">Trends summary, performance analysis</p>
        </div>
        <Select v-model="selectedTimeFrame">
          <SelectTrigger class="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="frame in timeFrames" :key="frame" :value="frame">
              {{ frame }}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div class="h-[300px]">
          <BarChart :data="overviewData.data" :labels="overviewData.labels" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
.dark {
  color-scheme: dark;
}
</style> 