'use client'

import { ReactNode } from 'react'

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && (
          <p className="text-muted-foreground">
            {text}
          </p>
        )}
      </div>
      {children && (
        <div className="w-full md:w-[200px]">
          {children}
        </div>
      )}
    </div>
  )
} 