'use client'

import { ColumnDef } from '@tanstack/react-table'

interface PerformanceData {
  customer: string
  amount: string
  status: string
  daysOverdue: string
}

export const columns: ColumnDef<PerformanceData>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'daysOverdue',
    header: 'Days Overdue',
  },
] 