import { createRouter, createWebHistory } from 'vue-router'
import { authMiddleware } from './middleware'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
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
