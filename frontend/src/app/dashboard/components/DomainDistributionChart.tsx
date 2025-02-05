"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { JobOffer } from "@/lib/supabase/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DomainDistributionChartProps {
  data: JobOffer[]
}

const COLORS = [
  'hsl(220, 70%, 50%)',  // Bleu
  'hsl(340, 75%, 55%)',  // Rose
  'hsl(30, 80%, 55%)',   // Orange
  'hsl(160, 60%, 45%)',  // Vert
  'hsl(280, 65%, 60%)',  // Violet
]

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  )
}

export default function DomainDistributionChart({ data }: DomainDistributionChartProps) {
  // Calculer la distribution des domaines
  const domainStats = data.reduce((acc, job) => {
    if (!job) return acc
    const domain = job.DOMAIN || "Non spécifié"
    acc[domain] = (acc[domain] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Convertir en format pour le graphique et trier par nombre d'offres
  const chartData = Object.entries(domainStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Limiter aux 10 premiers domaines
    .map(([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length]
    }))

  const domains = React.useMemo(() => chartData.map(item => item.name), [chartData])
  const [activeDomain, setActiveDomain] = React.useState(domains[0] || "")

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.name === activeDomain),
    [activeDomain, chartData]
  )

  const totalValue = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])

  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-white">Distribution des Domaines</CardTitle>
          <CardDescription className="text-white/60">Top 10 des domaines les plus représentés</CardDescription>
        </div>
        <Select value={activeDomain} onValueChange={setActiveDomain}>
          <SelectTrigger
            className="ml-auto h-7 w-[180px] rounded-lg pl-2.5 bg-black/40"
            aria-label="Sélectionner un domaine"
          >
            <SelectValue placeholder="Sélectionner un domaine" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {domains.map((domain, index) => (
              <SelectItem
                key={domain}
                value={domain}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                  {domain}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px] w-full flex items-center justify-center">
          <PieChart width={300} height={300}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx={150}
              cy={150}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveDomain(domains[index])}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        dy={-10}
                        className="fill-white text-2xl font-bold"
                      >
                        {chartData[activeIndex]?.value}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        dy={15}
                        className="fill-white/60 text-sm"
                      >
                        Offres
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
          </PieChart>
        </div>
      </CardContent>
    </Card>
  )
} 