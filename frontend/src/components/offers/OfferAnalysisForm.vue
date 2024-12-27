<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createOffer } from '@/services/offers'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/config/firebase'

const auth = useAuthStore()
const urls = ref<string[]>([])  // Array d'URLs au lieu d'une seule
const currentUrl = ref('')      // URL en cours de saisie
const loading = ref(false)
const error = ref('')
const success = ref(false)

const FEEDBACK_DURATION = 3000 // 3 secondes

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
  // ... à compléter
}

const emit = defineEmits(['offer-added'])

const clearFeedback = () => {
  error.value = ''
  success.value = false
}

const handleAddUrl = () => {
  if (!isValidJobUrl(currentUrl.value)) {
    error.value = 'URL non valide. Utilisez LinkedIn, WTTJ, Indeed ou Free-work'
    setTimeout(clearFeedback, FEEDBACK_DURATION)
    return
  }
  
  urls.value.push(currentUrl.value)
  currentUrl.value = ''  // Reset input
  success.value = true
  setTimeout(clearFeedback, FEEDBACK_DURATION)
}

const handleRemoveUrl = (index: number) => {
  urls.value.splice(index, 1)
}

const handleAnalyzeAll = async () => {
  loading.value = true
  
  try {
    for (const url of urls.value) {
      const response = await createOffer(url, auth.user?.uid || '')
      
      if (!response.success) {
        error.value = response.error
        setTimeout(clearFeedback, FEEDBACK_DURATION)
        continue
      }
    }
    urls.value = []  // Clear après succès
    emit('offer-added')
  } catch (e) {
    error.value = 'Erreur lors de l\'analyse des offres'
    console.error('Error analyzing offers:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Formulaire d'ajout -->
    <form @submit.prevent="handleAddUrl" class="flex gap-3">
      <div class="flex-1 relative">
        <input
          v-model="currentUrl"
          type="url"
          class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10"
          placeholder="Collez l'URL de l'offre ici..."
          required
        />
      </div>
      <Button 
        type="submit"
        variant="secondary"
      >
        Ajouter
      </Button>
    </form>

    <!-- Liste des URLs -->
    <div v-if="urls.length > 0" class="space-y-2">
      <div v-for="(url, index) in urls" :key="index"
        class="flex items-center justify-between p-2 bg-background-lighter rounded">
        <span class="text-sm truncate">{{ url }}</span>
        <button @click="handleRemoveUrl(index)" class="text-red-500">
          ❌
        </button>
      </div>
      
      <!-- Bouton d'analyse -->
      <Button 
        variant="primary"
        :disabled="loading"
        class="w-full mt-4"
        @click="handleAnalyzeAll"
      >
        <Spinner v-if="loading" size="sm" variant="white" class="mr-2" />
        {{ loading ? 'Analyse en cours...' : `Analyser ${urls.length} offre${urls.length > 1 ? 's' : ''}` }}
      </Button>
    </div>
  </div>
</template> 