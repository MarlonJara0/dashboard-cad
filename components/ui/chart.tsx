"use client"

import * as React from "react"
import { Circle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"

export type ChartConfig = Record<string, { label: string; color: string }>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({
  config,
  children,
  ...props
}: ChartContainerProps) {
  const cssProperties = React.useMemo(() => {
    return Object.entries(config).reduce((acc, [key, value]) => {
      acc[`--color-${key}`] = value.color
      return acc
    }, {} as Record<string, string>)
  }, [config])

  return (
    <div style={cssProperties} {...props}>
      {children}
    </div>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  config?: ChartConfig
  indicator?: "line" | "dot"
}

export function ChartTooltipContent({
  active,
  payload,
  config,
  indicator = "line",
}: ChartTooltipContentProps) {
  if (!active || !payload?.length || !config) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        {payload.map(({ value, name }) => (
          <div key={name} className="flex items-center gap-2">
            {indicator === "line" ? (
              <div
                className="h-0.5 w-3"
                style={{ background: config[name]?.color }}
              />
            ) : (
              <Circle style={{ color: config[name]?.color }} />
            )}
            <span className="font-medium">{config[name]?.label}:</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Tooltip as ChartTooltip, TooltipContent, TooltipProvider, TooltipTrigger } 