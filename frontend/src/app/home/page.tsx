"use client"

import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  RiTwitterXFill, 
  RiLinkedinFill, 
  RiGithubFill 
} from "@remixicon/react"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { DotPattern } from '@/components/ui/dot-pattern-1'
import { useEffect, useMemo, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LoaderCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

// Lazy load seulement les composants lourds
const Boxes = dynamic(() => import('@/components/ui/background-boxes').then(mod => {
  const BoxesComponent = mod.Boxes
  return (props: any) => (
    <BoxesComponent {...props} rows={20} cols={15} />
  )
}), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-black to-purple-900/20" />
  )
})

const DynamicAnimatedTooltip = dynamic(() => import('@/components/ui/animated-tooltip').then(mod => mod.AnimatedTooltip), {
  ssr: false
})

const DynamicInteractiveHoverButton = dynamic(() => import('@/components/ui/interactive-hover-button').then(mod => mod.InteractiveHoverButton), {
  ssr: false
})

const DynamicDotPattern = dynamic(() => import('@/components/ui/dot-pattern-1'), {
  ssr: false,
  loading: () => <div className="w-full h-full" />
})

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  // Déplacer teamMembers à l'intérieur du composant
  const teamMembers = useMemo(() => [
    {
      id: 1,
      name: "Hicham",
      designation: "Data Analyst BI",
      image: "/images/spider.png"
    }
  ], [])

  // Mémoriser les URLs
  const socialUrls = useMemo(() => ({
    twitter: 'https://x.com/spideystreet',
    linkedin: 'https://www.linkedin.com/in/hicham-djebali-35bb271a2/',
    github: 'https://github.com/spideystreet'
  }), [])

  const handleDashboardClick = useCallback(async () => {
    setIsLoading(true)
    // Ajouter un petit délai pour voir l'animation
    await new Promise(resolve => setTimeout(resolve, 1000))
    try {
      await router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleSocialClick = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  const socialButtons = useMemo(() => (
    <div className="flex flex-wrap justify-center gap-2 max-w-xs w-full mx-auto z-50">
      <Button onClick={() => handleSocialClick(socialUrls.twitter)} className="bg-white hover:bg-white/90" variant="outline" aria-label="X" size="icon">
        <RiTwitterXFill className="text-black" size={16} aria-hidden="true" />
      </Button>
      <Button onClick={() => handleSocialClick(socialUrls.linkedin)} className="bg-white hover:bg-white/90" variant="outline" aria-label="LinkedIn" size="icon">
        <RiLinkedinFill className="text-black" size={16} aria-hidden="true" />
      </Button>
      <Button onClick={() => handleSocialClick(socialUrls.github)} className="bg-white hover:bg-white/90" variant="outline" aria-label="GitHub" size="icon">
        <RiGithubFill className="text-black" size={16} aria-hidden="true" />
      </Button>
    </div>
  ), [handleSocialClick, socialUrls])

  return (
    <div className="h-screen relative w-full overflow-hidden bg-black">
      {/* Background boxes en arrière-plan absolu */}
      <div className="absolute inset-0">
        <Boxes />
      </div>

      {/* Masque radial */}
      <div className={cn(
        "absolute inset-0",
        "bg-black",
        "[mask-image:radial-gradient(circle_at_center,transparent,white)]",
        "pointer-events-none"
      )} />
      
      {/* Contenu principal */}
      <div className="relative w-full h-full flex flex-col items-center pt-4 sm:pt-6 md:pt-8">
        {/* Boutons sociaux */}
        {socialButtons}

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[95vw] sm:max-w-[90vw] xl:max-w-[80vw] flex flex-col items-center">
            {/* Badge et Tooltip */}
            <motion.div
              className="mb-4 sm:mb-6 w-full flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center w-auto">
                <Badge 
                  variant="secondary" 
                  className="bg-white text-black/80 hover:bg-white/90 font-helvetica font-normal pr-6 sm:pr-8 flex items-center h-5 sm:h-6 text-xs sm:text-sm"
                >
                  Powered by Spidey 👋
                </Badge>
                <div className="-ml-4 sm:-ml-6">
                  <AnimatedTooltip 
                    items={teamMembers} 
                    className="scale-[0.6] sm:scale-75 [&_img]:border-[2px] [&_img]:border-white"
                  />
                </div>
              </div>
            </motion.div>
            
            <div className="h-[40px] flex items-center justify-center">
              <p className="inline-flex px-4 py-1.5 rounded-full border border-purple-500/30 bg-black/50 backdrop-blur-sm
                text-purple-400 mb-4 sm:mb-6 text-base sm:text-lg md:text-xl
                font-helvetica tracking-wide"
              >
                Technos, Remote, Expertises et plus encore...
              </p>
            </div>

            {/* Titre principal */}
            <motion.div
              className="space-y-2 sm:space-y-4 text-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-helvetica font-semibold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-[1.1]">
                "Toutes les tendances
              </h1>
              <p className="font-helvetica font-thin text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white tracking-wide leading-[1.2]">
                du marché de l'emploi
              </p>
              <h1 className="font-helvetica font-semibold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight leading-[1.1]">
                dans l'IT..."
              </h1>
            </motion.div>

            {/* Bouton */}
            <motion.div className="mt-8 sm:mt-12 md:mt-16">
              <Button
                onClick={handleDashboardClick}
                disabled={isLoading}
                data-loading={isLoading}
                className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-purple-500 hover:bg-purple-600 disabled:opacity-100 text-base sm:text-lg font-helvetica rounded-full p-0 flex items-center justify-center"
              >
                <span className="group-data-[loading=true]:text-transparent">Go</span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoaderCircle 
                      className="animate-spin" 
                      size={20} 
                      strokeWidth={2} 
                      aria-hidden="true" 
                    />
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;