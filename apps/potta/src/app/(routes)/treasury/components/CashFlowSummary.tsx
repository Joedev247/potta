'use client';
import React from 'react';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';

interface CashFlowData {
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
  cashFlowPercentage: number;
}

interface CashFlowSummaryProps {
  data: CashFlowData;
  formatCurrency: (amount: number) => string;
}

const CashFlowSummary: React.FC<CashFlowSummaryProps> = ({
  data,
  formatCurrency,
}) => {
  const { cashIn, cashOut, netCashFlow, cashFlowPercentage } = data;

  const getCashFlowTrend = () => {
    if (netCashFlow > 0) {
      return { icon: TrendingUp, color: 'text-green-600', text: 'Positive' };
    }
    return { icon: TrendingDown, color: 'text-red-600', text: 'Negative' };
  };

  const trend = getCashFlowTrend();

  return (
    <div className="bg-white  border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Cash Flow Summary
        </h3>
        <Info className="w-4 h-4 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-green-50 ">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-700 font-medium">Cash In</span>
          </div>
          <span className="font-semibold text-green-600">
            {formatCurrency(cashIn)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-red-50 ">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <span className="text-gray-700 font-medium">Cash Out</span>
          </div>
          <span className="font-semibold text-red-600">
            {formatCurrency(cashOut)}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-900 font-semibold">Net Cash Flow</span>
            <div className="flex items-center">
              <trend.icon className={`w-4 h-4 mr-1 ${trend.color}`} />
              <span className={`font-semibold text-lg ${trend.color}`}>
                {formatCurrency(netCashFlow)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{trend.text} cash flow</span>
            <span className="text-gray-500">
              {cashFlowPercentage}% of total cash position
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowSummary;
