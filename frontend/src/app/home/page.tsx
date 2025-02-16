"use client"

import dynamic from 'next/dynamic'
import { motion } from "framer-motion"
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

// Remplacer les animations complexes par des versions plus légères
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, when: "beforeChildren" }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
}

// Garder seulement les composants vraiment lourds en dynamique
const Boxes = dynamic(() => import('@/components/ui/background-boxes').then(mod => {
  const BoxesComponent = mod.Boxes
  return (props: any) => (
    <BoxesComponent {...props} rows={30} cols={20} />
  )
}), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />
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

  const handleDashboardClick = useCallback(() => {
    router.push('/dashboard')
  }, [router])

  const handleSocialClick = useCallback((url: string) => {
    window.open(url, '_blank')
  }, [])

  return (
    <div className="h-screen relative w-full overflow-hidden bg-black flex flex-col items-center">
      {/* Masque radial pour l'effet de fondu */}
      <div className={cn(
        "absolute inset-0 w-full h-full",
        "bg-black z-20",
        "[mask-image:radial-gradient(circle_at_center,transparent,white)]",
        "pointer-events-none"
      )} />
      
      {/* Background boxes */}
      <Boxes />

      <div className="w-full h-full flex flex-col items-center pt-8 md:pt-12">
        {/* Boutons de réseaux sociaux en haut */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xs w-full mx-auto z-50">
          <Button onClick={() => handleSocialClick('https://x.com/spideystreet')} className="bg-white hover:bg-white/90" variant="outline" aria-label="X" size="icon">
            <RiTwitterXFill className="text-black" size={16} aria-hidden="true" />
          </Button>
          <Button onClick={() => handleSocialClick('https://www.linkedin.com/in/hicham-djebali-35bb271a2/')} className="bg-white hover:bg-white/90" variant="outline" aria-label="LinkedIn" size="icon">
            <RiLinkedinFill className="text-black" size={16} aria-hidden="true" />
          </Button>
          <Button onClick={() => handleSocialClick('https://github.com/spideystreet')} className="bg-white hover:bg-white/90" variant="outline" aria-label="GitHub" size="icon">
            <RiGithubFill className="text-black" size={16} aria-hidden="true" />
          </Button>
        </div>

        {/* Hero Section remontée */}
        <div className="relative z-30 flex-1 flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-6 xl:px-0 -mt-20">
          <div className="relative flex flex-col items-center border border-purple-500 w-full">
            <DynamicDotPattern 
              width={3}
              height={3}
              className="fill-purple-500/50 md:fill-purple-500/70"
            />

            {/* Badge et Tooltip en haut avec z-index plus élevé */}
            <motion.div
              className="absolute -top-7 w-full flex items-center justify-center z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-center w-auto">
                <Badge 
                  variant="secondary" 
                  className="bg-white text-black/80 hover:bg-white/90 font-helvetica font-normal pr-8 flex items-center"
                >
                  Powered by Spidey 👋
                </Badge>
                <div className="-ml-6">
                  <DynamicAnimatedTooltip 
                    items={teamMembers} 
                    className="scale-90 [&_img]:border-[2px] [&_img]:border-white" 
                  />
                </div>
              </div>
            </motion.div>

            <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-purple-500" />
            <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-purple-500" />
            <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-purple-500" />
            <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-purple-500" />

            <div className="relative z-20 mx-auto max-w-7xl rounded-[40px] py-6 md:p-10 xl:py-20">
              <motion.div
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                <motion.h1 
                  variants={itemVariants}
                  className="font-helvetica font-semibold text-5xl md:text-7xl text-white text-center"
                >
                  "Toutes les tendances
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="font-helvetica font-thin text-3xl md:text-5xl text-white text-center"
                >
                  du marché de l'emploi
                </motion.p>
                <motion.h1 
                  variants={itemVariants}
                  className="font-helvetica font-semibold text-5xl md:text-7xl text-white text-center"
                >
                  dans l'IT..."
                </motion.h1>
              </motion.div>
            </div>

            {/* Bouton CTA en bas avec z-index plus élevé */}
            <motion.div
              className="absolute -bottom-5 z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="relative justify-center">
                <DynamicInteractiveHoverButton 
                  onClick={handleDashboardClick}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;