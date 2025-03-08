<template>
  <div class="font-sans text-gray-900 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white min-h-screen">
    <!-- Navigation -->
    <Navbar v-model:isDarkMode="isDarkMode" />

    <!-- Hero Section -->
    <section class="pt-32 pb-20 relative overflow-hidden bg-white dark:bg-black min-h-screen flex items-center">
      <!-- Background gradient and effects -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.03)_0%,rgba(0,0,0,0)_100%)]"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <!-- Hero Title -->
        <div class="max-w-5xl mx-auto text-center">
          <h1 ref="heroTitle" class="text-6xl md:text-8xl lg:text-9xl font-extrabold mb-8 text-gray-900 dark:text-white opacity-0 transform translate-y-8 tracking-tighter leading-[0.9]">
            Chrono<span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">sync</span>
          </h1>
          <p ref="heroSubtitle" class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto opacity-0 transform translate-y-8 font-light">
            Master Your Digital Time Across All Your Devices
          </p>
        </div>

        <!-- CTA Buttons -->
        <div ref="heroCta" class="max-w-4xl mx-auto text-center mt-8 opacity-0 transform translate-y-8">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/auth" class="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity shadow-md inline-block">
              Start tracking now
            </router-link>
            <button class="px-8 py-4 rounded-full border border-blue-200 dark:border-white/20 text-blue-600 dark:text-white font-medium hover:bg-blue-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <play-icon class="w-5 h-5" />
              Watch demo
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Overview -->
    <section class="py-20 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center mb-16">
          <h2 ref="featuresTitle" class="text-3xl md:text-4xl font-bold mb-6">Everything you need to boost productivity</h2>
          <p ref="featuresSubtitle" class="text-lg text-gray-600 dark:text-gray-300">
            Chronosync combines powerful features into one seamless experience, helping you focus on what matters most.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" ref="featureCards" 
               class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <component :is="feature.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Task Management Section -->
    <section class="py-20 relative overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <div class="lg:w-1/2" ref="taskContent">
            <div class="inline-block px-4 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium mb-4">
              Task Management
            </div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Never miss a deadline again</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Organize your tasks with intuitive drag-and-drop interfaces, priority levels, and smart reminders that adapt to your work patterns.
            </p>
            <ul class="space-y-4 mb-8">
              <li v-for="(item, index) in taskFeatures" :key="index" class="flex items-start gap-3">
                <div class="mt-1 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <check-icon class="w-3 h-3 text-green-600" />
                </div>
                <span>{{ item }}</span>
              </li>
            </ul>
            <button class="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2">
              Learn more
              <arrow-right-icon class="w-4 h-4" />
            </button>
          </div>
          <div class="lg:w-1/2" ref="taskImage">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl blur-3xl"></div>
              <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-4">
                <img src="/placeholder.svg" alt="Task Management Interface" class="w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Calendar Section -->
    <section class="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row-reverse items-center gap-12">
          <div class="lg:w-1/2" ref="calendarContent">
            <div class="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium mb-4">
              AI Calendar
            </div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Your schedule, intelligently optimized</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our AI-powered calendar learns your preferences and automatically suggests the best times for meetings, focus work, and breaks.
            </p>
            <ul class="space-y-4 mb-8">
              <li v-for="(item, index) in calendarFeatures" :key="index" class="flex items-start gap-3">
                <div class="mt-1 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <check-icon class="w-3 h-3 text-blue-600" />
                </div>
                <span>{{ item }}</span>
              </li>
            </ul>
            <button class="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2">
              Explore AI features
              <arrow-right-icon class="w-4 h-4" />
            </button>
          </div>
          <div class="lg:w-1/2" ref="calendarImage">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-xl blur-3xl"></div>
              <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-4">
                <img src="/placeholder.svg" alt="AI Calendar Interface" class="w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cross-Platform Sync Section -->
    <section class="py-20 relative overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center mb-16" ref="syncTitle">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Seamlessly synced across all devices</h2>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Your productivity shouldn't be limited by your device. Chronosync works perfectly on desktop, mobile, and tablet.
          </p>
        </div>
        
        <div class="relative" ref="deviceShowcase">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-xl blur-3xl"></div>
          <div class="relative flex justify-center items-end">
            <!-- Desktop -->
            <div class="bg-white dark:bg-gray-800 rounded-t-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl z-10">
              <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div class="p-4">
                <img src="/placeholder.svg" alt="Desktop Interface" class="w-full rounded-lg" />
              </div>
            </div>
            
            <!-- Mobile -->
            <div class="bg-white dark:bg-gray-800 rounded-t-xl shadow-xl border border-gray-200 dark:border-gray-700 w-64 ml-[-50px] mr-[-50px] z-20 transform translate-y-[-30px]">
              <div class="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded-b-xl mx-auto mb-2"></div>
              <div class="p-2">
                <img src="/placeholder.svg" alt="Mobile Interface" class="w-full rounded-lg" />
              </div>
            </div>
            
            <!-- Tablet -->
            <div class="bg-white dark:bg-gray-800 rounded-t-xl shadow-xl border border-gray-200 dark:border-gray-700 w-80 z-0">
              <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2"></div>
              <div class="p-3">
                <img src="/placeholder.svg" alt="Tablet Interface" class="w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-16 grid md:grid-cols-3 gap-8" ref="syncFeatures">
          <div v-for="(feature, index) in syncFeaturesList" :key="index" 
               class="text-center p-6">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <component :is="feature.icon" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Focus Mode & YouTube Blocker -->
    <section class="py-20 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 relative overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <div class="lg:w-1/2" ref="focusContent">
            <div class="inline-block px-4 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium mb-4">
              YouTube Productivity
            </div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Stay productive on YouTube</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our intelligent YouTube filter removes distracting content and keeps only educational and productive videos in your recommendations.
            </p>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-semibold">YouTube Features</h4>
                <button class="text-sm text-purple-600 dark:text-purple-400">Configure</button>
              </div>
              <div class="space-y-3">
                <div v-for="(feature, index) in youtubeFeatures" :key="index" 
                     class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div class="flex items-center gap-3">
                    <component :is="feature.icon" class="w-5 h-5 text-gray-500" />
                    <span>{{ feature.name }}</span>
                  </div>
                  <div class="w-12 h-6 bg-purple-600 rounded-full relative">
                    <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <button class="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2">
              Enable YouTube Filter
              <arrow-right-icon class="w-4 h-4" />
            </button>
          </div>
          <div class="lg:w-1/2" ref="focusImage">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-red-600/20 to-purple-600/20 rounded-xl blur-3xl"></div>
              <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <play-icon class="w-5 h-5 text-red-600" />
                    <span class="font-medium">YouTube Feed</span>
                  </div>
                  <div class="text-sm text-green-600 font-medium flex items-center gap-1">
                    <check-icon class="w-4 h-4" />
                    Filter Active
                  </div>
                </div>
                <div class="p-6">
                  <div class="space-y-4">
                    <div class="relative">
                      <img src="/placeholder.svg" alt="Educational Content" class="w-full rounded-lg" />
                      <div class="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Educational
                      </div>
                    </div>
                    <div class="relative opacity-40">
                      <img src="/placeholder.svg" alt="Entertainment Content" class="w-full rounded-lg" />
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-lg flex items-center gap-2">
                          <eye-off-icon class="w-5 h-5 text-red-600" />
                          <span class="text-red-600 font-medium">Non-productive content hidden</span>
                        </div>
                      </div>
                    </div>
                    <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <div class="flex items-center gap-2 text-red-600 font-medium mb-2">
                        <shield-check-icon class="w-5 h-5" />
                        Protected Features
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-sm rounded-full">Shorts Blocked</span>
                        <span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-sm rounded-full">Entertainment Hidden</span>
                        <span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-sm rounded-full">Comments Limited</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center mb-16" ref="testimonialsTitle">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Loved by productive people</h2>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            Join thousands of professionals who have transformed their workflow with Chronosync.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" ref="testimonials">
          <div v-for="(testimonial, index) in testimonialsList" :key="index" 
               class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div class="flex gap-1 mb-4">
              <star-icon v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-500" />
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">{{ testimonial.text }}</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <img :src="`/placeholder.svg`" :alt="testimonial.name" />
              </div>
              <div>
                <div class="font-medium">{{ testimonial.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-purple-600 to-indigo-600 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-white/10"></div>
      <div class="container mx-auto px-4 relative">
        <div class="max-w-3xl mx-auto text-center" ref="ctaContent">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to transform your productivity?</h2>
          <p class="text-xl opacity-90 mb-8">
            Join over 10,000 professionals who have already boosted their efficiency with Chronosync.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/auth?tab=signup" class="px-8 py-3 rounded-full bg-white text-purple-600 font-medium hover:opacity-90 transition-opacity inline-block">
              Start your free trial
            </router-link>
            <button class="px-8 py-3 rounded-full border border-white/30 font-medium hover:bg-white/10 transition-colors">
              Schedule a demo
            </button>
          </div>
          <p class="mt-6 text-sm opacity-80">No credit card required. 14-day free trial.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="relative w-8 h-8">
                <div class="absolute inset-0 bg-purple-600 rounded-full opacity-70"></div>
                <div class="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
                  <div class="w-4 h-4 bg-purple-600 rounded-full"></div>
                </div>
              </div>
              <span class="text-xl font-bold text-white">Chronosync</span>
            </div>
            <p class="text-sm text-gray-400 mb-4">
              The all-in-one productivity platform that adapts to your workflow.
            </p>
            <div class="flex gap-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <twitter-icon class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <instagram-icon class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <linkedin-icon class="w-5 h-5" />
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <github-icon class="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-white mb-4">Product</h3>
            <ul class="space-y-2">
              <li v-for="item in ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap']" :key="item">
                <a href="#" class="text-sm hover:text-white transition-colors">{{ item }}</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold text-white mb-4">Resources</h3>
            <ul class="space-y-2">
              <li v-for="item in ['Documentation', 'Tutorials', 'Blog', 'Support Center', 'API']" :key="item">
                <a href="#" class="text-sm hover:text-white transition-colors">{{ item }}</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold text-white mb-4">Company</h3>
            <ul class="space-y-2">
              <li v-for="item in ['About', 'Careers', 'Press', 'Contact', 'Legal']" :key="item">
                <a href="#" class="text-sm hover:text-white transition-colors">{{ item }}</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-gray-500">© 2025 Chronosync. All rights reserved.</p>
          <div class="flex gap-4 mt-4 md:mt-0">
            <a href="#" class="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" class="text-sm text-gray-500 hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { 
  PlayIcon, CheckIcon, ArrowRightIcon, 
  ClockIcon, LockIcon, StarIcon, TwitterIcon, 
  InstagramIcon, LinkedinIcon, GithubIcon, 
  ListTodoIcon, CalendarIcon, MonitorSmartphoneIcon as DevicesIcon, ZapIcon, CloudIcon,
  EyeOffIcon, ShieldCheckIcon
} from 'lucide-vue-next'
import Navbar from '@/components/layout/Navbar.vue'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

// State
const isDarkMode = ref(false)

// Function for cleanup
const cleanup = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill(false));
  gsap.killTweensOf('*');
};

// Refs for animations
const heroTitle = ref<HTMLElement | null>(null)
const heroSubtitle = ref<HTMLElement | null>(null)
const heroCta = ref<HTMLElement | null>(null)
const featureCards = ref<HTMLElement[]>([])
const taskContent = ref<HTMLElement | null>(null)
const taskImage = ref<HTMLElement | null>(null)
const calendarContent = ref<HTMLElement | null>(null)
const calendarImage = ref<HTMLElement | null>(null)
const syncTitle = ref<HTMLElement | null>(null)
const deviceShowcase = ref<HTMLElement | null>(null)
const syncFeatures = ref<HTMLElement | null>(null)
const focusContent = ref<HTMLElement | null>(null)
const focusImage = ref<HTMLElement | null>(null)
const testimonialsTitle = ref<HTMLElement | null>(null)
const testimonials = ref<HTMLElement | null>(null)
const ctaContent = ref<HTMLElement | null>(null)

// Features data
const features = [
  {
    title: 'Smart Task Management',
    description: 'Organize and prioritize your tasks with intelligent suggestions.',
    icon: CheckIcon
  },
  {
    title: 'AI Calendar',
    description: 'Let AI optimize your schedule for maximum productivity.',
    icon: ClockIcon
  },
  {
    title: 'Focus Mode',
    description: 'Block distractions and stay focused on what matters.',
    icon: PlayIcon
  }
]

const taskFeatures = [
  'Smart task prioritization',
  'Customizable workflows',
  'Real-time collaboration',
  'Progress tracking'
]

const calendarFeatures = [
  'AI-powered scheduling',
  'Meeting time suggestions',
  'Focus time blocks',
  'Calendar analytics'
]

const syncFeaturesList = [
  {
    title: 'Real-time sync',
    description: 'Changes reflect instantly across all your devices',
    icon: ArrowRightIcon
  },
  {
    title: 'Offline support',
    description: 'Keep working even without internet connection',
    icon: CheckIcon
  },
  {
    title: 'Secure backup',
    description: 'Your data is always safe and backed up',
    icon: ClockIcon
  }
]

const youtubeFeatures = [
  {
    name: 'Educational Content',
    icon: PlayIcon
  },
  {
    name: 'Entertainment Content',
    icon: ClockIcon
  },
  {
    name: 'Shorts Blocked',
    icon: PlayIcon
  },
  {
    name: 'Entertainment Hidden',
    icon: ClockIcon
  },
  {
    name: 'Comments Limited',
    icon: ArrowRightIcon
  }
]

// Testimonials
const testimonialsList = [
  {
    text: "Chronosync has completely transformed how I manage my time. The AI calendar is like having a personal assistant!",
    name: 'Sarah Johnson',
    role: 'Marketing Director'
  },
  {
    text: "The YouTube blocker alone has saved me countless hours of productivity. This app is a game-changer for focus.",
    name: 'Michael Chen',
    role: 'Software Engineer'
  },
  {
    text: "I love how seamlessly it syncs between my devices. I can start a task on my phone and finish it on my laptop without missing a beat.",
    name: 'Emma Rodriguez',
    role: 'Freelance Designer'
  },
  {
    text: "As a project manager, the task dependencies feature has been invaluable for keeping our team on track and meeting deadlines.",
    name: 'David Kim',
    role: 'Project Manager'
  },
  {
    text: "The AI calendar suggestions are surprisingly accurate. It's like the app knows exactly when I'm most productive!",
    name: 'Olivia Taylor',
    role: 'Content Creator'
  },
  {
    text: "I've tried dozens of productivity apps, but Chronosync is the only one that's stuck. It's intuitive, powerful, and actually helps me get more done.",
    name: 'James Wilson',
    role: 'Entrepreneur'
  }
]

// Hero animation sequence
const animateHero = () => {
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });
  
  // Title and subtitle with split text effect
  tl.to([heroTitle.value, heroSubtitle.value], {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out'
  });
  
  // Show CTA
  tl.to(heroCta.value, {
    opacity: 1,
    y: 0,
    duration: 0.6
  }, '-=0.3');
}

// Watch for dark mode changes
watch(isDarkMode, (newValue: boolean) => {
  // Handle dark mode changes
  document.documentElement.classList.toggle('dark', newValue)
})

onMounted(() => {
  // Start hero animation
  animateHero();

  // Features animations
  if (featureCards.value) {
    gsap.from(featureCards.value, {
      scrollTrigger: {
        trigger: featureCards.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          gsap.to(featureCards.value, { 
            opacity: 0, 
            y: 30, 
            duration: 0.3 // Fast reverse
          });
        }
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.2
    })
  }

  // Task section animations
  if (taskContent.value && taskImage.value) {
    const taskTl = gsap.timeline({
      scrollTrigger: {
        trigger: taskContent.value,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          // Speed up reverse animation
          gsap.to([taskContent.value, taskImage.value], { 
            opacity: 0, 
            duration: 0.3,
            stagger: 0.1
          });
        }
      }
    });
    
    taskTl
      .from(taskContent.value, {
        opacity: 0,
        x: -50,
        duration: 0.5
      })
      .from(taskImage.value, {
        opacity: 0,
        x: 50,
        duration: 0.5
      }, "-=0.3"); // Start slightly before the previous animation finishes
  }

  // Calendar section animations
  if (calendarContent.value && calendarImage.value) {
    const calendarTl = gsap.timeline({
      scrollTrigger: {
        trigger: calendarContent.value,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          // Speed up reverse animation
          gsap.to([calendarContent.value, calendarImage.value], { 
            opacity: 0, 
            duration: 0.3,
            stagger: 0.1
          });
        }
      }
    });
    
    calendarTl
      .from(calendarContent.value, {
        opacity: 0,
        x: 50,
        duration: 0.5
      })
      .from(calendarImage.value, {
        opacity: 0,
        x: -50,
        duration: 0.5
      }, "-=0.3");
  }

  // Sync section animations
  if (syncTitle.value && deviceShowcase.value && syncFeatures.value) {
    const syncTl = gsap.timeline({
      scrollTrigger: {
        trigger: syncTitle.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          // Speed up reverse animation
          gsap.to([syncTitle.value, deviceShowcase.value], { 
            opacity: 0, 
            duration: 0.3
          });
          if (syncFeatures.value) {
            gsap.to(syncFeatures.value.children, { 
              opacity: 0, 
              duration: 0.3,
              stagger: 0.05
            });
          }
        }
      }
    });
    
    syncTl
      .from(syncTitle.value, {
        opacity: 0,
        y: 30,
        duration: 0.5
      })
      .from(deviceShowcase.value, {
        opacity: 0,
        y: 50,
        duration: 0.6
      }, "-=0.2")
      .from(syncFeatures.value.children, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1
      }, "-=0.3");
  }

  // Focus section animations
  if (focusContent.value && focusImage.value) {
    const focusTl = gsap.timeline({
      scrollTrigger: {
        trigger: focusContent.value,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          // Speed up reverse animation
          gsap.to([focusContent.value, focusImage.value], { 
            opacity: 0, 
            duration: 0.3,
            stagger: 0.1
          });
        }
      }
    });
    
    focusTl
      .from(focusContent.value, {
        opacity: 0,
        x: -50,
        duration: 0.5
      })
      .from(focusImage.value, {
        opacity: 0,
        x: 50,
        duration: 0.5
      }, "-=0.3");
  }

  // Testimonials section animations
  if (testimonialsTitle.value && testimonials.value) {
    const testimonialsTl = gsap.timeline({
      scrollTrigger: {
        trigger: testimonialsTitle.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          // Speed up reverse animation
          gsap.to(testimonialsTitle.value, { 
            opacity: 0, 
            duration: 0.3
          });
          if (testimonials.value) {
            gsap.to(testimonials.value.children, { 
              opacity: 0, 
              duration: 0.3,
              stagger: 0.03
            });
          }
        }
      }
    });
    
    testimonialsTl
      .from(testimonialsTitle.value, {
        opacity: 0,
        y: 30,
        duration: 0.5
      })
      .from(testimonials.value.children, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.08 // Reduced stagger time for faster animation
      }, "-=0.2");
  }

  // CTA section animations
  if (ctaContent.value) {
    gsap.from(ctaContent.value, {
      scrollTrigger: {
        trigger: ctaContent.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          // Speed up reverse animation
          gsap.to(ctaContent.value, { 
            opacity: 0, 
            y: 30,
            duration: 0.3
          });
        }
      },
      opacity: 0,
      y: 30,
      duration: 0.5 // Slightly faster animation
    })
  }

  // Performance improvement: batch DOM read/writes
  ScrollTrigger.config({ syncInterval: 16 });
  
  // Register the cleanup function for later use
  // (The cleanup function is already defined at the top level of the component)
});

// Clean up function
onBeforeUnmount(() => {
  // Call our cleanup function to properly kill all animations
  cleanup();
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-geist: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.font-sans {
  font-family: var(--font-geist);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-geist);
}

.font-light {
  font-weight: 300;
}

.font-normal {
  font-weight: 400;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.font-extrabold {
  font-weight: 800;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
}
</style>

