"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardTabsProps {
  children: React.ReactNode
  defaultValue?: string
  tabs: {
    value: string
    label: string
    content: React.ReactNode
  }[]
}

export function DashboardTabs({ 
  children, 
  defaultValue, 
  tabs 
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.value} className="space-y-4">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
} 