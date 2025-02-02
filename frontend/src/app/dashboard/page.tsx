'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Filters, { FilterState } from './components/Filters'
import OffersPerDayChart from './components/OffersPerDayChart'
import TechDistributionChart from './components/TechDistributionChart'
import { useJobData } from '@/lib/supabase/hooks'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ErrorDisplay error={error} onRetry={refetch} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-helvetica mb-8">Dashboard Freelance</h1>
        
        <div className="mb-8 p-4 bg-card rounded-lg shadow">
          <h2 className="text-2xl font-helvetica mb-4">Filtres</h2>
          <Filters onFilterChange={setFilters} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-4 rounded-lg shadow">
            <h3 className="text-xl font-helvetica mb-4">Offres publiées par jour</h3>
            {isLoading ? (
              <LoadingSpinner />
            ) : !data?.rawData?.length ? (
              <NoDataDisplay />
            ) : (
              <OffersPerDayChart data={data.rawData} />
            )}
          </div>
          
          <div className="bg-card p-4 rounded-lg shadow">
            <h3 className="text-xl font-helvetica mb-4">Distribution des Technologies</h3>
            {isLoading ? (
              <LoadingSpinner />
            ) : !data?.tjmData?.length ? (
              <NoDataDisplay />
            ) : (
              <TechDistributionChart data={data.tjmData} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  )
} 
