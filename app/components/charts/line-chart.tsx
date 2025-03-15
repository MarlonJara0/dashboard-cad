'use client'

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface LineChartProps {
  data: Array<{
    month: string
    target: number
    actual: number
  }>
}

export function LineChart({ data }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsLineChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 5"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
} 