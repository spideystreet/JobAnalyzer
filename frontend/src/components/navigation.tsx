"use client"

import { Home, User, Settings, Mail } from "lucide-react"
import { AnimeNavBar } from "@/components/ui/anime-navbar"

const navItems = [
  { name: "Home", url: "/home", icon: Home },
  { name: "Contact", url: "/contact", icon: Mail }
]   

export function Navigation() {
  return <AnimeNavBar items={navItems} />
} 