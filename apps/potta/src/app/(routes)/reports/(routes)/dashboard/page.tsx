'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@potta/components/card';
import KpiCard from '../../components/KpiCard';
import {
  pottaAnalyticsService,
  KpiCategory,
  KpiDefinition,
} from '../../../../../services/analyticsService';
import SearchableSelect from '../../../../../components/searchableSelect';
import {
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Building2,
  Package,
  LineChart,
  BarChart,
  PieChart,
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import RootLayout from '@potta/app/(routes)/layout';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardMetric {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  description: string;
}

const DashboardPage: React.FC = () => {
  const [availableKpis, setAvailableKpis] = useState<KpiDefinition[]>([]);
  const [kpiCategories, setKpiCategories] = useState<KpiCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('financial');
  const [timeGranularity, setTimeGranularity] = useState<
    'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  >('monthly');

  // Load KPI data
  useEffect(() => {
    const loadKpiData = async () => {
      try {
        const [kpisResponse, categoriesResponse] = await Promise.all([
          pottaAnalyticsService.kpi.getAvailableKpis(),
          pottaAnalyticsService.kpi.getKpiCategories(),
        ]);

        setAvailableKpis(kpisResponse.kpis);
        setKpiCategories(categoriesResponse.categories);

        if (categoriesResponse.categories.length > 0) {
          setActiveTab(categoriesResponse.categories[0].name);
        }
      } catch (error) {
        console.error('Error loading KPI data:', error);
      }
    };

    loadKpiData();
  }, []);

  // Get KPIs for selected category
  const getKpisForCategory = (category: string) => {
    return availableKpis.filter((kpi) => kpi.category === category);
  };

  // Chart data generators
  const getRevenueChartData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [2.1, 2.3, 2.8, 3.1, 2.9, 3.2],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Target',
        data: [2.0, 2.2, 2.5, 2.8, 3.0, 3.0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  });

  const getSalesPerformanceData = () => ({
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Sales Growth',
        data: [12, 18, 15, 22],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  });

  const getCustomerMetricsData = () => ({
    labels: ['New Customers', 'Returning', 'Churned', 'Reactivated'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  });

  const getEmployeeProductivityData = () => ({
    labels: ['Sales', 'Marketing', 'Engineering', 'Support', 'Operations'],
    datasets: [
      {
        label: 'Revenue per Employee',
        data: [180, 120, 95, 85, 110],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  });

  const getInventoryTurnoverData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Inventory Turnover',
        data: [6.2, 7.1, 8.3, 7.8, 8.9, 9.2],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  });

  const getProjectPerformanceData = () => ({
    labels: ['On Time', 'Delayed', 'Over Budget', 'Under Budget'],
    datasets: [
      {
        data: [65, 20, 10, 5],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Mock dashboard metrics for each category
  const getDashboardMetrics = (category: string): DashboardMetric[] => {
    const metrics: Record<string, DashboardMetric[]> = {
      financial: [
        {
          name: 'Total Revenue',
          value: '$2.4M',
          change: '+12.5%',
          changeType: 'positive',
          description: 'vs last month',
        },
        {
          name: 'Gross Margin',
          value: '68.2%',
          change: '+2.1%',
          changeType: 'positive',
          description: 'vs last month',
        },
        {
          name: 'EBITDA',
          value: '$450K',
          change: '+8.3%',
          changeType: 'positive',
          description: 'vs last month',
        },
        {
          name: 'Cash Flow',
          value: '$180K',
          change: '-3.2%',
          changeType: 'negative',
          description: 'vs last month',
        },
      ],
      sales_revenue: [
        {
          name: 'Customer Acquisition Cost',
          value: '$1,250',
          change: '-15.2%',
          changeType: 'positive',
          description: 'vs last month',
        },
        {
          name: 'Sales Growth Rate',
          value: '18.7%',
          change: '+5.3%',
          changeType: 'positive',
          description: 'vs last month',
        },
        {
          name: 'Average Revenue Per Customer',
          value: '$8,450',
          change: '+12.1%',
          changeType: 'positive',
          description: 'vs last month',
        },
        {
          name: 'Customer Churn Rate',
          value: '2.3%',
          change: '-0.8%',
          changeType: 'positive',
          description: 'vs last month',
        },
      ],
      human_capital: [
        {
          name: 'Revenue Per Employee',
          value: '$125K',
          change: '+8.9%',
          changeType: 'positive',
          description: 'vs last month',
        },
        {
          name: 'Average Salary Cost',
          value: '$85K',
          change: '+3.2%',
          changeType: 'neutral',
          description: 'vs last month',
        },
        {
          name: 'Headcount Growth Rate',
          value: '12.5%',
          change: '+2.1%',
          changeType: 'positive',
          description: 'vs last month',
        },
        {
          name: 'Cost Per FTE',
          value: '$95K',
          change: '+1.8%',
          changeType: 'neutral',
          description: 'vs last month',
        },
      ],
    };

    return metrics[category] || [];
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      financial: <DollarSign className="w-5 h-5" />,
      sales_revenue: <TrendingUp className="w-5 h-5" />,
      human_capital: <Users className="w-5 h-5" />,
      marketing: <BarChart3 className="w-5 h-5" />,
      inventory_supply_chain: <Package className="w-5 h-5" />,
      project_costing: <Building2 className="w-5 h-5" />,
      planning_performance: <BarChart3 className="w-5 h-5" />,
    };
    return icons[category] || <BarChart3 className="w-5 h-5" />;
  };

  const getChartsForCategory = (category: string) => {
    switch (category) {
      case 'financial':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-green-600" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={getRevenueChartData()} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-blue-600" />
                  Sales Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar
                    data={getSalesPerformanceData()}
                    options={chartOptions}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'sales_revenue':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-600" />
                  Customer Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Doughnut
                    data={getCustomerMetricsData()}
                    options={doughnutOptions}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-green-600" />
                  Sales Growth by Quarter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar
                    data={getSalesPerformanceData()}
                    options={chartOptions}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'human_capital':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-blue-600" />
                  Revenue per Employee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar
                    data={getEmployeeProductivityData()}
                    options={chartOptions}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-green-600" />
                  Employee Productivity Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={getRevenueChartData()} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-green-600" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={getRevenueChartData()} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-blue-600" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar
                    data={getSalesPerformanceData()}
                    options={chartOptions}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <RootLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Executive Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time performance metrics and KPIs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchableSelect
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
            selectedValue={timeGranularity}
            onChange={(value) => setTimeGranularity(value as any)}
            placeholder="Select Time Period"
            label="Time Period:"
            labelClass="text-sm font-medium text-gray-700"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-8">
          {kpiCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveTab(category.name)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === category.name
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getCategoryIcon(category.name)}
              {category.display_name}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getDashboardMetrics(activeTab).map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metric.value}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    metric.changeType === 'positive'
                      ? 'text-green-600'
                      : metric.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  <span>{metric.change}</span>
                  {metric.changeType === 'positive' && (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  {metric.changeType === 'negative' && (
                    <TrendingUp className="w-4 h-4 rotate-180" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {kpiCategories.find((cat) => cat.name === activeTab)?.display_name}{' '}
            Analytics
          </h2>
        </div>
        {getChartsForCategory(activeTab)}
      </div>

      {/* KPI Cards Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {kpiCategories.find((cat) => cat.name === activeTab)?.display_name}{' '}
            KPIs
          </h2>
          <p className="text-sm text-gray-600">
            {getKpisForCategory(activeTab).length} KPIs available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getKpisForCategory(activeTab).map((kpi) => (
            <KpiCard
              key={kpi.name}
              kpiName={kpi.name}
              displayName={kpi.display_name}
              category={kpi.category}
              timeGranularity={timeGranularity}
              useMockData={true}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Export Report</p>
                <p className="text-sm text-gray-600">
                  Download current dashboard
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Share Dashboard</p>
                <p className="text-sm text-gray-600">Send to stakeholders</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Schedule Report</p>
                <p className="text-sm text-gray-600">
                  Set up automated delivery
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
    </RootLayout>
  );
};

export default DashboardPage;
