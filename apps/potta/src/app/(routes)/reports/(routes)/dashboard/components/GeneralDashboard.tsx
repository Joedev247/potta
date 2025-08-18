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
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  Info,
  FileText,
  Building2,
  Network,
  Building,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import SearchableSelect from '../../../../../../components/searchableSelect';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GeneralDashboardProps {
  timeGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

const GeneralDashboard: React.FC<GeneralDashboardProps> = ({
  timeGranularity,
}) => {
  // Main KPI Data
  const mainKpiData = [
    { title: 'Cash Balance', value: 'FCFAO', trendPercent: 0, icon: Info },
    { title: 'Revenue', value: 'FCFAO', trendPercent: 0, icon: Info },
    { title: 'Expenses', value: 'FCFAO', trendPercent: 0, icon: Info },
    { title: 'Net Burn', value: 'FCFAO', trendPercent: 0, icon: Info },
  ];

  // Explore potta Data
  const exploreTymsData = [
    {
      title: 'Setup chart of accounts',
      description:
        'Categorize all your transaction accounts. Which can be any of assets, liabilities, equity, revenue and expenses.',
      icon: FileText,
      link: 'Quick start',
    },
    {
      title: 'Banks setup and reconciliation',
      description:
        'Manage all your bank transactions through manual import or auto-sync and perform bank reconciliation.',
      icon: Building2,
      link: 'Quick start',
    },
    {
      title: 'Documents and workflow automation',
      description:
        'Manage bank statements, bills and sales data document for automated data extraction and entries with AI.',
      icon: Network,
      link: 'Quick start',
    },
    {
      title: 'Automate fixed assets management',
      description: 'Manage your fixed assets with automated depreciations.',
      icon: Building,
      link: 'Quick start',
    },
    {
      title: 'Generate invoices and manage sales',
      description:
        'Create and send invoice to customers while also managing other sales activities.',
      icon: Receipt,
      link: 'Quick start',
    },
    {
      title: 'Manage vendor bills and expenses',
      description:
        'Keep record all your vendors bill while also managing other expense categories.',
      icon: FileSpreadsheet,
      link: 'Quick start',
    },
  ];

  // KPI Stat Card Component
  const KpiStatCard = ({
    title,
    value,
    trendPercent,
    icon: Icon,
  }: {
    title: string;
    value: string;
    trendPercent: number;
    icon: any;
  }) => (
    <Card className="bg-white border-0 duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">
              {trendPercent > 0 ? (
                <span className="text-green-600">
                  ↗ {trendPercent}% vs last period
                </span>
              ) : (
                <span>vs last period</span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Cashflow Chart Data
  const cashflowData = {
    labels: [
      'Jan 25',
      'Feb 25',
      'Mar 25',
      'Apr 25',
      'May 25',
      'Jun 25',
      'Jul 25',
      'Aug 25',
      'Sep 25',
      'Oct 25',
      'Nov 25',
      'Dec 25',
    ],
    datasets: [
      {
        label: 'Cash in',
        data: [0.8, 1.4, 0.6, 1.9, 0.3, 1.7, 0.5, 2.1, 0.9, 1.2, 1.8, 0.4],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Cash out',
        data: [0.4, 1.2, 0.8, 1.6, 0.2, 1.4, 0.7, 1.9, 0.5, 1.1, 1.5, 0.9],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
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
            return `FCFA${value}`;
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Message and Time Period - Flexed on same line */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, Vagaly LLC
        </h1>
        <div className="w-48">
          <SearchableSelect
            selectedValue={timeGranularity}
            onChange={(value: string) =>
              console.log('Time period changed:', value)
            }
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
            placeholder="Select period"
            labelClass="text-sm font-medium text-gray-700 mb-2"
          />
        </div>
      </div>

      {/* Main KPI Cards - 4 cards in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainKpiData.map((kpi, index) => (
          <KpiStatCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            trendPercent={kpi.trendPercent}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Cashflow Chart - Full Width */}
      <Card className="bg-white border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Cashflow
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <Line data={cashflowData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Explore potta Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Explore Potta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exploreTymsData.map((item, index) => (
            <Card
              key={index}
              className="bg-white border-0  duration-300"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  <a
                    href="#"
                    className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
                  >
                    {item.link} →
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboard;
