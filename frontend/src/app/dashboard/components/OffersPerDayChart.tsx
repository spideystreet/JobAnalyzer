'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { JobOffer } from '@/lib/supabase/types'

interface OffersPerDayChartProps {
  data: JobOffer[]
}

export default function OffersPerDayChart({ data }: OffersPerDayChartProps) {
  // Grouper les offres par jour
  const offersPerDay = data.reduce((acc: { [key: string]: number }, offer) => {
    const date = new Date(offer.CREATED_AT).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  // Convertir en tableau et trier par date
  const chartData = Object.entries(offersPerDay)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Formater la date pour l'affichage
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short'
    }).format(date)
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} className="font-helvetica">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          angle={-45}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 12, fontFamily: 'Helvetica Neue' }}
        />
        <YAxis 
          label={{ 
            value: 'Nombre d\'offres', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontFamily: 'Helvetica Neue' }
          }}
          tick={{ fontSize: 12, fontFamily: 'Helvetica Neue' }}
        />
        <Tooltip 
          formatter={(value: number) => [`${value} offres`, 'Nombre d\'offres']}
          labelFormatter={formatDate}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'Helvetica Neue'
          }}
        />
        <Legend 
          wrapperStyle={{
            fontFamily: 'Helvetica Neue',
            fontSize: '12px'
          }}
        />
        <Bar 
          dataKey="count" 
          fill="#2DD4BF"
          name="Offres publiées"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 