import { defineStore } from 'pinia'
import { ref } from 'vue'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/config/firebase'

export interface AnalysisStatus {
  url: string
  status: 'pending' | 'connecting' | 'extracting' | 'parsing' | 'analyzing' | 'saving' | 'success' | 'error'
  message?: string
  progress?: number
}

export const useAnalysisStore = defineStore('analysis', () => {
  const urlsList = ref<AnalysisStatus[]>([])
  const isAnalyzing = ref(false)
  const currentProgress = ref(0)
  const error = ref('')

  const addUrl = (url: string) => {
    urlsList.value.push({
      url,
      status: 'pending'
    })
  }

  const updateUrlStatus = (url: string, status: AnalysisStatus['status'], message?: string) => {
    const index = urlsList.value.findIndex(item => item.url === url)
    if (index !== -1) {
      urlsList.value[index].status = status
      if (message) {
        urlsList.value[index].message = message
      }
    }
  }

  const updateProgress = (url: string, progress: number) => {
    const index = urlsList.value.findIndex(item => item.url === url)
    if (index !== -1) {
      urlsList.value[index].progress = progress
    }
    currentProgress.value = progress
  }

  const analyzeUrl = async (url: string, userId: string) => {
    const analyze = httpsCallable<{ url: string, userId: string }, any>(
      functions,
      'analyze_job'
    )

    try {
      updateUrlStatus(url, 'connecting')
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateProgress(url, 20)

      updateUrlStatus(url, 'extracting')
      const result = await analyze({ url, userId })
      updateProgress(url, 40)

      updateUrlStatus(url, 'analyzing')
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateProgress(url, 60)

      updateUrlStatus(url, 'saving')
      updateProgress(url, 80)

      updateUrlStatus(url, 'success')
      updateProgress(url, 100)

      return result.data
    } catch (err: any) {
      updateUrlStatus(url, 'error', err.message)
      error.value = `Erreur lors de l'analyse de l'offre : ${err.message}`
      throw err
    }
  }

  const clearUrls = () => {
    urlsList.value = []
    currentProgress.value = 0
    error.value = ''
  }

  const removeUrl = (url: string) => {
    const index = urlsList.value.findIndex(item => item.url === url)
    if (index !== -1) {
      urlsList.value.splice(index, 1)
    }
  }

  return {
    urlsList,
    isAnalyzing,
    currentProgress,
    error,
    addUrl,
    analyzeUrl,
    clearUrls,
    removeUrl,
    updateUrlStatus,
    updateProgress
  }
}) 