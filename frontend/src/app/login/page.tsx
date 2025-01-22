import Image from "next/image";
import { IconCloud } from "@/components/ui/interactive-icon-cloud";
import { Typewriter } from "@/components/ui/typewriter";

export default function Home() {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-16 bg-background">
      <div className="flex flex-col items-center text-4xl font-bold">
        <span className="text-center text-6xl">{/* Taille plus grande pour l'émoji */}
          {"🧑‍💻"}
        </span>
        <span>{"Je souhaite devenir Freelance "}</span>
        <span className="text-4xl font-bold text-yellow-500 ml-2">
          <Typewriter
            text={[
              "développeur full-stack",
              "data analyst",
              "développeur web",
              "data engineer",
              "développeur mobile (iOS)",
            ]}
            speed={70}
            waitTime={1500}
            deleteSpeed={20}
            cursorChar={"_"}
          />
        </span>
      </div>
      <div className="flex flex-col items-center mt-8">
        <IconCloud iconSlugs={iconSlugs} />
      </div>
    </div>
  );
}