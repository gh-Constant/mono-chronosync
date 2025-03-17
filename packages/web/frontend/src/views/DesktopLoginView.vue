<template>
  <div class="font-sans text-gray-900 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white min-h-screen flex flex-col">
    <!-- Split Screen Auth Container -->
    <div class="flex flex-1">
      <!-- Decorative Side -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        <!-- Pattern overlay -->
        <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTU0LjYyNyAyMi41SDM3LjVhMi41IDIuNSAwIDAgMSAwLTVoMTkuMTI3YTcuNSA3LjUgMCAwIDAgNy41LTcuNXYtNUEyLjUgMi41IDAgMCAxIDY2LjYyNyAwSDY5djIuNWEyLjUgMi41IDAgMCAxLTUgMHYtLjEyN2wtLjEyNy4xMjctMTkuMTI3IDBhNy41IDcuNSAwIDAgMC03LjUgNy41djEwYTcuNSA3LjUgMCAwIDAgNy41IDcuNWgxOS4xMjdhMi41IDIuNSAwIDAgMSAwIDVINDkuNjI3YTcuNSA3LjUgMCAwIDAtNy41IDcuNXYxMGE3LjUgNy41IDAgMCAwIDcuNSA3LjVoMTcuMzI1TTI4Ljc1IDQ0Ljc1czEuNSAxLjUgMS41IDUuMjVIOTBWMjBIMzcuNWE3LjUgNy41IDAgMCAxLTcuNS03LjV2LTVhMi41IDIuNSAwIDAgMC0yLjUtMi41SDI1djVhMi41IDIuNSAwIDAgMS01IDB2LTVIMTVWMTBIMHY1YTIuNSAyLjUgMCAwIDEtNSAwdi01SDIwdjVhMi41IDIuNSAwIDAgMCAyLjUgMi41aDJjNS41MjMgMCAxMCA0LjQ3NyAxMCAxMHYxNy4yNXMtMTAuNzUgMS41LTEuNSAxMGgxLjI1VjUwSDI5djQuNzVoLS4yNXoiLz48L2c+PC9zdmc+')]"></div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div class="max-w-md text-center">
            <div class="mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <div class="w-4 h-4 bg-purple-600 rounded-full"></div>
                </div>
              </div>
              <h2 class="text-3xl font-extrabold mb-2">Chronosync</h2>
              <p class="text-xl font-light text-white/90">Master your digital time</p>
            </div>
            
            <div class="space-y-8">
              <div class="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 bg-white/20 rounded-lg p-3">
                    <clock-icon class="w-6 h-6" />
                  </div>
                  <div class="ml-4 text-left">
                    <h3 class="text-lg font-semibold mb-1">Smart Tracking</h3>
                    <p class="text-white/80">Our AI helps you optimize your time across all devices</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 bg-white/20 rounded-lg p-3">
                    <monitor-icon class="w-6 h-6" />
                  </div>
                  <div class="ml-4 text-left">
                    <h3 class="text-lg font-semibold mb-1">Desktop Integration</h3>
                    <p class="text-white/80">Sign in here to connect your desktop application</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Auth Form Side -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-md py-8">
          <!-- Auth Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <!-- Card Header with Logo -->
            <div class="p-8 text-center">
              <div class="inline-flex items-center gap-2 mb-8 lg:hidden">
                <div class="relative w-8 h-8">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  <div class="absolute inset-1 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <div class="w-4 h-4 bg-purple-600 rounded-full"></div>
                  </div>
                </div>
                <span class="text-xl font-bold tracking-tight">Chronosync</span>
              </div>
              
              <h2 class="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">
                Desktop App Login
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mb-6 font-light">
                Sign in to connect your desktop application
              </p>
              
              <!-- Desktop app info -->
              <div v-if="redirectUri" class="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
                <p class="text-sm text-blue-800 dark:text-blue-200">
                  <monitor-icon class="inline-block w-4 h-4 mr-2" />
                  Connecting with desktop application
                </p>
              </div>
            </div>
            
            <!-- Card Body -->
            <div class="px-8 pb-8">
              <!-- Social Login Section -->
              <div class="mb-6">
                <div class="grid grid-cols-3 gap-3">
                  <button
                    @click="handleOAuthLogin('google')"
                    class="flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors items-center"
                  >
                    <google-icon class="w-5 h-5" />
                  </button>
                  <button
                    disabled
                    title="Apple Sign In coming soon"
                    class="flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 opacity-50 cursor-not-allowed items-center"
                  >
                    <apple-icon class="w-5 h-5" />
                  </button>
                  <button
                    @click="handleOAuthLogin('github')"
                    class="flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors items-center"
                  >
                    <github-icon class="w-5 h-5" />
                  </button>
                </div>
                
                <div class="relative flex items-center mt-6 mb-6">
                  <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                  <span class="flex-shrink-0 mx-4 text-sm text-gray-500 dark:text-gray-400">or continue with email</span>
                  <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>
              </div>
              
              <!-- Login Form -->
              <form @submit.prevent="handleLogin" class="space-y-5">
                <!-- Error Alert -->
                <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                        Login failed
                      </h3>
                      <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                        {{ error }}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label for="login-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <mail-icon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="login-email" 
                      v-model="loginForm.email" 
                      type="email" 
                      required
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <div class="flex justify-between mb-1.5">
                    <label for="login-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <a href="#" class="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium">Forgot password?</a>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <lock-icon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="login-password" 
                      v-model="loginForm.password" 
                      type="password" 
                      required
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div class="flex items-center">
                  <div class="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      id="remember-me" 
                      v-model="loginForm.rememberMe" 
                      type="checkbox" 
                      class="sr-only"
                    />
                    <div class="block h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div 
                      :class="['absolute left-0 top-0 w-6 h-6 rounded-full transition-transform duration-200 ease-in-out transform', 
                               loginForm.rememberMe ? 'translate-x-full bg-purple-600' : 'bg-white dark:bg-gray-400']"
                    ></div>
                  </div>
                  <label for="remember-me" class="text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  :disabled="isLoading"
                  class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span v-if="isLoading" class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                  <span v-else>Sign in with Desktop App</span>
                </button>
              </form>
              
              <!-- No account link -->
              <div class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?
                <router-link 
                  to="/auth?tab=signup" 
                  class="text-purple-600 dark:text-purple-400 font-medium hover:underline focus:outline-none ml-1"
                >
                  Sign up
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  GithubIcon, ClockIcon, LockIcon, MailIcon, 
  AppleIcon, MonitorIcon 
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { authService } from '@/services/authService'

// Router and Route
const router = useRouter()
const route = useRoute()

// Auth store
const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)

// Login form state
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

// Get and validate the redirect_uri
const redirectUri = ref<string | null>(null)

onMounted(() => {
  // Get the redirect_uri from the query params
  const redirectUriParam = route.query.redirect_uri as string
  
  if (redirectUriParam) {
    // Validate the redirect_uri (only allow specific URI schemes for security)
    if (isValidRedirectUri(redirectUriParam)) {
      redirectUri.value = redirectUriParam
    } else {
      error.value = 'Invalid redirect URI provided'
    }
  } else {
    error.value = 'No redirect URI provided'
  }
})

// Validate the redirect URI (only allow specific URI schemes)
const isValidRedirectUri = (uri: string): boolean => {
  try {
    // Valid URI schemes for desktop apps (customize as needed)
    const validSchemes = ['myapp', 'chronosync']
    
    // Basic URI check
    const url = new URL(uri)
    return validSchemes.includes(url.protocol.replace(':', ''))
  } catch (err) {
    return false
  }
}

// Form handlers
const handleLogin = async () => {
  if (!redirectUri.value) {
    error.value = 'No valid redirect URI provided'
    return
  }
  
  const success = await authStore.login(
    loginForm.value.email,
    loginForm.value.password,
    loginForm.value.rememberMe
  )
  
  if (success) {
    // Get the token
    const token = authService.getToken()
    
    if (token) {
      // Log the redirect attempt
      console.log('Redirecting to desktop app:', {
        redirectUri: redirectUri.value,
        hasToken: !!token,
        tokenLength: token.length
      })
      
      // Use window.location.replace instead of window.location.href for a cleaner redirect
      window.location.replace(`${redirectUri.value}?token=${encodeURIComponent(token)}`)
    } else {
      error.value = 'Failed to generate token'
    }
  }
}

// OAuth login handler with redirect URI support
const handleOAuthLogin = (provider: 'google' | 'github' | 'apple') => {
  if (!redirectUri.value) {
    error.value = 'No valid redirect URI provided'
    return
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005/api'
  // Include the redirect_uri parameter in the OAuth request
  window.location.href = `${apiUrl}/auth/${provider}?redirect_uri=${encodeURIComponent(redirectUri.value)}`
}
</script>

<style scoped>
/* Add any specific styles here */
</style> 