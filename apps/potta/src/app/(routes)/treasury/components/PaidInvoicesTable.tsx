import React, { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import DataGrid from '@potta/app/(routes)/account_receivables/components/DataGrid';
import DynamicFilter from '@potta/components/dynamic-filter';
import { Filter, Calendar, DollarSign, Eye } from 'lucide-react';
import Button from '@potta/components/button';

interface PaidInvoice {
  id: string;
  title: string;
  type: string;
  beneficiary: string;
  invoiceNumber: string;
  billingDate: string;
  dueDate: string;
  status: string;
  amountExclTax: number;
  amountInclTax: number;
  paymentDate: string;
  paymentMethod: string;
}

const PaidInvoicesTable: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  const mockData: PaidInvoice[] = [
    {
      id: '1',
      title: 'Office Supplies Invoice',
      type: 'Bill',
      beneficiary: 'Office Supplies Co.',
      invoiceNumber: 'INV-2024-001',
      billingDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'paid',
      amountExclTax: 1500.0,
      amountInclTax: 1650.0,
      paymentDate: '2024-02-10',
      paymentMethod: 'Mobile Money',
    },
    {
      id: '2',
      title: 'Software License Renewal',
      type: 'Bill',
      beneficiary: 'Tech Solutions Ltd.',
      invoiceNumber: 'INV-2024-002',
      billingDate: '2024-01-20',
      dueDate: '2024-02-20',
      status: 'paid',
      amountExclTax: 2500.0,
      amountInclTax: 2750.0,
      paymentDate: '2024-02-18',
      paymentMethod: 'Orange Money',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredData = useMemo(() => {
    return mockData.filter((invoice) => {
      if (invoice.status !== 'paid') return false;

      const searchMatch =
        !searchValue ||
        invoice.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        invoice.beneficiary.toLowerCase().includes(searchValue.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchValue.toLowerCase());

      let dateMatch = true;
      if (dateFilter !== 'all') {
        const invoiceDate = new Date(invoice.paymentDate);
        const now = new Date();
        const diffDays = Math.ceil(
          (now.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (dateFilter) {
          case 'today':
            dateMatch = diffDays === 0;
            break;
          case 'week':
            dateMatch = diffDays <= 7;
            break;
          case 'month':
            dateMatch = diffDays <= 30;
            break;
          case 'quarter':
            dateMatch = diffDays <= 90;
            break;
        }
      }

      let amountMatch = true;
      if (amountFilter !== 'all') {
        const amount = invoice.amountInclTax;
        switch (amountFilter) {
          case 'low':
            amountMatch = amount < 1000;
            break;
          case 'medium':
            amountMatch = amount >= 1000 && amount < 5000;
            break;
          case 'high':
            amountMatch = amount >= 5000;
            break;
        }
      }

      const paymentMethodMatch =
        paymentMethodFilter === 'all' ||
        invoice.paymentMethod.toLowerCase() ===
          paymentMethodFilter.toLowerCase();

      return searchMatch && dateMatch && amountMatch && paymentMethodMatch;
    });
  }, [searchValue, dateFilter, amountFilter, paymentMethodFilter]);

  const filterConfig = [
    {
      key: 'date',
      label: 'Payment Date',
      icon: <Calendar className="w-4 h-4 text-gray-400" />,
      options: [
        { label: 'All', value: 'all' },
        { label: 'Today', value: 'today' },
        { label: 'This Week', value: 'week' },
        { label: 'This Month', value: 'month' },
        { label: 'This Quarter', value: 'quarter' },
      ],
      value: dateFilter,
      onChange: setDateFilter,
    },
    {
      key: 'amount',
      label: 'Amount',
      icon: <DollarSign className="w-4 h-4 text-gray-400" />,
      options: [
        { label: 'All', value: 'all' },
        { label: 'Low (< €1,000)', value: 'low' },
        { label: 'Medium (€1,000 - €5,000)', value: 'medium' },
        { label: 'High (> €5,000)', value: 'high' },
      ],
      value: amountFilter,
      onChange: setAmountFilter,
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      icon: <Filter className="w-4 h-4 text-gray-400" />,
      options: [
        { label: 'All Methods', value: 'all' },
        { label: 'Mobile Money', value: 'mobile money' },
        { label: 'Orange Money', value: 'orange money' },
        { label: 'Bank Transfer', value: 'bank transfer' },
      ],
      value: paymentMethodFilter,
      onChange: setPaymentMethodFilter,
    },
  ];

  const columns: ColumnDef<PaidInvoice>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.getValue('type')}
        </span>
      ),
    },
    {
      accessorKey: 'beneficiary',
      header: 'Beneficiary',
      cell: ({ row }) => (
        <div className="text-gray-900">{row.getValue('beneficiary')}</div>
      ),
    },
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice Number',
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-600">
          {row.getValue('invoiceNumber')}
        </div>
      ),
    },
    {
      accessorKey: 'paymentDate',
      header: 'Payment Date',
      cell: ({ row }) => (
        <div className="text-gray-900 font-medium">
          {formatDate(row.getValue('paymentDate'))}
        </div>
      ),
    },
    {
      accessorKey: 'amountInclTax',
      header: 'Amount Paid',
      cell: ({ row }) => (
        <div className="text-gray-900 font-medium">
          {formatCurrency(row.getValue('amountInclTax'))}
        </div>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => {
        const method = row.getValue('paymentMethod') as string;
        const getMethodColor = (method: string) => {
          switch (method.toLowerCase()) {
            case 'mobile money':
              return 'bg-green-100 text-green-800';
            case 'orange money':
              return 'bg-orange-100 text-orange-800';
            case 'bank transfer':
              return 'bg-blue-100 text-blue-800';
            default:
              return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(
              method
            )}`}
          >
            {method}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Paid
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          text="View"
          type="button"
          icon={<Eye className="w-3 h-3 mr-1" />}
          onClick={() => console.log('View invoice:', row.original)}
        />
      ),
    },
  ];

  return (
    <div className="bg-white p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Paid Invoices</h2>
        <span className="text-sm text-gray-500">
          {filteredData.length} of {mockData.length} paid invoices
        </span>
      </div>

      <DynamicFilter
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        onSearchClear={() => setSearchValue('')}
        searchPlaceholder="Search invoices, vendors, or invoice numbers..."
        filters={filterConfig}
        className="mb-6"
      />

      <DataGrid
        data={filteredData}
        columns={columns}
        onRowClick={(row) => console.log('Clicked:', row)}
      />
    </div>
  );
};

export default PaidInvoicesTable;
