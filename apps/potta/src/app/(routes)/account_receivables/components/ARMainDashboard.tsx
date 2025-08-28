'use client';
import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Calendar,
} from 'lucide-react';

// Import modular components
import ARHeader from './ARHeader';
import ARMetrics from './ARMetrics';
import CollectionSummary from './CollectionSummary';
import InvoiceBreakdown from './InvoiceBreakdown';
import CollectionChart from './CollectionChart';
import TopCustomers from './TopCustomers';
import RecentInvoices from './RecentInvoices';
import { useQuery } from '@tanstack/react-query';
import axios from 'config/axios.config';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@potta/components/shadcn/popover';


interface ARMainDashboardProps {
  type?: 'ar';
}

const periods = ['Yesterday', 'Today', 'This week', 'This Month', 'Custom'];

// Helper function to get date range based on period
const getDateRange = (period: string, customDate?: DateRange): DateRange => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  switch (period) {
    case 'Yesterday':
      return { from: yesterday, to: yesterday };
    case 'Today':
      return { from: today, to: today };
    case 'This week':
      return { from: startOfWeek, to: today };
    case 'This Month':
      return { from: startOfMonth, to: today };
    case 'Custom':
      return customDate || { from: today, to: today };
    default:
      return { from: today, to: today };
  }
};

const ARMainDashboard: React.FC<ARMainDashboardProps> = ({ type = 'ar' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [customDate, setCustomDate] = useState<DateRange | undefined>();

  // Memoize the date range calculation to prevent unnecessary re-renders
  const calculatedDateRange = useMemo(() => {
    return getDateRange(selectedPeriod, customDate);
  }, [
    selectedPeriod,
    customDate?.from?.toDateString(),
    customDate?.to?.toDateString(),
  ]);

  // Fetch bills data for collection analysis with date filtering
  const { data: billsData, isLoading: billsLoading } = useQuery({
    queryKey: [
      'bills-collection',
      calculatedDateRange?.from?.toISOString(),
      calculatedDateRange?.to?.toISOString(),
    ],
    queryFn: async () => {
      const filter =
        calculatedDateRange?.from && calculatedDateRange?.to
          ? {
              fromDate: calculatedDateRange.from.toISOString(),
              toDate: calculatedDateRange.to.toISOString(),
            }
          : {};
      const response = await axios.get('/bills', { params: filter });
      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // Fetch budgets data for income analysis
  const { data: budgetsData, isLoading: budgetsLoading } = useQuery({
    queryKey: ['budgets-collection'],
    queryFn: async () => {
      const response = await axios.get('/budgets');
      return response.data;
    },
  });

  const bills = billsData?.data || [];
  const budgets = budgetsData?.data || [];

  // Process data for dashboard components
  const collectionData = useMemo(() => {
    const totalCollected = bills.reduce(
      (sum: number, bill: any) => sum + (parseFloat(bill.invoiceTotal) || 0),
      0
    );

    const totalInvoices = bills.length;
    const averageInvoiceValue =
      totalInvoices > 0 ? totalCollected / totalInvoices : 0;

    return {
      totalCollected,
      totalInvoices,
      averageInvoiceValue,
      collectionRate: 85, // Mock data - you can calculate this based on your business logic
    };
  }, [bills]);

  const arMetrics = [
    {
      name: 'Days Sales Outstanding',
      value: 28,
      change: '-2',
      trend: 'down' as const,
      icon: Calendar,
    },
    {
      name: 'Collection Rate',
      value: 85,
      change: '+3%',
      trend: 'up' as const,
      icon: TrendingUp,
    },
    {
      name: 'Average Invoice Value',
      value: collectionData.averageInvoiceValue,
      change: '+5%',
      trend: 'up' as const,
      icon: DollarSign,
    },
    {
      name: 'Active Customers',
      value: 156,
      change: '+12',
      trend: 'up' as const,
      icon: Users,
    },
  ];

  // Group bills by payment method (terminals)
  const terminalsData = useMemo(() => {
    const terminals: Record<string, number> = {};
    bills.forEach((bill: any) => {
      const method = bill.paymentMethod || 'Other';
      terminals[method] =
        (terminals[method] || 0) + (parseFloat(bill.invoiceTotal) || 0);
    });
    return terminals;
  }, [bills]);

  // Group budgets by type (income drivers)
  const incomeData = useMemo(() => {
    const income: Record<string, number> = {};
    budgets.forEach((budget: any) => {
      const type = budget.name || 'General Budget';
      const spent =
        parseFloat(budget.totalAmount) - parseFloat(budget.availableAmount);
      income[type] = (income[type] || 0) + spent;
    });
    return income;
  }, [budgets]);

  const recentInvoices = useMemo(() => {
    return bills.slice(0, 5).map((bill: any) => ({
      id: bill.invoiceId || bill.uuid,
      customer: bill.customerName || 'Unknown Customer',
      amount: parseFloat(bill.invoiceTotal) || 0,
      date: bill.issuedDate || new Date().toISOString(),
      status: bill.status || 'pending',
    }));
  }, [bills]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Memoize the date range formatting
  const formatDateRange = useCallback(() => {
    if (!customDate?.from) return '';
    if (!customDate?.to) return format(customDate.from, 'PPP');
    return `${format(customDate.from, 'PPP')} - ${format(
      customDate.to,
      'PPP'
    )}`;
  }, [customDate?.from?.toDateString(), customDate?.to?.toDateString()]);

  // Memoize the custom button text
  const getCustomButtonText = useCallback(() => {
    if (selectedPeriod === 'Custom' && customDate?.from) {
      if (!customDate.to) return format(customDate.from, 'MMM d, yyyy');
      if (
        customDate.from.getFullYear() === customDate.to.getFullYear() &&
        customDate.from.getMonth() === customDate.to.getMonth()
      ) {
        return `${format(customDate.from, 'MMM d')} - ${format(
          customDate.to,
          'd, yyyy'
        )}`;
      }
      return `${format(customDate.from, 'MMM d')} - ${format(
        customDate.to,
        'MMM d, yyyy'
      )}`;
    }
    return 'Custom';
  }, [
    selectedPeriod,
    customDate?.from?.toDateString(),
    customDate?.to?.toDateString(),
  ]);

  // Memoize the period change handler
  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period);
    if (period !== 'Custom') {
      setCustomDate(undefined);
    }
  }, []);

  // Handle custom date selection
  const handleCustomDateChange = useCallback(
    (newDate: DateRange | undefined) => {
      setCustomDate(newDate);
    },
    []
  );

  if (billsLoading || budgetsLoading) {
    return (
      <div className="p-3 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="h-80 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-6">
      {/* Date Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {periods.map((period) => {
          if (period !== 'Custom') {
            return (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-4 py-2 flex rounded-full items-center text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-green-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {period}
              </button>
            );
          } else {
            return (
              <Popover key={period}>
                <PopoverTrigger>
                  <button
                    onClick={() => handlePeriodChange(period)}
                    className={`px-4 py-2 flex rounded-full items-center text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-green-900 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {getCustomButtonText()}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-md"
                  align="start"
                >
                  <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-md">
                    <h3 className="font-medium text-center">
                      {formatDateRange()}
                    </h3>
                  </div>
                  <div className="p-3">
                    <Calendar
                      mode="range"
                      defaultMonth={customDate?.from}
                      selected={customDate}
                      onSelect={handleCustomDateChange}
                      numberOfMonths={2}
                      className="bg-white"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        className="bg-green-900 text-white px-4 py-2 rounded-md text-sm"
                        onClick={() => {
                          // Handle applying the date range
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          }
        })}
      </div>

      {/* Header Section */}
      <ARHeader
        totalCollected={collectionData.totalCollected}
        totalInvoices={collectionData.totalInvoices}
        formatCurrency={formatCurrency}
      />

      {/* Key Metrics Section */}
      <ARMetrics metrics={arMetrics} formatCurrency={formatCurrency} />

      {/* Collection & Invoice Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollectionSummary
          data={collectionData}
          formatCurrency={formatCurrency}
        />
        <InvoiceBreakdown
          data={terminalsData}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Collection Chart Section */}
      <CollectionChart data={bills} formatCurrency={formatCurrency} />

      {/* Top Customers & Recent Invoices Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCustomers data={incomeData} formatCurrency={formatCurrency} />
        <RecentInvoices
          invoices={recentInvoices}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

export default ARMainDashboard;
