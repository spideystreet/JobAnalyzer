import { createRouter, createWebHistory } from 'vue-router'
import { authMiddleware } from './middleware'
import OnboardingView from '../views/onboarding/OnboardingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'onboarding',
      component: OnboardingView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('../views/analysis/AnalysisView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(authMiddleware)

export default router
