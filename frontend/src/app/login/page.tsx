"use client"; // Indique que c'est un composant client

import { useEffect, useState } from "react"; // Assurez-vous que useEffect et useState sont importés
import { Hero } from "@/components/ui/animated-hero"; // Importation du composant Hero
import { IconCloud } from "@/components/ui/interactive-icon-cloud"; // Importation du composant IconCloud
import { RainbowButton } from "@/components/ui/rainbow-button"; // Importation du composant RainbowButton
import { AnimatedTooltip } from "@/components/ui/animated-tooltip"; // Importation du composant AnimatedTooltip
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"; // Importation du nouveau bouton
import DisplayCards from "@/components/ui/display-cards"; // Importation du composant DisplayCards


export default function Home() {

  const [clientId, setClientId] = useState("");

  useEffect(() => {
    // Générer un ID unique côté client
    setClientId(`canvas-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

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
  ];

  const tooltipItems = [
    { id: 1, name: "Hicham", designation: "Développeur / Data analyst", image: "/images/hich.jpg" },
    // Ajoutez d'autres éléments ici
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="flex-center mb-4">
        <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center font-regular">
          Fait gentillement par la petite arraignée sympa du quartier
        </p>
        <AnimatedTooltip items={tooltipItems} /> {/* Utilisation du composant AnimatedTooltip */}
      </div>
      <Hero /> {/* Utilisation du composant Hero */}
      <div className="flex-center">
        <InteractiveHoverButton text="Analyser" /> {/* Utilisation du nouveau bouton */}
      </div>
      <div className="flex items-center justify-center mt-10">
        <IconCloud iconSlugs={iconSlugs} /> {/* Utilisation du composant IconCloud */}
      </div>
    </div>
  );
}
