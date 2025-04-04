<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SettingsCard, SettingsSection } from '@/components/ui/settings'
import { ProfilePictureUpload } from '@/components/ui/settings'
import { PasswordChange } from '@/components/ui/settings'
import { DeleteAccount } from '@/components/ui/settings'
import { useAuthStore } from '@/stores/auth'

// References to child components
const profilePicture = ref<{
  applyChanges: () => void
  discardChanges: () => void
} | null>(null)
const settingsSection = ref<{
  setHasChanges: (value: boolean) => void
} | null>(null)

const authStore = useAuthStore()
const user = ref(authStore.user)
const isEditing = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

// Initial form data
const initialFormData = {
  name: '',
  email: ''
}

// Form data
const formData = ref({
  name: '',
  email: ''
})

// Initialize form data
onMounted(() => {
  if (user.value) {
    initialFormData.name = user.value.name || ''
    initialFormData.email = user.value.email || ''

    formData.value.name = initialFormData.name
    formData.value.email = initialFormData.email
  }
})

// Track changes
const hasUnsavedChanges = () => {
  return formData.value.name !== initialFormData.name ||
    formData.value.email !== initialFormData.email
}

// Watch for changes
watch([() => formData.value.name, () => formData.value.email], () => {
  if (settingsSection.value && isEditing.value) {
    settingsSection.value.setHasChanges(hasUnsavedChanges())
  }
})

// Toggle edit mode
const toggleEdit = () => {
  if (isEditing.value) {
    // Cancel editing - reset form
    formData.value.name = initialFormData.name
    formData.value.email = initialFormData.email

    // Reset hasChanges
    if (settingsSection.value) {
      settingsSection.value.setHasChanges(false)
    }
  }

  isEditing.value = !isEditing.value
  error.value = null
  success.value = null
}

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true
  error.value = null
  success.value = null

  try {
    // Validate inputs
    if (!formData.value.name.trim()) {
      throw new Error('Name is required')
    }

    if (!formData.value.email.trim()) {
      throw new Error('Email is required')
    }

    // TODO: Implement actual API call to update profile
    // const response = await fetch('/api/auth/profile', {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${authStore.token}`
    //   },
    //   body: JSON.stringify({
    //     name: formData.value.name,
    //     email: formData.value.email
    //   })
    // })

    // if (!response.ok) {
    //   const data = await response.json()
    //   throw new Error(data.message || 'Failed to update profile')
    // }

    // For now, we'll just simulate a successful update
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update user in auth store
    if (user.value) {
      user.value.name = formData.value.name
      user.value.email = formData.value.email
      // TODO: authStore.updateUser(user.value)
    }

    // Update initial data
    initialFormData.name = formData.value.name
    initialFormData.email = formData.value.email

    // Apply profile picture changes if any
    if (profilePicture.value) {
      profilePicture.value.applyChanges()
    }

    success.value = 'Profile updated successfully'
    isEditing.value = false

    // Reset hasChanges
    if (settingsSection.value) {
      settingsSection.value.setHasChanges(false)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to update profile'
  } finally {
    isSubmitting.value = false
  }
}

// Save all changes
const saveChanges = async () => {
  if (isEditing.value) {
    await handleSubmit()
  } else if (profilePicture.value) {
    // Just apply profile picture changes
    profilePicture.value.applyChanges()

    // Reset hasChanges
    if (settingsSection.value) {
      settingsSection.value.setHasChanges(false)
    }
  }
}

// Discard all changes
const discardChanges = () => {
  // Reset form data
  formData.value.name = initialFormData.name
  formData.value.email = initialFormData.email

  // Exit edit mode
  isEditing.value = false

  // Discard profile picture changes
  if (profilePicture.value) {
    profilePicture.value.discardChanges()
  }
}
</script>

<template>
  <SettingsSection
    ref="settingsSection"
    sectionName="Account"
    @save="saveChanges"
    @discard="discardChanges"
  >
    <!-- Enhanced grid for large screens with better proportions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
      <!-- Left Column - Profile Section -->
      <div class="space-y-6">
        <!-- Profile Information Card -->
        <SettingsCard
          title="Profile Information"
          description="Update your account's profile information and email address."
          icon="user"

        >
          <div class="space-y-6">
            <!-- Centered Profile Picture with larger size on big screens -->
            <div class="flex justify-center">
              <ProfilePictureUpload
                ref="profilePicture"
                class="w-32 h-32 2xl:w-40 2xl:h-40"
              />
            </div>

            <!-- Profile Form with larger typography on big screens -->
            <form @submit.prevent="handleSubmit" class="mt-4 2xl:mt-6">
              <div class="space-y-6 2xl:space-y-7">
                <!-- Name Field -->
                <div>
                  <label for="name" class="block text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 2xl:mb-3">
                    Name <span class="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    :disabled="!isEditing"
                    placeholder="Your full name"
                    class="w-full text-base 2xl:text-lg"
                    :class="{ 'opacity-75': !isEditing }"
                  />
                </div>

                <!-- Email Field -->
                <div>
                  <label for="email" class="block text-sm 2xl:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 2xl:mb-3">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    :disabled="!isEditing"
                    placeholder="your.email@example.com"
                    class="w-full text-base 2xl:text-lg"
                    :class="{ 'opacity-75': !isEditing }"
                  />
                </div>

                <!-- Status Messages with larger text -->
                <transition name="fade">
                  <div v-if="error" class="p-4 2xl:p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm 2xl:text-base text-red-600 dark:text-red-300 flex items-start">
                    <ExclamationCircleIcon class="h-5 w-5 2xl:h-6 2xl:w-6 mr-3 mt-0.5 flex-shrink-0" />
                    {{ error }}
                  </div>
                </transition>

                <transition name="fade">
                  <div v-if="success" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-600 dark:text-green-300 flex items-start">
                    <CheckCircleIcon class="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    {{ success }}
                  </div>
                </transition>

                <!-- Form Actions with larger buttons -->
                <div class="flex justify-end space-x-4 pt-3">
                  <template v-if="isEditing">
                    <Button
                      type="button"
                      variant="outline"
                      @click="toggleEdit"
                      :disabled="isSubmitting"
                      class="min-w-[120px] 2xl:min-w-[140px] h-11 2xl:h-12 text-sm 2xl:text-base"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      :loading="isSubmitting"
                      class="min-w-[120px] 2xl:min-w-[140px] h-11 2xl:h-12 text-sm 2xl:text-base"
                    >
                      Save Changes
                    </Button>
                  </template>
                  <Button
                    v-else
                    type="button"
                    @click="toggleEdit"
                    class="min-w-[120px] h-11 text-sm"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </SettingsCard>
      </div>

      <!-- Right Column - Security Section -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Password Update Card -->
        <SettingsCard
          title="Update Password"
          description="Ensure your account is using a long, secure password with special characters."
          icon="lock"
        >
          <PasswordChange />
        </SettingsCard>

        <!-- Danger Zone Card with enhanced visibility -->
        <SettingsCard
          title="Danger Zone"
          description="Permanently delete your account and all associated data. This action cannot be undone."
          icon="trash"
          class="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10"
        >
          <DeleteAccount />
        </SettingsCard>
      </div>
    </div>
  </SettingsSection>
</template>