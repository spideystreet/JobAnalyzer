"use client"

import { motion } from "framer-motion"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { Boxes } from "@/components/ui/background-boxes"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { Badge } from "@/components/ui/badge"
import DotPattern from "@/components/ui/dot-pattern-1"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { RiFacebookFill, RiGithubFill, RiGoogleFill, RiTwitterXFill, RiLinkedinFill } from "@remixicon/react"

const teamMembers = [
  {
    id: 1,
    name: "Hicham",
    designation: "Data Analyst BI",
    image: "/images/spider.png"
  }
]

const LandingPage: React.FC = () => {
  return (
    <div className="h-screen relative w-full overflow-hidden bg-black flex flex-col items-center">
      {/* Masque radial pour l'effet de fondu */}
      <div className="absolute inset-0 w-full h-full bg-black z-20 [mask-image:radial-gradient(circle_at_center,transparent,white)] pointer-events-none" />
      
      {/* Background boxes */}
      <Boxes />

      <div className="w-full h-full flex flex-col items-center pt-8 md:pt-12">
        {/* Boutons de réseaux sociaux en haut */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xs w-full mx-auto z-50">
          <a href="https://x.com/spideystreet" target="_blank" rel="noopener noreferrer">
            <Button className="bg-white hover:bg-white/90" variant="outline" aria-label="X" size="icon">
              <RiTwitterXFill className="text-black" size={16} aria-hidden="true" />
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/hicham-djebali-35bb271a2/" target="_blank" rel="noopener noreferrer">
            <Button className="bg-white hover:bg-white/90" variant="outline" aria-label="LinkedIn" size="icon">
              <RiLinkedinFill className="text-black" size={16} aria-hidden="true" />
            </Button>
          </a>
          <a href="https://github.com/spideystreet" target="_blank" rel="noopener noreferrer">
            <Button className="bg-white hover:bg-white/90" variant="outline" aria-label="GitHub" size="icon">
              <RiGithubFill className="text-black" size={16} aria-hidden="true" />
            </Button>
          </a>
        </div>

        {/* Hero Section remontée */}
        <div className="relative z-30 flex-1 flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-6 xl:px-0 -mt-20">
          <div className="relative flex flex-col items-center border border-purple-500 w-full">
            <DotPattern width={5} height={5} className="fill-purple-500/50 md:fill-purple-500/70" />

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
                  <AnimatedTooltip 
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
              <motion.p 
                className="md:text-md text-xs text-purple-500 lg:text-lg xl:text-2xl font-helvetica"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Technos, Remote, Expertises et plus encore...
              </motion.p>
              <div className="text-2xl tracking-tighter text-white md:text-5xl lg:text-7xl xl:text-8xl">
                <div className="flex gap-1 md:gap-2 lg:gap-3 xl:gap-4">
                  <motion.h1 
                    className="font-semibold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    "Toutes les tendances
                  </motion.h1>
                </div>
                <div className="flex gap-1 md:gap-2 lg:gap-3 xl:gap-4">
                  <motion.p 
                    className="font-thin"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    du marché de l'emploi
                  </motion.p>
                </div>
                <div className="flex gap-1 md:gap-2 lg:gap-3 xl:gap-4">
                  <motion.h1 
                    className="font-semibold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    dans l'IT..."
                  </motion.h1>
                </div>
              </div>
            </div>

            {/* Bouton CTA en bas avec z-index plus élevé */}
            <motion.div
              className="absolute -bottom-5 z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="relative justify-center">
                <InteractiveHoverButton 
                  onClick={() => window.location.href = '/dashboard'}
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