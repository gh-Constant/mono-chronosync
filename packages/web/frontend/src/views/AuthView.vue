<template>
  <div class="font-sans text-gray-900 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white min-h-screen flex flex-col">
    <!-- Navigation with proper z-index -->
    <div class="relative z-50">
      <Navbar />
    </div>
    
    <!-- Split Screen Auth Container -->
    <div class="flex flex-1 flex-col lg:flex-row">
      <!-- Decorative Side - hidden on mobile, takes 1/2 width on large screens -->
      <div class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        <!-- Pattern overlay -->
        <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTU0LjYyNyAyMi41SDM3LjVhMi41IDIuNSAwIDAgMSAwLTVoMTkuMTI3YTcuNSA3LjUgMCAwIDAgNy41LTcuNXYtNUEyLjUgMi41IDAgMCAxIDY2LjYyNyAwSDY5djIuNWEyLjUgMi41IDAgMCAxLTUgMHYtLjEyN2wtLjEyNy4xMjctMTkuMTI3IDBhNy41IDcuNSAwIDAgMC03LjUgNy41djEwYTcuNSA3LjUgMCAwIDAgNy41IDcuNWgxOS4xMjdhMi41IDIuNSAwIDAgMSAwIDVINDkuNjI3YTcuNSA3LjUgMCAwIDAtNy41IDcuNXYxMGE3LjUgNy41IDAgMCAwIDcuNSA3LjVoMTcuMzI1TTI4Ljc1IDQ0Ljc1czEuNSAxLjUgMS41IDUuMjVIOTBWMjBIMzcuNWE3LjUgNy41IDAgMCAxLTcuNS03LjV2LTVhMi41IDIuNSAwIDAgMC0yLjUtMi41SDI1djVhMi41IDIuNSAwIDAgMS01IDB2LTVIMTVWMTBIMHY1YTIuNSAyLjUgMCAwIDEtNSAwdi01SDIwdjVhMi41IDIuNSAwIDAgMCAyLjUgMi41aDJjNS41MjMgMCAxMCA0LjQ3NyAxMCAxMHYxNy4yNXMtMTAuNzUgMS41LTEuNSAxMGgxLjI1VjUwSDI5djQuNzVoLS4yNXoiLz48L2c+PC9zdmc+')]"></div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col items-center justify-center w-full p-8 sm:p-12 text-white">
          <div class="max-w-md text-center">
            <div class="mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <div class="w-4 h-4 bg-purple-600 rounded-full"></div>
                </div>
              </div>
              <h2 class="text-3xl font-extrabold mb-2">Chrono<span class="text-purple-600">sync</span></h2>
              <p class="text-xl font-light text-white/90">Master your digital time</p>
            </div>
            
            <div class="space-y-6">
              <div class="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                <div class="flex items-start">
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
                <div class="flex items-start">
                  <div class="flex-shrink-0 bg-white/20 rounded-lg p-3">
                    <lock-icon class="w-6 h-6" />
                  </div>
                  <div class="ml-4 text-left">
                    <h3 class="text-lg font-semibold mb-1">Privacy First</h3>
                    <p class="text-white/80">Your data is always secure, private, and under your control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Auth Form Side - full width on mobile, 1/2 width on large screens -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div class="w-full max-w-md py-4 md:py-8">
          <!-- Auth Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <!-- Card Header with Logo -->
            <div class="p-6 sm:p-8 text-center">
              <!-- Mobile logo - only visible on mobile and medium screens -->
              <div class="inline-flex items-center gap-2 mb-6 lg:hidden">
                <div class="relative w-8 h-8">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  <div class="absolute inset-1 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <div class="w-4 h-4 bg-purple-600 rounded-full"></div>
                  </div>
                </div>
                <span class="text-xl font-bold tracking-tight">Chrono<span class="text-purple-600">sync</span></span>
              </div>
              
              <h2 class="text-xl md:text-2xl lg:text-3xl font-extrabold mb-3 tracking-tight">
                {{ activeTab === 'login' ? 'Welcome back' : 'Create your account' }}
              </h2>
              <p class="text-gray-600 dark:text-gray-400 mb-5 text-sm sm:text-base font-light">
                {{ activeTab === 'login' ? 'Enter your credentials to access your account' : 'Join thousands of users to boost productivity' }}
              </p>
              
              <!-- Tab switcher -->
              <div class="bg-gray-100 dark:bg-gray-900 rounded-full p-1 flex mb-6">
                <button @click="activeTab = 'login'" 
                        :class="[
                          'w-1/2 py-2 md:py-2.5 rounded-full text-sm font-medium transition-all',
                          activeTab === 'login' 
                            ? 'bg-white dark:bg-gray-800 shadow-sm text-purple-600 dark:text-purple-400' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                        ]">
                  Log In
                </button>
                <button @click="activeTab = 'signup'" 
                        :class="[
                          'w-1/2 py-2 md:py-2.5 rounded-full text-sm font-medium transition-all',
                          activeTab === 'signup' 
                            ? 'bg-white dark:bg-gray-800 shadow-sm text-purple-600 dark:text-purple-400' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                        ]">
                  Sign Up
                </button>
              </div>
            </div>
            
            <!-- Card Body -->
            <div class="px-6 sm:px-8 pb-6 sm:pb-8">
              <!-- Social Login Section -->
              <div class="mb-5">
                <div class="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    @click="handleOAuthLogin('google')"
                    class="flex justify-center py-2 sm:py-2.5 px-2 sm:px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors items-center"
                  >
                    <google-icon class="w-5 h-5" />
                  </button>
                  <button
                    disabled
                    title="Apple Sign In coming soon"
                    class="flex justify-center py-2 sm:py-2.5 px-2 sm:px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 opacity-50 cursor-not-allowed items-center"
                  >
                    <apple-icon class="w-5 h-5" />
                  </button>
                  <button
                    @click="handleOAuthLogin('github')"
                    class="flex justify-center py-2 sm:py-2.5 px-2 sm:px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors items-center"
                  >
                    <github-icon class="w-5 h-5" />
                  </button>
                </div>
                
                <div class="relative flex items-center mt-5 mb-5">
                  <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                  <span class="flex-shrink-0 mx-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">or continue with email</span>
                  <div class="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>
              </div>
              
              <!-- Login Form -->
              <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
                <div>
                  <label for="login-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
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
                  <div class="flex justify-between mb-1">
                    <label for="login-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <a href="#" class="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium">Forgot?</a>
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
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                  <span v-else>Log In</span>
                </button>
              </form>
              
              <!-- Signup Form -->
              <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="space-y-4">
                <!-- Error Alert -->
                <div v-if="error" class="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                        There was an error with your submission
                      </h3>
                      <div class="mt-1 text-xs sm:text-sm text-red-700 dark:text-red-300">
                        <p v-for="(line, index) in error.split('\n')" :key="index">{{ line }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label for="signup-username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <input 
                    id="signup-username" 
                    v-model="signupForm.name"
                    type="text" 
                    required
                    :disabled="isLoading"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                    placeholder="johndoe"
                  />
                </div>
                
                <div>
                  <label for="signup-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <mail-icon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="signup-email" 
                      v-model="signupForm.email" 
                      type="email" 
                      required
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label for="signup-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <lock-icon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="signup-password" 
                      v-model="signupForm.password" 
                      type="password" 
                      required
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <p class="mt-1 text-2xs sm:text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <shield-check-icon class="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                    Must be at least 8 characters with a number and special character
                  </p>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="agree-terms"
                    v-model="signupForm.agreeTerms"
                    type="checkbox"
                    required
                    class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label for="agree-terms" class="ml-2 block text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    I agree to the <a href="#" class="text-purple-600 dark:text-purple-400 hover:underline font-medium">Terms</a> and <a href="#" class="text-purple-600 dark:text-purple-400 hover:underline font-medium">Privacy Policy</a>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  :disabled="isLoading || !signupForm.agreeTerms"
                  class="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isLoading" class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                  <span v-else>Create Account</span>
                </button>
              </form>
            </div>
            
            <!-- Mobile Footer -->
            <div class="lg:hidden p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {{ activeTab === 'login' ? "Don't have an account?" : "Already have an account?" }}
              <button 
                @click="activeTab = activeTab === 'login' ? 'signup' : 'login'"
                class="text-purple-600 dark:text-purple-400 font-medium hover:underline focus:outline-none ml-1"
              >
                {{ activeTab === 'login' ? 'Sign up' : 'Log in' }}
              </button>
            </div>
          </div>
          
          <!-- Desktop Additional Info -->
          <p class="hidden lg:block mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
            By signing up, you agree to our Terms of Service and Privacy Policy.
            <br class="hidden sm:block" />
            We'll send you account related emails occasionally.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { 
  GithubIcon, ClockIcon, LockIcon, MailIcon, 
  ShieldCheckIcon, AppleIcon 
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import Navbar from '@/components/layout/Navbar.vue'

// Types
type OAuthProvider = 'google' | 'github' | 'apple'
interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}
interface SignupForm {
  name: string
  email: string
  password: string
  agreeTerms: boolean
}

// Router and route
const router = useRouter()
const route = useRoute()

// Auth store
const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)

// Active tab state (login or signup)
const activeTab = ref<'login' | 'signup'>('login')

// Login form state
const loginForm = ref<LoginForm>({
  email: '',
  password: '',
  rememberMe: false
})

// Signup form state
const signupForm = ref<SignupForm>({
  name: '',
  email: '',
  password: '',
  agreeTerms: false
})

// Set the active tab based on URL query parameter
onMounted(() => {
  const tabParam = route.query.tab
  if (tabParam === 'signup') {
    activeTab.value = 'signup'
  }
})

// Auth handlers
async function handleLogin(): Promise<void> {
  const { email, password, rememberMe } = loginForm.value
  const success = await authStore.login(email, password, rememberMe)
  
  if (success) {
    router.push('/oauth-callback')
  }
}

async function handleSignup(): Promise<void> {
  if (!signupForm.value.agreeTerms) {
    return
  }
  
  const { name, email, password } = signupForm.value
  const success = await authStore.signup(name, email, password)
  
  if (success) {
    router.push('/oauth-callback')
  }
}

function handleOAuthLogin(provider: OAuthProvider): void {
  // Get API URL from runtime config or fallback
  let apiUrl = 'http://localhost:3005/api'
  
  if (typeof window !== 'undefined' && window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.API_URL) {
    apiUrl = window.RUNTIME_CONFIG.API_URL
    
    // If the API URL is relative (starts with '/'), prepend the current origin
    if (apiUrl.startsWith('/') && typeof window !== 'undefined') {
      apiUrl = `${window.location.origin}${apiUrl}`
      console.log('AuthView: Using relative API URL from runtime config:', apiUrl)
    } else {
      console.log('AuthView: Using API URL from runtime config:', apiUrl)
    }
  } else if (import.meta.env.VITE_API_URL) {
    apiUrl = import.meta.env.VITE_API_URL
    console.log('AuthView: Using API URL from environment:', apiUrl)
  }
  
  window.location.href = `${apiUrl}/auth/${provider}`
}

// Custom Google icon since it's not in lucide-vue-next
const GoogleIcon = {
  name: 'GoogleIcon',
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '1em',
      height: '1em',
      fill: 'currentColor'
    }, [
      h('path', {
        d: 'M12.0003 4.7511C13.5909 4.7511 15.0355 5.3075 16.1228 6.28022L19.0889 3.31405C17.1492 1.5336 14.7999 0.475464 12.0003 0.475464C7.52249 0.475464 3.73244 3.14279 1.93695 7.0221L5.27568 9.50853C6.19032 6.75571 8.85635 4.7511 12.0003 4.7511Z',
        fill: '#EA4335'
      }),
      h('path', {
        d: 'M23.49 12.1903C23.49 11.382 23.4179 10.6069 23.2863 9.86456H12V14.354H18.4698C18.1835 15.7979 17.3517 17.0016 16.1226 17.815L19.1884 20.1698C21.4327 18.1242 23.49 15.4347 23.49 12.1903Z',
        fill: '#4285F4'
      }),
      h('path', {
        d: 'M5.27631 14.9629C5.03093 14.1763 4.8929 13.3461 4.8929 12.4899C4.8929 11.6338 5.03093 10.8035 5.2716 10.0169L1.93284 7.53052C1.10875 9.03916 0.639893 10.7449 0.639893 12.4899C0.639893 14.235 1.10875 15.9407 1.93284 17.4494L5.27631 14.9629Z',
        fill: '#FBBC05'
      }),
      h('path', {
        d: 'M12.0005 24.0001C15.1271 24.0001 17.735 22.93 19.5887 20.7739L16.1229 18.0451C15.0808 18.7741 13.7206 19.2206 12.0005 19.2206C8.86125 19.2206 6.19968 17.2251 5.27637 14.4772L1.93768 16.9401C3.73783 20.8194 7.5232 24.0001 12.0005 24.0001Z',
        fill: '#34A853'
      })
    ])
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.font-sans {
  font-family: var(--font-inter);
}

/* Toggle checkbox animations */
#remember-me:checked + div + div {
  transform: translateX(100%);
  background-color: rgb(124, 58, 237);
}

/* Micro-interactions */
input:focus {
  transform: translateY(-1px);
  transition: transform 0.2s ease-in-out;
}

button:active {
  transform: scale(0.98);
}

.bg-gradient-animation {
  background-size: 200% 200%;
  animation: gradientAnimation 5s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style> 