import React from "react"
import { cn } from "@/lib/utils"

interface ColumnsProps {
  children: React.ReactNode
  className?: string
  columns?: number
  gap?: number
}

export function Columns({
  children,
  className,
  columns = 2,
  gap = 4,
}: ColumnsProps) {
  return (
    <div
      className={cn(
        `grid grid-cols-1 gap-${gap} md:grid-cols-${columns}`,
        className
      )}
    >
      {children}
    </div>
  )
} 