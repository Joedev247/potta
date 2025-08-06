'use client';
import React, { useState } from 'react';
import RootLayout from '../layout';
import DashboardExpenses from '../dashboard/components/expenses';
import { useQuery } from '@tanstack/react-query';
import axios from 'config/axios.config';
import { ContextData } from '@potta/components/context';

const Dashboard = () => {
  const context = React.useContext(ContextData);
  const [startdate, setStartdate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1)
  ); // 6 months ago
  const [endDate, setEndDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');

  // Fetch bills data to get real status and payment method options
  const { data: billsData } = useQuery({
    queryKey: ['bills-filters'],
    queryFn: async () => {
      const response = await axios.get('/bills');
      return response.data;
    },
  });

  const bills = billsData?.data || [];

  // Extract unique statuses from bills
  const statusOptions = [
    { label: 'All Status', value: 'all' },
    ...Array.from(
      new Set(bills.map((bill: any) => bill.status).filter(Boolean))
    ).map((status) => ({ label: status, value: status })),
  ];

  // Extract unique payment methods from bills
  const paymentMethodOptions = [
    { label: 'All Methods', value: 'all' },
    ...Array.from(
      new Set(bills.map((bill: any) => bill.paymentMethod).filter(Boolean))
    ).map((method) => ({ label: method, value: method })),
  ];

  // Team options (you can customize based on your organization structure)
  const teamOptions = [
    { label: 'All Team', value: 'all' },
    { label: 'Finance', value: 'finance' },
    { label: 'Operations', value: 'operations' },
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'IT', value: 'it' },
    { label: 'HR', value: 'hr' },
  ];

  const onDateChange = (startDate: any, endDate: any) => {
    setStartdate(startDate);
    setEndDate(endDate);
  };

  return (
    <RootLayout>
      <div
        className={`${
          context?.layoutMode === 'sidebar' ? 'pl-12' : 'pl-5'
        } pr-5 mt-2`}
      >
        <DashboardExpenses />
      </div>
    </RootLayout>
  );
};
export default Dashboard;
