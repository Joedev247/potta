"use client"
import React, { useState } from 'react';
import MyTable from '@potta/components/table';
import { useGetAllSalesReceipts } from '../hooks/useGetAllReceipts';
import { Filters, SalesReceipt } from '../utils/types';
import TableActionPopover, { PopoverAction } from '@potta/components/tableActionsPopover';
import Filter from './filters';

// Updated type to match the actual response structure
type ResponseSalesReceipt = {
  uuid: string;
  branchId: string;
  createdAt: string;
  createdBy: string;
  updatedBy: string | null;
  deletedAt: string | null;
  updatedAt: string;
  saleReceiptId: string;
  saleDate: string;
  totalAmount: number;
  taxAmount: number;
  receiptNumber: string;
  notes: string;
  paymentReference: string;
  discountAmount: number;
  paymentMethod: string;
  salePerson: {
    uuid: string;
    name: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  customer: {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    customerId: string;
    [key: string]: any;
  };
  lineItems: Array<{
    uuid: string;
    description: string;
    quantity: number;
    discountType: string;
    unitPrice: number;
    discountCap: number;
    totalAmount: number;
    taxRate: number;
    taxAmount: number;
    discountRate: number;
    discountAmount: number | null;
    [key: string]: any;
  }>;
};

const SaleTable = () => {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<string | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState<ResponseSalesReceipt | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Set up filter state with pagination
  const filter: Filters = {
    limit,
    page,
    sortOrder: 'ASC',
    sortBy: 'createdAt',
  };

  // Fetch receipts data using the hook
  const { data, isLoading, error } = useGetAllSalesReceipts(filter);

  const columns = [
    {
      name: 'Date',
      selector: (row: ResponseSalesReceipt) => <div className="">{new Date(row.saleDate).toLocaleDateString()}</div>,
    },
    {
      name: 'Type',
      selector: (row: ResponseSalesReceipt) => <div className="">Sale</div>,
    },
    {
      name: 'Customer',
      selector: (row: ResponseSalesReceipt) => <div className="">{row.customer.firstName} {row.customer.lastName}</div>,
    },
    {
      name: 'Method',
      selector: (row: ResponseSalesReceipt) => <div className="">{row.paymentMethod}</div>,
    },
    {
      name: 'Memo',
      selector: (row: ResponseSalesReceipt) => <div className="">{row.notes || '-'}</div>,
    },
 
    {
      name: 'Balance',
      selector: (row: ResponseSalesReceipt) => <div className="">XAF 0</div>,
    },
    {
      name: 'Total',
      selector: (row: ResponseSalesReceipt) => <div className="">XAF {row.totalAmount.toLocaleString()}</div>,
    },
    {
      name: 'Resolution',
      selector: (row: ResponseSalesReceipt) => {
        const status = 'Completed'; // Assuming all are completed, adjust if needed
        return (
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {status}
          </div>
        );
      },
    },
    {
      name: 'Actions',
      selector: (row: ResponseSalesReceipt) => {
        const actions: PopoverAction[] = [
          {
            label: 'View',
            onClick: () => {
              setOpenViewModal(row.uuid);
              setReceiptDetails(row);
              setIsViewOpen(true);
            },
            className: 'hover:bg-gray-200',
            icon: <i className="ri-eye-line" />
          },
          {
            label: 'Edit',
            onClick: () => {
              setOpenUpdateModal(row.uuid);
              setReceiptDetails(row);
              setIsEditOpen(true);
            },
            className: 'hover:bg-gray-200',
            icon: <i className="ri-edit-line" />
          },
          {
            label: 'Delete',
            onClick: () => {
              setOpenDeleteModal(row.uuid);
              setReceiptDetails(row);
              setIsDeleteOpen(true);
            },
            className: 'hover:bg-red-200 text-red-600',
            icon: <i className="ri-delete-bin-line" />
          }
        ];

        return (
          <TableActionPopover
            actions={actions}
            rowUuid={row.uuid}
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          />
        );
      },
    },
  ];

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerRowsChange = (newLimit: number, newPage: number) => {
    setLimit(newLimit);
    setPage(newPage);
  };

  // Error handling
  if (error) {
    return (
      <div className="mt-10">
        <Filter />
        <div className="min-h-60 items-center flex justify-center">
          <p className="text-red-600 text-center">An error occurred while fetching receipts. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Use the fetched data or an empty array if data is not available
  const receiptsData = data?.data || [];

  return (
    <div className="mt-10">
      <Filter />
      <MyTable
        minHeight="50vh"
        columns={columns}
        data={receiptsData}
        pagination
        expanded
        pending={isLoading}
        paginationServer
        paginationTotalRows={data?.meta?.totalItems ?? 0}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
      />

      {/* Add your modal components here when implemented */}
      {/* Example:
      {openDeleteModal && (
        <DeleteModal
          receiptID={openDeleteModal}
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
        />
      )}
      {openUpdateModal && (
        <EditReceipt
          receipt={receiptDetails}
          receiptId={openUpdateModal}
          open={isEditOpen}
          setOpen={setIsEditOpen}
        />
      )}
      {openViewModal && (
        <ViewReceiptSlider
          receiptId={openViewModal}
          open={isViewOpen}
          setOpen={setIsViewOpen}
        />
      )}
      */}
    </div>
  );
};

export default SaleTable;
