'use client'

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from "recharts"
import { JobOffer } from "@/lib/supabase/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

interface ExperienceDistributionChartProps {
  data: JobOffer[]
}

export default function ExperienceDistributionChart({ data }: ExperienceDistributionChartProps) {
  // Calculer la distribution des niveaux d'expérience
  const experienceStats = data.reduce((acc, job) => {
    const exp = job.XP || "Non spécifié"
    acc[exp] = (acc[exp] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Convertir en format pour le graphique et trier
  const chartData = Object.entries(experienceStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const topExperience = chartData[0]?.name || "Non spécifié"

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Distribution des niveaux d&apos;expérience</CardTitle>
        <CardDescription className="text-white/60">Répartition des offres par niveau d&apos;expérience requis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 15,
                right: 30,
                left: 20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.8)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "white" }}
                itemStyle={{ color: "white" }}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(340, 75%, 55%)"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="white"
                  formatter={(value: number) => `${value} offres`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          {topExperience} est le niveau d&apos;expérience le plus demandé
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-white/60">
          Basé sur {data.length} offres d&apos;emploi analysées
        </div>
      </CardFooter>
    </Card>
  )
} 