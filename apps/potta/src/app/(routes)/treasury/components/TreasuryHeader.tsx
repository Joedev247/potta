'use client';
import React from 'react';

interface TreasuryHeaderProps {
  totalCash: number;
  formatCurrency: (amount: number) => string;
}

const TreasuryHeader: React.FC<TreasuryHeaderProps> = ({
  totalCash,
  formatCurrency,
}) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Treasury Overview</h1>
          <p className="text-green-100">
            Comprehensive financial management and cash flow monitoring
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold">
            {formatCurrency(totalCash)}
          </div>
          <div className="text-green-100">Total Cash Position</div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryHeader;
