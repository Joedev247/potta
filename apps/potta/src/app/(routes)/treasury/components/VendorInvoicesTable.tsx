import React, { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import DataGrid from '@potta/app/(routes)/account_receivables/components/DataGrid';
import DynamicFilter from '@potta/components/dynamic-filter';
import { Filter, Calendar, DollarSign, CreditCard } from 'lucide-react';
import Slider from '@potta/components/slideover';
import Button from '@potta/components/button';
import PaymentModal from './PaymentModal';

interface VendorInvoice {
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
}

const VendorInvoicesTable: React.FC = () => {
  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<VendorInvoice | null>(
    null
  );
  // Mock data - replace with actual API call
  const mockData: VendorInvoice[] = [
    {
      id: '1',
      title: 'Office Supplies Invoice',
      type: 'Bill',
      beneficiary: 'Office Supplies Co.',
      invoiceNumber: 'INV-2024-001',
      billingDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'active',
      amountExclTax: 1500.0,
      amountInclTax: 1650.0,
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
    },
    {
      id: '3',
      title: 'Marketing Services',
      type: 'Bill',
      beneficiary: 'Marketing Pro Agency',
      invoiceNumber: 'INV-2024-003',
      billingDate: '2024-01-25',
      dueDate: '2024-02-25',
      status: 'active',
      amountExclTax: 3000.0,
      amountInclTax: 3300.0,
    },
    {
      id: '4',
      title: 'Equipment Purchase',
      type: 'Bill',
      beneficiary: 'Hardware Store Inc.',
      invoiceNumber: 'INV-2024-004',
      billingDate: '2024-01-30',
      dueDate: '2024-02-28',
      status: 'active',
      amountExclTax: 5000.0,
      amountInclTax: 5500.0,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
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

  // Filter data based on search and filters - only show active invoices
  const filteredData = useMemo(() => {
    return mockData.filter((invoice) => {
      // Only show active invoices
      if (invoice.status !== 'active') {
        return false;
      }

      // Search filter
      const searchMatch =
        !searchValue ||
        invoice.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        invoice.beneficiary.toLowerCase().includes(searchValue.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchValue.toLowerCase());

      // Status filter
      const statusMatch =
        statusFilter === 'all' || invoice.status === statusFilter;

      // Date filter
      let dateMatch = true;
      if (dateFilter !== 'all') {
        const invoiceDate = new Date(invoice.billingDate);
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

      // Amount filter
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

      return searchMatch && statusMatch && dateMatch && amountMatch;
    });
  }, [searchValue, statusFilter, dateFilter, amountFilter]);

  // Filter configurations
  const filterConfig = [
    {
      key: 'date',
      label: 'Date',
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
  ];

  const columns: ColumnDef<VendorInvoice>[] = [
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
      accessorKey: 'billingDate',
      header: 'Billing Date',
      cell: ({ row }) => (
        <div className="text-gray-900">
          {formatDate(row.getValue('billingDate'))}
        </div>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => (
        <div className="text-gray-900">
          {formatDate(row.getValue('dueDate'))}
        </div>
      ),
    },
    {
      accessorKey: 'amountExclTax',
      header: 'Amount (excl. tax)',
      cell: ({ row }) => (
        <div className="text-gray-900 font-medium">
          {formatCurrency(row.getValue('amountExclTax'))}
        </div>
      ),
    },
    {
      accessorKey: 'amountInclTax',
      header: 'Amount (incl. tax)',
      cell: ({ row }) => (
        <div className="text-gray-900 font-medium">
          {formatCurrency(row.getValue('amountInclTax'))}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'active':
              return 'bg-blue-100 text-blue-800';
            case 'paid':
              return 'bg-green-100 text-green-800';
            case 'pending':
              return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
              return 'bg-red-100 text-red-800';
            default:
              return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <Button
            text="Pay"
            type="button"
            icon={<CreditCard className="w-3 h-3 mr-1" />}
            onClick={() => {
              setSelectedInvoice(invoice);
              setIsPaymentModalOpen(true);
            }}
          />
        );
      },
    },
  ];

  const handleRowClick = (row: VendorInvoice) => {
    console.log('Clicked invoice:', row);
    // Handle row click - could open details modal, navigate to detail page, etc.
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchValue('');
  };

  return (
    <>
      <div className="bg-white p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Vendor Invoices
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filteredData.length} of {mockData.length} invoices
            </span>
          </div>
        </div>

        {/* Dynamic Filters */}
        <DynamicFilter
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          searchPlaceholder="Search invoices, vendors, or invoice numbers..."
          filters={filterConfig}
          className="mb-6"
        />

        <DataGrid
          data={filteredData}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        setIsOpen={setIsPaymentModalOpen}
        selectedInvoice={selectedInvoice}
      />
    </>
  );
};

export default VendorInvoicesTable;
