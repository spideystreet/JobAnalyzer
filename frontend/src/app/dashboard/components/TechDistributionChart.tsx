"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

interface TechDistributionChartProps {
  data: Array<{
    TECHNOS: string[]
    TJM_MIN: number
    TJM_MAX: number
    TJM_AVG: number
  }>
}

const EmptyChart = ({ message = "Aucune donnée disponible" }) => (
  <Card className="bg-black/80 backdrop-blur-xl border-white/10">
    <CardHeader>
      <CardTitle className="text-white">Distribution des technologies</CardTitle>
      <CardDescription className="text-white/60">
        Répartition des technologies les plus demandées
      </CardDescription>
    </CardHeader>
    <CardContent className="flex items-center justify-center min-h-[300px]">
      <div className="text-white/60">
        {message}
      </div>
    </CardContent>
  </Card>
)

export default function TechDistributionChart({ data }: TechDistributionChartProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return <EmptyChart />
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
      return <EmptyChart message="Aucune technologie trouvée dans les données" />
    }

    const topTech = chartData[0]?.name || "Aucune technologie"

    return (
      <Card className="bg-black/80 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Distribution des Technologies</CardTitle>
          <CardDescription className="text-white/60">
            Top 10 des technologies les plus demandées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 32, bottom: 20, left: 150 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  type="number" 
                  stroke="rgba(255,255,255,0.5)"
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)"
                  width={140}
                  tick={{ 
                    fill: 'rgba(255,255,255,0.8)',
                    fontSize: 12
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "white" }}
                  itemStyle={{ color: "white" }}
                  formatter={(value: number, name: string) => {
                    if (name === "count") return [`${value} offres`, "Nombre d'offres"]
                    if (name === "avgTJM") return [`${value}€`, "TJM moyen"]
                    return [value, name]
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--chart-1))" 
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
    return <EmptyChart message="Erreur lors du traitement des données" />
  }
} 