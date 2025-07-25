'use client';
import React, { useState } from 'react';
import MyTable from '@potta/components/table';

import { IFilter } from '../_utils/types';
import TableActionPopover from '@potta/components/tableActionsPopover';
import { MoreVertical } from 'lucide-react';
import useGetAllInvoice from '../_hooks/useGetAllInvoice';
import Button from '@potta/components/button';
import ModalInvoice from './modal';
import { Icon } from '@iconify/react';
import DynamicFilter from '@potta/components/dynamic-filter';

// Define types based on the API response
interface Invoice {
  uuid: string;
  invoiceId: string;
  issuedDate: string;
  dueDate: string;
  invoiceType: string;
  invoiceTotal: number;
  status: string;
  notes: string;
  customer: {
    firstName: string;
    lastName: string;
  };
}

interface ApiResponse {
  data: Invoice[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}

const InvoiceTable = () => {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt:DESC');
  const [isOpen, setIsOpen] = useState(false);

  const filter: IFilter = {
    limit,
    page,
    sortOrder: 'DESC',
    sortBy: 'createdAt',
  };

  const { data, isLoading, error } = useGetAllInvoice(filter);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'text-gray-600';
      case 'overdue':
        return 'text-red-500';
      case 'paid':
        return 'text-green-500';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: string) => {
    const today = new Date();
    const inputDate = new Date(date);

    if (
      today.getDate() === inputDate.getDate() &&
      today.getMonth() === inputDate.getMonth() &&
      today.getFullYear() === inputDate.getFullYear()
    ) {
      return 'Today';
    }
    return inputDate.toLocaleDateString();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchValue('');
  };

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'Draft', value: 'draft' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Pending', value: 'pending' },
      ],
      value: statusFilter,
      onChange: setStatusFilter,
      selectClassName: 'min-w-[120px]',
    },
    {
      key: 'sort',
      label: 'Sort by',
      options: [
        { label: 'Newest First', value: 'createdAt:DESC' },
        { label: 'Oldest First', value: 'createdAt:ASC' },
        { label: 'Due Date', value: 'dueDate:ASC' },
        { label: 'Amount High to Low', value: 'invoiceTotal:DESC' },
        { label: 'Amount Low to High', value: 'invoiceTotal:ASC' },
      ],
      value: sortBy,
      onChange: setSortBy,
      selectClassName: 'min-w-[140px]',
    },
  ];

  const columns = [
    {
      name: 'Date',
      selector: (row: Invoice) => (
        <div className="text-sm text-gray-600">
          {formatDate(row.issuedDate)}
        </div>
      ),
    },
    {
      name: 'Customer',
      selector: (row: Invoice) => (
        <div className="text-sm font-medium">
          {`${row.customer.firstName} ${row.customer.lastName}`}
        </div>
      ),
    },
    {
      name: 'ID',
      selector: (row: Invoice) => (
        <div className="text-sm text-gray-500">
          {row.invoiceId}
          <div className="text-xs text-gray-400">viewed</div>
        </div>
      ),
    },
    {
      name: 'Title',
      selector: (row: Invoice) => (
        <div className="text-sm">{row.notes || 'No title'}</div>
      ),
    },
    {
      name: 'Status',
      selector: (row: Invoice) => (
        <div className={`text-sm ${getStatusStyle(row.status)}`}>
          {row.status.toLowerCase()}
          <div className="text-xs text-gray-400">viewed</div>
        </div>
      ),
    },
    {
      name: 'Amount',
      selector: (row: Invoice) => (
        <div className="text-sm">
          XAF{' '}
          {row.invoiceTotal.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      name: 'Resolution',
      selector: (row: Invoice) => {
        const status = 'Closed';
        return (
          <div className="border-r pr-4 flex justify-center">
            <div className="flex items-center gap-3  w-full px-3 py-2 border border-green-500 bg-green-50 text-green-700">
              <div className="flex items-center justify-center text-white bg-green-700 rounded-full size-4">
                <Icon icon="material-symbols:check" width="20" height="20" />
              </div>
              {status}
            </div>
          </div>
        );
      },
      hasBorderLeft: true, // Left border for data cells
      headerBorderLeft: true, // Left border for header cell
      width: '150px',
    },
    {
      name: '',
      selector: (row: Invoice) => (
        <div className="flex justify-center">
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical size={16} />
          </button>
        </div>
      ),
      width: '50px',
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center w-full">
        {/* Left side - Dynamic Filter */}
        <div className="flex-1">
          <DynamicFilter
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
            searchPlaceholder="Search invoices by customer, ID, or title..."
            filters={filterConfig}
            className="p-0 bg-transparent"
          />
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <Button
            text={'Export'}
            icon={<i className="ri-upload-2-line"></i>}
            theme="lightBlue"
            type={'button'}
            color={true}
          />
          <Button
            text={'Create Invoice'}
            icon={<i className="ri-file-add-line"></i>}
            theme="default"
            type={'button'}
            onClick={() => {
              setIsOpen(true);
            }}
          />
        </div>
      </div>

      <MyTable
        maxHeight="50vh"
        minHeight="50vh"
        columns={columns}
        selectable={true}
        data={data?.data || []}
        pagination
        pending={isLoading}
        paginationServer
        paginationTotalRows={data?.meta?.totalItems ?? 0}
        onChangePage={setPage}
        onChangeRowsPerPage={setLimit}
      />
      <ModalInvoice isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default InvoiceTable;
