'use client'

import { useEffect, useState } from 'react'
import { fetchAvailableMonths } from '@/lib/dashboard-data'

interface MonthSelectorProps {
  onMonthChange: (month: string) => void
}

export function MonthSelector({ onMonthChange }: MonthSelectorProps) {
  const [months, setMonths] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  useEffect(() => {
    const loadMonths = async () => {
      const availableMonths = await fetchAvailableMonths()
      setMonths(availableMonths)
      if (availableMonths.length > 0) {
        setSelectedMonth(availableMonths[0])
        onMonthChange(availableMonths[0])
      }
    }
    loadMonths()
  }, [onMonthChange])

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = event.target.value
    setSelectedMonth(month)
    onMonthChange(month)
  }

  return (
    <select
      value={selectedMonth}
      onChange={handleMonthChange}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
    >
      {months.map((month) => (
        <option key={month} value={month}>
          {month}
        </option>
      ))}
    </select>
  )
} 