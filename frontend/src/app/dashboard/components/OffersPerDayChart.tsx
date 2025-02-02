'use client'

import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { JobOffer } from '@/lib/supabase/types'

interface OffersPerDayChartProps {
  data: JobOffer[]
}

export default function OffersPerDayChart({ data }: OffersPerDayChartProps) {
  const chartData = useMemo(() => {
    const offersPerDay = data.reduce((acc: Record<string, number>, job) => {
      const date = format(parseISO(job.CREATED_AT), 'yyyy-MM-dd')
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return Object.entries(offersPerDay)
      .map(([date, count]) => ({
        date,
        count
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 p-2 rounded-lg shadow-lg border border-white/10">
          <p className="text-white font-medium">
            {format(parseISO(label), 'dd MMMM yyyy', { locale: fr })}
          </p>
          <p className="text-white/70">
            {payload[0].value} offres
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(parseISO(date), 'dd MMM', { locale: fr })}
            tick={{ fill: '#94A3B8' }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <YAxis
            tick={{ fill: '#94A3B8' }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <Tooltip content={CustomTooltip} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#0EA5E9"
            strokeWidth={2}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
} 