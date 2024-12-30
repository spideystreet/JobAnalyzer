<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createOffer, checkOfferExists } from '@/services/offers'
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

const StatusIcons = {
  pending: {
    text: 'En attente...',
    component: defineComponent({
      name: 'PendingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M12 6v6l4 2',
            stroke: 'url(#pendingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('circle', {
            cx: 12,
            cy: 12,
            r: 9,
            stroke: 'url(#pendingGradient)',
            'stroke-width': 2
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'pendingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  connecting: {
    text: 'Connexion au site de l\'offre...',
    component: defineComponent({
      name: 'ConnectingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
            stroke: 'url(#connectingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('path', {
            d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
            stroke: 'url(#connectingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'connectingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  extracting: {
    text: 'Extraction du contenu de l\'offre...',
    component: defineComponent({
      name: 'ExtractingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
            stroke: 'url(#extractingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'extractingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  parsing: {
    text: 'Analyse du contexte et des prérequis...',
    component: defineComponent({
      name: 'ParsingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M22 12h-4l-3 9L9 3l-3 9H2',
            stroke: 'url(#parsingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'parsingGradient',
              x1: 2,
              y1: 12,
              x2: 22,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  analyzing: {
    text: 'Analyse approfondie par IA des compétences...',
    component: defineComponent({
      name: 'AnalyzingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z',
            stroke: 'url(#analyzingGradient)',
            'stroke-width': 2
          }),
          h('path', {
            d: 'M12 6v6l4 2',
            stroke: 'url(#analyzingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round'
          }),
          h('circle', {
            cx: 12,
            cy: 12,
            r: 1,
            fill: 'url(#analyzingGradient)'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'analyzingGradient',
              x1: 2,
              y1: 12,
              x2: 22,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  saving: {
    text: 'Sauvegarde et indexation...',
    component: defineComponent({
      name: 'SavingIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
            stroke: 'url(#savingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('path', {
            d: 'M17 21v-8H7v8M7 3v5h8',
            stroke: 'url(#savingGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'savingGradient',
              x1: 3,
              y1: 12,
              x2: 21,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  success: {
    text: 'Analyse terminée !',
    component: defineComponent({
      name: 'SuccessIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M20 6L9 17L4 12',
            stroke: 'url(#successGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'successGradient',
              x1: 4,
              y1: 12,
              x2: 20,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#00D1FF' }),
              h('stop', { offset: 1, 'stop-color': '#0047FF' })
            ])
          ])
        ])
      }
    })
  },
  error: {
    text: 'Erreur',
    component: defineComponent({
      name: 'ErrorIcon',
      setup() {
        return () => h('svg', {
          class: 'w-5 h-5',
          viewBox: '0 0 24 24',
          fill: 'none'
        }, [
          h('path', {
            d: 'M18 6L6 18M6 6l12 12',
            stroke: 'url(#errorGradient)',
            'stroke-width': 2,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
          }),
          h('defs', {}, [
            h('linearGradient', {
              id: 'errorGradient',
              x1: 6,
              y1: 12,
              x2: 18,
              y2: 12,
              gradientUnits: 'userSpaceOnUse'
            }, [
              h('stop', { 'stop-color': '#FF4D4D' }),
              h('stop', { offset: 1, 'stop-color': '#FF0000' })
            ])
          ])
        ])
      }
    })
  }
}

const statusMessages = {
  pending: { text: StatusIcons.pending.text },
  connecting: { text: StatusIcons.connecting.text },
  extracting: { text: StatusIcons.extracting.text },
  parsing: { text: StatusIcons.parsing.text },
  analyzing: { text: StatusIcons.analyzing.text },
  saving: { text: StatusIcons.saving.text },
  success: { text: StatusIcons.success.text },
  error: { text: StatusIcons.error.text }
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

const handleAddUrl = async () => {
  if (!isValidJobUrl(currentUrl.value)) {
    error.value = 'URL non valide. Utilisez LinkedIn, WTTJ, Indeed ou Free-work'
    setTimeout(clearFeedback, FEEDBACK_DURATION)
    return
  }

  try {
    // Vérifier si l'offre existe déjà pour cet utilisateur
    const exists = await checkOfferExists(currentUrl.value, auth.user?.uid || '')
    if (exists) {
      error.value = 'Cette offre a déjà été analysée'
      setTimeout(clearFeedback, FEEDBACK_DURATION)
      return
    }
    
    urlsList.value.unshift({
      url: currentUrl.value,
      status: 'pending'
    })
    currentUrl.value = ''
    hasAddedFirstUrl.value = true
  } catch (err) {
    error.value = 'Erreur lors de la vérification de l\'URL'
    setTimeout(clearFeedback, FEEDBACK_DURATION)
  }
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

// Modifier handleAnalyzeAll pour une meilleure gestion des états
const handleAnalyzeAll = async () => {
  try {
    // Vérifier toutes les URLs avant de commencer
    for (const urlItem of urlsList.value) {
      const exists = await checkOfferExists(urlItem.url, auth.user?.uid || '')
      if (exists) {
        urlItem.status = 'error'
        urlItem.message = 'Cette offre a déjà été analysée'
        error.value = `L'offre ${urlItem.url} a déjà été analysée`
        setTimeout(clearFeedback, FEEDBACK_DURATION)
        return // Arrêter immédiatement le processus
      }
    }

    // Si on arrive ici, aucune URL n'existe déjà, on peut lancer l'analyse
    loading.value = true
    currentOfferIndex.value = 1
    totalOffers.value = urlsList.value.length
    
    for (const urlItem of urlsList.value) {
      try {
        loadingProgress.value = 0
        urlItem.status = 'connecting'
        
        const startTime = Date.now()
        const analysisPromise = createOffer(urlItem.url, auth.user?.uid || '')
        
        const progressSteps = [
          { status: 'connecting' as const, start: 0, end: 20, duration: 750 },
          { status: 'extracting' as const, start: 20, end: 40, duration: 1500 },
          { status: 'parsing' as const, start: 40, end: 60, duration: 2000 },
          { status: 'analyzing' as const, start: 60, end: 80, duration: 2000 },
          { status: 'saving' as const, start: 80, end: 98, duration: 1000 }
        ]
        
        for (const step of progressSteps) {
          urlItem.status = step.status
          await animateProgress(step.start, step.end, step.duration)
        }
        
        const result = await analysisPromise
        
        if (result.status === 'completed') {
          // Finir l'animation immédiatement
          await animateProgress(loadingProgress.value, 100, 250)
          urlItem.status = 'success'
        }
        
        if (currentOfferIndex.value < totalOffers.value) {
          currentOfferIndex.value++
        }
        
      } catch (err: any) {
        console.error('Error in analysis:', err)
        urlItem.status = 'error'
        urlItem.message = 'Erreur lors de l\'analyse'
        error.value = `Erreur pour l'URL ${urlItem.url}: ${err.message}`
        setTimeout(clearFeedback, FEEDBACK_DURATION)
        
        if (currentOfferIndex.value < totalOffers.value) {
          currentOfferIndex.value++
        }
      }
    }
    
    loading.value = false
    emit('offer-added')
  } catch (err) {
    loading.value = false
    error.value = 'Erreur lors de la vérification des URLs'
    setTimeout(clearFeedback, FEEDBACK_DURATION)
  }
}

const handleBack = () => {
  hasAddedFirstUrl.value = false  // Revenir à l'état d'onboarding
  urlsList.value = []  // Optionnel : vider la liste des URLs
}

const buttonContent = computed(() => {
  if (!hasAddedFirstUrl.value) {
    return {
      icon: 'w-3.5 h-3.5',
      showText: true,
      buttonClass: 'min-w-[100px] h-10'
    }
  }
  return {
    icon: 'w-4 h-4',
    showText: false,
    buttonClass: 'w-10 h-10 rounded-full'
  }
})
</script>

<template>
  <div class="w-full relative">
    <!-- Container principal fixe -->
    <div class="relative min-h-[600px]">
      <!-- Transition globale entre onboarding et interface principale -->
      <Transition name="fade" mode="out-in">
        <!-- Vue 1 (onboarding) -->
        <div v-if="!hasAddedFirstUrl" key="onboarding" class="w-full">
          <div class="relative bg-[#111111]/80 backdrop-blur-xl rounded-xl border border-white/10 min-h-[600px] flex flex-col justify-between overflow-hidden">
            <!-- Effet de gradient -->
            <div class="absolute -inset-[50%] opacity-20">
              <div class="absolute top-0 -left-[25%] w-[150%] h-[100%] bg-gradient-to-r from-[#0B1EDC] via-[#00D1FF] to-[#0047FF] blur-[80px] animate-slow-spin" />
            </div>
            
            <!-- En-tête avec description étendue -->
            <div class="relative z-10 p-8 text-center">
              <h3 class="text-2xl font-semibold text-white mb-4">
                Commencez en quelques étapes simples
              </h3>
              <p class="text-base text-white/70 max-w-2xl mx-auto">
                Optimisez votre recherche d'emploi avec notre analyse IA avancée. Obtenez des insights détaillés sur les offres, comprenez les exigences clés et prenez des décisions éclairées pour votre carrière.
              </p>
            </div>
            
            <!-- Cartes -->
            <div class="relative z-10 px-8">
              <div class="grid gap-6 md:grid-cols-3">
                <div 
                  v-for="(step, index) in steps" 
                  :key="index"
                  class="relative flex flex-col items-center justify-center p-6 rounded-xl bg-black/40 backdrop-blur-sm border border-white/5 min-h-[200px] transition-all duration-300 hover:border-white/20 group"
                >
                  <!-- Badge numéroté -->
                  <div class="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-gradient-to-r from-[#00D1FF] to-[#0047FF] flex items-center justify-center text-white font-medium shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    {{ index + 1 }}
                  </div>
                  
                  <!-- Contenu -->
                  <div class="flex flex-col items-center justify-center space-y-4 text-center">
                    <div class="text-3xl bg-gradient-to-r from-[#00D1FF] to-[#0047FF] bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300">
                      {{ step.icon }}
                    </div>
                    <h4 class="text-lg font-medium text-white">
                      {{ step.title }}
                    </h4>
                    <p class="text-sm text-gray-400">
                      {{ step.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section avantages -->
            <div class="relative z-10 px-8 py-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-start gap-3 p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
                  <div class="text-[#00D1FF]">✨</div>
                  <div>
                    <h5 class="text-sm font-medium text-white mb-1">Analyse intelligente</h5>
                    <p class="text-xs text-white/60">Détection automatique des compétences requises et des points clés de l'offre</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
                  <div class="text-[#00D1FF]">🎯</div>
                  <div>
                    <h5 class="text-sm font-medium text-white mb-1">Comparaison avancée</h5>
                    <p class="text-xs text-white/60">Comparez facilement plusieurs offres pour faire le meilleur choix</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- URL Input de l'onboarding -->
            <div class="relative z-10 px-8 pb-8">
              <form @submit.prevent="handleAddUrl" class="flex bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
                <input
                  v-model="currentUrl"
                  type="url"
                  placeholder="Collez l'URL de l'offre ici..."
                  required
                  class="flex-1 h-12 bg-transparent border-0 text-white placeholder-white/40 focus:ring-0 focus:outline-none px-4"
                />
                <Button 
                  type="submit"
                  variant="primary"
                  size="md"
                  class="m-1 bg-gradient-to-r from-[#00D1FF] to-[#0047FF] hover:bg-gradient-to-r hover:from-[#33DAFF] hover:to-[#3369FF] transition-all duration-300"
                >
                  <span class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Commencer
                  </span>
                </Button>
              </form>
            </div>
          </div>
        </div>

        <!-- Container noir fixe (Vue 2 et 3) -->
        <div v-else key="main" class="w-full">
          <div class="relative bg-[#111111]/80 backdrop-blur-xl rounded-xl border border-white/10 h-[600px] flex flex-col">
            <!-- Effet de gradient -->
            <div class="absolute -inset-[50%] opacity-10">
              <div class="absolute top-0 -left-[25%] w-[150%] h-[100%] bg-gradient-to-r from-[#0B1EDC] via-[#00D1FF] to-[#0047FF] blur-[80px] animate-slow-spin" />
            </div>

            <!-- Transition interne entre vue 2 et 3 -->
            <Transition name="inner-fade" mode="out-in">
              <!-- Vue 2 - Liste des URLs -->
              <div v-if="!loading" key="urls-list" class="relative z-10 flex flex-col h-full">
                <!-- En-tête avec description -->
                <div class="p-8">
                  <h2 class="text-2xl font-semibold text-white mb-3">
                    Analysez vos offres d'emploi
                  </h2>
                  <p class="text-base text-white/70 max-w-2xl">
                    Notre IA va analyser en détail chaque offre pour vous fournir des insights pertinents. 
                    Ajoutez autant d'offres que vous le souhaitez pour une analyse complète.
                  </p>
                </div>

                <!-- Section des plateformes supportées -->
                <div class="px-8 pb-6">
                  <h4 class="text-sm font-medium text-white/60 mb-3">Plateformes supportées :</h4>
                  <div class="flex gap-4">
                    <div class="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      <span class="text-sm text-white">LinkedIn</span>
                    </div>
                    <div class="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      <span class="text-sm text-white">WTTJ</span>
                    </div>
                    <div class="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      <span class="text-sm text-white">Indeed</span>
                    </div>
                    <div class="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      <span class="text-sm text-white">Free-work</span>
                    </div>
                  </div>
                </div>

                <!-- URL Input intégré -->
                <div class="px-8">
                  <form @submit.prevent="handleAddUrl" class="flex bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
                    <input
                      v-model="currentUrl"
                      type="url"
                      placeholder="Collez l'URL de l'offre ici..."
                      required
                      class="flex-1 h-12 bg-transparent border-0 text-white placeholder-white/40 focus:ring-0 focus:outline-none px-4"
                    />
                    <Button 
                      type="submit"
                      variant="primary"
                      size="md"
                      class="m-1 bg-gradient-to-r from-[#00D1FF] to-[#0047FF] hover:bg-gradient-to-r hover:from-[#33DAFF] hover:to-[#3369FF] transition-all duration-300"
                    >
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Ajouter
                      </span>
                    </Button>
                  </form>
                </div>

                <!-- Container principal avec défilement -->
                <div class="flex-1 flex flex-col px-6 pt-4 overflow-hidden">
                  <!-- En-tête de la liste -->
                  <div class="mb-4 flex items-center justify-between">
                    <div>
                      <h4 class="text-lg font-medium text-white">
                        Liste des offres
                      </h4>
                      <p class="text-sm text-white/60 mt-1">
                        {{ urlsList.length }} offre(s) ajoutée(s)
                      </p>
                    </div>
                    <div v-if="urlsList.length > 0" class="flex items-center gap-2">
                      <span class="text-sm text-white/60">Actions rapides :</span>
                      <Button 
                        variant="outline"
                        size="sm"
                        class="text-sm"
                        @click="urlsList = []"
                      >
                        Tout effacer
                      </Button>
                    </div>
                  </div>

                  <!-- Zone défilante pour la liste -->
                  <div class="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                    <div class="space-y-3 pr-2">
                      <TransitionGroup name="list" tag="div">
                        <div 
                          v-for="(item, index) in urlsList" 
                          :key="item.url"
                          class="group flex items-center gap-4 p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-white/20"
                          :class="{
                            'border-[#00D1FF]/30 shadow-[0_0_15px_rgba(0,209,255,0.1)]': loading && currentOfferIndex === index + 1
                          }"
                        >
                          <!-- Status Icon -->
                          <div class="flex-shrink-0">
                            <div 
                              v-if="loading && currentOfferIndex === index + 1"
                              class="flex items-center gap-2 bg-gradient-to-r from-[#00D1FF]/10 to-[#0047FF]/10 px-4 py-2 rounded-lg"
                            >
                              <component :is="StatusIcons[item.status].component" />
                              <span class="text-sm font-medium text-[#00D1FF] tabular-nums">
                                {{ Math.round(loadingProgress) }}%
                              </span>
                            </div>
                            <div 
                              v-else
                              class="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5"
                            >
                              <component :is="StatusIcons[item.status].component" />
                            </div>
                          </div>

                          <!-- URL -->
                          <div class="flex-1 min-w-0">
                            <p class="text-sm text-white/90 truncate font-medium">{{ item.url }}</p>
                            <p class="text-xs text-white/50 mt-1">
                              {{ statusMessages[item.status].text }}
                            </p>
                            <!-- Progress bar -->
                            <div 
                              v-if="loading && currentOfferIndex === index + 1"
                              class="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden"
                            >
                              <div 
                                class="h-full bg-gradient-to-r from-[#00D1FF] to-[#0047FF] transition-all duration-300 ease-out"
                                :style="{ width: `${loadingProgress}%` }"
                              />
                            </div>
                          </div>

                          <!-- Delete Button -->
                          <button 
                            v-if="!loading || currentOfferIndex !== index + 1"
                            @click="urlsList.splice(index, 1)"
                            class="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-white/10 rounded-lg"
                          >
                            <svg class="w-4 h-4 text-white/70 hover:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </TransitionGroup>

                      <!-- Message liste vide -->
                      <div v-if="urlsList.length === 0" class="h-full flex flex-col items-center justify-center text-white/40">
                        <svg class="w-12 h-12 mb-4 stroke-current opacity-50" fill="none" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        <p class="text-sm">Ajoutez des URLs pour commencer l'analyse</p>
                      </div>
                    </div>
                  </div>

                  <!-- Actions fixes en bas -->
                  <div v-if="urlsList.length > 0" class="pt-6 mt-6 border-t border-white/5">
                    <div class="flex gap-3">
                      <Button 
                        variant="primary"
                        size="lg"
                        :loading="loading"
                        :disabled="loading"
                        class="flex-1 bg-gradient-to-r from-[#00D1FF] via-[#0047FF] to-[#0B1EDC] hover:bg-gradient-to-r hover:from-[#33DAFF] hover:via-[#3369FF] hover:to-[#3B4EE3] transition-all duration-300"
                        @click="handleAnalyzeAll"
                      >
                        <span class="flex items-center justify-center gap-2 text-white font-medium">
                          <svg v-if="!loading" class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" fill="url(#paint0_linear)" />
                            <defs>
                              <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white" />
                                <stop offset="1" stop-color="white" stop-opacity="0.8" />
                              </linearGradient>
                            </defs>
                          </svg>
                          {{ loading ? 'Analyse en cours...' : 'Analyser avec IA' }}
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
                </div>
              </div>

              <!-- Vue 3 - État d'analyse -->
              <div v-else key="analysis" class="relative z-10 flex flex-col h-full">
                <!-- En-tête fixe -->
                <div class="p-6 pb-4">
                  <div class="text-center">
                    <h3 class="text-xl font-medium text-white mb-2">
                      Analyse en cours...
                    </h3>
                    <p class="text-sm text-white/60">
                      Veuillez patienter pendant que nous analysons vos offres
                    </p>
                  </div>
                </div>

                <!-- Zone défilante pour la liste -->
                <div class="flex-1 overflow-y-auto custom-scrollbar px-6">
                  <div class="space-y-4">
                    <div 
                      v-for="(item, index) in urlsList" 
                      :key="item.url"
                      class="flex items-center gap-4 p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10"
                      :class="{
                        'border-[#00D1FF]/30 shadow-[0_0_15px_rgba(0,209,255,0.1)]': currentOfferIndex === index + 1
                      }"
                    >
                      <!-- Status Icon -->
                      <div class="flex-shrink-0">
                        <div class="flex items-center justify-center w-10 h-10 rounded-lg" :class="currentOfferIndex === index + 1 ? 'bg-[#00D1FF]/10' : 'bg-white/5'">
                          <component :is="StatusIcons[item.status].component" />
                        </div>
                      </div>

                      <!-- URL -->
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-white/90 truncate font-medium">{{ item.url }}</p>
                        <p class="text-xs text-white/50 mt-1">
                          {{ statusMessages[item.status].text }}
                        </p>
                      </div>

                      <!-- Progress -->
                      <div v-if="currentOfferIndex === index + 1" class="flex-shrink-0">
                        <span class="text-sm font-medium text-[#00D1FF] tabular-nums">
                          {{ Math.round(loadingProgress) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer fixe -->
                <div class="p-6 pt-4 border-t border-white/5">
                  <!-- Progress global -->
                  <div class="w-full max-w-md mx-auto mb-6">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm text-white/60">
                        Offre {{ currentOfferIndex }} sur {{ totalOffers }}
                      </span>
                      <span class="text-sm font-medium text-[#00D1FF]">
                        {{ Math.round(loadingProgress) }}%
                      </span>
                    </div>
                    <div class="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-gradient-to-r from-[#00D1FF] to-[#0047FF] transition-all duration-300 ease-out"
                        :style="{ width: `${loadingProgress}%` }"
                      />
                    </div>
                  </div>

                  <!-- Back Button -->
                  <div class="flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      class="min-w-[200px]"
                      @click="handleBack"
                    >
                      Retour
                    </Button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Transition globale */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* Transition interne */
.inner-fade-enter-active,
.inner-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.inner-fade-enter-from,
.inner-fade-leave-to {
  opacity: 0;
  transform: scale(0.99);
}

/* Animations pour la liste d'URLs */
.list-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: calc(100% - 6px);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-move {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Style personnalisé pour la scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: transparent;
}

/* Animation de redimensionnement du conteneur */
.relative.bg-\[\#111111\]\/80 {
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 