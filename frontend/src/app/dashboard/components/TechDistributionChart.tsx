'use client'

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

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
import { TJMChartData } from '@/lib/supabase/types'

interface TechDistributionChartProps {
  data: TJMChartData[]
}

type CustomActiveShapeProps = {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: {
    name: string
    value: number
  }
  value: number
  percent: number
}

const COLORS = [
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#10B981', // Green
  '#F59E0B', // Orange
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#06B6D4', // Cyan
]

export default function TechDistributionChart({ data }: TechDistributionChartProps) {
  // Calculer le total des occurrences
  const total = data.reduce((sum, item) => sum + item.count, 0)
  
  // Préparer les données pour le graphique
  const chartData = data
    .map(item => ({
      name: item.technology,
      value: item.count,
      fill: COLORS[data.indexOf(item) % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) // Limiter aux 10 technologies les plus demandées

  const [activeTech, setActiveTech] = React.useState(chartData[0]?.name)
  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.name === activeTech),
    [activeTech, chartData]
  )

  const renderActiveShape = React.useCallback((props: unknown) => {
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
    } = props as CustomActiveShapeProps

    return (
      <g>
        <text 
          x={cx} 
          y={cy} 
          dy={-10} 
          textAnchor="middle" 
          className="text-[16px] fill-white font-medium"
        >
          {payload.name}
        </text>
        <text 
          x={cx} 
          y={cy} 
          dy={15} 
          textAnchor="middle" 
          className="text-[14px] fill-white/60"
        >
          {value}
        </text>
        <text 
          x={cx} 
          y={cy} 
          dy={35} 
          textAnchor="middle" 
          className="text-[12px] fill-white/40"
        >
          Offres
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          strokeWidth={0}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
          strokeWidth={0}
        />
      </g>
    )
  }, [])

  return (
    <Card className="w-full bg-black">
      <CardContent className="p-0">
        <div className="h-[350px] w-full flex items-center justify-center">
          <PieChart width={350} height={350}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx={175}
              cy={175}
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              onMouseEnter={(_, index) => {
                setActiveTech(chartData[index].name)
              }}
              strokeWidth={0}
            />
          </PieChart>
        </div>
      </CardContent>
    </Card>
  )
} 