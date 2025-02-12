"use client"

import AnimatedGradientBackground from "@/components/ui/animated-gradient-background"

const TestPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatedGradientBackground 
        Breathing={true}
        startingGap={125}
        gradientColors={[
          "#0A0A0A",
          "#2979FF",
          "#FF80AB",
          "#FF6D00",
          "#FFD600",
          "#00E676",
          "#3D5AFE"
        ]}
        gradientStops={[35, 50, 60, 70, 80, 90, 100]}
        animationSpeed={0.02}
        breathingRange={5}
        topOffset={0}
      />
      
      {/* Contenu de test */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-white">
          Page de Test - Gradient Animé
        </h1>
      </div>
    </div>
  )
}

export default TestPage
