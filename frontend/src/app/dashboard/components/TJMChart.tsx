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
import { TJMChartData } from '@/lib/supabase/types'

interface TJMChartProps {
  data: TJMChartData[]
}

export default function TJMChart({ data }: TJMChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="technology" 
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis 
          label={{ 
            value: 'TJM (€)', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip 
          formatter={(value: number) => [`${value}€`, 'TJM Moyen']}
          labelStyle={{ color: 'black' }}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <Legend />
        <Bar 
          dataKey="tjmMoyen" 
          fill="#2DD4BF"
          name="TJM Moyen"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 