"use client"

import { motion } from "framer-motion"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { Boxes } from "@/components/ui/background-boxes"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { IconCloud } from "@/components/ui/interactive-icon-cloud"
import { Badge } from "@/components/ui/badge"
import DotPattern from "@/components/ui/dot-pattern-1"
import { useEffect, useMemo, useState } from "react"

const iconSlugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
]

const teamMembers = [
  {
    id: 1,
    name: "Hicham",
    designation: "Data Analyst BI",
    image: "/images/spider.jpg"
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
        {/* Nuage d'icônes */}
        <div className="w-[150px] sm:w-[200px] md:w-[300px] h-[50px] sm:h-[60px] md:h-[80px] z-20">
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <IconCloud iconSlugs={iconSlugs} />
          </motion.div>
        </div>

        {/* Nouvelle Hero Section */}
        <div className="relative z-30 flex-1 flex flex-col items-center justify-start max-w-7xl w-full mx-auto px-6 xl:px-0 mt-[225px]">
          <div className="relative flex flex-col items-center border border-purple-500 w-full">
            <DotPattern width={5} height={5} className="fill-purple-500/50 md:fill-purple-500/70" />

            {/* Badge et Tooltip en haut */}
            <motion.div
              className="absolute -top-7 w-full flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-center w-auto">
                <Badge 
                  variant="secondary" 
                  className="bg-white text-black/80 hover:bg-white/90 font-helvetica font-normal pr-8 flex items-center"
                >
                  Fourni gentiment par l&apos;arraignée sympa des réseaux 👋
                </Badge>
                <div className="-ml-6">
                  <AnimatedTooltip items={teamMembers} className="scale-90 [&_img]:border-0" />
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
                TJM, Technos, Remote et plus encore...
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

            {/* Bouton CTA en bas */}
            <motion.div
              className="absolute -bottom-5"
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