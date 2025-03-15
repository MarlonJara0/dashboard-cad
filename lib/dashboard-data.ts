'use client'

import { supabase } from './supabase'

export interface DashboardData {
  id: number
  customer_number: string
  customer_name: string
  bussines_description: string
  invoice_number: string
  invoice_date: string
  due_date: string
  open_amount: number
  purchase_order: string
  entity: string
  aging_bucket: string
  debit_credit: string
  past_due: number
  over30: number
  over90: number
  month_of_report: string
}

export interface TransformedData {
  over30Data: Array<{
    month: string
    target: number
    actual: number
  }>
  over90Data: Array<{
    month: string
    target: number
    actual: number
  }>
  over30PerformanceData: Array<{
    customer: string
    amount: string
    status: string
    daysOverdue: string
  }>
  over90PerformanceData: Array<{
    customer: string
    amount: string
    status: string
    daysOverdue: string
  }>
  totalOver30: number
  totalOver90: number
  pendingActionsCount: number
  totalFcBdEoq: number
}

interface MonthlyMetric {
  month_of_report: string
  entity: string
  total_balance: number
  total_over30: number
  total_over90: number
  over30_percentage: number
  over90_percentage: number
}

interface TopCustomer30 {
  month_of_report: string
  entity: string
  customer_number: string
  customer_name: string
  total_over30: number
}

interface TopCustomer90 {
  month_of_report: string
  entity: string
  customer_number: string
  customer_name: string
  total_over90: number
}

// Assuming trendData is an array of objects with these properties
interface TrendDataItem {
  month: string;
  over30_percentage: number;
  over90_percentage: number;
}

export async function fetchAvailableMonths(): Promise<string[]> {
  try {
    // Query months from multiple tables to ensure we get all available months
    const tables = [
      'dashboard_data',
      'total_balances_per_entity',
      'top_10_over30_customers_monthly',
      'top_10_over90_customers_monthly',
      'total_fc_bd_eoq_entities',
      'count_actions_per_entity'
    ];
    
    let allMonths: string[] = [];
    
    // Query each table for available months
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('month_of_report')
        .order('month_of_report', { ascending: false });
        
      if (error) {
        console.error(`Error fetching months from ${table}:`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        const tableMonths = data.map((item: any) => (item as { month_of_report: string }).month_of_report);
        allMonths = [...allMonths, ...tableMonths];
      }
    }
    
    // Get unique months
    let uniqueMonths = [...new Set(allMonths)] as string[];
    
    // For display purposes, normalize "Febuary" to "February"
    const displayMonths = uniqueMonths.map(month => {
      // Keep the original month for database queries, but display it correctly
      return month && month.toLowerCase() === 'febuary' ? 'February' : month;
    }).filter(Boolean); // Remove any null/undefined values
    
    // Remove duplicates that might have been created by normalization
    const finalMonths = [...new Set(displayMonths)];
    
    console.log('Available months for display:', finalMonths);
    console.log('Original months in database:', uniqueMonths);
    
    return finalMonths;
  } catch (error) {
    console.error('Error in fetchAvailableMonths:', error);
    return [];
  }
}

export async function fetchDashboardData(entity: 'PPA' | 'MCS' | 'EPM', month?: string): Promise<TransformedData> {
  try {
    console.log(`Fetching data for entity: ${entity}, month: ${month}`);
    
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    // If no month is provided, get the latest month
    if (!month) {
      const months = await fetchAvailableMonths();
      if (months.length === 0) {
        throw new Error('No months available in the database');
      }
      month = months[0];
      console.log('Using default month:', month);
    }

    // Normalize month spelling (handle both "February" and "Febuary")
    const normalizedMonth = month.toLowerCase() === 'february' ? 'Febuary' : month;
    console.log('Normalized month for database query:', normalizedMonth);

    // Fetch trend data from trending_data_charts - this should NOT be filtered by month
    const { data: trendData, error: trendError } = await supabase
      .from('trending_data_charts')
      .select('*')
      .eq('entity', entity)
      .order('month', { ascending: true });

    if (trendError) {
      console.error('Error fetching trend data:', trendError);
      throw trendError;
    }

    // Transform trend data into chart format - this shows all months
    const over30Data = trendData.map((item: TrendDataItem) => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      target: 15,
      actual: Number(item.over30_percentage)
    }));

    const over90Data = trendData.map((item: TrendDataItem) => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      target: 6,
      actual: Number(item.over90_percentage)
    }));

    // The rest of the data should be filtered by the selected month
    const { data: balanceData, error: balanceError } = await supabase
      .from('total_balances_per_entity')
      .select('*')
      .eq('entity', entity)
      .eq('month_of_report', normalizedMonth)
      .single();

    if (balanceError) {
      console.error('Error fetching balance data:', balanceError);
      throw balanceError;
    }

    // Log the balance data for debugging
    console.log('Balance data for month:', { month: normalizedMonth, data: balanceData });

    // Fetch pending actions count
    const { data: actionsCount, error: actionsCountError } = await supabase
      .from('count_actions_per_entity')
      .select('action_count')
      .eq('entity', entity)
      .eq('month_of_report', normalizedMonth)
      .single();

    if (actionsCountError) {
      console.error('Error fetching actions count:', actionsCountError);
    }

    console.log('Actions count data from count_actions_per_entity:', actionsCount);

    // Always fetch from actions_data directly - this is the most reliable source
    console.log('Fetching actions directly from actions_data table...');
    
    const { data: actionsData, error: actionsDataError } = await supabase
      .from('actions_data')
      .select('id, status, entity')
      .eq('entity', entity)
      .eq('status', 'open');
      
    if (actionsDataError) {
      console.error('Error fetching actions data:', actionsDataError);
    } else {
      console.log(`Found ${actionsData?.length || 0} pending actions in actions_data table:`, actionsData);
    }
    
    // Use the count from actions_data, fallback to count_actions_per_entity if needed
    const pendingActionsCount = actionsData?.length || actionsCount?.action_count || 0;

    // Fetch total forecast bad debt
    const { data: fcBdData, error: fcBdError } = await supabase
      .from('total_fc_bd_eoq_entities')
      .select('total_fc_bd_eoq')
      .eq('entity', entity)
      .eq('month_of_report', normalizedMonth)
      .single();

    if (fcBdError) {
      console.error('Error fetching forecast bad debt:', fcBdError);
    }

    // Fetch top over30 customers for the selected month
    const { data: topCustomers30, error: topCustomers30Error } = await supabase
      .from('top_10_over30_customers_monthly')
      .select('*')
      .eq('entity', entity)
      .eq('month_of_report', normalizedMonth)
      .order('total_over30', { ascending: false })
      .limit(10);

    if (topCustomers30Error) {
      console.error('Error fetching top over30 customers:', topCustomers30Error);
      throw topCustomers30Error;
    }

    // Fetch top over90 customers for the selected month
    const { data: topCustomers90, error: topCustomers90Error } = await supabase
      .from('top_10_over90_customers_monthly')
      .select('*')
      .eq('entity', entity)
      .eq('month_of_report', normalizedMonth)
      .order('total_over90', { ascending: false })
      .limit(10);

    if (topCustomers90Error) {
      console.error('Error fetching top over90 customers:', topCustomers90Error);
      throw topCustomers90Error;
    }

    // Transform top customers data - ensure no duplicates by using customer_number as key
    const customerMap30 = new Map();
    (topCustomers30 || []).forEach((item: TopCustomer30) => {
      customerMap30.set(item.customer_number, {
        customer: item.customer_name,
        amount: item.total_over30.toString(),
        status: 'Over 30',
        daysOverdue: '30+'
      });
    });
    
    const over30PerformanceData = Array.from(customerMap30.values())
      .sort((a: { amount: string }, b: { amount: string }) => parseFloat(b.amount) - parseFloat(a.amount));

    const customerMap90 = new Map();
    (topCustomers90 || []).forEach((item: TopCustomer90) => {
      customerMap90.set(item.customer_number, {
        customer: item.customer_name,
        amount: item.total_over90.toString(),
        status: 'Over 90',
        daysOverdue: '90+'
      });
    });
    
    const over90PerformanceData = Array.from(customerMap90.values())
      .sort((a: { amount: string }, b: { amount: string }) => parseFloat(b.amount) - parseFloat(a.amount));

    return {
      // These don't change with month selection
      over30Data,
      over90Data,
      // These update based on selected month
      over30PerformanceData,
      over90PerformanceData,
      totalOver30: balanceData?.total_over30 || 0,
      totalOver90: balanceData?.total_over90 || 0,
      pendingActionsCount: pendingActionsCount,
      totalFcBdEoq: fcBdData?.total_fc_bd_eoq || 0
    };

  } catch (error) {
    console.error(`Error in fetchDashboardData for ${entity}:`, error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    return getEmptyData();
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function getEmptyData(): TransformedData {
  return {
    over30Data: [],
    over90Data: [],
    over30PerformanceData: [],
    over90PerformanceData: [],
    totalOver30: 0,
    totalOver90: 0,
    pendingActionsCount: 0,
    totalFcBdEoq: 0
  }
}

export function subscribeToActions(entity: string, callback: () => void) {
  const subscription = supabase
    .channel('actions_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'actions_data',
        filter: `entity=eq.${entity}`
      },
      () => {
        callback()
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
} 