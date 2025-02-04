"use client"

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { JobOffer } from "@/lib/supabase/types"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface JobOffersChartProps {
  data: JobOffer[]
}

const chartConfig = {
  offers: {
    label: "Offres",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function JobOffersChart({ data }: JobOffersChartProps) {
  // Grouper les offres par jour
  const dailyData = data.reduce((acc, job) => {
    const date = new Date(job.CREATED_AT)
    const dayKey = date.toLocaleDateString('fr-FR', { 
      day: '2-digit',
      month: 'short'
    })
    
    acc[dayKey] = (acc[dayKey] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Convertir en format pour le graphique et trier par date
  const chartData = Object.entries(dailyData)
    .map(([day, offers]) => ({
      month: day,
      offers,
    }))
    .sort((a, b) => {
      const [dayA, monthA] = a.month.split(' ')
      const [dayB, monthB] = b.month.split(' ')
      const dateA = new Date(`${monthA} ${dayA}, 2024`)
      const dateB = new Date(`${monthB} ${dayB}, 2024`)
      return dateA.getTime() - dateB.getTime()
    })

  return (
    <>
      <h3 className="text-xl font-helvetica mb-4 text-white">Offres publiées par jour</h3>
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.split(' ')[0]}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
          <Line
            dataKey="offers"
            type="natural"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{
              fill: "hsl(var(--chart-1))",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    </>
  )
} 
