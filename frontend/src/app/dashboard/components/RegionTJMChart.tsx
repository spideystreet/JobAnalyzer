"use client"

import { TrendingUp } from "lucide-react"
import { JobOffer } from "@/lib/supabase/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface RegionTJMChartProps {
  data: JobOffer[]
}

export default function RegionTJMChart({ data }: RegionTJMChartProps) {
  // Calculer les TJM moyens par région
  const regionStats = data.reduce((acc, job) => {
    if (!job.REGION || !job.TJM_MIN || !job.TJM_MAX) return acc
    
    if (!acc[job.REGION]) {
      acc[job.REGION] = {
        count: 0,
        totalTJMMin: 0,
        totalTJMMax: 0
      }
    }
    
    acc[job.REGION].count += 1
    acc[job.REGION].totalTJMMin += job.TJM_MIN
    acc[job.REGION].totalTJMMax += job.TJM_MAX
    
    return acc
  }, {} as Record<string, { count: number; totalTJMMin: number; totalTJMMax: number }>)

  // Convertir en format pour l'affichage et trier par TJM moyen
  const chartData = Object.entries(regionStats)
    .map(([region, stats]) => ({
      region,
      tjmMoyen: Math.round((stats.totalTJMMin + stats.totalTJMMax) / (2 * stats.count)),
      tjmMin: Math.round(stats.totalTJMMin / stats.count),
      tjmMax: Math.round(stats.totalTJMMax / stats.count),
      count: stats.count
    }))
    .filter(item => item.count >= 15) // Filtrer les régions avec moins de 15 offres
    .sort((a, b) => b.tjmMoyen - a.tjmMoyen)
    .slice(0, 3)

  // Si aucune région ne correspond aux critères
  if (chartData.length === 0) {
    return (
      <Card className="bg-black/80 backdrop-blur-xl border-white/10 h-full">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-white text-base">Top 3 Régions par TJM</CardTitle>
          <CardDescription className="text-white/60 text-xs">Les régions les plus attractives</CardDescription>
        </CardHeader>
        <CardContent className="p-3 flex items-center justify-center">
          <div className="text-white/60 text-sm">
            Aucune région avec plus de 15 offres
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/10 h-full">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-white text-base">Top 3 Régions par TJM</CardTitle>
        <CardDescription className="text-white/60 text-xs">Les régions les plus attractives</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex justify-between gap-2">
          {chartData.map((item, index) => (
            <div 
              key={item.region} 
              className="flex-1 flex items-center gap-3 p-2 rounded-lg bg-white/5"
            >
              <div className={`
                size-6 rounded-full flex items-center justify-center font-semibold text-black text-xs
                ${index === 0 ? 'bg-[#FFD700]' : ''}
                ${index === 1 ? 'bg-[#C0C0C0]' : ''}
                ${index === 2 ? 'bg-[#CD7F32]' : ''}
              `}>
                #{index + 1}
              </div>
              <div>
                <div className="font-medium text-white text-sm truncate max-w-[80px]">
                  {item.region}
                </div>
                <div className="text-white font-bold text-base">
                  {item.tjmMoyen}€
                </div>
                <div className="text-[10px] text-white/70">
                  {item.count} offre{item.count > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 