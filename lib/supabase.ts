'use client'

import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Test the connection and log table data
async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test database access
    const { data: tableData, error: tableError } = await supabase
      .from('dashboard_data')
      .select('*')
    
    if (tableError) {
      console.error('Error accessing dashboard_data table:', tableError)
      console.error('Error details:', {
        message: tableError.message,
        code: tableError.code,
        details: tableError.details,
        hint: tableError.hint
      })
      return
    }

    if (!tableData) {
      console.log('No data returned from dashboard_data table')
      return
    }

    console.log('Successfully connected to Supabase')
    console.log('Records found in dashboard_data:', tableData.length)
    console.log('Sample record:', tableData[0])

    // Test entity-specific query
    const { data: ppaData, error: ppaError } = await supabase
      .from('dashboard_data')
      .select('*')
      .eq('entity', 'PPA')

    if (ppaError) {
      console.error('Error querying PPA data:', ppaError)
      return
    }

    console.log('PPA records found:', ppaData?.length || 0)

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to connect to Supabase:', error.message)
      console.error('Error stack:', error.stack)
    } else {
      console.error('Failed to connect to Supabase with unknown error:', error)
    }
  }
}

// Run the connection test
testConnection()

// Type for bad debt customer data
export interface BadDebtCustomer {
  id: number
  customer_name: string
  bad_debt_amount: number
}

// Type for action data
export interface Action {
  id: number
  title: string
  description: string
  customer_name: string
  customer_number: string
  entity: 'PPA' | 'MCS' | 'EPM'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  requested_date: string
  due_date: string
  assigned_to: string
  created_at: string
  updated_at: string
}

export async function fetchActions(entity: 'PPA' | 'MCS' | 'EPM'): Promise<Action[]> {
  try {
    const { data, error } = await supabase
      .from('actions_data')
      .select('*')
      .eq('entity', entity)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching actions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchActions:', error);
    return [];
  }
} 