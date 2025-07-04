// src/app/dashboard/page.tsx (or your desired route)
'use client';

import * as React from 'react';

import { PaymentRequestDataTableWrapper } from './components/table';
import Filter from './components/filters';
import RootLayout from '../../layout';

export default function DashboardPage() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [paymentMethod, setPaymentMethod] = React.useState('all');

  return (
    <RootLayout>
      <div className=" bg-gray-50 min-h-[92vh] space-y-14 pl-16 pr-5 w-full pt-6">
        {/* Top Row Cards (same as before) */}

        {/* Action/Filter Row (same as before) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
          {/* Search and Filters */}
          <Filter
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
        </div>

        {/* Payment Request Table - USE THE NEW WRAPPER */}
        <div>
          <PaymentRequestDataTableWrapper
            search={search}
            status={status}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </RootLayout>
  );
}
