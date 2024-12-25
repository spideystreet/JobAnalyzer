<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'
import Alert from '@/components/ui/Alert.vue'

const router = useRouter()
const auth = useAuthStore()
const error = ref('')

const handleGoogleLogin = async () => {
  try {
    await auth.loginWithGoogle()
    router.push('/dashboard')
  } catch (e) {
    error.value = 'Erreur lors de la connexion avec Google'
  }
}
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center p-24">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold">Connexion</h2>
        <p class="mt-2 text-gray-600">
          Connectez-vous pour accéder à votre dashboard
        </p>
      </div>

      <div class="mt-8">
        <Button 
          @click="handleGoogleLogin"
          variant="outline" 
          size="lg"
          class="w-full flex items-center justify-center gap-3"
          :disabled="auth.loading"
        >
          <img 
            src="@/assets/google.svg" 
            alt="Google" 
            class="w-5 h-5"
          />
          {{ auth.loading ? 'Connexion...' : 'Continuer avec Google' }}
        </Button>
      </div>

      <Alert 
        v-if="error"
        type="error"
        :message="error"
        class="mt-4"
      />
    </div>
  </main>
</template> 