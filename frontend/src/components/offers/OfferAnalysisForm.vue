<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createOffer, listenToProgress } from '@/services/offers'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/config/firebase'
import Input from '@/components/ui/Input.vue'
import Toast from '@/components/ui/Toast.vue'

const auth = useAuthStore()
const urls = ref<string[]>([])  // Array d'URLs au lieu d'une seule
const currentUrl = ref('')      // URL en cours de saisie
const loading = ref(false)
const error = ref('')
const success = ref(false)

const FEEDBACK_DURATION = 5000 // 5 secondes

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

const handleClearError = () => {
  clearFeedback()
}

interface UrlStatus {
  url: string
  status: 'pending' | 'connecting' | 'extracting' | 'parsing' | 'analyzing' | 'saving' | 'success' | 'error'
  message?: string
}

const urlsList = ref<UrlStatus[]>([])

const statusMessages = {
  pending: { text: 'En attente...', icon: '⏳' },
  connecting: { text: 'Connexion au site de l\'offre...', icon: '🔗' },
  extracting: { text: 'Extraction du contenu de l\'offre...', icon: '📥' },
  parsing: { text: 'Analyse du contexte et des prérequis...', icon: '🔍' },
  analyzing: { text: 'Analyse approfondie par IA des compétences...', icon: '🤖' },
  saving: { text: 'Sauvegarde et indexation...', icon: '💾' },
  success: { text: 'Analyse terminée !', icon: '✅' },
  error: { text: 'Erreur', icon: '❌' }
}

// État pour l'onboarding
const hasAddedFirstUrl = ref(false)

// Étapes de l'onboarding
const steps = [
  {
    title: "Ajoutez votre première offre",
    description: "Collez une URL d'offre LinkedIn, WTTJ, Indeed ou Free-work",
    icon: "🔗"
  },
  {
    title: "Notre IA analyse les détails",
    description: "Extraction automatique des informations clés",
    icon: "🤖"
  },
  {
    title: "Obtenez des insights",
    description: "Visualisez les tendances et prenez de meilleures décisions",
    icon: "📊"
  }
]

const handleAddUrl = () => {
  if (!isValidJobUrl(currentUrl.value)) {
    error.value = 'URL non valide. Utilisez LinkedIn, WTTJ, Indeed ou Free-work'
    setTimeout(clearFeedback, FEEDBACK_DURATION)
    return
  }
  
  urlsList.value.push({
    url: currentUrl.value,
    status: 'pending'
  })
  currentUrl.value = ''
  success.value = true
  hasAddedFirstUrl.value = true
  setTimeout(clearFeedback, FEEDBACK_DURATION)
}

// Ajout des refs pour le loading state
const loadingProgress = ref(0)

// Fonction pour animer la progression entre deux valeurs
const animateProgress = async (start: number, end: number, duration: number) => {
  const steps = duration / 30 // Update toutes les 30ms
  const increment = (end - start) / steps
  
  for (let i = 0; i <= steps; i++) {
    const progress = start + (i * increment)
    // Ajouter une petite variation aléatoire pour plus de réalisme
    const variation = (Math.random() - 0.5)
    loadingProgress.value = Math.min(Math.max(progress + variation, start), end)
    await new Promise(r => setTimeout(r, 30))
  }
}

// Ajout des refs pour le tracking des offres
const currentOfferIndex = ref(0)
const totalOffers = ref(0)

// Modifier handleAnalyzeAll pour initialiser le compteur
const handleAnalyzeAll = async () => {
  loading.value = true
  currentOfferIndex.value = 1
  totalOffers.value = urlsList.value.length
  
  for (const urlItem of urlsList.value) {
    try {
      loadingProgress.value = 0
      urlItem.status = 'connecting'
      
      // Simuler la progression de manière réaliste
      const progressSteps = [
        { status: 'connecting' as const, start: 0, end: 20, duration: 1000 },
        { status: 'extracting' as const, start: 20, end: 40, duration: 2000 },
        { status: 'parsing' as const, start: 40, end: 60, duration: 3000 },
        { status: 'analyzing' as const, start: 60, end: 80, duration: 4000 },
        { status: 'saving' as const, start: 80, end: 95, duration: 1000 }
      ]
      
      // Lancer l'analyse en parallèle
      const analysisPromise = createOffer(urlItem.url, auth.user?.uid || '')
      
      // Simuler la progression
      for (const step of progressSteps) {
        urlItem.status = step.status
        await animateProgress(step.start, step.end, step.duration)
      }
      
      // Attendre la fin de l'analyse réelle
      const result = await analysisPromise
      
      // Finaliser la progression
      if (result.status === 'completed') {
        loadingProgress.value = 100
        urlItem.status = 'success'
      }
      
      if (currentOfferIndex.value < totalOffers.value) {
        currentOfferIndex.value++
      }
      
    } catch (err: any) {
      console.error('Error in analysis:', err)
      urlItem.status = 'error'
      urlItem.message = err.code === 'functions/already-exists' 
        ? 'Offre déjà analysée'
        : 'Erreur lors de l\'analyse'
      error.value = `Erreur pour l'URL ${urlItem.url}: ${err.message}`
      setTimeout(clearFeedback, FEEDBACK_DURATION)
      
      if (currentOfferIndex.value < totalOffers.value) {
        currentOfferIndex.value++
      }
      continue
    }
  }
  
  loading.value = false
  emit('offer-added')
}

const handleBack = () => {
  hasAddedFirstUrl.value = false  // Revenir à l'état d'onboarding
  urlsList.value = []  // Optionnel : vider la liste des URLs
}
</script>

<template>
  <div class="w-full relative overflow-hidden">
    <!-- Container avec transition -->
    <Transition name="slide" mode="out-in">
      <!-- Onboarding View -->
      <div v-if="!hasAddedFirstUrl" key="onboarding" class="w-full">
        <!-- Contenu existant de l'onboarding -->
        <div class="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-gray-800 mb-8">
          <h3 class="text-xl font-medium text-white mb-6 text-center">
            Commencez en quelques étapes simples
          </h3>
          
          <div class="grid gap-6 md:grid-cols-3">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="relative flex flex-col items-center justify-center p-6 rounded-lg bg-gray-800-alpha min-h-[200px]"
            >
              <!-- Numéro de l'étape -->
              <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-medium">
                {{ index + 1 }}
              </div>
              
              <!-- Contenu centré -->
              <div class="flex flex-col items-center justify-center space-y-3 text-center">
                <!-- Icône -->
                <div class="text-3xl">{{ step.icon }}</div>
                
                <!-- Titre -->
                <h4 class="text-lg font-medium text-white">
                  {{ step.title }}
                </h4>
                
                <!-- Description -->
                <p class="text-sm text-gray-400">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- URL Input -->
        <div class="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-gray-800">
          <form @submit.prevent="handleAddUrl" class="flex gap-2">
            <!-- Input -->
            <div class="flex-1">
              <Input
                v-model="currentUrl"
                type="url"
                placeholder="Collez l'URL de l'offre ici..."
                :success="success"
                required
              />
            </div>

            <!-- Bouton Ajouter -->
            <Button 
              type="submit"
              variant="primary"
              size="md"
              class="w-[120px]"
            >
              <span class="flex items-center justify-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Ajouter
              </span>
            </Button>
          </form>
        </div>
      </div>

      <!-- Main Interface -->
      <div v-else key="main" class="w-full space-y-6">
        <!-- URL Input -->
        <div class="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-gray-800">
          <form @submit.prevent="handleAddUrl" class="flex gap-2">
            <!-- Input -->
            <div class="flex-1">
              <Input
                v-model="currentUrl"
                type="url"
                placeholder="Collez l'URL de l'offre ici..."
                :success="success"
                required
              />
            </div>

            <!-- Bouton Ajouter -->
            <Button 
              type="submit"
              variant="primary"
              size="md"
              class="w-[120px]"
            >
              <span class="flex items-center justify-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Ajouter
              </span>
            </Button>
          </form>
        </div>

        <!-- URLs List avec loading state intégré -->
        <TransitionGroup name="list" tag="div" class="space-y-2 mt-6">
          <div 
            v-for="(item, index) in urlsList" 
            :key="item.url"
            class="group flex items-center gap-3 p-3 rounded-lg bg-black/40 backdrop-blur-sm border border-white/5"
            :class="{
              'border-[#00D1FF]/20': loading && currentOfferIndex === index + 1
            }"
          >
            <!-- Status Icon ou Loading State -->
            <div class="flex-shrink-0">
              <div 
                v-if="loading && currentOfferIndex === index + 1"
                class="flex items-center gap-2 bg-[#00D1FF]/5 px-3 py-1.5 rounded-lg"
              >
                <span class="text-lg text-[#00D1FF]">{{ statusMessages[item.status].icon }}</span>
                <span class="text-xs font-medium text-[#00D1FF] tabular-nums">{{ Math.round(loadingProgress) }}%</span>
              </div>
              <div 
                v-else
                class="w-6 h-6 flex items-center justify-center rounded-full"
                :class="{
                  'bg-gray-100/10': item.status === 'pending',
                  'bg-green-100/10': item.status === 'success',
                  'bg-red-100/10': item.status === 'error'
                }"
              >
                <span class="text-sm">{{ statusMessages[item.status].icon }}</span>
              </div>
            </div>

            <!-- URL -->
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white/90 truncate">{{ item.url }}</p>
              <p class="text-xs text-white/50">
                {{ statusMessages[item.status].text }}
              </p>
              <!-- Progress bar -->
              <div 
                v-if="loading && currentOfferIndex === index + 1"
                class="mt-2 h-0.5 w-full bg-gray-700 rounded-full overflow-hidden"
              >
                <div 
                  class="h-full bg-gradient-to-r from-[#00D1FF] to-blue-500 transition-all duration-300 ease-out"
                  :style="{ width: `${loadingProgress}%` }"
                />
              </div>
            </div>

            <!-- Delete Button -->
            <button 
              v-if="!loading || currentOfferIndex !== index + 1"
              @click="urlsList.splice(index, 1)"
              class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 hover:bg-white/5 rounded-full"
            >
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>

          <!-- Global Progress -->
          <div 
            v-if="loading" 
            key="loading-global"
            class="flex items-center justify-center gap-2 text-xs text-[#00D1FF]/80 py-2"
          >
            <span>{{ currentOfferIndex }}/{{ totalOffers }} offres analysées</span>
          </div>
        </TransitionGroup>

        <!-- Actions -->
        <div v-if="urlsList.length > 0" class="flex gap-3 pt-4">
          <Button 
            variant="primary"
            size="lg"
            :loading="loading"
            :disabled="loading"
            class="flex-1 action-button text-white"
            @click="handleAnalyzeAll"
          >
            <span class="flex items-center justify-center gap-2 text-white font-medium">
              <span v-if="!loading">✨</span>
              {{ loading ? 'Analyse en cours...' : `Analyser avec IA` }}
            </span>
          </Button>
          
          <Button 
            variant="outline"
            size="md"
            class="px-4"
            @click="urlsList = []"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </Transition>

    <!-- Notifications -->
    <TransitionGroup 
      name="notifications" 
      tag="div" 
      class="fixed bottom-4 right-4 space-y-2 z-50"
    >
      <Toast
        v-if="error"
        key="error"
        type="error"
        :message="error"
        :show="!!error"
        @close="clearFeedback"
      />

      <Toast
        v-if="success"
        key="success"
        type="success"
        message="URL ajoutée avec succès"
        :show="success"
        @close="clearFeedback"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Animation de slide horizontal */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Animation globale de la page */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Pour que les éléments se chevauchent proprement pendant la transition */
.page-transition-move {
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

/* Ajustement pour une transition plus fluide */
.page-container.relative {
  min-height: 400px; /* Hauteur minimale pour éviter les sauts */
}

/* Style spécifique pour le bouton */
.action-button {
  position: relative;
  height: 2.5rem; /* équivalent à h-10 */
}

/* Animations pour les notifications */
.notifications-enter-active,
.notifications-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.notifications-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.notifications-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Animations pour la liste d'URLs */
.list-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Animation pour le hover des boutons */
.group:hover .group-hover\:opacity-100 {
  transition: opacity 0.2s ease;
}

.bg-gray-800-alpha {
  background-color: rgba(31, 41, 55, 0.5);
}

/* Animation plus smooth pour l'onboarding */
.bg-white\/5 {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation de sortie de l'onboarding */
.v-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.v-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Ajustement de la hauteur minimale pour les cartes */
.min-h-\[200px\] {
  min-height: 200px;
}

/* Animation plus douce pour l'onboarding */
.onboarding-enter-active,
.onboarding-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.onboarding-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.onboarding-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-shimmer-delayed {
  animation: shimmer 2s infinite;
  animation-delay: 1s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: .8;
    transform: scale(0.95);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Amélioration des transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(10px);
}

.animate-spin-slow {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 