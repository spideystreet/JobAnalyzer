"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { JobOffer } from "@/lib/supabase/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

interface OffersPerDayChartProps {
  data: JobOffer[]
}

export default function OffersPerDayChart({ data }: OffersPerDayChartProps) {
  // Grouper les offres par jour
  const offersPerDay = data.reduce((acc, job) => {
    const date = new Date(job.CREATED_AT).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    })
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Convertir en format pour le graphique et trier par date
  const chartData = Object.entries(offersPerDay)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculer la tendance
  const trend = chartData.length >= 2 
    ? ((chartData[chartData.length - 1].value - chartData[0].value) / chartData[0].value) * 100 
    : 0

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Offres publiées par jour</CardTitle>
        <CardDescription className="text-white/60">Évolution du nombre d'offres publiées</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 32, bottom: 20, left: 32 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => value}
              />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "white" }}
                itemStyle={{ color: "white" }}
                formatter={(value: number) => [`${value} offres`, "Offres"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-3))"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          {trend > 0 ? "Augmentation" : "Diminution"} de {Math.abs(trend).toFixed(1)}% sur la période
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-white/60">
          Basé sur {data.length} offres d'emploi analysées
        </div>
      </CardFooter>
    </Card>
  )
} 