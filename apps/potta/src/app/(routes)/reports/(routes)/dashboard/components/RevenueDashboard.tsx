'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@potta/components/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { pottaAnalyticsService } from '../../../../../../services/analyticsService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueDashboardProps {
  timeGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

const RevenueDashboard: React.FC<RevenueDashboardProps> = ({
  timeGranularity,
}) => {
  const [kpiData, setKpiData] = useState([
    {
      title: 'Revenue',
      value: '$0',
      trend: '0% vs Budget',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'QTD New ARR',
      value: '$0',
      trend: '0% vs Budget',
      isPositive: false,
      icon: TrendingDown,
    },
    {
      title: 'Gap to QTD Target',
      value: '$0',
      trend: '0% vs Last Month',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'Sales Headcount',
      value: '0',
      trend: '0% vs Budget',
      isPositive: true,
      icon: Users,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sales Capacity Data
  const salesCapacityData = [
    {
      region: 'US',
      salesCapacity: '$9,600,000',
      revenueTarget: '$7,680,000',
      revenuePacing: '$6,528,000',
      revenueGap: -1152000,
    },
    {
      region: 'UK',
      salesCapacity: '$5,600,000',
      revenueTarget: '$4,480,000',
      revenuePacing: '$4,032,000',
      revenueGap: -448000,
    },
    {
      region: 'Canada',
      salesCapacity: '$1,600,000',
      revenueTarget: '$1,280,000',
      revenuePacing: '$1,408,000',
      revenueGap: 128000,
    },
    {
      region: 'France',
      salesCapacity: '$3,200,000',
      revenueTarget: '$2,560,000',
      revenuePacing: '$2,304,000',
      revenueGap: -256000,
    },
    {
      region: 'Germany',
      salesCapacity: '$3,200,000',
      revenueTarget: '$2,560,000',
      revenuePacing: '$2,688,000',
      revenueGap: 328000,
    },
  ];

  // Calculate totals
  const totals = salesCapacityData.reduce(
    (acc, item) => ({
      salesCapacity:
        acc.salesCapacity + parseFloat(item.salesCapacity.replace(/[$,]/g, '')),
      revenueTarget:
        acc.revenueTarget + parseFloat(item.revenueTarget.replace(/[$,]/g, '')),
      revenuePacing:
        acc.revenuePacing + parseFloat(item.revenuePacing.replace(/[$,]/g, '')),
      revenueGap: acc.revenueGap + item.revenueGap,
    }),
    { salesCapacity: 0, revenueTarget: 0, revenuePacing: 0, revenueGap: 0 }
  );

  // Revenue Scenarios Chart Data
  const revenueScenariosData = {
    labels: [
      'Q1 24',
      'Q2 24',
      'Q3 24',
      'Q4 24',
      'Q1 25',
      'Q2 25',
      'Q3 25',
      'Q4 25',
    ],
    datasets: [
      {
        label: 'Actuals',
        data: [20, 23, 28, 35, null, null, null, null],
        borderColor: '#22c55e', // Changed to green
        backgroundColor: '#22c55e', // Changed to green
        borderWidth: 3,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Base',
        data: [null, null, null, 35, 38, 42, 47, 55],
        borderColor: '#16a34a', // Darker green
        backgroundColor: '#16a34a', // Darker green
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Bear',
        data: [null, null, null, 35, 36, 39, 41, 47],
        borderColor: '#15803d', // Even darker green
        backgroundColor: '#15803d', // Even darker green
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Bull',
        data: [null, null, null, 35, 41, 45, 52, 63],
        borderColor: '#22c55e', // Green
        backgroundColor: '#22c55e', // Green
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#6b7280',
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { weight: 500, size: 12 } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: {
          color: '#6b7280',
          font: { weight: 500, size: 12 },
          callback: function (value: any) {
            return `$${value}m`;
          },
        },
        beginAtZero: true,
      },
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRetentionColor = (value: number | null) => {
    if (value === null) {
      return 'bg-gray-100 text-gray-800';
    }
    if (value >= 90) {
      return 'bg-green-100 text-green-800';
    }
    if (value >= 80) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-red-100 text-red-800';
  };

  // Fetch revenue data from Finance API
  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch revenue data
      const revenueData = await pottaAnalyticsService.finance.getAnalytics(
        'revenue',
        {
          metrics: ['total_revenue'],
          dimensions: ['time'],
          time_granularity: timeGranularity,
          use_mock_data: true,
        }
      );

      // Fetch COGS data for gross profit calculation
      const cogsData = await pottaAnalyticsService.finance.getAnalytics(
        'cogs',
        {
          metrics: ['total_cost'],
          dimensions: ['time'],
          time_granularity: timeGranularity,
          use_mock_data: true,
        }
      );

      // Process and update KPI data
      if (revenueData.data && revenueData.data.length > 0) {
        const currentRevenue =
          revenueData.data[revenueData.data.length - 1]?.total_revenue || 0;
        const previousRevenue =
          revenueData.data[revenueData.data.length - 2]?.total_revenue ||
          currentRevenue;
        const revenueGrowth =
          previousRevenue > 0
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
            : 0;

        setKpiData((prev) =>
          prev.map((item) =>
            item.title === 'Revenue'
              ? {
                  ...item,
                  value: `$${(currentRevenue / 1000000).toFixed(1)}m`,
                  trend: `${
                    revenueGrowth >= 0 ? '+' : ''
                  }${revenueGrowth.toFixed(1)}% vs Budget`,
                }
              : item
          )
        );

        // Calculate QTD New ARR (assuming 25% of revenue is new ARR)
        const newARR = currentRevenue * 0.25;
        setKpiData((prev) =>
          prev.map((item) =>
            item.title === 'QTD New ARR'
              ? {
                  ...item,
                  value: `$${(newARR / 1000000).toFixed(1)}m`,
                  trend: `${
                    revenueGrowth >= 0 ? '+' : ''
                  }${revenueGrowth.toFixed(1)}% vs Budget`,
                }
              : item
          )
        );

        // Calculate gap to target (assuming 20% gap)
        const targetGap = currentRevenue * 0.2;
        setKpiData((prev) =>
          prev.map((item) =>
            item.title === 'Gap to QTD Target'
              ? {
                  ...item,
                  value: `$${(targetGap / 1000000).toFixed(1)}m`,
                  trend: `${
                    revenueGrowth >= 0 ? '+' : ''
                  }${revenueGrowth.toFixed(1)}% vs Last Month`,
                }
              : item
          )
        );
      }

      console.log('✅ Revenue data fetched:', {
        revenue: revenueData,
        cogs: cogsData,
      });

      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching revenue data:', error);
      setError('Failed to load revenue data');
      setLoading(false);
    }
  };

  // Load data when component mounts or timeGranularity changes
  useEffect(() => {
    fetchRevenueData();
  }, [timeGranularity]);

  return (
    <div className="space-y-8">
      {/* KPI Cards - 4 cards in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-white border-0">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 font-medium">
                    {kpi.title}
                  </p>
                  <kpi.icon
                    className={`w-4 h-4 ${
                      kpi.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {kpi.value}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      kpi.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {kpi.trend}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Section - Sales Capacity Table and Revenue Scenarios Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Capacity Table */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Sales Capacity - 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-700">
                      Region
                    </th>
                    <th className="text-right py-2 font-medium text-gray-700">
                      Sales Capacity
                    </th>
                    <th className="text-right py-2 font-medium text-gray-700">
                      Revenue Target
                    </th>
                    <th className="text-right py-2 font-medium text-gray-700">
                      Revenue Pacing
                    </th>
                    <th className="text-right py-2 font-medium text-gray-700">
                      Revenue Gap
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salesCapacityData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-gray-900 font-medium">
                        {item.region}
                      </td>
                      <td className="py-2 text-right text-gray-700">
                        {item.salesCapacity}
                      </td>
                      <td className="py-2 text-right text-gray-700">
                        {item.revenueTarget}
                      </td>
                      <td className="py-2 text-right text-gray-700">
                        {item.revenuePacing}
                      </td>
                      <td className="py-2 text-right">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.revenueGap >= 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {formatCurrency(item.revenueGap)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-300 bg-gray-50">
                    <td className="py-2 text-gray-900 font-bold">Total</td>
                    <td className="py-2 text-right text-gray-900 font-bold">
                      {formatCurrency(totals.salesCapacity)}
                    </td>
                    <td className="py-2 text-right text-gray-900 font-bold">
                      {formatCurrency(totals.revenueTarget)}
                    </td>
                    <td className="py-2 text-right text-gray-900 font-bold">
                      {formatCurrency(totals.revenuePacing)}
                    </td>
                    <td className="py-2 text-right">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          totals.revenueGap >= 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {formatCurrency(totals.revenueGap)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Scenarios Chart */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Revenue Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={revenueScenariosData} options={revenueChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Revenue Retention Table and Weighted Pipeline Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Retention Table */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Revenue retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-700">
                      Month
                    </th>
                    <th className="text-center py-2 font-medium text-gray-700">
                      Month 1
                    </th>
                    <th className="text-center py-2 font-medium text-gray-700">
                      Month 2
                    </th>
                    <th className="text-center py-2 font-medium text-gray-700">
                      Month 3
                    </th>
                    <th className="text-center py-2 font-medium text-gray-700">
                      Month 4
                    </th>
                    <th className="text-center py-2 font-medium text-gray-700">
                      Month 5
                    </th>
                    <th className="text-center py-2 font-medium text-gray-700">
                      Month 5
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      month: 'Jul 24',
                      month1: 100,
                      month2: 95.26,
                      month3: 92.32,
                      month4: 89.92,
                      month5: 87.5,
                      month5Repeat: 86.07,
                    },
                    {
                      month: 'Aug 24',
                      month1: null,
                      month2: 100,
                      month3: 75.87,
                      month4: 75.1,
                      month5: 74.62,
                      month5Repeat: 74.32,
                    },
                    {
                      month: 'Sep 24',
                      month1: null,
                      month2: null,
                      month3: 100,
                      month4: 62.09,
                      month5: 60.35,
                      month5Repeat: 59.3,
                    },
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 text-gray-900 font-medium">
                        {row.month}
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRetentionColor(
                            row.month1
                          )}`}
                        >
                          {row.month1 ? `${row.month1}%` : '-'}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRetentionColor(
                            row.month2
                          )}`}
                        >
                          {row.month2 ? `${row.month2}%` : '-'}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRetentionColor(
                            row.month3
                          )}`}
                        >
                          {row.month3 ? `${row.month3}%` : '-'}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRetentionColor(
                            row.month4
                          )}`}
                        >
                          {row.month4 ? `${row.month4}%` : '-'}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRetentionColor(
                            row.month5
                          )}`}
                        >
                          {row.month5 ? `${row.month5}%` : '-'}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getRetentionColor(
                            row.month5Repeat
                          )}`}
                        >
                          {row.month5Repeat ? `${row.month5Repeat}%` : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Weighted Pipeline Chart */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Weighted Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: ['Qualification', 'Solutioning', 'Negotiation'],
                  datasets: [
                    {
                      label: 'Pipeline Value',
                      data: [17, 0, 0], // Only Qualification is visible
                      backgroundColor: ['#22c55e', '#16a34a', '#15803d'], // Green variations
                      borderColor: ['#22c55e', '#16a34a', '#15803d'], // Green variations
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom' as const,
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        color: '#6b7280',
                      },
                    },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: '#6b7280',
                        font: { weight: 500, size: 12 },
                      },
                    },
                    y: {
                      grid: { color: '#f3f4f6' },
                      ticks: {
                        color: '#6b7280',
                        font: { weight: 500, size: 12 },
                        callback: function (value: any) {
                          return `$${value}m`;
                        },
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueDashboard;
