<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { createOffer, checkOfferExists } from '@/services/offers'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/config/firebase'
import Toast from '@/components/ui/Toast.vue'
import UrlInput from './UrlInput.vue'
import AnalysisProgress from './AnalysisProgress.vue'

const auth = useAuthStore()
const loading = ref(false)
const error = ref('')
const success = ref(false)
const showToast = ref(false)

interface UrlStatus {
  url: string
  status: 'pending' | 'connecting' | 'extracting' | 'parsing' | 'analyzing' | 'saving' | 'success' | 'error'
  message?: string
}

const urlsList = ref<UrlStatus[]>([])

const analyzeOffer = async (url: string) => {
  const analyze = httpsCallable<{ url: string }, any>(
    functions,
    'analyze_job'
  )

  const urlStatus: UrlStatus = {
    url,
      status: 'pending'
  }
  urlsList.value.push(urlStatus)

  try {
    // Mise à jour du statut
    const updateStatus = (status: UrlStatus['status']) => {
      const index = urlsList.value.findIndex(item => item.url === url)
      if (index !== -1) {
        urlsList.value[index].status = status
      }
    }

    updateStatus('connecting')
    await new Promise(resolve => setTimeout(resolve, 1000))

    updateStatus('extracting')
    const result = await analyze({ url })

    updateStatus('analyzing')
    await new Promise(resolve => setTimeout(resolve, 1000))

    updateStatus('saving')
    const userId = auth.user?.uid || ''
    await createOffer(result.data, userId)

    updateStatus('success')
    emit('offer-added')
  } catch (err: any) {
    const index = urlsList.value.findIndex(item => item.url === url)
    if (index !== -1) {
      urlsList.value[index].status = 'error'
      urlsList.value[index].message = err.message
    }
    error.value = 'Erreur lors de l\'analyse de l\'offre'
    showToast.value = true
  }
}

const emit = defineEmits(['offer-added'])

const handleUrlAdded = async (url: string) => {
  const userId = auth.user?.uid || ''
  if (await checkOfferExists(url, userId)) {
    error.value = 'Cette offre a déjà été analysée'
    showToast.value = true
    return
  }
  analyzeOffer(url)
}
</script>

<template>
  <div class="space-y-6">
    <UrlInput @url-added="handleUrlAdded" />
    
    <AnalysisProgress :urls-list="urlsList" />

    <Toast
      v-if="error"
      type="error"
      :message="error"
      :show="showToast"
      @close="showToast = false"
    />
  </div>
</template>