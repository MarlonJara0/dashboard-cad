'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

  return (
    <Select
      value={selectedMonth}
      onValueChange={(value) => {
        setSelectedMonth(value)
        onMonthChange(value)
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month} value={month}>
            {new Date(month).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 