'use client'

import { useState, useEffect } from 'react'
import { fetchAvailableMonths } from '@/lib/dashboard-data'

interface MonthSelectorProps {
  onMonthSelect: (month: string) => void
  selectedMonth?: string
}

export function MonthSelector({ onMonthSelect, selectedMonth }: MonthSelectorProps) {
  const [months, setMonths] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMonths = async () => {
      try {
        const availableMonths = await fetchAvailableMonths()
        setMonths(availableMonths)
        if (!selectedMonth && availableMonths.length > 0) {
          onMonthSelect(availableMonths[0])
        }
      } catch (error) {
        console.error('Error loading months:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMonths()
  }, [onMonthSelect, selectedMonth])

  const formatMonthDisplay = (monthStr: string) => {
    try {
      const date = new Date(monthStr)
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } catch (error) {
      console.error('Error formatting date:', error)
      return monthStr
    }
  }

  if (loading) {
    return <div>Loading months...</div>
  }

  return (
    <select
      value={selectedMonth || ''}
      onChange={(e) => onMonthSelect(e.target.value)}
      className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
    >
      {months.map((month) => (
        <option key={month} value={month}>
          {formatMonthDisplay(month)}
        </option>
      ))}
    </select>
  )
} 