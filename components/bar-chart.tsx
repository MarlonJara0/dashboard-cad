"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BarChartProps {
  customColors?: {
    value: {
      label: string
      color: string
    }
  }
}

// Sample data with more items
const chartData = [
  { name: "Item 1", value: 275 },
  { name: "Item 2", value: 250 },
  { name: "Item 3", value: 225 },
  { name: "Item 4", value: 200 },
  { name: "Item 5", value: 175 },
  { name: "Item 6", value: 150 },
  { name: "Item 7", value: 125 },
  { name: "Item 8", value: 100 },
  { name: "Item 9", value: 75 },
  { name: "Item 10", value: 50 },
]

const chartConfig = {
  value: {
    label: "Value",
    color: "#2979ff",
  }
} satisfies ChartConfig

const CustomBar = (props: any) => {
  const { x, y, width, height, index } = props;
  const opacity = 1 - (index * 0.1);
  return <rect x={x} y={y} width={width} height={height} fill="#2979ff" fillOpacity={opacity} rx={5} ry={5} />;
};

export function BarChartComponent({ customColors }: BarChartProps) {
  const defaultColors = {
    value: {
      label: "Value",
      color: "#2979ff",
    }
  }

  const colors = customColors || defaultColors

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bad Debt Customers</CardTitle>
        <CardDescription>Customers with highest bad debt impact</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ScrollArea className="h-[300px] pr-4">
            <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 50)}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0,
                  right: 20,
                  top: 0,
                  bottom: 0,
                }}
              >
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={80}
                />
                <XAxis dataKey="value" type="number" hide />
                <Bar 
                  dataKey="value" 
                  layout="vertical"
                  shape={<CustomBar />}
                  fill={colors.value.color}
                />
              </BarChart>
            </ResponsiveContainer>
          </ScrollArea>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing top customers with bad debt
        </div>
      </CardFooter>
    </Card>
  )
} 