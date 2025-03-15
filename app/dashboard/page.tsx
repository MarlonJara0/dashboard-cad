'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchDashboardData, type TransformedData } from '@/lib/dashboard-data'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardShell } from '@/components/dashboard-shell'
import { MonthSelector } from '@/components/MonthSelector'
import { DashboardTabs } from '@/components/dashboard-tabs'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<TransformedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const entity = searchParams.get('entity') || 'PPA'

  const loadData = async (month?: string) => {
    setLoading(true)
    try {
      const dashboardData = await fetchDashboardData(entity as 'PPA' | 'MCS' | 'EPM', month)
      setData(dashboardData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(selectedMonth)
  }, [entity, selectedMonth])

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
  }

  if (loading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Dashboard"
          text="Overview of your collection metrics."
        >
          <Skeleton className="w-[180px] h-10" />
        </DashboardHeader>
        <div className="grid gap-4">
          <Skeleton className="h-[500px]" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your collection metrics."
      >
        <MonthSelector onMonthChange={handleMonthChange} />
      </DashboardHeader>
      {data && <DashboardTabs data={data} />}
    </DashboardShell>
  )
} 