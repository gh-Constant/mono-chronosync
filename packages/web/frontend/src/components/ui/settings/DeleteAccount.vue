<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertTriangle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showConfirmation = ref(false)
const confirmText = ref('')
const password = ref('')
const isDeleting = ref(false)
const error = ref<string | null>(null)

// Required confirmation text
const requiredConfirmation = "DELETE MY ACCOUNT"

// Toggle confirmation dialog
const toggleConfirmation = () => {
  showConfirmation.value = !showConfirmation.value
  confirmText.value = ''
  password.value = ''
  error.value = null
}

// Check if confirmation is valid
const isConfirmationValid = () => {
  return confirmText.value === requiredConfirmation && password.value.length > 0
}

// Handle account deletion
const handleDeleteAccount = async () => {
  if (!isConfirmationValid()) return

  isDeleting.value = true
  error.value = null

  try {
    // TODO: Implement actual API call to delete account
    // const response = await fetch('/api/auth/account', {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${authStore.token}`
    //   },
    //   body: JSON.stringify({
    //     password: password.value
    //   })
    // })

    // if (!response.ok) {
    //   const data = await response.json()
    //   throw new Error(data.message || 'Failed to delete account')
    // }

    // For now, we'll just simulate a successful account deletion
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Logout and redirect to home page
    authStore.logout()
  } catch (err: any) {
    error.value = err.message || 'Failed to delete account'
    isDeleting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Initial delete button -->
    <div v-if="!showConfirmation">
      <h3 class="text-lg font-medium text-red-600 dark:text-red-500 mb-2">Delete Account</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Once you delete your account, there is no going back. All of your data will be permanently removed.
      </p>
      <Button
        variant="destructive"
        @click="toggleConfirmation"
      >
        Delete Account
      </Button>
    </div>

    <!-- Confirmation dialog -->
    <div v-else class="border border-red-200 dark:border-red-900/50 rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
      <div class="flex items-start mb-4">
        <AlertTriangle class="h-6 w-6 text-red-600 dark:text-red-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="text-lg font-medium text-red-600 dark:text-red-500">Delete your account?</h3>
          <p class="mt-1 text-sm text-gray-700 dark:text-gray-300">
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </p>
        </div>
      </div>

      <!-- Confirmation form -->
      <form @submit.prevent="handleDeleteAccount" class="space-y-4">
        <!-- Password verification -->
        <div>
          <label for="delete-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Enter your password to confirm
          </label>
          <Input
            id="delete-password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <!-- Confirmation text -->
        <div>
          <label for="confirm-delete" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            To verify, type "{{ requiredConfirmation }}" below
          </label>
          <Input
            id="confirm-delete"
            v-model="confirmText"
            type="text"
            placeholder="DELETE MY ACCOUNT"
            required
          />
        </div>

        <!-- Error message -->
        <div v-if="error" class="p-3 bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-md text-red-600 dark:text-red-400 text-sm">
          {{ error }}
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end space-x-3">
          <Button
            variant="outline"
            @click="toggleConfirmation"
            :disabled="isDeleting"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            :disabled="!isConfirmationValid() || isDeleting"
          >
            <span v-if="isDeleting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
            <span v-else>Delete Account</span>
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
