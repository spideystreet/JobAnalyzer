'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import { JobOffer } from '@/lib/supabase/types'

interface ExperienceDistributionChartProps {
  data: JobOffer[]
}

const XP_LEVELS = [
  "Junior (0-2 ans)",
  "Confirmé (2-5 ans)",
  "Senior (5-8 ans)",
  "Expert (8+ ans)"
]

export default function ExperienceDistributionChart({ data }: ExperienceDistributionChartProps) {
  // Calculer la distribution des niveaux d'expérience
  const experienceDistribution = XP_LEVELS.map(level => {
    const count = data.filter(job => job.XP === level).length
    return {
      name: level,
      count: count,
      percentage: (count / data.length) * 100
    }
  })

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={experienceDistribution}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="rgba(255,255,255,0.1)"
          vertical={false}
        />
        <XAxis 
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fill: 'white', fontSize: 12 }}
          tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
        />
        <YAxis 
          tick={{ fill: 'white', fontSize: 12 }}
          tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          label={{ 
            value: "Nombre d'offres", 
            angle: -90, 
            position: 'insideLeft',
            fill: 'white',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip
          formatter={(value: number) => [
            `${value} offres (${((value / data.length) * 100).toFixed(1)}%)`,
            'Nombre d\'offres'
          ]}
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'white',
            fontFamily: 'Helvetica Neue'
          }}
          labelStyle={{ color: 'white' }}
          itemStyle={{ color: 'white' }}
          wrapperStyle={{ outline: 'none' }}
        />
        <Bar 
          dataKey="count"
          fill="#2DD4BF"
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 