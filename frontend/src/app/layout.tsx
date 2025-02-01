import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Analyzer",
  description: "Analysez le marché de l'emploi tech",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="w-full min-h-screen bg-background">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
