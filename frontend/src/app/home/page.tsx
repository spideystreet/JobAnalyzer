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
import { LoaderCircle, ArrowRight, Smartphone } from "lucide-react"
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

// Ajouter le composant MobileMessage
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
            But where is Spidey ?
            Il prépare la version mobile pour toi ! En attendant, tu peux utiliser la version desktop sur ton ordi.
          </p>
        </motion.div>
        <motion.div 
          className="pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <p className="text-sm text-white/60 mb-3">
            Suivez les avancées sur mes réseaux
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => handleSocialClick(socialUrls.twitter)} className="bg-white hover:bg-white/90 hover:scale-105 transition-transform" variant="outline" aria-label="X" size="icon">
              <RiTwitterXFill className="text-black" size={16} aria-hidden="true" />
            </Button>
            <Button onClick={() => handleSocialClick(socialUrls.linkedin)} className="bg-white hover:bg-white/90 hover:scale-105 transition-transform" variant="outline" aria-label="LinkedIn" size="icon">
              <RiLinkedinFill className="text-black" size={16} aria-hidden="true" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      {isMobile ? (
        <MobileMessage />
      ) : (
        <>
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
          <div className="relative w-full h-full flex flex-col justify-between">
            {/* Header - Badge et Tooltip */}
            <div className="pt-14 sm:pt-16 md:pt-16">
              <div className="h-[40px] w-full flex items-center justify-center">
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                >
                  <div className="flex items-center">
                    <Badge 
                      variant="secondary" 
                      className="bg-white text-black/80 hover:bg-white/90 font-helvetica font-normal pr-5 sm:pr-7
                        flex items-center h-5 sm:h-6 text-xs sm:text-sm min-w-[140px] relative"
                    >
                      Powered by Spidey 👋
                    </Badge>
                    <div className="w-[40px] -ml-5 sm:-ml-7 relative z-20">
                      <DynamicAnimatedTooltip 
                        items={teamMembers} 
                        className="scale-[0.6] sm:scale-75 [&_img]:border-[2px] [&_img]:border-white"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Hero Section - Centrée verticalement */}
            <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-[95vw] sm:max-w-[90vw] xl:max-w-[80vw] flex flex-col items-center space-y-8">
                <Badge 
                  variant="secondary" 
                  className="bg-black text-purple-400 hover:bg-black/90 font-helvetica font-normal
                    flex items-center rounded-full 
                    border-2 border-white/20
                    px-4 py-1.5 text-base sm:text-lg tracking-wide"
                >
                  Technos, Remote, Expertises et plus encore...
                </Badge>

                <motion.div
                  className="text-center w-full space-y-2 sm:space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Titre principal */}
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

                <motion.div>
                  <Button
                    onClick={handleDashboardClick}
                    loading={isLoading}
                    className="group relative w-16 h-16 sm:w-20 sm:h-20 
                      bg-purple-500 hover:bg-purple-600 
                      disabled:opacity-100 
                      text-base sm:text-lg font-helvetica 
                      rounded-full p-0 
                      flex items-center justify-center
                      text-white
                      border-2 border-white/80
                      transition-colors"
                  >
                    Go
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Footer - Boutons sociaux */}
            <div className="pb-4 sm:pb-6 md:pb-8">
              {socialButtons}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LandingPage;