"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { LayoutGroup, motion } from "framer-motion"
import { TextRotate } from "@/components/ui/text-rotate"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { AnimeNavBar } from "@/components/ui/anime-navbar"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"
import { Home, User, Settings, Mail } from "lucide-react"

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

const navItems = [
  { name: "Home", url: "#home", icon: Home },
  { name: "Contact", url: "#contact", icon: Mail }
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
    <div className="w-full min-h-screen bg-background flex flex-col items-center">
      <AnimeNavBar items={navItems} className="w-full flex justify-center" />
      
      <section id="home" className="w-full h-screen flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0">
          <Floating sensitivity={-0.5} className="h-full w-full">
            {exampleImages.map((image, index) => (
              <FloatingElement
                key={index}
                depth={index % 2 === 0 ? 0.5 : 1}
                className={`absolute ${image.className} transform -translate-x-1/2 -translate-y-1/2`}
              >
                <motion.img
                  src={image.url}
                  alt={image.title}
                  className="w-32 h-32 object-contain hover:scale-110 duration-200 cursor-pointer transition-transform rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                />
              </FloatingElement>
            ))}
          </Floating>
        </div>

        <div className="flex-1 relative z-10 flex flex-col justify-center items-center px-4">
          <motion.h1
            className="text-7xl text-center flex flex-col items-center justify-center font-helvetica tracking-tight"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
          >
            <span className="mb-4 font-bold font-helvetica">Analysez les</span>
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
            className="text-xl text-center font-helvetica mt-16 max-w-[600px]"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
          >
            Analysez les tendances du marché Freelance en France.<br />
            TJM, Technos, ESN et bien d'autres paramètres !
          </motion.p>
        </div>

        <motion.div
          className="fixed bottom-8 z-10 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.p className="text-sm text-muted-foreground mb-4 text-center font-helvetica">Fourni gentiment par l'arraignée sympa des réseaux 👋</motion.p>
          <AnimatedTooltip items={teamMembers} className="mr-4 scale-90" />
        </motion.div>
      </section>

      <section id="contact" className="w-full min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-background to-background/90 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full flex flex-col items-center text-center px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Contact</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Vous avez des questions ? N'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-col space-y-4 w-full max-w-md">
            <input type="email" placeholder="Votre email" className="p-4 rounded-lg border border-border bg-background text-center" />
            <textarea placeholder="Votre message" rows={4} className="p-4 rounded-lg border border-border bg-background text-center" />
            <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Envoyer
            </button>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedTooltip items={teamMembers} className="scale-125" />
        </motion.div>
      </section>
    </div>
  )
}

export default LandingPage