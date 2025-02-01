"use client"

import { motion } from "framer-motion"

export default function About() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-8">À propos</h2>
        <p className="text-lg text-muted-foreground">
          Découvrez notre approche unique pour analyser le marché de l'emploi dans le domaine tech.
          Notre plateforme utilise des algorithmes avancés pour collecter et analyser les données
          du marché de l'emploi en temps réel.
        </p>
      </motion.div>
    </section>
  )
} 