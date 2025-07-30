'use client';
import { ContextData } from '@potta/components/context';
import RootLayout from '../layout';
import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'config/axios.config';
import {
  ExternalLink,
  Info,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Treasury = () => {
  const context = useContext(ContextData);

  // Fetch data for treasury dashboard
  const { data: billsData, isLoading: billsLoading } = useQuery({
    queryKey: ['treasury-bills'],
    queryFn: async () => {
      const response = await axios.get('/bills');
      return response.data;
    },
  });

  const bills = billsData?.data || [];

  // Calculate pending actions
  const invoicesToVerify = bills.filter(
    (bill: any) => bill.status === 'pending_verification'
  ).length;
  const invoicesToPay = bills.filter(
    (bill: any) => bill.status === 'pending_payment'
  ).length;
  const transactionsToPay = 1; // Mock data
  const entriesToPrepare = 11; // Mock data

  // Calculate main figures
  const totalToPay = bills
    .filter((bill: any) => bill.status === 'pending_payment')
    .reduce(
      (sum: number, bill: any) => sum + (parseFloat(bill.invoiceTotal) || 0),
      0
    );

  const scheduledTransactions = 0;
  const paidTransactions = 0;

  // Calculate aging balance data for chart
  const agingBalanceData = {
    '0-30': bills
      .filter((bill: any) => {
        const dueDate = new Date(bill.dueDate);
        const now = new Date();
        const diffDays = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffDays >= 0 && diffDays <= 30;
      })
      .reduce(
        (sum: number, bill: any) => sum + (parseFloat(bill.invoiceTotal) || 0),
        0
      ),
    '31-60': bills
      .filter((bill: any) => {
        const dueDate = new Date(bill.dueDate);
        const now = new Date();
        const diffDays = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffDays >= 31 && diffDays <= 60;
      })
      .reduce(
        (sum: number, bill: any) => sum + (parseFloat(bill.invoiceTotal) || 0),
        0
      ),
    '61-90': bills
      .filter((bill: any) => {
        const dueDate = new Date(bill.dueDate);
        const now = new Date();
        const diffDays = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffDays >= 61 && diffDays <= 90;
      })
      .reduce(
        (sum: number, bill: any) => sum + (parseFloat(bill.invoiceTotal) || 0),
        0
      ),
    '90+': bills
      .filter((bill: any) => {
        const dueDate = new Date(bill.dueDate);
        const now = new Date();
        const diffDays = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffDays > 90;
      })
      .reduce(
        (sum: number, bill: any) => sum + (parseFloat(bill.invoiceTotal) || 0),
        0
      ),
  };

  // Calculate beneficiaries ranking
  const beneficiariesRanking = bills.reduce((acc: any, bill: any) => {
    const vendor = bill.vendor?.name || 'Unknown Vendor';
    if (!acc[vendor]) {
      acc[vendor] = 0;
    }
    acc[vendor] += parseFloat(bill.invoiceTotal) || 0;
    return acc;
  }, {});

  const topBeneficiaries = Object.entries(beneficiariesRanking)
    .map(([name, amount]) => ({ name, amount: amount as number }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Chart options for aging balance
  const agingChartOptions: ApexOptions = {
    chart: {
      id: 'aging-balance-chart',
      toolbar: { show: false },
      stacked: false,
    },
    xaxis: {
      categories: Object.keys(agingBalanceData),
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return formatCurrency(value);
        },
      },
    },
    colors: ['#ef4444', '#f97316', '#eab308', '#dc2626'],
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      width: 2,
      dashArray: 0,
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return formatCurrency(value);
        },
      },
    },
  };

  const agingChartSeries = [
    {
      name: 'Aging Balance',
      data: Object.values(agingBalanceData),
    },
  ];

  if (billsLoading) {
    return (
      <RootLayout>
        <div
          className={`${
            context?.layoutMode === 'sidebar' ? 'pl-16' : 'pl-5'
          } p-6`}
        >
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div
        className={`${
          context?.layoutMode === 'sidebar' ? 'pl-16' : 'pl-5'
        } p-6`}
      >
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Outstanding */}
          <div className="bg-white p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalToPay)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          {/* Scheduled Payments */}
          <div className="bg-white p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Scheduled Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(scheduledTransactions)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-red-600">-5.2%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          {/* Paid This Month */}
          <div className="bg-white p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Paid This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(paidTransactions)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+8.7%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Actions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {invoicesToPay + transactionsToPay + entriesToPrepare}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {invoicesToPay} invoices, {transactionsToPay} payments
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Aging Balance Chart */}
          <div className="bg-white p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Aging Balance Analysis
              </h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="h-64">
              <ApexChart
                type="bar"
                options={agingChartOptions}
                series={agingChartSeries}
                height={250}
              />
            </div>
          </div>

          {/* Beneficiaries Ranking */}
          <div className="bg-white p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Beneficiaries
              </h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            {topBeneficiaries.length > 0 ? (
              <div className="space-y-3">
                {topBeneficiaries.map((beneficiary, index) => (
                  <div
                    key={beneficiary.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-xs font-semibold mr-3">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-900 truncate max-w-32">
                        {beneficiary.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(beneficiary.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No beneficiaries data</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-green-100 flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Review Invoices</p>
                <p className="text-sm text-gray-500">
                  {invoicesToVerify} pending
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center mr-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Process Payments</p>
                <p className="text-sm text-gray-500">
                  {transactionsToPay} pending
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <div className="w-10 h-10 bg-orange-100 flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Journal Entries</p>
                <p className="text-sm text-gray-500">
                  {entriesToPrepare} to prepare
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Treasury;
