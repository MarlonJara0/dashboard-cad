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
  actions?: Array<{
    id: number
    entity: string
    parent_name: string
    action_requested_on: string
    action_owner: string
    comment: string
    total: number
    created_at: string
    updated_at: string
  }>
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

export async function fetchDashboardData(entity: 'PPA' | 'MCS' | 'EPM'): Promise<TransformedData> {
  try {
    console.log(`Fetching data for entity: ${entity}`);
    
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    // Fetch trend data from the new table for line charts
    const { data: trendData, error: trendError } = await supabase
      .from('trending_data_charts')
      .select('*')
      .eq('entity', entity)
      .order('month', { ascending: true });

    if (trendError) {
      console.error('Error fetching trend data:', trendError);
      throw trendError;
    }

    // Transform trend data into chart format
    const over30Data = trendData.map(item => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      target: 15,
      actual: Number(item.over30_percentage)
    }));

    const over90Data = trendData.map(item => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      target: 6,
      actual: Number(item.over90_percentage)
    }));

    // Fetch total forecast bad debt from the new view
    const { data: fcBdData, error: fcBdError } = await supabase
      .from('total_fc_bd_eoq_entities')
      .select('total_fc_bd_eoq')
      .eq('entity', entity)
      .order('month_of_report', { ascending: false })
      .limit(1)
      .single();

    if (fcBdError) {
      console.error('Error fetching forecast bad debt:', fcBdError);
    }

    // Fetch pending actions count
    const { data: actionsCount, error: actionsCountError } = await supabase
      .from('count_actions_per_entity')
      .select('action_count')
      .eq('entity', entity)
      .single();

    if (actionsCountError) {
      console.error('Error fetching actions count:', actionsCountError);
    }

    // Fetch actions data
    const { data: actionsData, error: actionsError } = await supabase
      .from('sorted_actions_data')
      .select('*')
      .eq('entity', entity);

    if (actionsError) {
      console.error('Error fetching actions:', actionsError);
      throw actionsError;
    }

    // Fetch total balances
    const { data: balanceData, error: balanceError } = await supabase
      .from('total_balances_per_entity')
      .select('*')
      .eq('entity', entity)
      .single();

    if (balanceError) {
      console.error('Error fetching balance data:', balanceError);
      throw balanceError;
    }

    // Fetch top over30 customers
    const { data: topCustomers30, error: topCustomers30Error } = await supabase
      .from('top_10_over30_customers_monthly')
      .select('*')
      .eq('entity', entity)
      .order('total_over30', { ascending: false })
      .limit(10);

    if (topCustomers30Error) {
      console.error('Error fetching top over30 customers:', topCustomers30Error);
      throw topCustomers30Error;
    }

    // Fetch top over90 customers
    const { data: topCustomers90, error: topCustomers90Error } = await supabase
      .from('top_10_over90_customers_monthly')
      .select('*')
      .eq('entity', entity)
      .order('total_over90', { ascending: false })
      .limit(10);

    if (topCustomers90Error) {
      console.error('Error fetching top over90 customers:', topCustomers90Error);
      throw topCustomers90Error;
    }

    // Transform top customers data
    const over30PerformanceData = (topCustomers30 || [])
      .map(item => ({
        customer: item.customer_name,
        amount: item.total_over30.toString(),
        status: 'Over 30',
        daysOverdue: '30+'
      }))
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

    const over90PerformanceData = (topCustomers90 || [])
      .map(item => ({
        customer: item.customer_name,
        amount: item.total_over90.toString(),
        status: 'Over 90',
        daysOverdue: '90+'
      }))
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

    return {
      over30Data,
      over90Data,
      over30PerformanceData,
      over90PerformanceData,
      totalOver30: balanceData?.total_over30 || 0,
      totalOver90: balanceData?.total_over90 || 0,
      pendingActionsCount: actionsCount?.action_count || 0,
      actions: actionsData || [],
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
    actions: [],
    totalFcBdEoq: 0
  }
}

export function subscribeToActions(entity: 'PPA' | 'MCS' | 'EPM', callback: () => void) {
  const channel = supabase
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
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
} 