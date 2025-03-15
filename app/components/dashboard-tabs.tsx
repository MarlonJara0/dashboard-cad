'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@/components/charts/line-chart'
import { DataTable } from '@/components/data-table'
import { columns } from '@/components/columns'
import { TransformedData } from '@/lib/dashboard-data'

interface DashboardTabsProps {
  data: TransformedData
}

export function DashboardTabs({ data }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Over 30
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalOver30.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Over 90
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalOver90.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.pendingActionsCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total FC BD EOQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalFcBdEoq.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Over 30 Trend</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <LineChart data={data.over30Data} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Over 30 Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data.over30PerformanceData} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Over 90 Trend</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <LineChart data={data.over90Data} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Over 90 Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data.over90PerformanceData} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="space-y-4">
        {/* Add analytics content here */}
      </TabsContent>
    </Tabs>
  )
} 