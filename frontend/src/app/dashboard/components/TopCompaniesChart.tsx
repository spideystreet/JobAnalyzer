"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

interface CompanyStats {
  company_type: string
  count: number
}

interface TopCompaniesChartProps {
  data: CompanyStats[]
}

export default function TopCompaniesChart({ data }: TopCompaniesChartProps) {
  // Convertir en format pour le graphique et trier par nombre d'offres
  const chartData = data
    .slice(0, 3)
    .map(({ company_type: name, count: value }) => ({ name, value }))

  // Calculer le nombre total d'offres
  const totalOffers = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Top 3 des types d&apos;entreprises</CardTitle>
        <CardDescription className="text-white/60">Nuance (exemple) : si une ESN recrute pour un Grand Compte, elle sera comptabilisée comme Grand Compte</CardDescription>
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
                  position="insideRight"
                  fill="white"
                  formatter={(value: number) => `${value} offres`}
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-white">
          {chartData[0]?.name} est le type d&apos;entreprise le plus représenté
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-white/60">
          Basé sur {totalOffers} offres d&apos;emploi analysées
        </div>
      </CardFooter>
    </Card>
  )
} 