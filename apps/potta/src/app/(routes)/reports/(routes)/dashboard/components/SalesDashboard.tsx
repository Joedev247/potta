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

interface SalesDashboardProps {
  timeGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

const SalesDashboard: React.FC<SalesDashboardProps> = ({ timeGranularity }) => {
  const salesKpiData = [
    { title: 'Total sales', value: 'FCFAO', trendPercent: 0 },
    { title: 'Total revenue', value: 'FCFAO', trendPercent: 0 },
    { title: 'Receivables due soon', value: 'FCFAO', trendPercent: 0 },
    { title: 'Overdue receivables', value: 'FCFAO', trendPercent: 0 },
    { title: 'Payments received', value: 'FCFAO', trendPercent: 0 },
    { title: 'Total tax added', value: 'FCFAO', trendPercent: 0 },
    { title: 'Total WHT', value: 'FCFAO', trendPercent: 0 },
    { title: 'Total discount', value: 'FCFAO', trendPercent: 0 },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesKpiData.map((kpi, index) => (
          <KpiStatCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            trendPercent={kpi.trendPercent}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Revenue growth
            </CardTitle>
            <p className="text-sm text-gray-600">
              See how your revenue is growing periodically.
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
                      label: 'Revenue Growth',
                      data: [67, 45, 89, 23, 78, 34, 91, 56, 12, 67, 45],
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
                        callback: (value: any) => `$${value}`,
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Sales payments
            </CardTitle>
            <p className="text-sm text-gray-600">
              See your sales cash inflow over periods.
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
                      label: 'Sales Payments',
                      data: [45, 78, 23, 67, 89, 34, 12, 91, 56, 78, 23],
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
                        callback: (value: any) => `$${value}`,
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Receivables aging
            </CardTitle>
            <p className="text-sm text-gray-600">
              See your unpaid sales over periods.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top revenue sources
            </CardTitle>
            <p className="text-sm text-gray-600">
              Most active revenue accounts.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-48">
              <Bar
                data={{
                  labels: [
                    'Product A',
                    'Product B',
                    'Product C',
                    'Product D',
                    'Product E',
                  ],
                  datasets: [
                    {
                      label: 'Revenue by Source',
                      data: [89, 67, 45, 78, 34],
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

        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top customers
            </CardTitle>
            <p className="text-sm text-gray-600">Your top sales customers.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-48">
              <Bar
                data={{
                  labels: [
                    'Customer X',
                    'Customer Y',
                    'Customer Z',
                    'Customer W',
                    'Customer V',
                  ],
                  datasets: [
                    {
                      label: 'Sales by Customer',
                      data: [91, 78, 56, 45, 23],
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

        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top debtors
            </CardTitle>
            <p className="text-sm text-gray-600">Your top sales debtors.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-48">
              <Bar
                data={{
                  labels: [
                    'Client A',
                    'Client B',
                    'Client C',
                    'Client D',
                    'Client E',
                  ],
                  datasets: [
                    {
                      label: 'Outstanding by Client',
                      data: [67, 89, 34, 78, 45],
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

export default SalesDashboard;
