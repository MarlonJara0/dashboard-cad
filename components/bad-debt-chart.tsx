"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface BadDebtChartProps {
  division?: 'PPA' | 'MCS' | 'EPM'
}

interface BadDebtCustomer {
  customer_name: string;
  total_fc_bd_eoq: number;
}

const CustomBar = (props: any) => {
  const { x, y, width, height, index } = props;
  const opacity = 1 - (index * 0.1);
  return (
    <g>
      <defs>
        <linearGradient id={`barGradient${index}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1565c0" stopOpacity={opacity} />
          <stop offset="100%" stopColor="#2979ff" stopOpacity={opacity} />
        </linearGradient>
      </defs>
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        fill={`url(#barGradient${index})`}
        rx={5} 
        ry={5}
        className="transition-all duration-300 hover:opacity-80"
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-2 shadow-sm">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-blue-600">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function BadDebtChart({ division = 'PPA' }: BadDebtChartProps) {
  const [chartData, setChartData] = useState<BadDebtCustomer[]>([]);

  useEffect(() => {
    async function fetchBadDebtData() {
      try {
        const { data, error } = await supabase
          .from('top_10_fc_bd_eoq_entities')
          .select('customer_name, total_fc_bd_eoq')
          .eq('entity', division)
          .order('total_fc_bd_eoq', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching bad debt data:', error);
          return;
        }

        if (data) {
          setChartData(data);
        }
      } catch (error) {
        console.error('Error in fetchBadDebtData:', error);
      }
    }

    fetchBadDebtData();
  }, [division]);

  const formattedData = chartData.map(item => ({
    name: item.customer_name,
    value: item.total_fc_bd_eoq
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{division} Bad Debt Customers</CardTitle>
        <CardDescription>Top customers with highest bad debt impact</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[350px]">
          {/* Scrollable chart area */}
          <div className="flex-1 relative">
            <ScrollArea className="h-[300px]">
              <div className="pr-4">
                <ResponsiveContainer width="100%" height={Math.max(300, formattedData.length * 50)}>
                  <BarChart
                    data={formattedData}
                    layout="vertical"
                    margin={{
                      left: 0,
                      right: 20,
                      top: 5,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      horizontal={false}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      width={120}
                      fontSize={12}
                      style={{
                        fill: "hsl(var(--muted-foreground))"
                      }}
                    />
                    <XAxis 
                      dataKey="value"
                      type="number"
                      hide
                      domain={[0, 'dataMax']}
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar 
                      dataKey="value"
                      shape={<CustomBar />}
                      className="cursor-pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ScrollArea>
          </div>
          
          {/* Fixed X-axis container */}
          <div className="h-[50px] border-t">
            <ResponsiveContainer width="100%" height={50}>
              <BarChart
                data={formattedData}
                layout="vertical"
                margin={{
                  left: 120,
                  right: 20,
                  top: 0,
                  bottom: 0,
                }}
              >
                <XAxis 
                  dataKey="value" 
                  type="number"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tickLine={true}
                  axisLine={true}
                  fontSize={12}
                  style={{
                    fill: "hsl(var(--muted-foreground))"
                  }}
                  height={50}
                  tickMargin={5}
                  domain={[0, 'dataMax']}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 