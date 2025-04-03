<script setup lang="ts">
import { Button } from '.'
import { ref } from 'vue'

const loading = ref(false)

const toggleLoading = () => {
  loading.value = !loading.value

  if (loading.value) {
    setTimeout(() => {
      loading.value = false
    }, 2000)
  }
}
</script>

<template>
  <div class="p-6 space-y-8 max-w-4xl mx-auto">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Button Component</h1>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Button Variants</h2>
        <div class="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="purple">Purple</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Button Sizes</h2>
        <div class="flex flex-wrap items-center gap-4">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="icon" iconOnly>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </Button>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Loading State</h2>
        <div class="flex flex-wrap gap-4">
          <Button :loading="loading" @click="toggleLoading">
            Click to Load
          </Button>
          <Button variant="purple" :loading="loading" @click="toggleLoading">
            Purple Loading
          </Button>
          <Button variant="success" :loading="loading" @click="toggleLoading">
            Success Loading
          </Button>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Disabled State</h2>
        <div class="flex flex-wrap gap-4">
          <Button disabled>Disabled</Button>
          <Button variant="purple" disabled>Purple Disabled</Button>
          <Button variant="success" disabled>Success Disabled</Button>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">With Icons</h2>
        <div class="flex flex-wrap gap-4">
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
            Continue
          </Button>
          <Button variant="purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Add New
          </Button>
          <Button variant="success">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            Save
          </Button>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Compact Buttons (for Settings)</h2>
        <div class="flex flex-wrap gap-4">
          <Button size="sm" compact>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            Save
          </Button>
          <Button size="sm" variant="outline" compact>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Cancel
          </Button>
          <Button size="sm" variant="destructive" compact>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            </svg>
            Delete
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
