import { LineChartComponent } from "@/components/line-chart"
import { BadDebtChart } from "@/components/bad-debt-chart"
import { PerformanceTables } from "@/components/performance-tables"
import { fetchDashboardData, TransformedData } from "@/lib/dashboard-data"

function combineData(ppaData: TransformedData, mcsData: TransformedData, epmData: TransformedData): TransformedData {
  // Combine performance data from all divisions
  const allOver30Data = [
    ...ppaData.over30PerformanceData,
    ...mcsData.over30PerformanceData,
    ...epmData.over30PerformanceData,
  ];

  const allOver90Data = [
    ...ppaData.over90PerformanceData,
    ...mcsData.over90PerformanceData,
    ...epmData.over90PerformanceData,
  ];

  // Helper function to average data points for the same month
  const averageMonthlyData = (data1: Array<{ month: string; target: number; actual: number }>, 
                             data2: Array<{ month: string; target: number; actual: number }>, 
                             data3: Array<{ month: string; target: number; actual: number }>) => {
    const monthMap = new Map<string, { total: { actual: number; target: number }; count: number }>();
    
    [...data1, ...data2, ...data3].forEach(item => {
      if (!monthMap.has(item.month)) {
        monthMap.set(item.month, { total: { actual: 0, target: 0 }, count: 0 });
      }
      const current = monthMap.get(item.month)!;
      current.total.actual += item.actual;
      current.total.target += item.target;
      current.count += 1;
    });

    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      actual: data.total.actual / data.count,
      target: data.total.target / data.count,
    }));
  };

  // Calculate total amounts
  const totalOver30 = ppaData.totalOver30 + mcsData.totalOver30 + epmData.totalOver30;
  const totalOver90 = ppaData.totalOver90 + mcsData.totalOver90 + epmData.totalOver90;
  const totalFcBdEoq = ppaData.totalFcBdEoq + mcsData.totalFcBdEoq + epmData.totalFcBdEoq;
  const pendingActionsCount = ppaData.pendingActionsCount + mcsData.pendingActionsCount + epmData.pendingActionsCount;

  // Combine actions if they exist
  const actions = [
    ...(ppaData.actions || []),
    ...(mcsData.actions || []),
    ...(epmData.actions || [])
  ];

  const result: TransformedData = {
    over30Data: averageMonthlyData(ppaData.over30Data, mcsData.over30Data, epmData.over30Data),
    over90Data: averageMonthlyData(ppaData.over90Data, mcsData.over90Data, epmData.over90Data),
    over30PerformanceData: allOver30Data,
    over90PerformanceData: allOver90Data,
    totalOver30,
    totalOver90,
    pendingActionsCount,
    totalFcBdEoq,
    actions
  };

  return result;
}

export default async function Page() {
  // Fetch data for all divisions
  const [ppaData, mcsData, epmData] = await Promise.all([
    fetchDashboardData('PPA'),
    fetchDashboardData('MCS'),
    fetchDashboardData('EPM'),
  ]);

  // Combine data from all divisions
  const data = combineData(ppaData, mcsData, epmData);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending Actions", value: data.pendingActionsCount },
          { label: "Over 30 Days Impact", value: formatCurrency(data.totalOver30) },
          { label: "Over 90 Days Impact", value: formatCurrency(data.totalOver90) },
          { label: "Critical Cases", value: data.over90PerformanceData.length },
        ].map((item, index) => (
          <div key={index} className="rounded-lg border p-4">
            <h2 className="font-semibold">{item.label}</h2>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
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
        <BadDebtChart />
      </div>
      <PerformanceTables 
        over30Data={data.over30PerformanceData} 
        over90Data={data.over90PerformanceData} 
      />
    </div>
  )
}
