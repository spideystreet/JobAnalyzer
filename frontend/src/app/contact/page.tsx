"use client"

import { motion } from "framer-motion"
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"

const teamMembers = [
  {
    id: 1,
    name: "Hicham SADDEK",
    designation: "Fondateur & Développeur",
    image: "https://avatars.githubusercontent.com/u/1234567?v=4" // Remplacez par votre image
  },
  {
    id: 2,
    name: "Sarah Martin",
    designation: "Data Scientist",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    name: "Marc Dubois",
    designation: "Analyste Data",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
]

export default function Contact() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Contact</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Vous avez des questions ? N'hésitez pas à nous contacter.
        </p>
        <div className="flex flex-col space-y-4">
          <input 
            type="email" 
            placeholder="Votre email" 
            className="p-4 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
          />
          <textarea 
            placeholder="Votre message" 
            rows={4} 
            className="p-4 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
          />
          <motion.button 
            className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Envoyer
          </motion.button>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center">
          <motion.h3 
            className="text-2xl font-semibold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Notre Équipe
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatedTooltip items={teamMembers} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
} 