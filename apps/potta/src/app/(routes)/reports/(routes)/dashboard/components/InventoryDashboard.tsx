'use client';
import React from 'react';
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

interface InventoryDashboardProps {
  timeGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({
  timeGranularity,
}) => {
  // Inventory Dashboard KPI Data Array
  const inventoryKpiData = [
    { title: 'Items count', value: '0.0', trendPercent: 0 },
    { title: 'Opening inventory balance', value: 'FCFAO', trendPercent: 0 },
    { title: 'Cost of goods sold', value: 'FCFAO', trendPercent: 0 },
    { title: 'Closing inventory balance', value: 'FCFAO', trendPercent: 0 },
    { title: 'Average inventory', value: 'FCFAO', trendPercent: 0 },
    { title: 'Turnover rate', value: '0.0%', trendPercent: 0 },
    { title: 'Total sales', value: 'FCFAO', trendPercent: 0 },
    { title: 'Gross profit', value: 'FCFAO', trendPercent: 0 },
    { title: 'Total purchases', value: 'FCFAO', trendPercent: 0 },
    { title: 'Purchase payments', value: 'FCFAO', trendPercent: 0 },
    { title: 'Payables due soon', value: 'FCFAO', trendPercent: 0 },
    { title: 'Payables overdue', value: 'FCFAO', trendPercent: 0 },
  ];

  // Simple KPI Stat Card Component
  const KpiStatCard = ({
    title,
    value,
    trendPercent,
  }: {
    title: string;
    value: string;
    trendPercent: number;
  }) => (
    <Card className="bg-white border-0 transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">↗ {trendPercent}%</span> vs last
              period
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Chart data generation functions
  const getInventoryBalanceData = () => ({
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Inventory Balance',
        data: [45, 67, 23, 89, 34, 78, 56, 12, 91, 43, 67, 28],
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
        borderWidth: 1,
      },
    ],
  });

  const getCogsData = () => ({
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Cost of Goods Sold',
        data: [67, 23, 89, 45, 12, 78, 34, 91, 56, 23, 67, 45],
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
        borderWidth: 1,
      },
    ],
  });

  const getTurnoverRateData = () => ({
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Turnover Rate',
        data: [23, 78, 45, 67, 89, 34, 12, 91, 56, 78, 23, 67],
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
        borderWidth: 1,
      },
    ],
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { weight: 500, size: 12 } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { color: '#6b7280', font: { weight: 500, size: 12 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {inventoryKpiData.map((kpi, index) => (
          <KpiStatCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            trendPercent={kpi.trendPercent}
          />
        ))}
      </div>

      {/* Trend Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Balance Chart */}
        <Card className="bg-white  border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Inventory balance
            </CardTitle>
            <p className="text-sm text-gray-600">
              See your inventory balance over periods.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <Bar data={getInventoryBalanceData()} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Cost of Goods Sold Chart */}
        <Card className="bg-white  border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Cost of goods sold
            </CardTitle>
            <p className="text-sm text-gray-600">
              See your cost of goods sold over periods.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <Bar data={getCogsData()} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Turnover Rate Chart */}
        <Card className="bg-white  border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Turnover rate
            </CardTitle>
            <p className="text-sm text-gray-600">
              See your turnover rate over periods.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <Bar data={getTurnoverRateData()} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;
