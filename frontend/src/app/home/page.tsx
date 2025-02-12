"use client"

import { LayoutGroup, motion } from "framer-motion"
import { TextRotate } from "@/components/ui/text-rotate"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { Boxes } from "@/components/ui/background-boxes"
import { ButtonCta } from "@/components/ui/button-shiny"
import { IconCloud } from "@/components/ui/interactive-icon-cloud"

const iconSlugs = [
  "python",
  "javascript",
  "typescript",
  "react",
  "nextdotjs",
  "nodedotjs",
  "docker",
  "kubernetes",
  "amazonaws",
  "postgresql",
  "mongodb",
  "redis",
  "git",
  "github",
  "visualstudiocode",
  "tailwindcss",
  "figma",
  "powerbi",
  "microsoftazure",
  "googlecloud"
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

      {/* Nuage d'icônes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px]">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <IconCloud iconSlugs={iconSlugs} />
        </motion.div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4">
        <motion.h1
          className="text-7xl text-center flex flex-col items-center justify-center font-helvetica tracking-tight space-y-6"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
        >
          <span className="font-bold font-helvetica text-white">Analysez les</span>
          <LayoutGroup>
            <motion.div layout className="flex items-center justify-center whitespace-nowrap">
              <TextRotate
                texts={[
                  "Dev full-stack",
                  "Data analyst",
                  "Dev WEB",
                  "Data engineer",
                  "Dev iOS",
                ]}
                mainClassName="overflow-hidden text-purple-600 py-4 rounded-xl text-center whitespace-nowrap h-full"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </motion.div>
          </LayoutGroup>
        </motion.h1>

        <motion.p
          className="text-xl text-center font-helvetica mt-8 max-w-2xl text-white/80"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
        >
          Toutes les tendances du marché Freelance en France.<br />
          TJM, Technos, ESN et bien d&apos;autres paramètres !
        </motion.p>

        {/* Bouton CTA */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ButtonCta 
            label="Découvrir"
            className="w-fit text-sm"
            onClick={() => window.location.href = '/dashboard'}
          />
        </motion.div>
      </div>

      <motion.div
        className="relative z-30 mb-8 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.p className="text-sm text-white/60 mb-4 text-center font-helvetica">
          Fourni gentiment par l&apos;arraignée sympa des réseaux 👋
        </motion.p>
        <AnimatedTooltip items={teamMembers} className="mr-4 scale-90" />
      </motion.div>
    </div>
  );
}

export default LandingPage;