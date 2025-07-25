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
import MyTable from '@potta/components/table';
import {
  PaymentMethod,
  PaymentRequest,
} from '../../budgets/details/utils/types';
import { Icon } from '@iconify/react';
import { useBills } from '../new/hooks/useBills';
import useApproveBill from '../new/hooks/useApproveBill';
import useRejectBill from '../new/hooks/useRejectBill';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { billsQueryKey } from '../new/hooks/useBills';
import Slider from '@potta/components/slideover';
import useGetBill from '../new/hooks/useGetBill';
import BillDetailsSlideover from './BillDetailsSlideover';

interface PaymentRequestDataTableWrapperProps {
  search: string;
  status: string;
  paymentMethod: string;
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
}: PaymentRequestDataTableWrapperProps) {
  const branchId = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3b';
  const orgId = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3c';

  // Map status filter
  let statusFilter: any = {};
  if (status !== 'all') {
    statusFilter.status = status.charAt(0).toUpperCase() + status.slice(1); // API expects 'Pending', 'Paid', etc.
  }

  // Remove search and paymentMethod from API call for client-side filtering
  const { data, isLoading, error } = useBills({
    branchId,
    orgId,
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
  const approveBillMutation = useApproveBill(branchId, orgId, {
    ...statusFilter,
  });
  const rejectBillMutation = useRejectBill(branchId, orgId, {
    ...statusFilter,
  });

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

  // Define columns for react-data-table-component
  const columns = React.useMemo(
    () => [
      {
        name: 'Ref',
        selector: (row: any) => row.ref,
        sortable: true,
        cell: (row: any) => row.ref,
        minWidth: '100px',
      },
      {
        name: 'Made To',
        selector: (row: any) => row.madeTo,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Category',
        selector: (row: any) => row.category,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Amount',
        selector: (row: any) => row.amount,
        sortable: true,
        cell: (row: any) => (
          <span className="font-medium">
            {row.currency} {formatTableCurrency(row.amount)}
          </span>
        ),
        minWidth: '100px',
      },
      {
        name: 'Method',
        selector: (row: any) => row.method?.name || '',
        cell: (row: any) => <PaymentMethodIcon method={row.method} />,
        center: true,
        width: '100px',
      },
      {
        name: 'Request Status',
        selector: (row: any) => row.status || '',
        center: true,
        cell: (row: any) => {
          const color = statusColorMap[row.status] || statusColorMap['Draft'];
          const isDraft = row.status === 'Draft';
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
                {row.status}
              </div>
            </div>
          );
        },
        minWidth: '120px',
      },
      {
        name: 'Date',
        selector: (row: any) => row.date,
        sortable: true,
        minWidth: '100px',
      },
      {
        name: 'Actions',
        selector: (row: (typeof requests)[0]) => row.id,
        button: true,
        allowOverflow: true,
        ignoreRowClick: true,
        width: '100px',
        cell: (row: (typeof requests)[0]) => (
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
                  setSelectedBillId(row.id);
                  setDetailsOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              {row.status !== 'Approved' && row.status !== 'Rejected' && (
                <>
                  <DropdownMenuItem
                    onClick={async () => {
                      toast.promise(approveBillMutation.mutateAsync(row.id), {
                        loading: 'Approving bill...',
                        success: 'Bill approved!',
                        error: (err) =>
                          err?.message || 'Failed to approve bill',
                      });
                    }}
                    // disabled={approveBillMutation.isLoading} // Remove isLoading linter error
                  >
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      toast.promise(rejectBillMutation.mutateAsync(row.id), {
                        loading: 'Rejecting bill...',
                        success: 'Bill rejected!',
                        error: (err) => err?.message || 'Failed to reject bill',
                      });
                    }}
                    // disabled={rejectBillMutation.isLoading} // Remove isLoading linter error
                  >
                    Reject
                  </DropdownMenuItem>
                </>
              )}
              {/* <DropdownMenuItem
                className="text-red-600"
                onClick={() => alert(`Deleting ${row.id}`)}
              >
                Delete Request
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  // State for details modal
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      {error && (
        <div className="text-red-500 px-4 py-2">Failed to load bills.</div>
      )}
      <MyTable
        columns={columns}
        data={filteredRequests}
        selectable={true}
        pagination={false}
        pending={isLoading}
        color={false}
        size={false}
        expanded={false}
        ExpandableComponent={null}
        minHeight="600px"
      />
      <BillDetailsSlideover
        billId={selectedBillId}
        open={detailsOpen}
        setOpen={setDetailsOpen}
      />
    </>
  );
}
