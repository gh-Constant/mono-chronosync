<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted, provide } from 'vue'
import { Button } from '@/components/ui/button'
import { X, Save, AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
  sectionName: string
}>()

const hasChanges = ref(false)
const showSaveBar = ref(false)
const isSubmitting = ref(false)
const showDiscardWarning = ref(false)

// Provide hasChanges to child components
provide('hasChanges', hasChanges)

// Watch for changes and show save bar
watch(hasChanges, (newVal) => {
  showSaveBar.value = newVal
})

// Handle save
const handleSave = async () => {
  isSubmitting.value = true

  try {
    // Emit save event for parent component to handle
    emit('save')

    // Reset state
    hasChanges.value = false
    showSaveBar.value = false
  } finally {
    isSubmitting.value = false
  }
}

// Handle discard
const handleDiscard = () => {
  if (hasChanges.value) {
    showDiscardWarning.value = true
  }
}

// Confirm discard
const confirmDiscard = () => {
  emit('discard')
  hasChanges.value = false
  showSaveBar.value = false
  showDiscardWarning.value = false
}

// Cancel discard
const cancelDiscard = () => {
  showDiscardWarning.value = false
}

// Before unload handler for browser navigation
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (hasChanges.value) {
    e.preventDefault()
    e.returnValue = ''
    return ''
  }
}

// Add beforeunload event listener
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// Remove beforeunload event listener
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// Emit events
const emit = defineEmits<{
  (e: 'save'): void
  (e: 'discard'): void
}>()

// Method to set hasChanges from child components
const setHasChanges = (value: boolean) => {
  hasChanges.value = value
}

// Expose methods to template
defineExpose({
  setHasChanges
})
</script>

<template>
  <div class="relative">
    <!-- Main content -->
    <div>
      <slot></slot>
    </div>

    <!-- Sticky save bar -->
    <div
      v-if="showSaveBar"
      class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg transform transition-all duration-300 z-50"
      :class="showSaveBar ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="container mx-auto px-4 py-3 md:py-4 lg:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center text-amber-600 dark:text-amber-400">
          <AlertTriangle class="h-5 w-5 md:h-6 md:w-6 mr-2" />
          <span class="text-sm md:text-base font-medium">You have unsaved changes in {{ sectionName }}</span>
        </div>
        <div class="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            @click="handleDiscard"
            class="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors duration-200"
          >
            <X class="h-4 w-4 mr-1" />
            <span class="hidden sm:inline">Discard</span>
            <span class="sm:hidden">Cancel</span>
          </Button>
          <Button
            size="sm"
            @click="handleSave"
            :disabled="isSubmitting"
            class="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 min-w-[100px] md:min-w-[120px]"
          >
            <Save v-if="!isSubmitting" class="h-4 w-4 md:h-5 md:w-5 mr-1" />
            <svg v-else class="animate-spin h-4 w-4 md:h-5 md:w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Discard changes warning modal -->
    <div v-if="showDiscardWarning" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 md:p-8 mx-auto transition-all duration-200">
        <div class="flex items-start mb-4 md:mb-6">
          <div class="flex-shrink-0 text-red-500">
            <AlertTriangle class="h-6 w-6 md:h-8 md:w-8" />
          </div>
          <div class="ml-3 md:ml-4">
            <h3 class="text-lg md:text-xl font-medium text-gray-900 dark:text-white">Discard changes?</h3>
            <p class="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400">
              You have unsaved changes that will be lost if you continue. Are you sure you want to discard these changes?
            </p>
          </div>
        </div>
        <div class="flex justify-end space-x-3 md:space-x-4">
          <Button
            variant="outline"
            @click="cancelDiscard"
            class="transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="confirmDiscard"
            class="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
          >
            Discard Changes
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
