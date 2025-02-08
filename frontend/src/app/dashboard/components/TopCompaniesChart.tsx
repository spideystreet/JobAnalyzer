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

interface CompanyStats {
  company_type: string
  count: number
}

interface TopCompaniesChartProps {
  data: CompanyStats[]
}

const chartConfig = {
  value: {
    label: "Offres",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function TopCompaniesChart({ data }: TopCompaniesChartProps) {
  // Convertir en format pour le graphique et trier par nombre d'offres
  const chartData = data
    .slice(0, 3)
    .map(({ company_type: name, count: value }) => ({ name, value }))

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Top 3 Types d'Entreprises</CardTitle>
        <CardDescription className="text-white/60">Distribution des types d'entreprises</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 5,
                right: 50,
                bottom: 5,
                left: 5,
              }}
            >
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.1)" />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                width={100}
              />
              <XAxis 
                type="number" 
                hide 
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--chart-1))"
                radius={4}
                barSize={20}
              >
                <LabelList
                  dataKey="value"
                  position="right"
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