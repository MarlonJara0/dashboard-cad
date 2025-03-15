"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface LineChartProps {
  title: string
  description: string
  data: ReadonlyArray<{
    readonly month: string
    readonly target: number
    readonly actual: number
  }>
  yAxisDomain?: [number, number]
  yAxisTicks?: number[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-2 shadow-sm">
        <p className="text-sm text-muted-foreground">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm font-bold" style={{ color: item.color }}>
            {item.name}: {item.value.toFixed(1)}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

CustomTooltip.displayName = 'CustomTooltip';

export const LineChartComponent = React.memo(function LineChartComponent({
  title,
  description,
  data: readonlyData,
  yAxisDomain = [0, 50],
  yAxisTicks = [0, 10, 20, 30, 40, 50]
}: LineChartProps) {
  // Create a mutable copy of the data for Recharts
  const data = [...readonlyData]
  
  console.log('LineChartComponent data:', { title, data })

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const gradientId = `gradient-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const targetGradientId = `target-${gradientId}`;
  const actualGradientId = `actual-${gradientId}`;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id={targetGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#90caf9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#90caf9" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id={actualGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bbdefb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#bbdefb" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3"
                vertical={true}
                horizontal={true}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                tickFormatter={(value) => value.slice(0, 3)}
                tickLine={false}
                axisLine={false}
                dy={10}
                fontSize={12}
                style={{
                  fill: "hsl(var(--muted-foreground))"
                }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                domain={yAxisDomain}
                ticks={yAxisTicks}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                style={{
                  fill: "hsl(var(--muted-foreground))"
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="target"
                stroke="none"
                fill={`url(#${targetGradientId})`}
                fillOpacity={1}
                isAnimationActive={false}
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="none"
                fill={`url(#${actualGradientId})`}
                fillOpacity={1}
                isAnimationActive={false}
                stackId="2"
              />
              <Line
                name="Target"
                type="monotone"
                dataKey="target"
                stroke="#1976d2"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                name="Actual"
                type="monotone"
                dataKey="actual"
                stroke="#2196f3"
                strokeWidth={2}
                dot={{ fill: '#2196f3', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}); 