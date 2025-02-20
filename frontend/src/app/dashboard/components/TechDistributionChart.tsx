"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useMemo } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

import { EmptyState } from "@/components/ui/empty-state"

interface TechDistributionChartProps {
  data: Array<{
    TECHNOS: string[]
    TJM_MIN: number
    TJM_MAX: number
    TJM_AVG: number
  }>
}

export default function TechDistributionChart({ data }: TechDistributionChartProps) {
  const processedData = useMemo(() => {
    // Compter les occurrences de chaque technologie
    const techCount = data.reduce((acc, curr) => {
      const techs = curr.TECHNOS || []
      techs.forEach((tech: string) => {
        acc[tech] = (acc[tech] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    // Convertir en tableau et trier par nombre d'occurrences
    return Object.entries(techCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Prendre les 10 premiers
  }, [data])

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <EmptyState 
        title="Distribution des technologies"
        description="Répartition des technologies les plus demandées"
      />
    )
  }

  try {
    // Calculer les statistiques par technologie
    const techStats = data.reduce((acc, job) => {
      if (!Array.isArray(job.TECHNOS)) return acc
      
      job.TECHNOS.forEach(tech => {
        if (!tech || typeof tech !== 'string') return
        
        if (!acc[tech]) {
          acc[tech] = {
            count: 0,
            totalTJM: 0
          }
        }
        acc[tech].count += 1
        acc[tech].totalTJM += job.TJM_AVG || 0
      })
      return acc
    }, {} as Record<string, { count: number; totalTJM: number }>)

    // Convertir en format pour le graphique
    const chartData = Object.entries(techStats)
      .map(([tech, stats]) => ({
        name: tech,
        count: stats.count,
        avgTJM: Math.round(stats.totalTJM / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    if (chartData.length === 0) {
      return (
        <EmptyState 
          title="Distribution des technologies"
          description="Répartition des technologies les plus demandées"
          message="Aucune technologie trouvée dans les données"
        />
      )
    }

    const topTech = chartData[0]?.name || "Aucune technologie"

    return (
      <Card className="bg-black/80 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Distribution des technologies</CardTitle>
          <CardDescription className="text-white/60">
            Top 10 des technologies les plus demandées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={processedData} 
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number" 
                  domain={[0, 'dataMax']}
                  tickFormatter={(value) => `${value}`}
                  tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: 'rgba(255, 255, 255, 0.8)' }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                  }}
                  itemStyle={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  labelStyle={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  formatter={(value: number) => [`${value} offres`, 'Nombre d\'offres']}
                />
                <Bar 
                  dataKey="count" 
                  fill="rgba(147, 51, 234, 0.8)" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none text-white">
            {topTech} est la technologie la plus demandée
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-white/60">
            Basé sur {Object.keys(techStats).length} technologies analysées
          </div>
        </CardFooter>
      </Card>
    )
  } catch (error) {
    console.error('Erreur dans TechDistributionChart:', error)
    return (
      <EmptyState 
        title="Distribution des technologies"
        description="Répartition des technologies les plus demandées"
        message="Erreur lors du traitement des données"
      />
    )
  }
} 