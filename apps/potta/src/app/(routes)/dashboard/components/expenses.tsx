'use client';
import React, { useEffect, useState } from 'react';
import Chart from './dashboardChart';
import BalanceBox from './balanceBoxes';
import PieChart from '../../../charts/piechart';
import { useQuery } from '@tanstack/react-query';
import axios from 'config/axios.config';

const DashboardExpenses = () => {
  const DEFAULT_ORGANIZATION_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3c';
  const DEFAULT_BRANCH_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3b';

  // Fetch bills and budgets
  const { data: billsData, isLoading: billsLoading } = useQuery({
    queryKey: ['bills-dashboard'],
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
  const { data: budgetsData, isLoading: budgetsLoading } = useQuery({
    queryKey: ['budgets-dashboard'],
    queryFn: async () => {
      const response = await axios.get('/budgets', {
        headers: {
          organizationId: DEFAULT_ORGANIZATION_ID,
          BranchId: DEFAULT_BRANCH_ID,
        },
      });
      return response.data;
    },
  });

  const bills = billsData?.data || [];
  const budgets = budgetsData?.data || [];

  // Group expenses by person (madeTo or vendor)
  const expensesByPerson: Record<string, number> = {};
  bills.forEach((bill: any) => {
    const person = bill.customer?.firstName
      ? `${bill.customer.firstName} ${bill.customer.lastName}`
      : bill.vendor?.name || '-';
    expensesByPerson[person] =
      (expensesByPerson[person] || 0) + (parseFloat(bill.invoiceTotal) || 0);
  });
  const personList = Object.entries(expensesByPerson).map(([name, amount]) => ({
    name,
    amount,
  }));
  personList.sort((a, b) => b.amount - a.amount);

  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  bills.forEach((bill: any) => {
    const category = bill.invoiceType || 'Other';
    expensesByCategory[category] =
      (expensesByCategory[category] || 0) +
      (parseFloat(bill.invoiceTotal) || 0);
  });
  const categoryList = Object.entries(expensesByCategory).map(
    ([name, amount]) => ({ name, amount })
  );
  categoryList.sort((a, b) => b.amount - a.amount);

  // Pie chart data for categories
  const pieChartData = categoryList.map((item) => ({
    name: item.name,
    value: item.amount,
  }));

  // Format numbers for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (billsLoading || budgetsLoading) {
    return (
      <div className="pt-3 animate-pulse">
        <div className="flex flex-col grow h-full">
          <div>
            <BalanceBox />
          </div>
          <div className="w-full flex space-x-5">
            <div className="mt-5 w-[50%] w-full py-2">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="w-[50%] mt-2">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-5 pb-5 grow">
                <div className="flex flex-col border grow">
                  <div className="flex border-b items-center p-4">
                    <div className="h-6 bg-gray-200 rounded w-40"></div>
                  </div>
                  <div className="flex flex-col px-4 gap-2 my-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex w-full border-b py-2 justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                          <div className="ml-4 h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                        <div className="ml-4 mt-2 h-4 w-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex space-x-5 mt-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="w-[50%] border">
              <div className="w-full border-b py-3 bg-[#F3FBFB]">
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </div>
              <div className="flex space-x-5 w-full px-2">
                <div className="my-5 w-[50%] h-32 bg-gray-200 rounded"></div>
                <div className="w-[50%] flex-1 flex-col w-full justify-between">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="flex justify-between py-4 border-b w-full gap-2"
                    >
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="pt-3">
        <div className="flex flex-col grow h-full">
          <div>
            <BalanceBox />
          </div>
          <div className="w-full flex space-x-5">
            <div className="mt-5 w-[50%] w-full py-2">
              {/* You can update Chart to use real data if needed */}
              <Chart />
            </div>
            <div className="w-[50%] mt-2">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-5 pb-5 grow">
                <div className="flex flex-col border grow">
                  <div className="flex border-b items-center p-4">
                    <h1 className="text-[18px]">Total Expenses by Person</h1>
                  </div>
                  <div className="flex flex-col px-4 gap-2 my-4">
                    {personList.map((data, index) => (
                      <div
                        key={index}
                        className="flex w-full border-b py-2 justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                            {data.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className="ml-4">
                            <div className="font-thin text-gray-900">
                              {data.name}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 mt-2">
                          <div className="text-gray-900 flex justify-end">
                            {formatCurrency(data.amount as number)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex space-x-5 mt-8">
          {/* <div className="w-[50%] border">
            <div className="w-full border-b py-3 bg-[#F3FBFB]">
              <h3>Expenses by Category</h3>
            </div>
            <div className="flex space-x-5 w-full px-2">
              <div className="my-5 w-[50%]">
                {/* Pass real pie chart data */}
                {/* <PieChart
                  data={pieChartData}
                  title="Expenses by Category"
                  width={200}
                />
              </div>
              <div className="w-[50%]">
                <div className="flex-1 flex-col w-full justify-between">
                  {categoryList.map((items, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-4 border-b w-full gap-2"
                    >
                      <div>{items.name}</div>
                      <div>{formatCurrency(items.amount as number)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> */} 
          {/* <div className="w-[50%] border">
            <div className="w-full border-b py-3 bg-[#F3FBFB]">
              <h3>Expenses by Category</h3>
            </div>
            <div className="flex space-x-5 w-full px-2">
              <div className="my-5 w-[50%]">
                <PieChart
                  data={pieChartData}
                  title="Expenses by Category"
                  width={200}
                />
              </div>
              <div className="w-[50%]">
                <div className="flex-1 flex-col w-full justify-between">
                  {categoryList.map((items, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-4 border-b w-full gap-2"
                    >
                      <div>{items.name}</div>
                      <div>{formatCurrency(items.amount as number)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default DashboardExpenses;
