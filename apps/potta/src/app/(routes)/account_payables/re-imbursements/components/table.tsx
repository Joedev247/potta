// src/components/PaymentRequestDataTableWrapper.tsx (New File)
'use client';

import React, { useState } from 'react';

import {
  MoreHorizontal,
  Check as CheckIcon,
  Briefcase,
  Landmark,
  MoreVertical,
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
import {
  PaymentMethod,
  PaymentRequest,
} from '../../budgets/details/utils/types';
import { Icon } from '@iconify/react';
import RightSideModal from './RightSideModal';
import ReimbursementDetails from './ReimbursementDetails';
import ReimbursementForm from './ReimbursementForm';
import Slider from '@potta/components/slideover';
import { ColumnDef } from '@tanstack/react-table';

interface PaymentRequestDataTableWrapperProps {
  requests: PaymentRequest[];
  isLoading?: boolean; // Add a loading state prop
}

// --- Helper Functions (can be moved to utils) ---

// Helper to render payment method icon (same as before)
const PaymentMethodIcon: React.FC<{ method: PaymentMethod }> = ({ method }) => {
  const IconComponent = method.iconComponent;
  const sizeClass = 'h-5 w-5';

  return (
    <div
      className={cn(
        'h-7 w-7 rounded-full flex items-center justify-center',
        method.bgColorClass || 'bg-gray-100'
      )}
    >
      {method.iconUrl ? (
        <img
          src={method.iconUrl}
          alt={method.name}
          className="h-5 w-5 object-contain"
        />
      ) : IconComponent ? (
        <IconComponent
          className={cn(sizeClass, method.iconColorClass || 'text-gray-600')}
        />
      ) : (
        <span className="text-xs font-medium">?</span>
      )}
    </div>
  );
};

// Helper for currency format (same as before)
const formatTableCurrency = (amount: number, currencyCode: string = 'XAF') => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Main Wrapper Component ---

export function PaymentRequestDataTableWrapper({
  requests,
  isLoading = false,
}: PaymentRequestDataTableWrapperProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  // Define columns for TanStack Table
  const columns: ColumnDef<PaymentRequest>[] = [
    {
      accessorKey: 'madeBy',
      header: 'Employee',
      cell: ({ row: { original } }) => (
        <span className="font-semibold">{original.madeBy}</span>
      ),
    },
    {
      accessorKey: 'merchant',
      header: 'Merchant',
      cell: ({ row: { original } }) => original.merchant,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row: { original } }) => (
        <span className="font-medium">
          {original.currency} {original.amount?.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'memo',
      header: 'Memo',
      cell: ({ row: { original } }) => original.memo,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row: { original } }) => {
        let color = 'text-yellow-700';
        if (original.status?.toLowerCase() === 'approved')
          color = 'text-green-700';
        if (original.status?.toLowerCase() === 'rejected')
          color = 'text-red-700';
        return (
          <span className={`text-sm font-bold ${color}`}>
            {original.status?.charAt(0).toUpperCase() +
              original.status?.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Category',
      cell: ({ row: { original } }) => (
        <span className="capitalize">{original.type?.replace(/_/g, ' ')}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row: { original } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800 hover:bg-transparent focus:bg-transparent active:bg-transparent"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedRow(original);
                setDetailsOpen(true);
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedRow(original);
                setEditOpen(true);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Rejecting ${original.id}`)}>
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => alert(`Deleting ${original.id}`)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataGrid columns={columns} data={requests} isLoading={isLoading} />
      <RightSideModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        title="Reimbursement Details"
      >
        {selectedRow && <ReimbursementDetails data={selectedRow} />}
      </RightSideModal>
      <Slider
        edit={true}
        title="Edit Reimbursement"
        open={editOpen}
        setOpen={setEditOpen}
      >
        {selectedRow && (
          <ReimbursementForm
            onSubmit={() => setEditOpen(false)}
            onClose={() => setEditOpen(false)}
            initialData={selectedRow}
          />
        )}
      </Slider>
    </>
  );
}
