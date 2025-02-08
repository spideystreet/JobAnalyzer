"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector, ResponsiveContainer, Cell } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { JobOffer } from "@/lib/supabase/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DomainStats {
  name: string
  value: number
}

interface DomainDistributionChartProps {
  data: DomainStats[]
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
    payload,
    percent,
    value
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
      <text 
        x={cx} 
        y={cy} 
        dy={-4} 
        textAnchor="middle" 
        fill="white"
        className="text-[12px]"
      >
        {payload.name}
      </text>
      <text 
        x={cx} 
        y={cy} 
        dy={14} 
        textAnchor="middle" 
        fill="white"
        className="text-[10px]"
      >
        {`${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  )
}

export default function DomainDistributionChart({ data }: DomainDistributionChartProps) {
  const chartData = data
    .slice(0, 10)
    .map((item, index) => ({
      ...item,
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
    <Card className="bg-black/80 backdrop-blur-xl border-white/10 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">Distribution des Domaines</CardTitle>
        <CardDescription className="text-white/60">
          Top 10 des domaines les plus demandés
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 h-[400px]">
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveDomain(domains[index])}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 overflow-auto py-2">
          {chartData.map((entry, index) => (
            <div 
              key={`legend-${index}`} 
              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white/5 p-1 rounded"
              onMouseEnter={() => setActiveDomain(entry.name)}
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-white/80 truncate">{entry.name}</span>
              <span className="text-white/60 ml-auto">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 