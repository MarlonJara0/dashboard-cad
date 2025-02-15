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
  const averageMonthlyData = (data1: any[], data2: any[], data3: any[]) => {
    const monthMap = new Map();
    
    [...data1, ...data2, ...data3].forEach(item => {
      if (!monthMap.has(item.month)) {
        monthMap.set(item.month, { total: { actual: 0, target: 0 }, count: 0 });
      }
      const current = monthMap.get(item.month);
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

  return {
    over30Data: averageMonthlyData(ppaData.over30Data, mcsData.over30Data, epmData.over30Data),
    over90Data: averageMonthlyData(ppaData.over90Data, mcsData.over90Data, epmData.over90Data),
    over30PerformanceData: allOver30Data,
    over90PerformanceData: allOver90Data
  };
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

  // Calculate total amounts for over30 and over90
  const totalOver30Amount = data.over30PerformanceData.reduce((sum, item) => {
    const amount = parseFloat(item.amount.replace(/[$,]/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalOver90Amount = data.over90PerformanceData.reduce((sum, item) => {
    const amount = parseFloat(item.amount.replace(/[$,]/g, ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

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
          { label: "Pending Actions", value: data.over30PerformanceData.length + data.over90PerformanceData.length },
          { label: "Over 30 Days Impact", value: formatCurrency(totalOver30Amount) },
          { label: "Over 90 Days Impact", value: formatCurrency(totalOver90Amount) },
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
