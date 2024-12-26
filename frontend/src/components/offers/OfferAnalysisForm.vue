<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createOffer } from '@/services/offers'
import Button from '@/components/ui/Button.vue'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/config/firebase'

const auth = useAuthStore()
const url = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const statusIcon = computed(() => {
  if (loading.value) return '⭕'
  if (error.value) return '❌'
  if (success.value) return '✅'
  return ''
})

const isValidJobUrl = (url: string): boolean => {
  const allowedDomains = [
    'linkedin.com',
    'welcometothejungle.com',
    'free-work.com',
    'indeed.com'
  ]
  
  try {
    const urlObj = new URL(url)
    return allowedDomains.some(domain => urlObj.hostname.includes(domain))
  } catch {
    return false
  }
}

const analyzeOffer = async (url: string) => {
  const analyze = httpsCallable<{ url: string }, any>(
    functions,
    'analyze_job'
  )
  // ...
}

const handleSubmit = async () => {
  error.value = ''
  success.value = false
  
  if (!isValidJobUrl(url.value)) {
    error.value = 'URL non valide. Utilisez LinkedIn, WTTJ, Indeed ou Free-work'
    return
  }

  loading.value = true
  try {
    await createOffer(url.value, auth.user?.uid || '')
    success.value = true
    url.value = '' // Reset form
  } catch (e) {
    error.value = 'Erreur lors de l\'enregistrement de l\'offre'
    console.error('Error saving offer:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit" class="flex gap-3">
      <div class="flex-1 relative">
        <input
          v-model="url"
          type="url"
          class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10"
          :class="{
            'border-red-500': error,
            'border-green-500': success
          }"
          placeholder="Collez l'URL de l'offre ici..."
          required
        />
        <span 
          v-if="statusIcon"
          class="absolute right-3 top-1/2 -translate-y-1/2"
          :class="{
            'animate-spin': loading
          }"
        >
          {{ statusIcon }}
        </span>
        <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
      </div>
      <Button 
        type="submit"
        variant="primary"
        :disabled="loading"
        class="px-2 py-2"
      >
        {{ loading ? 'Analyse...' : 'Analyser' }}
      </Button>
    </form>
  </div>
</template> 