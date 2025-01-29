"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/ui/animated-hero";
import { IconCloud } from "@/components/ui/interactive-icon-cloud";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RiFacebookFill, RiGithubFill, RiGoogleFill, RiLinkedinBoxFill, RiLinkedinLine, RiTwitterXFill } from "@remixicon/react";

export default function Home() {
  const [clientId, setClientId] = useState("");

  useEffect(() => {
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
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start p-8 bg-background">
      <GridPattern
        squares={[
          [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4],
          [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5],
          [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6],
          [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7],
          [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [10, 8],
          [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9],
          [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10],
        ]}
        className={cn(
          "absolute inset-0 w-full h-full [mask-image:radial-gradient(800px_circle_at_center,white,transparent)] skew-y-12"
        )}
      />
      <div className="flex-center">
        <a href="https://www.linkedin.com/in/hicham-djebali-35bb271a2/" target="_blank" rel="noopener noreferrer">
          <AnimatedTooltip items={tooltipItems} />
        </a>
        <p className="text-sm md:text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center font-regular">
          Fait gentiment par la petite araignée sympa du quartier 👋
        </p>
        <div className="inline-flex flex-wrap gap-2">
          <a href="https://www.linkedin.com/in/hicham-djebali-35bb271a2/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" aria-label="LinkedIn" size="icon">
              <RiLinkedinBoxFill size={16} aria-hidden="true" />
            </Button>
          </a>
          <a href="https://github.com/spideystreet" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" aria-label="GitHub" size="icon">
              <RiGithubFill size={16} aria-hidden="true" />
            </Button>
          </a>
        </div>
      </div>
      <div className="flex-center mt-16">
        <Hero />
        <a href="/dashboard" target="_self">
          <InteractiveHoverButton text="Analyser" />
        </a>
      </div>
      <div className="flex items-center justify-center mt-16">
        <IconCloud iconSlugs={iconSlugs} />
      </div>
    </div>
  );
}
