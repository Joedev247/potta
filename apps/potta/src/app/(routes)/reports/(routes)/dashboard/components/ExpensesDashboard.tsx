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
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpensesDashboardProps {
  timeGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

const ExpensesDashboard: React.FC<ExpensesDashboardProps> = ({
  timeGranularity,
}) => {
  // Expenses Dashboard KPI Data Array
  const expensesKpiData = [
    { title: 'Total expenses', value: 'FCFAO', trendPercent: 0 },
    { title: 'Total payments', value: 'FCFAO', trendPercent: 0 },
    { title: 'Payables due soon', value: 'FCFAO', trendPercent: 0 },
    { title: 'Overdue payables', value: 'FCFAO', trendPercent: 0 },
    { title: 'Total tax added', value: 'FCFAO', trendPercent: 0 },
    { title: 'Total WHT', value: 'FCFAO', trendPercent: 0 },
  ];

  // KPI Stat Card Component
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

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid - 2x3 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expensesKpiData.map((kpi, index) => (
          <KpiStatCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            trendPercent={kpi.trendPercent}
          />
        ))}
      </div>

      {/* Charts and Payables Aging Section - 3 cards on one line */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expenses Growth Chart */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Expenses growth
            </CardTitle>
            <p className="text-sm text-gray-600">
              See how your expenses is growing periodically.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <Bar
                data={{
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
                  ],
                  datasets: [
                    {
                      label: 'Expenses Growth',
                      data: [45, 32, 67, 23, 89, 54, 12, 78, 43, 91, 28],
                      backgroundColor: '#22c55e',
                      borderColor: '#22c55e',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
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
                          return `$${value}`;
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

        {/* Expenses Payments Chart */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Expenses payments
            </CardTitle>
            <p className="text-sm text-gray-600">
              See your expenses inflow over periods.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <Bar
                data={{
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
                  ],
                  datasets: [
                    {
                      label: 'Expenses Payments',
                      data: [67, 23, 89, 45, 12, 78, 34, 91, 56, 23, 67],
                      backgroundColor: '#22c55e',
                      borderColor: '#22c55e',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
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
                          return `$${value}`;
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

        {/* Payables Aging - Third card on the same line */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Payables aging
            </CardTitle>
            <p className="text-sm text-gray-600">
              See your unpaid expenses over periods.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {['0-30', '31-60', '61-90', '>90'].map((period, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {period}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      FCFAO
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: `${(index + 1) * 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Summary Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top expenses sources */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top expenses sources
            </CardTitle>
            <p className="text-sm text-gray-600">
              Most popular expenses accounts.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-48">
              <Bar
                data={{
                  labels: [
                    'Rent',
                    'Utilities',
                    'Office',
                    'Travel',
                    'Marketing',
                  ],
                  datasets: [
                    {
                      label: 'Expenses by Source',
                      data: [45, 30, 25, 20, 15],
                      backgroundColor: [
                        '#22c55e',
                        '#bbf7d0',
                        '#4ade80',
                        '#a7f3d0',
                        '#d1fae5',
                      ],
                      borderColor: [
                        '#22c55e',
                        '#bbf7d0',
                        '#4ade80',
                        '#a7f3d0',
                        '#d1fae5',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: '#6b7280',
                        font: { weight: 500, size: 10 },
                      },
                    },
                    y: {
                      grid: { color: '#f3f4f6' },
                      ticks: {
                        color: '#6b7280',
                        font: { weight: 500, size: 10 },
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Top vendors */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top vendors
            </CardTitle>
            <p className="text-sm text-gray-600">Your top expenses vendors.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-48">
              <Bar
                data={{
                  labels: [
                    'Vendor A',
                    'Vendor B',
                    'Vendor C',
                    'Vendor D',
                    'Vendor E',
                  ],
                  datasets: [
                    {
                      label: 'Expenses by Vendor',
                      data: [60, 45, 35, 25, 20],
                      backgroundColor: [
                        '#22c55e',
                        '#bbf7d0',
                        '#4ade80',
                        '#a7f3d0',
                        '#d1fae5',
                      ],
                      borderColor: [
                        '#22c55e',
                        '#bbf7d0',
                        '#4ade80',
                        '#a7f3d0',
                        '#d1fae5',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: '#6b7280',
                        font: { weight: 500, size: 10 },
                      },
                    },
                    y: {
                      grid: { color: '#f3f4f6' },
                      ticks: {
                        color: '#6b7280',
                        font: { weight: 500, size: 10 },
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Top debtors */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top debtors
            </CardTitle>
            <p className="text-sm text-gray-600">Your top expenses debtors.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-48">
              <Bar
                data={{
                  labels: [
                    'Client X',
                    'Client Y',
                    'Client Z',
                    'Client W',
                    'Client V',
                  ],
                  datasets: [
                    {
                      label: 'Outstanding by Client',
                      data: [80, 65, 50, 40, 30],
                      backgroundColor: [
                        '#22c55e',
                        '#bbf7d0',
                        '#4ade80',
                        '#a7f3d0',
                        '#d1fae5',
                      ],
                      borderColor: [
                        '#22c55e',
                        '#bbf7d0',
                        '#4ade80',
                        '#a7f3d0',
                        '#d1fae5',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: '#6b7280',
                        font: { weight: 500, size: 10 },
                      },
                    },
                    y: {
                      grid: { color: '#f3f4f6' },
                      ticks: {
                        color: '#6b7280',
                        font: { weight: 500, size: 10 },
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

export default ExpensesDashboard;
