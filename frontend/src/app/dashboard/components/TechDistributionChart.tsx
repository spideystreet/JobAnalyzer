'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TJMChartData } from '@/lib/supabase/types'

interface TechDistributionChartProps {
  data: TJMChartData[]
}

const COLORS = [
  '#2DD4BF', // Teal
  '#0EA5E9', // Sky
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#F43F5E', // Rose
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#14B8A6', // Teal
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return percent * 100 >= 5 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-helvetica"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  ) : null
}

export default function TechDistributionChart({ data }: TechDistributionChartProps) {
  // Calculer le total des occurrences
  const total = data.reduce((sum, item) => sum + item.count, 0)
  
  // Préparer les données pour le graphique
  const chartData = data
    .map(item => ({
      name: item.technology,
      value: item.count,
      percentage: (item.count / total) * 100
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) // Limiter aux 10 technologies les plus demandées

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart className="font-helvetica">
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={160}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              className="stroke-background hover:opacity-80 transition-opacity"
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `${value} offres (${((value / total) * 100).toFixed(1)}%)`,
            'Nombre d\'offres'
          ]}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'Helvetica Neue'
          }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{
            paddingTop: '20px',
            fontFamily: 'Helvetica Neue',
            fontSize: '12px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
} 