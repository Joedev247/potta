import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';

const BalanceBox = () => {
  // Default organization and branch IDs
  const DEFAULT_ORGANIZATION_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3c';
  const DEFAULT_BRANCH_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3b';

  // Fetch bills data for total amount and transactions
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

  // Fetch budgets data for budget overview
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

  // Calculate totals from real data
  const bills = billsData?.data || [];
  const budgets = budgetsData?.data || [];

  const totalAmount = bills.reduce((sum: number, bill: any) => {
    return sum + (parseFloat(bill.invoiceTotal) || 0);
  }, 0);

  const totalTransactions = bills.length;

  const totalBudgetAmount = budgets.reduce((sum: number, budget: any) => {
    return sum + (parseFloat(budget.totalAmount) || 0);
  }, 0);

  const totalBudgetSpent = budgets.reduce((sum: number, budget: any) => {
    const total = parseFloat(budget.totalAmount) || 0;
    const available = parseFloat(budget.availableAmount) || 0;
    return sum + (total - available);
  }, 0);

  // Calculate upcoming payments (bills due in next 30 days)
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const upcomingBills = bills.filter((bill: any) => {
    if (!bill.dueDate) return false;
    const dueDate = new Date(bill.dueDate);
    return dueDate >= now && dueDate <= thirtyDaysFromNow;
  });

  const overdueBills = bills.filter((bill: any) => {
    if (!bill.dueDate) return false;
    const dueDate = new Date(bill.dueDate);
    return dueDate < now && bill.status !== 'Paid';
  });

  const upcomingAmount = upcomingBills.reduce((sum: number, bill: any) => {
    return sum + (parseFloat(bill.invoiceTotal) || 0);
  }, 0);

  const overdueAmount = overdueBills.reduce((sum: number, bill: any) => {
    return sum + (parseFloat(bill.invoiceTotal) || 0);
  }, 0);

  // Format numbers for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (billsLoading || budgetsLoading) {
    return (
      <div className="w-full flex space-x-3">
        <div className="w-[50%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-4 mt-5">
          <div className="w-full">
            <div className="flex flex-col border px-5 h xs:w-full grow animate-pulse">
              <div className="flex justify-between mt-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-4"></div>
              </div>
              <div className="py-4">
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-col border px-5 h- xs:w-full grow animate-pulse">
              <div className="flex justify-between mt-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-4"></div>
              </div>
              <div className="py-4">
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[17vh] relative border w-[50%] mt-5 animate-pulse">
          <div className="bg-gray-200 border-b px-5 flex items-center h-[25%] w-full">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-3 h-[75%] gap-0">
            <div className="flex justify-center w-full items-center">
              <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
            <div className="flex border-l border-r justify-center w-full h-full items-center">
              <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
            <div className="flex justify-center w-full items-center">
              <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex space-x-3">
      <div className="w-[50%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-4 mt-5">
        <div className="w-full">
          <div className="flex flex-col border px-5 h-full grow">
            <div className="flex justify-between mt-2">
              <p className="text-[17px]">Total Amount</p>
              <i className="ri-arrow-right-up-line text-green-400"></i>
            </div>
            <div className="py-4 flex-1 flex flex-col justify-center">
              <h1 className="text-3xl font-bold">
                {formatCurrency(totalAmount)}
              </h1>
            </div>
            <div className="flex justify-between">
              <h1 className="text-md">
                {formatNumber(totalTransactions)} Transactions
              </h1>
              <h1 className="text-sm text-green-400">+10%</h1>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col border px-5 h-full grow">
            <div className="flex justify-between mt-2">
              <p className="text-[17px]">Budget Spent</p>
              <i className="ri-arrow-left-down-line text-green-400"></i>
            </div>
            <div className="py-4 flex-1 flex flex-col justify-center">
              <h1 className="text-3xl font-bold">
                {formatCurrency(totalBudgetSpent)}
              </h1>
            </div>
            <div className="flex justify-between">
              <h1 className="text-md">
                {formatNumber(budgets.length)} Budgets
              </h1>
              <h1 className="text-sm text-green-400">-2%</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[50%] mt-5">
        <div className="flex flex-col border h-full">
          <div className="bg-[#F3FBFB] border-b px-5 py-3 flex items-center">
            <p className="font-medium text-lg">Upcoming Payments</p>
          </div>
          <div className="grid grid-cols-3 flex-1">
            <div className="flex justify-center items-center p-4">
              <div className="text-center">
                <h3 className="text-lg">Overdue</h3>
                <h1 className="text-[#154406] text-xl">
                  {formatCurrency(overdueAmount)}
                </h1>
                <p className="text-gray-400">
                  {formatNumber(overdueBills.length)} Invoices
                </p>
              </div>
            </div>
            <div className="flex border-l border-r justify-center items-center p-4">
              <div className="text-center">
                <h3 className="text-lg">Due in 30 days</h3>
                <h1 className="text-[#154406] text-xl">
                  {formatCurrency(upcomingAmount)}
                </h1>
                <p className="text-gray-400">
                  {formatNumber(upcomingBills.length)} Invoices
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center p-4">
              <div className="text-center">
                <h3 className="text-lg">Total Budget</h3>
                <h1 className="text-[#154406] text-xl">
                  {formatCurrency(totalBudgetAmount)}
                </h1>
                <p className="text-gray-400">
                  {formatNumber(budgets.length)} Budgets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceBox;
