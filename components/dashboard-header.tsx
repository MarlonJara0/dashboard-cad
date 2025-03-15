'use client'

import { MonthSelector } from './MonthSelector'

interface DashboardHeaderProps {
  onMonthSelect: (month: string) => void
  selectedMonth?: string
}

export function DashboardHeader({ onMonthSelect, selectedMonth }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your accounts receivable metrics
        </p>
      </div>
      <div className="w-full md:w-[200px]">
        <MonthSelector onMonthSelect={onMonthSelect} selectedMonth={selectedMonth} />
      </div>
    </div>
  )
} 