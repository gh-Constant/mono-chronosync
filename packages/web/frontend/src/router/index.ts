import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import OAuthCallbackView from '../views/OAuthCallbackView.vue'
import { useAuthStore } from '../stores/auth'
import { authService } from '../services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false } // Public route
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresAuth: false } // Public route
    },
    {
      path: '/oauth-callback',
      name: 'oauth-callback',
      component: OAuthCallbackView,
      meta: { requiresAuth: false } // Public route
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('../views/PrivacyPolicyView.vue'),
      meta: { requiresAuth: false } // Public route
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true } // Protected route
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true } // Protected route
    }
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Initialize auth service if needed
    const token = authService.getToken()
    
    // If no token, redirect to auth page
    if (!token) {
      next({ name: 'auth', query: { redirect: to.fullPath } })
    } else {
      // Token exists, proceed
      next()
    }
  } else {
    // Route doesn't require auth, proceed
    next()
  }
})

export default router
