"use client"

import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button-loading"
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
  ), [handleSocialClick, socialUrls])

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black">
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
      
      {/* Contenu principal avec flex pour espacer les éléments */}
      <div className="relative w-full min-h-screen flex flex-col px-4 sm:px-6">
        {/* Header - Badge et Tooltip */}
        <div className="flex-none pt-6 sm:pt-8 lg:pt-10">
          <div className="w-full flex items-center justify-center">
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex items-center">
                <Badge 
                  variant="secondary" 
                  className="bg-white text-black/80 hover:bg-white/90 font-helvetica font-normal pr-4 sm:pr-5
                    flex items-center h-5 sm:h-6 text-xs sm:text-sm min-w-[120px] sm:min-w-[140px] relative"
                >
                  Powered by Spidey 👋
                </Badge>
                <div className="w-[32px] sm:w-[40px] -ml-4 sm:-ml-5 relative z-20">
                  <DynamicAnimatedTooltip 
                    items={teamMembers} 
                    className="scale-[0.5] sm:scale-[0.6] lg:scale-75 [&_img]:border-[2px] [&_img]:border-white"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Section - Centrée verticalement avec flex-auto */}
        <div className="flex-auto flex items-center justify-center py-8 sm:py-12">
          <div className="w-full max-w-[95vw] sm:max-w-[90vw] xl:max-w-[80vw] flex flex-col items-center space-y-6 sm:space-y-8">
            <Badge 
              variant="secondary" 
              className="bg-black text-purple-400 hover:bg-black/90 font-helvetica font-normal
                flex items-center rounded-full 
                border-2 border-white/20
                px-3 sm:px-4 py-1 sm:py-1.5 
                text-xs sm:text-sm lg:text-base 
                tracking-wide"
            >
              Technos, Remote, Expertises et plus encore...
            </Badge>

            <motion.div
              className="text-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Titre principal avec tailles adaptatives */}
              <div className="space-y-1 sm:space-y-2">
                <h1 className="font-helvetica font-semibold 
                  text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                  text-white tracking-tight leading-[1.1]"
                >
                  "Toutes les tendances
                </h1>
                <p className="font-helvetica font-thin 
                  text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
                  text-white tracking-wide leading-[1.2]"
                >
                  du marché de l'emploi
                </p>
                <h1 className="font-helvetica font-semibold 
                  text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 
                  text-white tracking-tight leading-[1.1]"
                >
                  dans l'IT..."
                </h1>
              </div>
            </motion.div>

            <motion.div>
              <Button
                onClick={handleDashboardClick}
                loading={isLoading}
                className="group relative 
                  w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 
                  bg-purple-500 hover:bg-purple-600 
                  disabled:opacity-100 
                  text-sm xs:text-base sm:text-lg font-helvetica 
                  rounded-full p-0 
                  flex items-center justify-center
                  text-white
                  border-2 border-white/80
                  transition-all
                  hover:scale-105"
              >
                Go
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Footer - Boutons sociaux */}
        <div className="flex-none pb-4 sm:pb-6 lg:pb-8">
          {socialButtons}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;