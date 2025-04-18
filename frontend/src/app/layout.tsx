import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobAnalyzer",
  description: "Analyse du marché de l'emploi IT",
  keywords: ["freelance", "tech", "emploi", "TJM", "France", "développeur", "data", "analyse"],
  authors: [{ name: "Spidey" }],
  creator: "Spidey",
  publisher: "Job Analyzer",
  robots: "index, follow",
  metadataBase: new URL('https://votre-domaine.com'),
  
  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://job-analyzer-six.vercel.app",
    siteName: "Job Analyzer",
    title: "Job Analyzer - Analyse du marché Tech",
    description: "Découvrez les tendances du marché Freelance en France : TJM, technologies, domaines d'expertise et bien plus.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Job Analyzer Preview"
      }
    ]
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Job Analyzer - Analyse du marché Freelance Tech",
    description: "Découvrez les tendances du marché Freelance en France : TJM, technologies, domaines d'expertise et bien plus.",
    images: ["/og-image.png"],
    creator: "@spideystreet",
  },

  // Icônes
  icons: {
    icon: [
      {
        url: '/icon.png',
        sizes: 'any',
      },
    ],
    apple: [
      {
        url: "/icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5"
      }
    ]
  },

  // Thème et couleurs
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  manifest: "/site.webmanifest"
}

export function generateHeaders() {
  return [
    {
      'Link': '</fonts/helvetica-neue.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous'
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link 
          rel="preload" 
          href="/fonts/helvetica-neue.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className={`${inter.className} bg-black`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
