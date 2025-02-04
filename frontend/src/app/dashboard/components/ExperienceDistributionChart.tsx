'use client'

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { JobOffer } from '@/lib/supabase/types'

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const XP_LEVELS = [
  "Junior",
  "Intermédiaire",
  "Confirmé",
  "Sénior"
]

interface ExperienceDistributionChartProps {
  data: JobOffer[]
}

const chartConfig = {
  count: {
    label: "Offres",
    color: "hsl(var(--chart-1))"
  },
  Junior: {
    label: "Junior",
    color: "hsl(var(--chart-1))",
  },
  Intermédiaire: {
    label: "Intermédiaire",
    color: "hsl(var(--chart-2))",
  },
  Confirmé: {
    label: "Confirmé",
    color: "hsl(var(--chart-3))",
  },
  Sénior: {
    label: "Sénior",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function ExperienceDistributionChart({ data }: ExperienceDistributionChartProps) {
  // Calculer la distribution des niveaux d'expérience
  const experienceDistribution = XP_LEVELS.map(level => {
    const count = data.filter(job => job.XP === level).length
    return {
      xp: level,
      count: count,
      fill: `hsl(var(--chart-${XP_LEVELS.indexOf(level) + 1}))`,
      percentage: (count / data.length) * 100
    }
  })

  return (
    <Card className="bg-transparent">
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={experienceDistribution}
              margin={{
                top: 30,
                right: 15,
                bottom: 5,
                left: 15,
              }}
            >
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="xp"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white',
                }}
                formatter={(value: number, name: string) => [
                  `${value} offres`,
                  chartConfig[name as keyof typeof chartConfig]?.label || name
                ]}
              />
              <Bar
                dataKey="count"
                strokeWidth={2}
                radius={8}
                maxBarSize={60}
                fill="currentColor"
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  )
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 