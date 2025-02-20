'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Filters from './components/Filters'
import OffersPerDayChart from './components/OffersPerDayChart'
import TechDistributionChart from './components/TechDistributionChart'
import ExperienceDistributionChart from './components/ExperienceDistributionChart'
import { useJobData } from '@/lib/supabase/hooks'
import TopCompaniesChart from "./components/TopCompaniesChart"
import DomainDistributionChart from "./components/DomainDistributionChart"
import RegionTJMChart from "./components/RegionTJMChart"
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import { usePersistedFilters } from '@/lib/hooks/usePersistedFilters'
import { useStats } from '@/lib/hooks/useStats'
import { Button } from '@/components/ui/button-aremettre'
import { RefreshCw, FilterX, ArrowLeft, Smartphone } from 'lucide-react'
import { RiTwitterXFill, RiLinkedinFill, RiGithubFill } from "@remixicon/react"
import React from 'react'
import { EmptyState } from '@/components/ui/empty-state'
import Image from 'next/image'
import { motion } from 'framer-motion'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

function ErrorDisplay({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4" role="alert">
      <h2 className="text-lg font-helvetica text-red-800 dark:text-red-200 mb-2">
        Une erreur est survenue lors du chargement des données
      </h2>
      <p className="text-red-600 dark:text-red-300 mb-4 font-helvetica">
        {error instanceof Error ? error.message : 'Erreur inconnue'}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors font-helvetica"
        aria-label="Réessayer le chargement des données"
      >
        <RefreshCw className="w-4 h-4 mr-2 inline" />
        Réessayer
      </button>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[300px]" role="status">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-label="Chargement des données"></div>
    </div>
  )
}

function MobileMessage() {
  const socialUrls = {
    twitter: 'https://x.com/spideystreet',
    linkedin: 'https://www.linkedin.com/in/hicham-djebali-35bb271a2/',
    github: 'https://github.com/spideystreet'
  }

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black text-white flex flex-col items-center justify-center p-6">
      <motion.div 
        className="relative z-10 text-center space-y-6 max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="relative w-48 h-48 mx-auto mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image
            src="/images/SpideyCuisto.png"
            alt="Mobile version coming soon"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Smartphone className="w-16 h-16 mx-auto text-purple-400" />
          <h1 className="text-3xl font-bold font-helvetica mt-4">Version Mobile</h1>
          <p className="text-lg text-white/80 mt-2">
            Oops ! Pas encore disponible sur mobile.
            Mais ton fidèle Spidey est en train de préparer ça pour toi !
          </p>
        </motion.div>
        <motion.div 
          className="pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <p className="text-sm text-white/60 mb-3">
            Suivez l'avancement sur mes réseaux
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => handleSocialClick(socialUrls.twitter)} className="bg-white hover:bg-white/90 hover:scale-105 transition-transform" variant="outline" aria-label="X" size="icon">
              <RiTwitterXFill className="text-black" size={16} aria-hidden="true" />
            </Button>
            <Button onClick={() => handleSocialClick(socialUrls.linkedin)} className="bg-white hover:bg-white/90 hover:scale-105 transition-transform" variant="outline" aria-label="LinkedIn" size="icon">
              <RiLinkedinFill className="text-black" size={16} aria-hidden="true" />
            </Button>
            <Button onClick={() => handleSocialClick(socialUrls.github)} className="bg-white hover:bg-white/90 hover:scale-105 transition-transform" variant="outline" aria-label="GitHub" size="icon">
              <RiGithubFill className="text-black" size={16} aria-hidden="true" />
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="mt-6 bg-purple-500 hover:bg-purple-600 text-white border-none hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

function DashboardContent() {
  const { filters, updateFilters, resetFilters } = usePersistedFilters()
  const { data, isLoading, error, refetch } = useJobData(filters)
  const stats = useStats(data?.rawData)

  // Calculer les dates min et max à partir des données
  const { minDate, maxDate } = React.useMemo(() => {
    if (!data?.rawData?.length) return { minDate: undefined, maxDate: undefined }

    const dates = data.rawData
      .map(job => job.CREATED_AT ? new Date(job.CREATED_AT) : null)
      .filter((date): date is Date => date !== null)
      .sort((a, b) => a.getTime() - b.getTime())

    return {
      minDate: dates[0],
      maxDate: dates[dates.length - 1]
    }
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
      gradientBackgroundStart="rgb(108, 0, 162)"
      gradientBackgroundEnd="rgb(0, 17, 82)"
      firstColor="18, 113, 255"
      secondColor="221, 74, 255"
      thirdColor="100, 220, 255"
      fourthColor="200, 50, 50"
      fifthColor="180, 180, 50"
      pointerColor="140, 100, 255"
      size="100%"
      blendingValue="hard-light"
      containerClassName="fixed inset-0"
      interactive={true}
    >
      <div className="relative z-10 h-screen overflow-auto">
        <div className="container mx-auto px-4 py-8 pb-16">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => window.location.href = '/'}
                variant="ghost"
                className="text-white hover:text-white/80"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-4xl font-helvetica text-white drop-shadow-lg">
                Dashboard
              </h1>
            </div>
            <Button
              onClick={resetFilters}
              variant="ghost" 
              className="text-white hover:text-white/80"
              aria-label="Réinitialiser tous les filtres"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Réinitialiser les filtres
            </Button>
          </div>
          
          <div className="mb-8 p-4 bg-black/80 backdrop-blur-xl rounded-lg border border-white/10">
            <h2 className="text-2xl font-helvetica mb-4 text-white">Filtres</h2>
            <Filters 
              onFilterChange={updateFilters} 
              initialFilters={filters}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                {isLoading ? (
                  <LoadingSpinner />
                ) : !data?.rawData?.length ? (
                  <EmptyState 
                    title="Distribution par région"
                    description="Répartition des TJM par région"
                  />
                ) : (
                  <RegionTJMChart data={data.rawData} />
                )}
              </div>

              <div className="flex flex-col">
                {isLoading ? (
                  <LoadingSpinner />
                ) : !data?.rawData?.length ? (
                  <EmptyState 
                    title="Top des entreprises"
                    description="Répartition par type d'entreprise"
                  />
                ) : (
                  <TopCompaniesChart data={stats.companyTypeStats} />
                )}
              </div>
            </div>

            <div className="h-full">
              {isLoading ? (
                <LoadingSpinner />
              ) : !data?.rawData?.length ? (
                <EmptyState 
                  title="Distribution par expérience"
                  description="Répartition des offres par niveau d'expérience"
                />
              ) : (
                <ExperienceDistributionChart data={data.rawData} />
              )}
            </div>

            <div className="h-full">
              {isLoading ? (
                <LoadingSpinner />
              ) : !data?.rawData?.length ? (
                <EmptyState 
                  title="Distribution par domaine"
                  description="Répartition des offres par domaine"
                />
              ) : (
                <DomainDistributionChart data={stats.domainStats} />
              )}
            </div>

            <div className="h-full">
              {isLoading ? (
                <LoadingSpinner />
              ) : !data?.tjmData ? (
                <EmptyState 
                  title="Technologies"
                  description="Répartition des TJM par technologie"
                />
              ) : (
                <TechDistributionChart data={data.tjmData} />
              )}
            </div>
            
            <div className="lg:col-span-2 h-full">
              {isLoading ? (
                <LoadingSpinner />
              ) : !data?.rawData?.length ? (
                <EmptyState 
                  title="Offres par jour"
                  description="Répartition des offres par jour"
                />
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
