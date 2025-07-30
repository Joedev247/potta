import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import DataGrid from '@potta/app/(routes)/account_receivables/components/DataGrid';
import DynamicFilter from '@potta/components/dynamic-filter';
import { Filter, Calendar, DollarSign, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@potta/components/shadcn/dropdown';
import { Button } from '@potta/components/shadcn/button';
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

interface Vendor {
  id: string;
  uuid: string;
  name: string;
  phone: string;
  email: string;
  openingBalance: number;
  currency: string;
  status: string;
  createdAt: string;
}

const PhoneFlag = ({ phoneNumber }: { phoneNumber: string }) => {
  const phoneNumberObj = parsePhoneNumberFromString(phoneNumber);
  const countryCode = phoneNumberObj?.country;
  const number = phoneNumberObj?.number;
  return countryCode ? (
    <div className="flex items-center">
      <div className="">
        <img
          src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
          alt={countryCode}
        />
      </div>
      {number}
    </div>
  ) : (
    <p>Invalid Number</p>
  );
};

const VendorsTable: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [balanceFilter, setBalanceFilter] = useState('all');

  const mockData: Vendor[] = [
    {
      id: '1',
      uuid: 'vendor-1',
      name: 'Office Supplies Co.',
      phone: '+1234567890',
      email: 'contact@officesupplies.com',
      openingBalance: 1500.0,
      currency: 'EUR',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      uuid: 'vendor-2',
      name: 'Tech Solutions Ltd.',
      phone: '+1987654321',
      email: 'info@techsolutions.com',
      openingBalance: 2500.0,
      currency: 'EUR',
      status: 'active',
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      uuid: 'vendor-3',
      name: 'Marketing Pro Agency',
      phone: '+1122334455',
      email: 'hello@marketingpro.com',
      openingBalance: 3000.0,
      currency: 'EUR',
      status: 'inactive',
      createdAt: '2024-01-25',
    },
  ];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
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

  const filteredData = React.useMemo(() => {
    return mockData.filter((vendor) => {
      const searchMatch =
        !searchValue ||
        vendor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        vendor.phone.includes(searchValue);

      const statusMatch = statusFilter === 'all' || vendor.status === statusFilter;

      let balanceMatch = true;
      if (balanceFilter !== 'all') {
        const balance = vendor.openingBalance;
        switch (balanceFilter) {
          case 'low': balanceMatch = balance < 1000; break;
          case 'medium': balanceMatch = balance >= 1000 && balance < 5000; break;
          case 'high': balanceMatch = balance >= 5000; break;
        }
      }

      return searchMatch && statusMatch && balanceMatch;
    });
  }, [searchValue, statusFilter, balanceFilter]);

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      icon: <Filter className="w-4 h-4 text-gray-400" />,
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      value: statusFilter,
      onChange: setStatusFilter,
    },
    {
      key: 'balance',
      label: 'Balance',
      icon: <DollarSign className="w-4 h-4 text-gray-400" />,
      options: [
        { label: 'All', value: 'all' },
        { label: 'Low (< €1,000)', value: 'low' },
        { label: 'Medium (€1,000 - €5,000)', value: 'medium' },
        { label: 'High (> €5,000)', value: 'high' },
      ],
      value: balanceFilter,
      onChange: setBalanceFilter,
    },
  ];

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: 'name',
      header: 'Vendor/ Company Name',
      cell: ({ row: { original } }) => (
        <div className="font-medium text-gray-900">{original.name}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Telephone',
      cell: ({ row: { original } }) => (
        <PhoneFlag phoneNumber={original.phone} />
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row: { original } }) => (
        <div className="text-gray-900">{original.email}</div>
      ),
    },
    {
      accessorKey: 'openingBalance',
      header: 'Balance',
      cell: ({ row: { original } }) => (
        <div className="font-medium">
          {original.openingBalance !== null ? original.currency : ''}
          {original.openingBalance !== null ? formatCurrency(original.openingBalance, original.currency) : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row: { original } }) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'active':
              return 'bg-green-100 text-green-800';
            case 'inactive':
              return 'bg-red-100 text-red-800';
            default:
              return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              original.status
            )}`}
          >
            {original.status.charAt(0).toUpperCase() + original.status.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
      cell: ({ row: { original } }) => (
        <div className="text-gray-900">{formatDate(original.createdAt)}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row: { original } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log('View vendor:', original.uuid)}>
              <i className="ri-eye-line mr-2"></i>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Edit vendor:', original.uuid)}>
              <i className="ri-edit-line mr-2"></i>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600" 
              onClick={() => console.log('Delete vendor:', original.uuid)}
            >
              <i className="ri-delete-bin-line mr-2"></i>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Vendors</h2>
        <span className="text-sm text-gray-500">
          {filteredData.length} of {mockData.length} vendors
        </span>
      </div>

      <DynamicFilter
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        onSearchClear={() => setSearchValue('')}
        searchPlaceholder="Search vendors, emails, or phone numbers..."
        filters={filterConfig}
        className="mb-6"
      />

      <DataGrid
        columns={columns}
        data={filteredData}
        onRowClick={(row) => console.log('Clicked vendor:', row)}
      />
    </div>
  );
};

export default VendorsTable; 