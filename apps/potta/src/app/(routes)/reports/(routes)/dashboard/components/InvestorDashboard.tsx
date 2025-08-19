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
import { Bar } from 'react-chartjs-2';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Info,
} from 'lucide-react';

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

interface InvestorDashboardProps {
  timeGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  timeGranularity,
}) => {
  // KPI Data
  const kpiData = [
    {
      title: 'ARR',
      value: '$43.5m',
      trend: '↑ 15% vs Plan',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'New ARR',
      value: '$7.2m',
      trend: '↑ 5% vs Plan',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'NDR',
      value: '101.8%',
      trend: '↑ 1.23% vs Plan',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'CaC Payback',
      value: '16 months',
      trend: '↓ -7% vs Plan',
      isPositive: false,
      icon: Clock,
    },
    {
      title: 'Headcount',
      value: '673',
      trend: '↑ 1% vs last quarter',
      isPositive: true,
      icon: Users,
    },
    {
      title: 'Runway',
      value: '26 months',
      trend: '↓ -5% vs Plan',
      isPositive: false,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Executive Summary Section */}
      {/* <Card className="bg-white border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Executive summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              Revenue is increasing but costs (Cost of Sales, R&D, S&M, G&A expenses) are also rising, 
              negatively impacting gross profit. We note a deterioration in EBITDA and EBIT, suggesting 
              investments haven't yet improved operational efficiency, despite a slight improvement in 
              Other Income. The company's financial health is under pressure, and strategic adjustments 
              are needed to address costs and improve efficiency.
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Refine output?</span>
                <button className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                  Make shorter
                </button>
                <button className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                  Make longer
                </button>
                <button className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                  Simplify
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Was this summary useful?</span>
                <button className="p-1 text-gray-400 hover:text-green-600">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-800">
                  AI responses can be inaccurate or misleading. Learn more
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* KPI Cards - 6 cards in grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Charts Section - 2 charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New ARR vs Target Chart */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              New ARR vs Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                  datasets: [
                    {
                      label: 'Forecast',
                      data: [24, 26, 29, 36],
                      backgroundColor: '#22c55e', // Changed to green
                      borderColor: '#22c55e', // Changed to green
                      borderWidth: 1,
                    },
                    {
                      label: 'Target',
                      data: [15, 17, 20, 25],
                      backgroundColor: '#16a34a', // Changed to darker green
                      borderColor: '#16a34a', // Changed to darker green
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
                        callback: function (
                          value: any,
                          index: number,
                          ticks: any[]
                        ) {
                          if (index === 0) return '$10m';
                          if (index === 1) return '$20m';
                          if (index === 2) return '$30m';
                          return '';
                        },
                      },
                      beginAtZero: true,
                      max: 40,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* New vs Expansion ARR Chart */}
        <Card className="bg-white border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              New vs Expansion ARR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                  datasets: [
                    {
                      label: 'New',
                      data: [85, 82, 78, 70],
                      backgroundColor: '#22c55e', // Changed to green
                      borderColor: '#22c55e', // Changed to green
                      borderWidth: 1,
                    },
                    {
                      label: 'Expansion',
                      data: [15, 18, 22, 30],
                      backgroundColor: '#16a34a', // Changed to darker green
                      borderColor: '#16a34a', // Changed to darker green
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
                          return `${value}%`;
                        },
                      },
                      beginAtZero: true,
                      max: 100,
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

export default InvestorDashboard;
