'use client'

import { useState, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Filters, { FilterState } from './components/Filters'
import OffersPerDayChart from './components/OffersPerDayChart'
import TechDistributionChart from './components/TechDistributionChart'
import ExperienceDistributionChart from './components/ExperienceDistributionChart'
import { useJobData } from '@/lib/supabase/hooks'
import { CompanyTypeTop } from './components/CompanyTypeTop'
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'

interface JobOffer {
  id: string
  COMPANY_TYPE: string | null
  created_at: string
  // autres propriétés si nécessaire
}

interface JobData {
  rawData: JobOffer[]
  tjmData: any[] // type spécifique pour tjmData si nécessaire
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function ErrorDisplay({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <h2 className="text-lg font-helvetica text-red-800 dark:text-red-200 mb-2">
        Une erreur est survenue lors du chargement des données
      </h2>
      <p className="text-red-600 dark:text-red-300 mb-4 font-helvetica">
        {error instanceof Error ? error.message : 'Erreur inconnue'}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors font-helvetica"
      >
        Réessayer
      </button>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}

function NoDataDisplay() {
  return (
    <div className="flex items-center justify-center h-[400px] text-gray-500 font-helvetica">
      Aucune donnée disponible pour les filtres sélectionnés
    </div>
  )
}

function DashboardContent() {
  const [filters, setFilters] = useState<FilterState>({
    technologies: [],
    experienceLevel: [],
    location: [],
    dateRange: [null, null]
  })

  const { data, isLoading, error, refetch } = useJobData(filters)
  
  const companyTypeStats = useMemo(() => {
    if (!data?.rawData) return []
    
    const stats = data.rawData.reduce<Record<string, number>>((acc, job) => {
      const type = job.COMPANY_TYPE || 'Non spécifié'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    return Object.entries(stats)
      .map(([company_type, count]) => ({ 
        company_type, 
        count 
      }))
      .sort((a, b) => b.count - a.count)
  }, [data?.rawData])

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <ErrorDisplay error={error} onRetry={refetch} />
        </div>
      </div>
    )
  }

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(0, 80, 100)"
      gradientBackgroundEnd="rgb(0, 45, 62)"
      firstColor="0, 187, 225"
      secondColor="0, 166, 225"
      thirdColor="0, 225, 210"
      fourthColor="0, 204, 225"
      fifthColor="0, 145, 186"
      pointerColor="120, 80, 225"
      blendingValue="screen"
      containerClassName="min-h-screen"
    >
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-helvetica mb-8 text-white drop-shadow-lg">
            Dashboard Freelance
          </h1>
          
          <div className="mb-8 p-4 bg-black/20 backdrop-blur-xl rounded-lg border border-white/10">
            <h2 className="text-2xl font-helvetica mb-4 text-white">Filtres</h2>
            <Filters onFilterChange={setFilters} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-4">
              <h3 className="text-xl font-helvetica mb-4 text-white">Distribution des Technologies</h3>
              {isLoading ? (
                <LoadingSpinner />
              ) : !data?.tjmData?.length ? (
                <NoDataDisplay />
              ) : (
                <TechDistributionChart data={data.tjmData} />
              )}
            </div>

            <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-4">
              <h3 className="text-xl font-helvetica mb-4 text-white">Distribution des Niveaux d'Expérience</h3>
              {isLoading ? (
                <LoadingSpinner />
              ) : !data?.rawData?.length ? (
                <NoDataDisplay />
              ) : (
                <ExperienceDistributionChart data={data.rawData} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompanyTypeTop data={companyTypeStats} />
            
            <div className="bg-black/20 backdrop-blur-xl rounded-lg border border-white/10 p-4">
              <h3 className="text-xl font-helvetica mb-4 text-white">Offres publiées par jour</h3>
              {isLoading ? (
                <LoadingSpinner />
              ) : !data?.rawData?.length ? (
                <NoDataDisplay />
              ) : (
                <OffersPerDayChart data={data.rawData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  )
}

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  )
} 
