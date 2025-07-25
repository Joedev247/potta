// 'use client';
import React, { useEffect, useState } from 'react';
import Chart from './dashboardChart';
import BalanceBox from './balanceBoxes';
import { useQuery } from '@tanstack/react-query';
import axios from 'config/axios.config';

interface Assets {
  image: string;
  transactionName: string;
  amount: string;
}

interface Income {
  transactionName: string;
  amount: string;
}

const DashboardCollection = () => {
  const [heights, setHeights] = useState<string>('');
  const [dashTopHeight, setDashTopHeight] = useState<string>('');

  // Fetch bills data for collection analysis
  const { data: billsData, isLoading: billsLoading } = useQuery({
    queryKey: ['bills-collection'],
    queryFn: async () => {
      const response = await axios.get('/bills');
      return response.data;
    },
  });

  // Fetch budgets data for income analysis
  const { data: budgetsData, isLoading: budgetsLoading } = useQuery({
    queryKey: ['budgets-collection'],
    queryFn: async () => {
      const response = await  axios.get('/budgets');
      return response.data;
    },
  });

  useEffect(() => {
    setHeights(window.innerHeight.toString());
    setDashTopHeight(localStorage.getItem('dashTopHeight') || '');
  }, []);

  const bills = billsData?.data || [];
  const budgets = budgetsData?.data || [];

  // Group bills by payment method (terminals)
  const terminalsData: Record<string, number> = {};
  bills.forEach((bill: any) => {
    const method = bill.paymentMethod || 'Other';
    terminalsData[method] =
      (terminalsData[method] || 0) + (parseFloat(bill.invoiceTotal) || 0);
  });

  // Group budgets by type (income drivers)
  const incomeData: Record<string, number> = {};
  budgets.forEach((budget: any) => {
    const type = budget.name || 'General Budget';
    const spent =
      parseFloat(budget.totalAmount) - parseFloat(budget.availableAmount);
    incomeData[type] = (incomeData[type] || 0) + spent;
  });

  // Format data for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const datas: Assets[] = Object.entries(terminalsData)
    .map(([method, amount]) => ({
      image: '/icons/user.svg', // You can map specific icons based on payment method
      transactionName: method,
      amount: formatCurrency(amount),
    }))
    .sort(
      (a, b) =>
        parseFloat(b.amount.replace(/[^0-9.-]+/g, '')) -
        parseFloat(a.amount.replace(/[^0-9.-]+/g, ''))
    )
    .slice(0, 5); // Top 5 terminals

  const Incomes: Income[] = Object.entries(incomeData)
    .map(([type, amount]) => ({
      transactionName: type,
      amount: formatCurrency(amount),
    }))
    .sort(
      (a, b) =>
        parseFloat(b.amount.replace(/[^0-9.-]+/g, '')) -
        parseFloat(a.amount.replace(/[^0-9.-]+/g, ''))
    )
    .slice(0, 5); // Top 5 income drivers

  if (billsLoading || budgetsLoading) {
    return (
      <div className="pt-3 animate-pulse">
        <div className="flex flex-col grow h-full">
          <div>
            <BalanceBox />
          </div>
          <div className="mt-5 w-full py-2">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pb-5 grow">
            <div className="flex flex-col border grow">
              <div className="flex border-b items-center w-full bg-[#F3FBFB] p-4">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
              </div>
              <div className="flex flex-col px-4 gap-2 my-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex w-full border-b py-2 justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 bg-gray-200 rounded"></div>
                      <div className="ml-4 h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="ml-4 h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col border grow">
                <div className="flex justify-between border-b items-center w-full bg-[#F3FBFB] p-4">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-4"></div>
                </div>
                <div className="flex flex-col px-4 gap-2 mt-4 divide-y">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-2 first:pt-0 items-center"
                    >
                      <div className="flex items-center gap-2">
                        <div className="ml-4 h-4 w-32 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div
        style={{ height: parseInt(heights) - parseInt(dashTopHeight) - 20 }}
        className="pt-3"
      >
        <div className="flex flex-col grow h-full">
          <div>
            <BalanceBox />
          </div>
          <div className="mt-5 w-full  py-2">
            <Chart />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-4 mt-5 pb-5 grow">
            <div className="flex flex-col  border grow">
              <div className="flex border-b items-center w-full bg-[#F3FBFB] p-4">
                <h1 className="text-[18px]">Collection by Terminals</h1>
              </div>
              <div className="flex flex-col px-4 gap-2 my-4">
                {datas.length > 0 ? (
                  datas.map((data, index) => (
                    <div
                      key={index}
                      className="flex w-full border-b py-2 justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <img src={data.image} className="h-10 w-10" alt="" />
                        <div className="ml-4">
                          <div className="font-thin text-gray-900">
                            {data.transactionName}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className=" text-gray-900 flex justify-end">
                          {data.amount}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No collection data available
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col  border grow">
                <div className="flex justify-between border-b items-center w-full bg-[#F3FBFB] p-4">
                  <h1 className="text-[18px]">Top Income Driver</h1>
                  <i className="ri-arrow-right-up-line"></i>
                </div>
                <div className="flex flex-col px-4 gap-2 mt-4 divide-y">
                  {Incomes.length > 0 ? (
                    Incomes.map((data, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 first:pt-0 items-center"
                      >
                        <div className="flex items-center gap-2">
                          <div className="ml-4">
                            <div className="font-normal text-gray-900">
                              {data.transactionName}
                            </div>
                          </div>
                        </div>
                        <div className=" text-gray-900 text-lg">
                          {data.amount}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No income data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardCollection;
