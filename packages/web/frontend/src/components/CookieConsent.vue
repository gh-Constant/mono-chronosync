<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showBanner = ref(false)
const showPreferences = ref(false)

// Cookie consent state
const cookieConsent = ref({
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  preferences: false
})

// Load consent from localStorage if available
onMounted(() => {
  const savedConsent = localStorage.getItem('cookie-consent')
  if (!savedConsent) {
    showBanner.value = true
  } else {
    try {
      const parsedConsent = JSON.parse(savedConsent)
      cookieConsent.value = { ...cookieConsent.value, ...parsedConsent }
    } catch (e) {
      // If parsing fails, show the banner again
      showBanner.value = true
    }
  }
})

// Save consent to localStorage
const saveConsent = () => {
  localStorage.setItem('cookie-consent', JSON.stringify(cookieConsent.value))
  showBanner.value = false
  showPreferences.value = false
}

// Accept all cookies
const acceptAll = () => {
  cookieConsent.value = {
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true
  }
  saveConsent()
}

// Accept only necessary cookies
const acceptNecessary = () => {
  cookieConsent.value = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  }
  saveConsent()
}

// Navigate to privacy policy
const goToPrivacyPolicy = () => {
  router.push('/privacy-policy')
  showBanner.value = false
}

// Toggle preferences panel
const togglePreferences = () => {
  showPreferences.value = !showPreferences.value
}
</script>

<template>
  <!-- Cookie Consent Banner -->
  <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 p-4 border-t border-gray-200 dark:border-gray-700">
    <div class="container mx-auto">
      <!-- Main Banner -->
      <div v-if="!showPreferences" class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nous respectons votre vie privée</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site, personnaliser le contenu et les publicités, 
            fournir des fonctionnalités de médias sociaux et analyser notre trafic. 
            <button @click="goToPrivacyPolicy" class="text-purple-600 dark:text-purple-400 underline">
              En savoir plus sur notre politique de confidentialité
            </button>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button @click="acceptNecessary" class="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Cookies essentiels uniquement
          </button>
          <button @click="togglePreferences" class="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Personnaliser
          </button>
          <button @click="acceptAll" class="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition">
            Accepter tous les cookies
          </button>
        </div>
      </div>

      <!-- Preferences Panel -->
      <div v-else class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Paramètres des cookies</h3>
          <button @click="togglePreferences" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <span class="sr-only">Fermer</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Cookie Categories -->
        <div class="space-y-3">
          <!-- Necessary Cookies -->
          <div class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">Cookies essentiels</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">Nécessaires au fonctionnement du site</p>
            </div>
            <div class="relative">
              <input type="checkbox" disabled checked class="sr-only" id="necessary" />
              <label for="necessary" class="flex items-center cursor-not-allowed">
                <div class="relative w-10 h-5 bg-purple-600 rounded-full shadow-inner"></div>
                <div class="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transform translate-x-5"></div>
              </label>
            </div>
          </div>

          <!-- Analytics Cookies -->
          <div class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">Cookies d'analyse</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">Nous aident à comprendre comment vous utilisez le site</p>
            </div>
            <div class="relative">
              <input type="checkbox" v-model="cookieConsent.analytics" class="sr-only" id="analytics" />
              <label for="analytics" class="flex items-center cursor-pointer">
                <div class="relative w-10 h-5 bg-gray-400 dark:bg-gray-600 rounded-full shadow-inner" :class="{ 'bg-purple-600': cookieConsent.analytics }"></div>
                <div class="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transform" :class="{ 'translate-x-5': cookieConsent.analytics }"></div>
              </label>
            </div>
          </div>

          <!-- Marketing Cookies -->
          <div class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">Cookies marketing</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">Utilisés pour vous montrer des publicités pertinentes</p>
            </div>
            <div class="relative">
              <input type="checkbox" v-model="cookieConsent.marketing" class="sr-only" id="marketing" />
              <label for="marketing" class="flex items-center cursor-pointer">
                <div class="relative w-10 h-5 bg-gray-400 dark:bg-gray-600 rounded-full shadow-inner" :class="{ 'bg-purple-600': cookieConsent.marketing }"></div>
                <div class="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transform" :class="{ 'translate-x-5': cookieConsent.marketing }"></div>
              </label>
            </div>
          </div>

          <!-- Preferences Cookies -->
          <div class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">Cookies de préférences</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">Permettent de mémoriser vos préférences</p>
            </div>
            <div class="relative">
              <input type="checkbox" v-model="cookieConsent.preferences" class="sr-only" id="preferences" />
              <label for="preferences" class="flex items-center cursor-pointer">
                <div class="relative w-10 h-5 bg-gray-400 dark:bg-gray-600 rounded-full shadow-inner" :class="{ 'bg-purple-600': cookieConsent.preferences }"></div>
                <div class="absolute left-1 top-1 bg-white w-3 h-3 rounded-full transform" :class="{ 'translate-x-5': cookieConsent.preferences }"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2">
          <button @click="acceptNecessary" class="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Refuser tout
          </button>
          <button @click="saveConsent" class="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition">
            Enregistrer les préférences
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 