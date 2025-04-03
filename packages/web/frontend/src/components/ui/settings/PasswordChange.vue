<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Check } from 'lucide-vue-next'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

// Password strength indicators
const passwordStrength = ref(0)
const passwordFeedback = ref('')

// Password requirements
const hasMinLength = ref(false)
const hasUppercase = ref(false)
const hasLowercase = ref(false)
const hasNumber = ref(false)
const hasSpecialChar = ref(false)

// Check password strength
const checkPasswordStrength = (password: string) => {
  // Reset all checks
  hasMinLength.value = password.length >= 8
  hasUppercase.value = /[A-Z]/.test(password)
  hasLowercase.value = /[a-z]/.test(password)
  hasNumber.value = /[0-9]/.test(password)
  hasSpecialChar.value = /[^A-Za-z0-9]/.test(password)
  
  // Calculate strength (0-4)
  const checks = [
    hasMinLength.value,
    hasUppercase.value,
    hasLowercase.value,
    hasNumber.value,
    hasSpecialChar.value
  ]
  
  passwordStrength.value = checks.filter(Boolean).length
  
  // Set feedback based on strength
  if (passwordStrength.value === 0) {
    passwordFeedback.value = 'Very weak'
  } else if (passwordStrength.value === 1) {
    passwordFeedback.value = 'Weak'
  } else if (passwordStrength.value === 2) {
    passwordFeedback.value = 'Fair'
  } else if (passwordStrength.value === 3) {
    passwordFeedback.value = 'Good'
  } else if (passwordStrength.value === 4) {
    passwordFeedback.value = 'Strong'
  } else {
    passwordFeedback.value = 'Very strong'
  }
}

// Watch for password changes
const handlePasswordChange = () => {
  checkPasswordStrength(newPassword.value)
}

// Handle form submission
const handleSubmit = async () => {
  // Reset messages
  error.value = null
  success.value = null
  
  // Validate inputs
  if (!currentPassword.value) {
    error.value = 'Current password is required'
    return
  }
  
  if (!newPassword.value) {
    error.value = 'New password is required'
    return
  }
  
  if (newPassword.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }
  
  if (newPassword.value === currentPassword.value) {
    error.value = 'New password must be different from current password'
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  // Check password strength
  if (passwordStrength.value < 3) {
    error.value = 'Please choose a stronger password'
    return
  }
  
  isSubmitting.value = true
  
  try {
    // TODO: Implement actual API call to change password
    // const response = await fetch('/api/auth/password/change', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${authStore.token}`
    //   },
    //   body: JSON.stringify({
    //     currentPassword: currentPassword.value,
    //     newPassword: newPassword.value
    //   })
    // })
    
    // if (!response.ok) {
    //   const data = await response.json()
    //   throw new Error(data.message || 'Failed to change password')
    // }
    
    // For now, we'll just simulate a successful password change
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Clear form
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordStrength.value = 0
    passwordFeedback.value = ''
    
    // Show success message
    success.value = 'Password changed successfully'
  } catch (err: any) {
    error.value = err.message || 'Failed to change password'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Current password -->
    <div>
      <label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Current Password
      </label>
      <div class="relative">
        <Input
          id="current-password"
          v-model="currentPassword"
          :type="showCurrentPassword ? 'text' : 'password'"
          placeholder="Enter your current password"
          class="pr-10"
        />
        <button
          type="button"
          @click="showCurrentPassword = !showCurrentPassword"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Eye v-if="!showCurrentPassword" class="h-5 w-5" />
          <EyeOff v-else class="h-5 w-5" />
        </button>
      </div>
    </div>
    
    <!-- New password -->
    <div>
      <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        New Password
      </label>
      <div class="relative">
        <Input
          id="new-password"
          v-model="newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          placeholder="Enter your new password"
          class="pr-10"
          @input="handlePasswordChange"
        />
        <button
          type="button"
          @click="showNewPassword = !showNewPassword"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Eye v-if="!showNewPassword" class="h-5 w-5" />
          <EyeOff v-else class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Password strength indicator -->
      <div v-if="newPassword" class="mt-2">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Password strength:</span>
          <span class="text-xs font-medium" :class="{
            'text-red-500': passwordStrength < 2,
            'text-yellow-500': passwordStrength === 2,
            'text-green-500': passwordStrength > 2
          }">{{ passwordFeedback }}</span>
        </div>
        <div class="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300"
            :class="{
              'bg-red-500': passwordStrength < 2,
              'bg-yellow-500': passwordStrength === 2,
              'bg-green-500': passwordStrength > 2
            }"
            :style="{ width: `${(passwordStrength / 5) * 100}%` }"
          ></div>
        </div>
        
        <!-- Password requirements -->
        <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          <div class="flex items-center text-xs">
            <span :class="hasMinLength ? 'text-green-500' : 'text-gray-400'">
              <Check v-if="hasMinLength" class="h-3.5 w-3.5 mr-1 inline" />
              <span v-else class="h-3.5 w-3.5 mr-1 inline-block"></span>
              At least 8 characters
            </span>
          </div>
          <div class="flex items-center text-xs">
            <span :class="hasUppercase ? 'text-green-500' : 'text-gray-400'">
              <Check v-if="hasUppercase" class="h-3.5 w-3.5 mr-1 inline" />
              <span v-else class="h-3.5 w-3.5 mr-1 inline-block"></span>
              Uppercase letter
            </span>
          </div>
          <div class="flex items-center text-xs">
            <span :class="hasLowercase ? 'text-green-500' : 'text-gray-400'">
              <Check v-if="hasLowercase" class="h-3.5 w-3.5 mr-1 inline" />
              <span v-else class="h-3.5 w-3.5 mr-1 inline-block"></span>
              Lowercase letter
            </span>
          </div>
          <div class="flex items-center text-xs">
            <span :class="hasNumber ? 'text-green-500' : 'text-gray-400'">
              <Check v-if="hasNumber" class="h-3.5 w-3.5 mr-1 inline" />
              <span v-else class="h-3.5 w-3.5 mr-1 inline-block"></span>
              Number
            </span>
          </div>
          <div class="flex items-center text-xs">
            <span :class="hasSpecialChar ? 'text-green-500' : 'text-gray-400'">
              <Check v-if="hasSpecialChar" class="h-3.5 w-3.5 mr-1 inline" />
              <span v-else class="h-3.5 w-3.5 mr-1 inline-block"></span>
              Special character
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirm password -->
    <div>
      <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Confirm Password
      </label>
      <div class="relative">
        <Input
          id="confirm-password"
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm your new password"
          class="pr-10"
        />
        <button
          type="button"
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
          <EyeOff v-else class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Password match indicator -->
      <div v-if="confirmPassword && newPassword" class="mt-1">
        <p v-if="confirmPassword === newPassword" class="text-xs text-green-500 flex items-center">
          <Check class="h-3.5 w-3.5 mr-1" />
          Passwords match
        </p>
        <p v-else class="text-xs text-red-500">
          Passwords do not match
        </p>
      </div>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-md text-red-600 dark:text-red-400 text-sm">
      {{ error }}
    </div>
    
    <!-- Success message -->
    <div v-if="success" class="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-md text-green-600 dark:text-green-400 text-sm">
      {{ success }}
    </div>
    
    <!-- Submit button -->
    <div class="flex justify-end">
      <Button type="submit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Changing Password...
        </span>
        <span v-else>Change Password</span>
      </Button>
    </div>
  </form>
</template>
