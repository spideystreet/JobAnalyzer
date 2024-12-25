import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = useAuthStore()
  const isAuthRoute = to.meta.requiresAuth

  if (isAuthRoute && !auth.user) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (auth.user && to.name === 'login') {
    return next({ name: 'dashboard' })
  }

  next()
} 