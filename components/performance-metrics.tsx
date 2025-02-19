import { TransformedData } from '@/lib/dashboard-data';

interface PerformanceMetricsProps {
  data: TransformedData;
}

export function PerformanceMetrics({ data }: PerformanceMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Pending Actions</h2>
        <p className="text-2xl font-bold">{data.pendingActionsCount}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Over 30 Days Impact</h2>
        <p className="text-2xl font-bold">{formatCurrency(data.totalOver30)}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Over 90 Days Impact</h2>
        <p className="text-2xl font-bold">{formatCurrency(data.totalOver90)}</p>
      </div>
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Total Forecasted Bad Debt EOQ</h2>
        <p className="text-2xl font-bold">{formatCurrency(data.totalFcBdEoq)}</p>
      </div>
    </div>
  );
} 