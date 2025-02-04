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
  data: {
    technology: string
    count: number
  }[]
}

export default function TechDistributionChart({ data }: TechDistributionChartProps) {
  // Trier les données par nombre d'offres décroissant
  const chartData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Limiter aux 10 premières technologies
    .map(item => ({
      name: item.technology,
      value: item.count
    }))

  const topTech = chartData[0]?.name || "Aucune technologie"

  // Hauteur fixe pour 10 technologies
  const chartHeight = 400

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Distribution des Technologies</CardTitle>
        <CardDescription className="text-white/60">Répartition des technologies les plus demandées</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${chartHeight}px` }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 32, bottom: 20, left: 150 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="rgba(255,255,255,0.5)"
                width={140}
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
                formatter={(value: number) => [`${value} offres`, "Offres"]}
              />
              <Bar 
                dataKey="value" 
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
          Basé sur {data.length} technologies analysées
        </div>
      </CardFooter>
    </Card>
  )
} 