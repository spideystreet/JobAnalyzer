import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Analyzer",
  description: "Analysez le marché de l'emploi tech",
  icons: {
    icon: [
      {
        url: '/icon.png',
        sizes: 'any',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-black`}>
        {children}
      </body>
    </html>
  );
}
