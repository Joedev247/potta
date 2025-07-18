'use client';
import React, { useState } from 'react';
import RootLayout from '../layout';
import Select from '../../../components/select';
import DashboardCollection from '../dashboard/components/collection';
import DashboardExpenses from '../dashboard/components/expenses';
import CustomDatePicker from '../../../components/CustomDatePicker';
import Icon from '@potta/components/icon_fonts/icon';
import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import { ContextData } from '@potta/components/context';

const Dashboard = () => {
  const DEFAULT_ORGANIZATION_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3c';
  const DEFAULT_BRANCH_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3b';
  const context = React.useContext(ContextData);
  const [swipe, setSwipe] = useState('collection');
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
      const response = await axios.get('/bills', {
        headers: {
          organizationId: DEFAULT_ORGANIZATION_ID,
          BranchId: DEFAULT_BRANCH_ID,
        },
      });
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
          context?.layoutMode === 'sidebar' ? 'pl-16 !mt-4' : 'pl-5 !mt-4'
        } pr-5 mt-10`}
      >
        <div className="w-full flex justify-between space-x-10">
          <div className="w-[30%] flex">
            <div
              onClick={() => setSwipe('collection')}
              className={`w-full h-12 flex justify-center cursor-pointer items-center bg-[#F3FBFB] ${
                swipe == 'collection' &&
                'border-b-2 border-[#154406] text-[#154406] font-medium'
              }`}
            >
              <p>Collections</p>
            </div>
            <div
              onClick={() => setSwipe('expenses')}
              className={`w-full h-12 flex justify-center cursor-pointer items-center bg-[#F3FBFB] ${
                swipe == 'expenses' &&
                'border-b-2 border-[#154406] text-[#154406] font-medium'
              }`}
            >
              <p>Expenses</p>
            </div>
          </div>
          <div className="w-[65%]  flex justify-end">
            <div className="w-full h-12 px-3 flex border-r justify-center items-center bg-[#F3FBFB]">
              <div className="flex w-full space-x-2 mt-1  py-1">
                <CustomDatePicker
                  startDate={startdate}
                  endDate={endDate}
                  minDate={new Date(2020, 0, 1)}
                  maxDate={new Date(2030, 11, 31)}
                  onChange={onDateChange}
                />
              </div>
            </div>
            <div className="w-full h-12 flex border-r justify-center items-center bg-[#F3FBFB]">
              <Select
                options={statusOptions}
                name="Status"
                selectedValue={statusFilter}
                onChange={(value) => setStatusFilter(value)}
              />
            </div>
            <div className="w-full h-12 border-r  flex justify-center items-center bg-[#F3FBFB]">
              <Select
                options={paymentMethodOptions}
                name="Payment Method"
                selectedValue={paymentMethodFilter}
                onChange={(value) => setPaymentMethodFilter(value)}
              />
            </div>
            {/* Remove the Team filter section entirely */}
          </div>
        </div>
        {swipe == 'collection' && <DashboardCollection />}
        {swipe == 'expenses' && <DashboardExpenses />}
      </div>
    </RootLayout>
  );
};
export default Dashboard;
