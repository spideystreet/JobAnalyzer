"use client"

import { useEffect, useRef } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { TextRotate } from "@/components/ui/text-rotate"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { Boxes } from "@/components/ui/background-boxes"
import { MagnetizeButton } from "@/components/ui/magnetize-button"

const exampleImages = [
    {
        url: "/images/docker.svg",
        author: "Docker",
        title: "Docker",
        className: "top-[12%] left-[16%]"
    },
    {
        url: "/images/python.svg",
        author: "Python",
        title: "Python",
        className: "top-[31%] right-[10%]"
    },
    {
        url: "/images/pbi.png",
        author: "Power BI",
        title: "Power BI",
        className: "bottom-[20%] left-[12%]"
    },
    {
        url: "/images/figma.svg",
        author: "Figma",
        title: "Figma",
        className: "bottom-[20%] right-[21%]"
    },
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
    <div className="h-screen relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
      {/* Masque radial pour l'effet de fondu */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(circle_at_center,transparent,white)] pointer-events-none" />
      
      {/* Background boxes */}
      <Boxes />

      {/* Contenu principal */}
      <div className="relative z-30 flex flex-col items-center">
        <motion.h1
          className="text-7xl text-center flex flex-col items-center justify-center font-helvetica tracking-tight"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
        >
          <span className="mb-4 font-bold font-helvetica text-white">Analysez les</span>
          <LayoutGroup>
            <motion.div layout className="flex items-center justify-center whitespace-nowrap">
              <TextRotate
                texts={[
                  "🧑‍💻 Dev full-stack",
                  "📊 Data analyst",
                  "🌐 Dev WEB",
                  "⚙️ Data engineer",
                  "📱 Dev iOS",
                ]}
                mainClassName="overflow-hidden text-[#0015ff] py-4 rounded-xl text-center whitespace-nowrap h-full -ml-6"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </motion.div>
          </LayoutGroup>
        </motion.h1>

        <motion.p
          className="text-xl text-center font-helvetica mt-16 max-w-[600px] text-white/80"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
        >
          Analysez les tendances du marché Freelance en France.<br />
          TJM, Technos, ESN et bien d'autres paramètres !
        </motion.p>

        {/* Bouton magnétique */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <MagnetizeButton
            onClick={() => console.log("Clicked!")}
            className="text-lg font-semibold px-8 py-6"
            particleCount={15}
          >
            Explorer les données
          </MagnetizeButton>
        </motion.div>

        <motion.div
          className="fixed bottom-8 z-10 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.p className="text-sm text-white/60 mb-4 text-center font-helvetica">
            Fourni gentiment par l'arraignée sympa des réseaux 👋
          </motion.p>
          <AnimatedTooltip items={teamMembers} className="mr-4 scale-90" />
        </motion.div>
      </div>
    </div>
  );
}

export default LandingPage;