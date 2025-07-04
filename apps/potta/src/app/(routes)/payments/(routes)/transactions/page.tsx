'use client';
import React, { useState } from 'react';
import Filter from './components/Filters';
import TransactionsTable from './components/TransactionsTable';

const TransactionsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [dateRange, setDateRange] = useState('All Time');
  return (
    <div className="p-8 pl-12">
      <Filter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <TransactionsTable
        search={search}
        status={status}
        dateRange={dateRange}
      />
    </div>
  );
};

export default TransactionsPage;
