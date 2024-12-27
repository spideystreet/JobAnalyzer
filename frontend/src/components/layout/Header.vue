<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import { computed } from 'vue'

const router = useRouter()
const auth = useAuthStore()

const handleLogout = async () => {
  await auth.signOut()
  router.push('/login')
}

const buttonText = computed(() => {
  return auth.user ? "Ajouter des offres d'emploi" : 'Commencer gratuitement'
})
</script>

<template>
  <header class="border-b">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="text-xl font-bold">
          Job<span class="text-primary">Analyzer</span>
        </a>
      </div>

      <!-- Navigation -->
      <nav class="flex items-center gap-4">
        <template v-if="auth.user">
          <Button 
            variant="ghost" 
            @click="router.push('/dashboard')"
          >
            {{ buttonText }}
          </Button>
          <span class="text-sm text-gray-500">{{ auth.user.email }}</span>
          <Button variant="ghost" @click="handleLogout">
            Déconnexion
          </Button>
        </template>
        <template v-else>
          <Button 
            variant="ghost" 
            @click="router.push('/login')"
            v-if="router.currentRoute.value.path !== '/login'"
          >
            Connexion
          </Button>
          <Button 
            variant="primary"
            @click="router.push('/login')"
            v-if="router.currentRoute.value.path === '/'"
            class="px-4 py-2 transform transition-all duration-300 hover:scale-105"
          >
            {{ buttonText }}
          </Button>
        </template>
      </nav>
    </div>
  </header>
</template> 