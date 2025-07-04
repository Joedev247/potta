// src/app/dashboard/page.tsx (or your desired route)
'use client';

import * as React from 'react';

import { PaymentRequestDataTableWrapper } from './components/table';
import Filter from './components/filters';
import RootLayout from '../../layout';
import { mockPaymentRequests } from '../budgets/details/utils/data';
// Import your components and data

// Import the NEW Table Wrapper Component

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false); // Example loading state
  const [requests, setRequests] = React.useState(mockPaymentRequests);

  // Basic filtering example (can be expanded)
  const filteredRequests = requests.filter(
    (req) =>
      req.madeBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.madeTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Example: Simulate loading (replace with actual API call)
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate 1 second load
    return () => clearTimeout(timer);
  }, []);

  const handleAddReimbursement = (data: any) => {
    setRequests([
      ...requests,
      {
        id: Date.now(),
        madeBy: data.employee,
        madeTo: data.merchant,
        amount: Number(data.amount),
        memo: data.memo,
        status: data.status,
        category: data.category,
        currency: 'XAF',
      },
    ]);
  };

  return (
    <RootLayout>
      <div className=" bg-gray-50 min-h-[92vh] space-y-14 pl-16 pr-5 w-full pt-6">
        {/* Top Row Cards (same as before) */}

        {/* Action/Filter Row (same as before) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
          {/* Search and Filters */}
          <Filter onNew={handleAddReimbursement} />
        </div>
        {/* Payment Request Table - USE THE NEW WRAPPER */}
        <div>
          <PaymentRequestDataTableWrapper
            requests={filteredRequests}
            isLoading={isLoading}
          />
        </div>
      </div>
    </RootLayout>
  );
}
