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
import MyTable from '@potta/components/table';
import {
  PaymentMethod,
  PaymentRequest,
} from '../../budgets/details/utils/types';
import { Icon } from '@iconify/react';
import RightSideModal from './RightSideModal';
import ReimbursementDetails from './ReimbursementDetails';
import ReimbursementForm from './ReimbursementForm';
import Slider from '@potta/components/slideover';

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

  // Define columns for react-data-table-component
  const columns = React.useMemo(
    () => [
      {
        name: 'Employee',
        selector: (row: any) => row.madeBy,
        sortable: true,
        cell: (row: any) => <span className="font-semibold">{row.madeBy}</span>,
        minWidth: '120px',
      },
      {
        name: 'Merchant',
        selector: (row: any) => row.merchant,
        sortable: true,
        minWidth: '120px',
      },
      {
        name: 'Amount',
        selector: (row: any) => row.amount,
        sortable: true,
        cell: (row: any) => (
          <span className="font-medium">
            {row.currency} {row.amount?.toLocaleString()}
          </span>
        ),
        minWidth: '100px',
      },
      {
        name: 'Memo',
        selector: (row: any) => row.memo,
        sortable: false,
        minWidth: '120px',
      },
      {
        name: 'Status',
        selector: (row: any) => row.status,
        sortable: true,
        cell: (row: any) => {
          let color = 'text-yellow-700';
          if (row.status?.toLowerCase() === 'approved')
            color = 'text-green-700';
          if (row.status?.toLowerCase() === 'rejected') color = 'text-red-700';
          return (
            <span className={`text-sm font-bold ${color}`}>
              {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
            </span>
          );
        },
        minWidth: '100px',
      },
      {
        name: 'Category',
        selector: (row: any) => row.type,
        sortable: true,
        cell: (row: any) => (
          <span className="capitalize">{row.type?.replace(/_/g, ' ')}</span>
        ),
        minWidth: '120px',
      },
      {
        name: 'Actions',
        button: true,
        allowOverflow: true,
        ignoreRowClick: true,
        width: '80px',
        cell: (row: any) => (
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
                  setSelectedRow(row);
                  setDetailsOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRow(row);
                  setEditOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert(`Rejecting ${row.id}`)}>
                Reject
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => alert(`Deleting ${row.id}`)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <>
      <MyTable
        columns={columns}
        data={requests}
        selectable={true}
        pagination={false}
        pending={isLoading}
        color={false}
        size={false}
        expanded={false}
        ExpandableComponent={null}
      />
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
