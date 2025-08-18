'use client';
import React from 'react';
import { Card, CardContent } from '@potta/components/card';

interface CFODashboardProps {
  timeGranularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

const CFODashboard: React.FC<CFODashboardProps> = ({ timeGranularity }) => {
  // CFO Dashboard KPI Data Array - 20 KPIs in 5x4 grid
  const cfoKpiData = [
    // Row 1: Financial Performance
    { title: 'Revenue', value: 'FCFAO', trendPercent: 0, isPercentage: false },
    {
      title: 'Cost of goods sold',
      value: 'FCFAO',
      trendPercent: 0,
      isPercentage: false,
    },
    {
      title: 'Gross profit',
      value: 'FCFAO',
      trendPercent: 0,
      isPercentage: false,
    },
    {
      title: 'Gross profit margin',
      value: '0.0%',
      trendPercent: 0,
      isPercentage: true,
    },

    // Row 2: Operating Performance
    {
      title: 'Operating expenses',
      value: 'FCFAO',
      trendPercent: 0,
      isPercentage: false,
    },
    {
      title: 'Operating income',
      value: 'FCFAO',
      trendPercent: 0,
      isPercentage: false,
    },
    {
      title: 'Operating income margin',
      value: '0.0%',
      trendPercent: 0,
      isPercentage: true,
    },
    {
      title: 'Net income',
      value: 'FCFAO',
      trendPercent: 0,
      isPercentage: false,
    },

    // Row 3: Profitability & Assets
    {
      title: 'Net income margin',
      value: '0.0%',
      trendPercent: 0,
      isPercentage: true,
    },
    { title: 'EBITDA', value: 'FCFAO', trendPercent: 0, isPercentage: false },
    {
      title: 'EBITDA margin',
      value: '0.0%',
      trendPercent: 0,
      isPercentage: true,
    },
    { title: 'Assets', value: 'FCFAO', trendPercent: 0, isPercentage: false },

    // Row 4: Liabilities & Ratios
    {
      title: 'Liabilities',
      value: 'FCFAO',
      trendPercent: 0,
      isPercentage: false,
    },
    { title: 'Equity', value: 'FCFAO', trendPercent: 0, isPercentage: false },
    {
      title: 'Current ratio',
      value: '0.0%',
      trendPercent: 0,
      isPercentage: true,
    },
    {
      title: 'Debt equity ratio',
      value: '0.0%',
      trendPercent: 0,
      isPercentage: true,
    },

    // Row 5: Returns & Cash Flow
    {
      title: 'Return on assets',
      value: '0.0%',
      trendPercent: 0,
      isPercentage: true,
    },
    {
      title: 'Return on equity',
      value: '0.0%',
      trendPercent: 0,
      isPercentage: true,
    },
    {
      title: 'Cash inflow',
      value: 'FCFAO',
      trendPercent: 0,
      isPercentage: false,
    },
    {
      title: 'Cash outflow',
      value: 'FCFAO',
      trendPercent: 0,
      isPercentage: false,
    },
  ];

  // KPI Stat Card Component - CFO Style
  const KpiStatCard = ({
    title,
    value,
    trendPercent,
    isPercentage,
  }: {
    title: string;
    value: string;
    trendPercent: number;
    isPercentage: boolean;
  }) => (
    <Card className="bg-white border-0 transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Top Left: Trend Percentage */}
          <div className="flex justify-center">
            <span className="text-sm font-medium text-green-600">
              ↗ {trendPercent}%
            </span>
          </div>

          {/* Center: Title */}
          <div className="text-center">
            <p className="text-sm text-gray-600 font-medium">{title}</p>
          </div>

          {/* Below Title: Current Value */}
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>

          {/* Bottom: Last Period Value */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Last period was {isPercentage ? '0.0%' : 'FCFAO'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid - 5x4 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cfoKpiData.map((kpi, index) => (
          <KpiStatCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            trendPercent={kpi.trendPercent}
            isPercentage={kpi.isPercentage}
          />
        ))}
      </div>
    </div>
  );
};

export default CFODashboard;
