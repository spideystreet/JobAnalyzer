"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { LayoutGroup, motion } from "framer-motion"
import { TextRotate } from "@/components/ui/text-rotate"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { AnimeNavBar } from "@/components/ui/anime-navbar"
import { Home, User, Settings, Mail } from "lucide-react"

const exampleImages = [
    {
        url: "https://images.unsplash.com/photo-1588600878108-578307a3cc9d?q=80&w=2676&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        author: "John Doe",
        title: "Image 1"
    }
]

const navItems = [
  { name: "Home", url: "#home", icon: Home },
  { name: "About", url: "#about", icon: User },
  { name: "Services", url: "#services", icon: Settings },
  { name: "Contact", url: "#contact", icon: Mail },
]

const LandingPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <AnimeNavBar items={navItems} />
      
      <section id="home" className="w-full h-screen overflow-hidden md:overflow-visible flex flex-col items-center justify-center relative">
        <Floating sensitivity={-0.5} className="h-full">
          {exampleImages.map((image, index) => (
            <FloatingElement
              key={index}
              depth={index % 2 === 0 ? 0.5 : 1}
              className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
            >
              <motion.img
                src={image.url}
                alt={image.title}
                className="w-40 h-40 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
              />
            </FloatingElement>
          ))}
        </Floating>

        <div className="flex flex-col justify-center items-center w-[250px] sm:w-[300px] md:w-[500px] lg:w-[700px] z-50 pointer-events-auto">
          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight font-calendas tracking-tight space-y-1 md:space-y-4"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
          >
            <span>Make your </span>
            <LayoutGroup>
              <motion.span layout className="flex flex-row items-center whitespace-nowrap">
                <TextRotate
                  texts={[
                      "🧑‍💻 Dev full-stack",
                      "📊 Data analyst",
                      "🌐 Dev WEB",
                      "⚙️ Data engineer",
                      "📱 Dev iOS",
                  ]}
                  mainClassName="overflow-hidden text-[#0015ff] py-0 rounded-xl"
                  staggerDuration={0.03}
                  staggerFrom="last"
                  rotationInterval={3000}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                />
              </motion.span>
            </LayoutGroup>
          </motion.h1>
          <motion.p
            className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center font-overusedGrotesk pt-4 sm:pt-8 md:pt-10 lg:pt-12"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
          >
            with a growing library of ready-to-use react components &
            microinteractions. free & open source.
          </motion.p>

          <div className="flex flex-row justify-center space-x-4 items-center mt-10 sm:mt-16 md:mt-20 lg:mt-20 text-xs">
            <motion.button
              className="sm:text-base md:text-lg lg:text-xl font-semibold tracking-tight text-background bg-foreground px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl font-calendas"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
                delay: 0.7,
                scale: { duration: 0.2 },
              }}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", damping: 30, stiffness: 400 },
              }}
            >
              <Link href="/docs/introduction">
                Check docs <span className="font-serif ml-1">→</span>
              </Link>
            </motion.button>
            <motion.button
              className="sm:text-base md:text-lg lg:text-xl font-semibold tracking-tight text-white bg-[#0015ff] px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3 rounded-full z-20 shadow-2xl font-calendas"
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
                delay: 0.7,
                scale: { duration: 0.2 },
              }}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", damping: 30, stiffness: 400 },
              }}
            >
              <Link href="https://github.com/danielpetho/fancy">★ on GitHub</Link>
            </motion.button>
          </div>
        </div>
      </section>

      <section id="about" className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">À propos</h2>
          <p className="text-lg text-muted-foreground">
            Découvrez notre approche unique pour analyser le marché de l'emploi dans le domaine tech.
          </p>
        </motion.div>
      </section>

      <section id="services" className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/90 to-background p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-border">
              <Settings className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analyse de données</h3>
              <p className="text-muted-foreground">Explorez les tendances du marché de l'emploi tech.</p>
            </div>
            {/* Add more service cards as needed */}
          </div>
        </motion.div>
      </section>

      <section id="contact" className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Contact</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Vous avez des questions ? N'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-col space-y-4">
            <input type="email" placeholder="Votre email" className="p-4 rounded-lg border border-border bg-background" />
            <textarea placeholder="Votre message" rows={4} className="p-4 rounded-lg border border-border bg-background" />
            <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Envoyer
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default LandingPage