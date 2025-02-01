"use client"

import { motion } from "framer-motion"
import { Settings, LineChart, Code, Search } from "lucide-react"

const services = [
  {
    icon: LineChart,
    title: "Analyse de données",
    description: "Explorez les tendances du marché de l'emploi tech en temps réel."
  },
  {
    icon: Search,
    title: "Veille technologique",
    description: "Suivez l'évolution des technologies les plus demandées."
  },
  {
    icon: Code,
    title: "Analyse des compétences",
    description: "Identifiez les compétences les plus recherchées par les recruteurs."
  },
  {
    icon: Settings,
    title: "Personnalisation",
    description: "Configurez vos alertes et tableaux de bord selon vos besoins."
  }
]

export default function Services() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/90 to-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                className="p-6 rounded-xl border border-border hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
} 