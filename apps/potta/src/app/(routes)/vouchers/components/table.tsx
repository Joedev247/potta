'use client';
import React, { useState } from 'react';
import MyTable from '@potta/components/table';

import { Filter } from '../_utils/types';
import TableActionPopover from '@potta/components/tableActionsPopover';
import { MoreVertical } from 'lucide-react';

import Search from '@potta/components/search';
import CustomSelect, { IOption } from './CustomSelect';
import Button from '@potta/components/button';
import ModalInvoice from './modal';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useGetAllVouchers } from '../_hooks/hooks';

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

const VoucherTable = () => {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const filter: Filter = {
    limit,
    page,
    sortOrder: 'DESC',
    sortBy: 'createdAt',
  };

  const { data, isLoading, error } = useGetAllVouchers(filter);

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
  const options: IOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const columns = [
    {
      name: 'Code',
      selector: (row: Invoice) => (
        <div className="text-sm text-gray-600">
          {formatDate(row.issuedDate)}
        </div>
      ),
    },
    {
      name: 'Type',
      selector: (row: Invoice) => (
        <div className="text-sm font-medium">
          {`${row.customer.firstName} ${row.customer.lastName}`}
        </div>
      ),
    },
    {
      name: 'Start Date',
      selector: (row: Invoice) => (
        <div className="text-sm text-gray-500">{row.invoiceId}</div>
      ),
    },
    {
      name: 'End Date',
      selector: (row: Invoice) => (
        <div className="text-sm">{row.notes || 'No title'}</div>
      ),
    },
    {
      name: '',
      selector: (row: Invoice) => (
        <div className="text-sm">{row.notes || 'No title'}</div>
      ),
    },
   
    {
      name: 'Status',
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
  if (error) {
    return (
      <div className={'w-full py-24 flex flex-col items-center justify-center'}>
        An Error Occured
      </div>
    );
  }
  return (
    <div className="">
      <div className="flex justify-between w-full">
        <div className="mt-5 w-[50%] flex items-center space-x-2">
          <div className="w-[65%]">
            <Search />
          </div>

          <CustomSelect
            options={options}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Choose an option"
          />
          <CustomSelect
            options={options}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Choose an option"
          />
        </div>
        <div className="w-[50%] flex justify-end">
          <div className="flex mt-10 space-x-2">
            <div>
              {/*<Link href={'/invoicing/new_invoice'}>*/}
              <Button
                text={'Export'}
                icon={<i className="ri-upload-2-line"></i>}
                theme="lightBlue"
                type={'button'}
                color={true}
              />
              {/*</Link>*/}
            </div>
            <div>
              <Link href={'/vouchers/new'}>
                <Button
                  text={'Create Voucher'}
                  icon={<i className="ri-file-add-line"></i>}
                  theme="default"
                  type={'button'}
                />
              </Link>
            </div>
          </div>
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
    </div>
  );
};

export default VoucherTable;
