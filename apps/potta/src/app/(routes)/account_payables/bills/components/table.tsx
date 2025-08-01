// src/components/PaymentRequestDataTableWrapper.tsx (New File)
'use client';

import React, { useState } from 'react';

import {
  MoreHorizontal,
  Check as CheckIcon,
  Briefcase,
  Landmark,
} from 'lucide-react'; // Import necessary icons

import { cn } from '@potta/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@potta/components/shadcn/dropdown';
import { Button } from '@potta/components/shadcn/button';
import DataGrid from '@potta/app/(routes)/account_receivables/invoice/components/DataGrid';
import { ColumnDef } from '@tanstack/react-table';

import { Icon } from '@iconify/react';
import { useBills } from '../new/hooks/useBills';
import useApproveBill from '../new/hooks/useApproveBill';
import useRejectBill from '../new/hooks/useRejectBill';
import toast from 'react-hot-toast';
import BillDetailsSlideover from './BillDetailsSlideover';
import Filter from './filters';

interface PaymentRequestDataTableWrapperProps {
  search: string;
  status: string;
  paymentMethod: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onStatusChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

// --- Helper Functions (can be moved to utils) ---

// Helper for currency format (same as before)
const formatTableCurrency = (amount: number, currencyCode: string = 'XAF') => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Status Color Mapping ---
const statusColorMap: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Draft: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-400',
  },
  Issued: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-400',
  },
  Paid: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-400',
  },
  Overdue: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-400' },
};

// --- Payment Method Image Mapping ---
const paymentMethodImageMap: Record<string, string> = {
  'Credit Card': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
  'Bank Transfer': 'https://cdn-icons-png.flaticon.com/512/483/483361.png',
  'ACH Transfer': 'https://cdn-icons-png.flaticon.com/512/483/483361.png',
  'Mobile Money':
    'https://upload.wikimedia.org/wikipedia/commons/6/6b/Mobile_Money_logo.png',
  Cash: 'https://cdn-icons-png.flaticon.com/512/2331/2331943.png',
  Credit: 'https://cdn-icons-png.flaticon.com/512/483/483361.png',
  Other: 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
};

const PaymentMethodIcon: React.FC<{ method?: { name?: string } }> = ({
  method,
}) => {
  if (!method || !method.name) {
    return (
      <div className="h-7 w-7 rounded-full flex items-center justify-center bg-gray-100">
        <span className="text-xs font-medium">?</span>
      </div>
    );
  }
  const img =
    paymentMethodImageMap[method.name] || paymentMethodImageMap['Other'];
  return (
    <div className="h-7 w-7 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden">
      <img src={img} alt={method.name} className="h-5 w-5 object-contain" />
    </div>
  );
};

// --- Main Wrapper Component ---

export function PaymentRequestDataTableWrapper({
  search,
  status,
  paymentMethod,
  onSearchChange,
  onSearchClear,
  onStatusChange,
  onPaymentMethodChange,
}: PaymentRequestDataTableWrapperProps) {
  // Map status filter
  let statusFilter: any = {};
  if (status !== 'all') {
    statusFilter.status = status.charAt(0).toUpperCase() + status.slice(1); // API expects 'Pending', 'Paid', etc.
  }

  // Remove search and paymentMethod from API call for client-side filtering
  const { data, isLoading, error } = useBills({
    body: { ...statusFilter },
  });
  const bills = data?.data || [];

  // Map API bills to table rows
  const requests = bills.map((bill: any) => ({
    id: bill.uuid,
    ref: bill.invoiceNumber || bill.invoiceId,
    madeTo: bill.customer?.firstName
      ? `${bill.customer.firstName} ${bill.customer.lastName}`
      : bill.vendor?.name || '-',
    category: bill.invoiceType || '-',
    amount: bill.invoiceTotal,
    currency: bill.currency || 'XAF',
    method: { name: bill.paymentMethod },
    status: bill.status,
    date: bill.issuedDate
      ? new Date(bill.issuedDate).toLocaleDateString()
      : '-',
  }));

  // Approve/Reject hooks (handle cache invalidation internally)
  const approveBillMutation = useApproveBill({ ...statusFilter });
  const rejectBillMutation = useRejectBill({ ...statusFilter });

  // Client-side search and payment method filter
  let filteredRequests = requests;
  if (search) {
    const term = search.toLowerCase();
    filteredRequests = filteredRequests.filter(
      (row: (typeof requests)[0]) =>
        (row.madeTo && row.madeTo.toLowerCase().includes(term)) ||
        (row.category && row.category.toLowerCase().includes(term)) ||
        (row.ref && row.ref.toLowerCase().includes(term))
    );
  }
  if (paymentMethod && paymentMethod !== 'all') {
    filteredRequests = filteredRequests.filter(
      (row: (typeof requests)[0]) => row.method?.name === paymentMethod
    );
  }

  // State for details modal
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Define columns for TanStack Table
  const columns: ColumnDef<(typeof requests)[0]>[] = React.useMemo(
    () => [
      {
        accessorKey: 'ref',
        header: 'Ref',
        cell: ({ row }) => row.original.ref,
      },
      {
        accessorKey: 'madeTo',
        header: 'Made To',
        cell: ({ row }) => row.original.madeTo,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => row.original.category,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.currency} {formatTableCurrency(row.original.amount)}
          </span>
        ),
      },
      {
        accessorKey: 'method',
        header: 'Method',
        cell: ({ row }) => <PaymentMethodIcon method={row.original.method} />,
      },
      {
        accessorKey: 'status',
        header: 'Request Status',
        cell: ({ row }) => {
          const color =
            statusColorMap[row.original.status] || statusColorMap['Draft'];
          const isDraft = row.original.status === 'Draft';
          return (
            <div className="border-r pr-8 border-black">
              <div
                className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-sm font-medium
                  ${
                    isDraft
                      ? 'bg-gray-50 text-gray-500 border border-gray-200'
                      : `${color.bg} ${color.text} ${color.border}`
                  }
                `}
              >
                <span className="flex items-center justify-center rounded-full size-5 bg-white/80">
                  {isDraft ? (
                    <Icon
                      icon="mdi:pencil-outline"
                      width="18"
                      height="18"
                      className="text-gray-400"
                    />
                  ) : (
                    <Icon
                      icon="material-symbols:check"
                      width="18"
                      height="18"
                      className="text-green-600"
                    />
                  )}
                </span>
                {row.original.status}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => row.original.date,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedBillId(row.original.id);
                  setDetailsOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              {row.original.status !== 'Approved' &&
                row.original.status !== 'Rejected' && (
                  <>
                    <DropdownMenuItem
                      onClick={async () => {
                        toast.promise(
                          approveBillMutation.mutateAsync(row.original.id),
                          {
                            loading: 'Approving bill...',
                            success: 'Bill approved!',
                            error: (err) =>
                              err?.message || 'Failed to approve bill',
                          }
                        );
                      }}
                    >
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        toast.promise(
                          rejectBillMutation.mutateAsync(row.original.id),
                          {
                            loading: 'Rejecting bill...',
                            success: 'Bill rejected!',
                            error: (err) =>
                              err?.message || 'Failed to reject bill',
                          }
                        );
                      }}
                    >
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [approveBillMutation, rejectBillMutation]
  );

  if (error)
    <div>
      <Filter
        search={search}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
        status={status}
        onStatusChange={onStatusChange}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
      />

      <div className="flex flex-col gap-4">
        <div className="text-red-500  px-4 py-2">Failed to load bills.</div>
      </div>
    </div>;
  return (
    <>
      <DataGrid
        columns={columns}
        data={filteredRequests}
        isLoading={isLoading}
      />
      <BillDetailsSlideover
        billId={selectedBillId}
        open={detailsOpen}
        setOpen={setDetailsOpen}
      />
    </>
  );
}
