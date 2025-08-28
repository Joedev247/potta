'use client';
import React from 'react';
import { CreditCard, Smartphone, Banknote, Wallet } from 'lucide-react';

interface InvoiceBreakdownProps {
  data: Record<string, number>;
  formatCurrency: (amount: number) => string;
}

const InvoiceBreakdown: React.FC<InvoiceBreakdownProps> = ({
  data,
  formatCurrency,
}) => {
  // Get icon for payment method
  const getPaymentIcon = (method: string) => {
    const methodLower = method.toLowerCase();
    if (methodLower.includes('card') || methodLower.includes('credit')) {
      return CreditCard;
    } else if (
      methodLower.includes('mobile') ||
      methodLower.includes('phone')
    ) {
      return Smartphone;
    } else if (methodLower.includes('cash')) {
      return Banknote;
    } else {
      return Wallet;
    }
  };

  // Sort data by amount (descending)
  const sortedData = Object.entries(data)
    .map(([method, amount]) => ({ method, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5); // Top 5 payment methods

  return (
    <div className="bg-white p-6  border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Collection by Payment Method
        </h2>
        <div className="blue-100 ">
          <CreditCard className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      <div className="space-y-3">
        {sortedData.length > 0 ? (
          sortedData.map((item, index) => {
            const Icon = getPaymentIcon(item.method);
            const percentage = data
              ? (item.amount / Object.values(data).reduce((a, b) => a + b, 0)) *
                100
              : 0;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50  hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="white  shadow-sm">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.method}
                    </p>
                    <p className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% of total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-8">
            <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No collection data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceBreakdown;
