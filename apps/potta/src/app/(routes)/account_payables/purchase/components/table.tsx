'use client';
import React, { useState } from 'react';
import MyTable from '@potta/components/table';

import TableActionPopover from '@potta/components/tableActionsPopover';
import { MoreVertical } from 'lucide-react';

import Search from '@potta/components/search';

import Button from '@potta/components/button';


import useGetAllPurchaseOrders from '../hooks/useGetAllPurchaseOrders';
import Slider from '@potta/components/slideover';
import PurchaseOrderPage from '../new/page';
import CustomSelect from '@potta/app/(routes)/account_receivables/components/CustomSelect';
import { IOption } from '@potta/app/(routes)/policies/utils/types';

// Define types for purchase order
interface PurchaseOrder {
  uuid: string;
  orderNumber: string;
  orderDate: string;
  requiredDate: string;
  status: string;
  orderTotal: number;
  salePerson: {
    name: string;
  };
}

interface ApiResponse {
  data: PurchaseOrder[];
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
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const filter = {
    limit,
    page,
    sortBy: ['createdAt:DESC'],
  };

  const { data, isLoading, error } = useGetAllPurchaseOrders(filter);

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
      name: 'Order Number',
      selector: (row: PurchaseOrder) => (
        <div className="text-sm font-medium">{row.orderNumber}</div>
      ),
    },
    {
      name: 'Vendor',
      selector: (row: PurchaseOrder) => (
        <div className="text-sm">{row.salePerson?.name || '-'}</div>
      ),
    },
    {
      name: 'Order Date',
      selector: (row: PurchaseOrder) => (
        <div className="text-sm text-gray-600">{formatDate(row.orderDate)}</div>
      ),
    },
    {
      name: 'Required Date',
      selector: (row: PurchaseOrder) => (
        <div className="text-sm text-gray-600">
          {formatDate(row.requiredDate)}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: (row: PurchaseOrder) => (
        <div className={`text-sm ${getStatusStyle(row.status)}`}>
          {row.status}
        </div>
      ),
    },
    {
      name: 'Total',
      selector: (row: PurchaseOrder) => (
        <div className="text-sm">
          XAF{' '}
          {row.orderTotal?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      name: '',
      selector: (row: PurchaseOrder) => (
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
          <div className="flex space-x-2">
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
              <Button
                text={'Create PurchaseOrder'}
                icon={<i className="ri-file-add-line"></i>}
                theme="default"
                type={'button'}
                onClick={() => {
                  setIsOpen(true);
                }}
              />
              <Slider
                open={isOpen}
                setOpen={setIsOpen}
                edit={false}
                title="Create Purchase Order"
              >
                <div className="w-full  mx-auto">
                  <PurchaseOrderPage />
                </div>
              </Slider>
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

export default InvoiceTable;
