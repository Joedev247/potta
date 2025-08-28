'use client';
import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

interface TopCustomersProps {
  data: Record<string, number>;
  formatCurrency: (amount: number) => string;
}

const TopCustomers: React.FC<TopCustomersProps> = ({
  data,
  formatCurrency,
}) => {
  // Sort data by amount (descending) and take top 5
  const topCustomers = Object.entries(data)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Top Revenue Sources
        </h2>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
      </div>

      <div className="space-y-3">
        {topCustomers.length > 0 ? (
          topCustomers.map((customer, index) => {
            const totalAmount = Object.values(data).reduce((a, b) => a + b, 0);
            const percentage =
              totalAmount > 0 ? (customer.amount / totalAmount) * 100 : 0;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <span className="text-sm font-semibold text-green-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% of total revenue
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(customer.amount)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No customer data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCustomers;
