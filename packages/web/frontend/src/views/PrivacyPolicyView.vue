<script setup lang="ts">
import { ref } from 'vue'
import { cookieService } from '@/services/cookieService'

const cookieConsent = ref(cookieService.getConsent())

// Save updated consent
const saveConsent = () => {
  cookieService.saveConsent(cookieConsent.value)
  cookieService.clearNonEssentialCookies()
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Politique de Confidentialité</h1>
    
    <div class="prose dark:prose-invert max-w-none">
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Introduction</h2>
        <p>
          Chez Chronosync, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles. 
          Cette politique de confidentialité vous informe sur la façon dont nous traitons vos données personnelles 
          lorsque vous visitez notre site web et vous informe de vos droits en matière de protection des données 
          conformément au Règlement Général sur la Protection des Données (RGPD).
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Qui sommes-nous</h2>
        <p>
          Chronosync est une application de productivité qui vous aide à gérer votre temps et vos tâches.
          Nous sommes responsables du traitement de vos données personnelles collectées via notre site web et notre application.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Les données que nous collectons</h2>
        <p>Nous pouvons collecter les types de données suivants :</p>
        <ul class="list-disc pl-6 mt-2 space-y-2">
          <li><strong>Données d'identité</strong> : prénom, nom, nom d'utilisateur</li>
          <li><strong>Données de contact</strong> : adresse e-mail</li>
          <li><strong>Données techniques</strong> : adresse IP, type et version du navigateur, fuseau horaire, système d'exploitation</li>
          <li><strong>Données d'utilisation</strong> : informations sur votre utilisation de notre site et application</li>
          <li><strong>Données de profil</strong> : vos préférences, retours et réponses aux enquêtes</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Comment nous utilisons vos données</h2>
        <p>Nous utilisons vos données personnelles uniquement lorsque la loi nous y autorise. Le plus souvent, nous utiliserons vos données personnelles dans les circonstances suivantes :</p>
        <ul class="list-disc pl-6 mt-2 space-y-2">
          <li>Pour exécuter le contrat que nous avons conclu avec vous</li>
          <li>Lorsque cela est nécessaire pour nos intérêts légitimes et que vos intérêts ne prévalent pas</li>
          <li>Lorsque nous devons nous conformer à une obligation légale</li>
          <li>Lorsque vous avez donné votre consentement</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Cookies et technologies similaires</h2>
        <p>
          Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site, 
          analyser notre trafic et personnaliser le contenu. Vous pouvez contrôler l'utilisation des cookies en 
          ajustant les paramètres ci-dessous ou les paramètres de votre navigateur.
        </p>
        
        <div class="mt-6 space-y-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 class="text-xl font-medium">Paramètres des cookies</h3>
          
          <!-- Cookie Categories -->
          <div class="space-y-3">
            <!-- Necessary Cookies -->
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded">
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
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded">
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
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded">
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
            <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded">
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

          <!-- Save Button -->
          <div class="flex justify-end">
            <button @click="saveConsent" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
              Enregistrer les préférences
            </button>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Vos droits</h2>
        <p>Selon le RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
        <ul class="list-disc pl-6 mt-2 space-y-2">
          <li><strong>Droit d'accès</strong> : Vous avez le droit d'obtenir une copie de vos données personnelles</li>
          <li><strong>Droit de rectification</strong> : Vous pouvez demander la correction de données inexactes</li>
          <li><strong>Droit à l'effacement</strong> : Vous pouvez demander la suppression de vos données dans certaines circonstances</li>
          <li><strong>Droit à la limitation du traitement</strong> : Vous pouvez demander de limiter le traitement de vos données</li>
          <li><strong>Droit à la portabilité des données</strong> : Vous pouvez demander le transfert de vos données</li>
          <li><strong>Droit d'opposition</strong> : Vous pouvez vous opposer au traitement de vos données</li>
          <li><strong>Droit de retirer votre consentement</strong> : Vous pouvez retirer votre consentement à tout moment</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Sécurité des données</h2>
        <p>
          Nous avons mis en place des mesures de sécurité appropriées pour empêcher que vos données personnelles 
          soient accidentellement perdues, utilisées ou consultées de manière non autorisée, modifiées ou divulguées. 
          De plus, nous limitons l'accès à vos données personnelles aux employés, agents, contractants et autres tiers 
          qui ont un besoin professionnel de les connaître.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Modifications de cette politique</h2>
        <p>
          Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
          Nous vous informerons de tout changement important en publiant la nouvelle politique 
          de confidentialité sur cette page et, si nécessaire, par e-mail.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">Nous contacter</h2>
        <p>
          Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques 
          en matière de protection des données, veuillez nous contacter à l'adresse suivante : 
          <a href="mailto:privacy@chronosync.app" class="text-purple-600 dark:text-purple-400 hover:underline">
            privacy@chronosync.app
          </a>
        </p>
      </section>
    </div>
  </div>
</template> 