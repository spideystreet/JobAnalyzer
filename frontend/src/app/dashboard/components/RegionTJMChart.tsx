"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { JobOffer } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"

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
    <Card className="bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Top 3 Régions par TJM</CardTitle>
        <CardDescription className="text-white/60">
          Les régions les plus attractives
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-3 gap-2">
          {chartData.map((region, index) => (
            <div
              key={region.region}
              className="flex flex-col items-center justify-between p-3 rounded-lg bg-black/40"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  index === 0 ? "bg-yellow-500" : 
                  index === 1 ? "bg-gray-400" : 
                  "bg-amber-700"
                )}>
                  #{index + 1}
                </div>
                <span className="text-white/90 text-sm font-medium truncate max-w-[100px]" title={region.region}>
                  {region.region}
                </span>
              </div>
              <div className="text-white font-bold">{region.tjmMoyen}€</div>
              <div className="text-white/60 text-xs">{region.count} offres</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 