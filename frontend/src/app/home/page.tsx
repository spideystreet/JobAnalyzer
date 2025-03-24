"use client"

import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button-loading"
import { Badge } from "@/components/ui/badge"
import { 
  RiLinkedinFill, 
  RiGithubFill 
} from "@remixicon/react"
import { useEffect, useMemo, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

// Lazy load avec condition pour mobile
const Boxes = dynamic(() => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return Promise.resolve(() => null)
  }
  return import('@/components/ui/background-boxes').then(mod => {
    const BoxesComponent = mod.Boxes
    return (props: any) => (
      <BoxesComponent {...props} rows={20} cols={15} />
    )
  })
}, {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-black to-purple-900/20" />
  )
})

const DynamicAnimatedTooltip = dynamic(() => import('@/components/ui/animated-tooltip').then(mod => mod.AnimatedTooltip), {
  ssr: false
})

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const teamMembers = useMemo(() => [
    {
      id: 1,
      name: "Hicham",
      designation: "Data Analyst BI",
      image: "/images/spider.png"
    }
  ], [])

  const socialUrls = useMemo(() => ({
    linkedin: 'https://www.linkedin.com/in/hicham-djebali-35bb271a2/',
    github: 'https://github.com/spideystreet'
  }), [])

  const handleDashboardClick = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }
    setIsLoading(true)
    try {
      await router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleSocialClick = useCallback((url: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  const socialButtons = useMemo(() => (
    <div className="flex flex-wrap justify-center gap-2 max-w-xs w-full mx-auto z-50">
      <Button 
        onClick={() => handleSocialClick(socialUrls.linkedin)} 
        className="bg-white hover:bg-white/90 active:bg-white/70
          transition-all duration-200
          hover:scale-105 active:scale-95
          touch-manipulation select-none
          -webkit-tap-highlight-color-transparent" 
        variant="outline" 
        aria-label="LinkedIn" 
        size="icon"
      >
        <RiLinkedinFill className="text-black" size={16} aria-hidden="true" />
      </Button>
      <Button 
        onClick={() => handleSocialClick(socialUrls.github)} 
        className="bg-white hover:bg-white/90 active:bg-white/70
          transition-all duration-200
          hover:scale-105 active:scale-95
          touch-manipulation select-none
          -webkit-tap-highlight-color-transparent" 
        variant="outline" 
        aria-label="GitHub" 
        size="icon"
      >
        <RiGithubFill className="text-black" size={16} aria-hidden="true" />
      </Button>
    </div>
  ), [handleSocialClick, socialUrls])

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Boxes />
      </div>

      <div className={cn(
        "absolute inset-0",
        "bg-black",
        "[mask-image:radial-gradient(circle_at_center,transparent,white)]",
        "pointer-events-none"
      )} />
      
      <div className="relative w-full min-h-screen flex flex-col justify-between px-4 sm:px-6">
        <div className="flex-none pt-2 xs:pt-4 sm:pt-6 lg:pt-8">
        </div>

        <div className="flex-auto flex items-center justify-center">
          <div className="w-full max-w-[95vw] sm:max-w-[90vw] xl:max-w-[80vw] flex flex-col items-center space-y-4 xs:space-y-6 sm:space-y-8">
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSocialClick(socialUrls.linkedin)} 
                  className="bg-white hover:bg-white/90 active:bg-white/70
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                    touch-manipulation select-none
                    -webkit-tap-highlight-color-transparent" 
                  variant="outline" 
                  aria-label="LinkedIn" 
                  size="icon"
                >
                  <RiLinkedinFill className="text-black" size={16} aria-hidden="true" />
                </Button>
                <Button 
                  onClick={() => handleSocialClick(socialUrls.github)} 
                  className="bg-white hover:bg-white/90 active:bg-white/70
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                    touch-manipulation select-none
                    -webkit-tap-highlight-color-transparent" 
                  variant="outline" 
                  aria-label="GitHub" 
                  size="icon"
                >
                  <RiGithubFill className="text-black" size={16} aria-hidden="true" />
                </Button>
              </div>
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

            <Badge 
              variant="secondary" 
              className="bg-black text-purple-400 hover:bg-black/90 font-helvetica font-normal
                flex items-center rounded-full 
                border-2 border-white/20
                px-2 sm:px-4 py-0.5 sm:py-1.5 
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
              <div className="space-y-0">
                <h1 className="font-helvetica font-semibold 
                  text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                  text-white tracking-tight leading-[1.1]"
                >
                  "Toutes les tendances
                </h1>
                <p className="font-helvetica font-thin 
                  text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl
                  text-white tracking-wide leading-[1.1]"
                >
                  du marché de l'emploi
                </p>
                <h1 className="font-helvetica font-semibold 
                  text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                  text-white tracking-tight leading-[1.1]"
                >
                  dans l'IT..."
                </h1>
              </div>
            </motion.div>

            <motion.div>
              <button
                onClick={handleDashboardClick}
                disabled={isLoading}
                className="group relative 
                  w-12 h-12 xs:w-14 xs:h-14 sm:w-20 sm:h-20
                  bg-purple-500 hover:bg-purple-600 active:bg-purple-700
                  disabled:opacity-100 
                  text-base xs:text-lg sm:text-xl font-helvetica 
                  rounded-full
                  flex items-center justify-center
                  text-white
                  border-2 border-white/80
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  touch-manipulation select-none
                  -webkit-tap-highlight-color-transparent
                  shadow-lg"
              >
                {isLoading ? (
                  <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white rounded-full animate-spin border-t-transparent" />
                ) : (
                  "Go"
                )}
              </button>
            </motion.div>
          </div>
        </div>

        <div className="flex-none pb-2 xs:pb-4 sm:pb-6">
        </div>
      </div>
    </div>
  )
}

export default LandingPage