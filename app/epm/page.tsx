"use client"

import { LineChartComponent } from "@/components/line-chart"
import { BadDebtChart } from "@/components/bad-debt-chart"
import { PerformanceTables } from "@/components/performance-tables"
import { fetchDashboardData, subscribeToActions, TransformedData } from "@/lib/dashboard-data"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ListTodo } from "lucide-react"
import { useState, useEffect } from "react"

// Disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const chartConfig = {
  target: {
    label: "Target",
    color: "#2979ff", // Light blue
  },
  actual: {
    label: "Actual",
    color: "#1565c0", // Darker blue
  },
} 

export default function EPMDashboardPage() {
  const [data, setData] = useState<TransformedData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const dashboardData = await fetchDashboardData('EPM')
      setData(dashboardData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToActions('EPM', () => {
      fetchData()
    })

    return () => {
      // Cleanup subscription on component unmount
      unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">EPM Overview</h1>
        <div className="rounded-lg border p-4 bg-blue-50 text-blue-600">
          Loading data...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">EPM Overview</h1>
        <div className="rounded-lg border p-4 bg-blue-50 text-blue-600">
          Error loading data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">EPM Overview</h1>
      <div className="flex justify-end">
        <p className="text-sm text-muted-foreground mb-2">Report as of 01/31/2025</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingActionsCount}</div>
            <p className="text-xs text-muted-foreground">
              Active tasks requiring attention
            </p>
          </CardContent>
        </Card>
        <div className="rounded-lg border p-4 bg-white">
          <h2 className="font-semibold">Over 30 Days Balance</h2>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.totalOver30)}</p>
        </div>
        <div className="rounded-lg border p-4 bg-white">
          <h2 className="font-semibold">Over 90 Days Balance</h2>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.totalOver90)}</p>
        </div>
        <div className="rounded-lg border p-4 bg-white">
          <h2 className="font-semibold">Total Forecasted Bad Debt EOQ</h2>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.totalFcBdEoq)}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LineChartComponent 
          title="Over30 Performance"
          description="Showing performance metrics for accounts over 30 days"
          data={data.over30Data}
          yAxisDomain={[0, 50]}
          yAxisTicks={[0, 10, 20, 30, 40, 50]}
        />
        <LineChartComponent 
          title="Over90 Performance"
          description="Showing performance metrics for accounts over 90 days"
          data={data.over90Data}
          yAxisDomain={[0, 30]}
          yAxisTicks={[0, 5, 10, 15, 20, 25, 30]}
        />
        <BadDebtChart division="EPM" />
      </div>
      <PerformanceTables 
        over30Data={data.over30PerformanceData}
        over90Data={data.over90PerformanceData}
      />
    </div>
  );
} 