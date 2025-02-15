"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { cn } from "@/lib/utils"

interface PerformanceTablesProps {
  over30Data?: ReadonlyArray<{
    readonly customer: string;
    readonly amount: string;
    readonly status: string;
    readonly daysOverdue: string;
  }>;
  over90Data?: ReadonlyArray<{
    readonly customer: string;
    readonly amount: string;
    readonly status: string;
    readonly daysOverdue: string;
  }>;
}

export function PerformanceTables({ over30Data = [], over90Data = [] }: PerformanceTablesProps) {
  // Format currency
  const formatCurrency = (amount: string) => {
    const value = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  console.log("Performance Tables Data:", {
    over30Count: over30Data.length,
    over90Count: over90Data.length,
    over30Sample: over30Data[0],
    over90Sample: over90Data[0]
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Over 30 Days Impact</CardTitle>
          <CardDescription>Top 10 customers impacting over 30 days performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Days Overdue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {over30Data.map((item) => (
                <TableRow key={item.customer}>
                  <TableCell className="font-medium">{item.customer}</TableCell>
                  <TableCell>{formatCurrency(item.amount)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{item.daysOverdue}</TableCell>
                </TableRow>
              ))}
              {over30Data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Over 90 Days Impact</CardTitle>
          <CardDescription>Top 10 customers impacting over 90 days performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Days Overdue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {over90Data.map((item) => (
                <TableRow key={item.customer}>
                  <TableCell className="font-medium">{item.customer}</TableCell>
                  <TableCell>{formatCurrency(item.amount)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{item.daysOverdue}</TableCell>
                </TableRow>
              ))}
              {over90Data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 