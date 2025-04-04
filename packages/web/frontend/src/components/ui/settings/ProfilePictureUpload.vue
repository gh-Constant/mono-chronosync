<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { Camera, Trash2 } from 'lucide-vue-next'
import DefaultAvatar from './DefaultAvatar.vue'

const authStore = useAuthStore()
const imageUrl = ref<string | null>(null)
const initialImageUrl = ref<string | null>(null)
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const error = ref<string | null>(null)

// Get hasChanges from parent SettingsSection if available
const hasChanges = inject<{ value: boolean }>('hasChanges', { value: false })

// Initialize with user's existing image if available
onMounted(() => {
  if (authStore.user?.image) {
    imageUrl.value = authStore.user.image
    initialImageUrl.value = authStore.user.image
  }
})

// Display user initials if no image is available
const userInitials = computed(() => {
  if (!authStore.user?.name) return 'U'
  return authStore.user.name.charAt(0).toUpperCase()
})

// Trigger file input click
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Handle file selection
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  // Validate file type
  if (!file.type.match('image.*')) {
    error.value = 'Please select an image file (JPEG, PNG, GIF)'
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Image size should be less than 5MB'
    return
  }

  error.value = null
  uploadImage(file)
}

// Upload image to server
const uploadImage = async (file: File) => {
  isUploading.value = true

  try {
    // Create a temporary URL for preview
    imageUrl.value = URL.createObjectURL(file)

    // TODO: Implement actual API call to upload image
    // const formData = new FormData()
    // formData.append('image', file)
    // const response = await fetch('/api/auth/profile/image', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     'Authorization': `Bearer ${authStore.token}`
    //   }
    // })

    // if (!response.ok) throw new Error('Failed to upload image')
    // const data = await response.json()
    // imageUrl.value = data.imageUrl

    // For now, we'll just simulate a successful upload
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update hasChanges if provided by parent
    if (hasChanges && typeof hasChanges === 'object' && 'value' in hasChanges) {
      hasChanges.value = true
    } else {
      // If not in a settings section with change tracking, apply immediately
      // TODO: Update user in auth store with new image URL
      // authStore.updateUserImage(imageUrl.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to upload image'
    imageUrl.value = initialImageUrl.value
  } finally {
    isUploading.value = false
  }
}

// Remove profile picture
const removeProfilePicture = async () => {
  isUploading.value = true

  try {
    // TODO: Implement actual API call to remove image
    // const response = await fetch('/api/auth/profile/image', {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${authStore.token}`
    //   }
    // })

    // if (!response.ok) throw new Error('Failed to remove image')

    // For now, we'll just simulate a successful removal
    await new Promise(resolve => setTimeout(resolve, 1000))

    imageUrl.value = null

    // Update hasChanges if provided by parent
    if (hasChanges && typeof hasChanges === 'object' && 'value' in hasChanges) {
      hasChanges.value = true
    } else {
      // If not in a settings section with change tracking, apply immediately
      // TODO: Update user in auth store with null image
      // authStore.updateUserImage(null)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to remove image'
  } finally {
    isUploading.value = false
  }
}

// Method to apply changes (called from parent)
const applyChanges = async () => {
  // TODO: Implement actual API call to save changes
  // authStore.updateUserImage(imageUrl.value)
  initialImageUrl.value = imageUrl.value
}

// Method to discard changes (called from parent)
const discardChanges = () => {
  imageUrl.value = initialImageUrl.value
}

// Expose methods to parent
defineExpose({
  applyChanges,
  discardChanges
})
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <!-- Profile picture or default avatar -->
      <div class="relative mx-auto sm:mx-0">
        <div v-if="imageUrl" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
          <img :src="imageUrl" alt="Profile" class="w-full h-full object-cover" />
        </div>
        <DefaultAvatar
          v-else
          :initials="userInitials"
          size="lg"
          class="shadow-md"
        />

        <!-- Loading overlay -->
        <div v-if="isUploading" class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <svg class="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>

      <!-- Upload/remove buttons -->
      <div class="flex flex-col space-y-2 mx-auto sm:mx-0">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
        <Button
          size="sm"
          @click="triggerFileInput"
          :disabled="isUploading"
          class="w-full sm:w-auto"
        >
          <Camera class="h-4 w-4 mr-2" />
          <span>{{ imageUrl ? 'Change Picture' : 'Upload Picture' }}</span>
        </Button>

        <Button
          v-if="imageUrl"
          size="sm"
          @click="removeProfilePicture"
          :disabled="isUploading"
          class="text-white bg-red-500 hover:bg-red-600 dark:text-white dark:bg-red-500 dark:hover:bg-red-600 w-full sm:w-auto"
        >
          <Trash2 class="h-4 w-4 mr-2" />
          <span>Remove</span>
        </Button>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ error }}</p>

    <!-- Help text -->
    <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
      Upload a profile picture in JPEG, PNG, or GIF format (max 5MB).
    </p>
  </div>
</template>
