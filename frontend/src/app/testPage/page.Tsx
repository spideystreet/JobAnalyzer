"use client"

import * as React from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", ventes: 4000, revenus: 2400 },
  { month: "Fév", ventes: 3000, revenus: 1398 },
  { month: "Mar", ventes: 2000, revenus: 9800 },
  { month: "Avr", ventes: 2780, revenus: 3908 },
  { month: "Mai", ventes: 1890, revenus: 4800 },
  { month: "Jun", ventes: 2390, revenus: 3800 },
]

const chartConfig = {
  ventes: {
    label: "Ventes",
    theme: {
      light: "hsl(220 80% 60%)",
      dark: "hsl(220 80% 70%)",
    },
  },
  revenus: {
    label: "Revenus",
    theme: {
      light: "hsl(150 80% 40%)",
      dark: "hsl(150 80% 50%)",
    },
  },
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      
      <div className="w-full h-[400px] border rounded-lg p-4">
        <ChartContainer config={chartConfig}>
          <AreaChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip
              content={props => (
                <ChartTooltipContent {...props} />
              )}
            />
            <ChartLegend
              content={props => (
                <ChartLegendContent {...props} />
              )}
            />
            <Area
              type="monotone"
              dataKey="ventes"
              stroke="var(--color-ventes)"
              fill="var(--color-ventes)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="revenus"
              stroke="var(--color-revenus)"
              fill="var(--color-revenus)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}