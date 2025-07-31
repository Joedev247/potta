'use client';
import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Building,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@potta/components/shadcn/select';

interface TreasuryMetric {
  name: string;
  value: number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

interface TreasuryMetricsProps {
  metrics: TreasuryMetric[];
  formatCurrency?: (amount: number) => string;
}

const TreasuryMetrics: React.FC<TreasuryMetricsProps> = ({
  metrics,
  formatCurrency,
}) => {
  const [timeFilter, setTimeFilter] = useState('6m');

  const timeFilterOptions = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
  ];

  const formatValue = (value: number, name: string) => {
    if (name.toLowerCase().includes('ratio')) {
      return value.toFixed(2);
    }
    if (name.toLowerCase().includes('days')) {
      return `${value} days`;
    }
    if (formatCurrency) {
      return formatCurrency(value);
    }
    return value.toString();
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Key Performance Metrics
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Period:</span>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="w-8 h-8 text-green-600" />
              <div
                className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatValue(metric.value, metric.name)}
            </div>
            <div className="text-sm text-gray-600">{metric.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreasuryMetrics;
