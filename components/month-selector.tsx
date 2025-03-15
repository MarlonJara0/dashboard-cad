'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchAvailableMonths } from '@/lib/dashboard-data'

interface MonthSelectorProps {
  onMonthChange: (month: string) => void;
  currentMonth?: string;
}

export function MonthSelector({ onMonthChange, currentMonth }: MonthSelectorProps) {
  const [months, setMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMonths() {
      try {
        setLoading(true);
        const availableMonths = await fetchAvailableMonths();
        console.log('Month selector - available months:', availableMonths);
        
        if (availableMonths && availableMonths.length > 0) {
          setMonths(availableMonths);
          
          // If no current month is selected, select the latest one
          if (!currentMonth) {
            onMonthChange(availableMonths[0]);
          }
        }
      } catch (error) {
        console.error('Error loading months:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMonths();
  }, []);  // Remove currentMonth and onMonthChange from dependencies to prevent infinite loops

  const handleMonthChange = (month: string) => {
    console.log('Month selected in dropdown:', month);
    onMonthChange(month);
  };

  return (
    <Select
      value={currentMonth}
      onValueChange={handleMonthChange}
      disabled={loading || months.length === 0}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={loading ? "Loading..." : "Select month"} />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month} value={month}>
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 