"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { JobOffer } from "@/lib/supabase/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

interface TopCompaniesChartProps {
  data: JobOffer[]
}

const chartConfig = {
  value: {
    label: "Offres",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function TopCompaniesChart({ data }: TopCompaniesChartProps) {
  // Calculer les statistiques des types d'entreprises
  const companyStats = data.reduce((acc, job) => {
    if (job.COMPANY_TYPE) {
      acc[job.COMPANY_TYPE] = (acc[job.COMPANY_TYPE] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Convertir en format pour le graphique et trier par nombre d'offres
  const chartData = Object.entries(companyStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, value]) => ({ name, value }))

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Top 3 Types d'Entreprises</CardTitle>
        <CardDescription className="text-white/60">Distribution des types d'entreprises</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 20,
                right: 32,
                bottom: 20,
                left: 32,
              }}
            >
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.1)" />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide
              />
              <XAxis dataKey="value" type="number" hide />
              <Bar
                dataKey="value"
                fill="hsl(var(--chart-1))"
                radius={4}
                barSize={20}
              >
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  className="fill-white/60"
                  fontSize={12}
                  offset={10}
                />
                <LabelList
                  dataKey="value"
                  position="right"
                  offset={10}
                  className="fill-white"
                  fontSize={12}
                  formatter={(value: number) => `${value} offres`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          {chartData[0]?.name} est le type d'entreprise le plus représenté
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-white/60">
          Basé sur {data.length} offres d'emploi analysées
        </div>
      </CardFooter>
    </Card>
  )
} 