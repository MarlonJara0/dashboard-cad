"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Over30ChartProps {
  data: Array<{
    month: string;
    target: number;
    actual: number;
  }>;
}

export default function Over30Chart({ data }: Over30ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#2979ff"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#1565c0"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 