import React from 'react';
import moment from 'moment';
import MyTable from '@potta/components/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@potta/components/shadcn/dropdown';
import {
  formatCurrencyWithoutDecimals,
  formatPercentageWithoutDecimals,
} from '../utils/formUtils';

interface Benefit {
  uuid: string;
  name: string;
  description: string;
  type: 'FINANCIAL' | 'SERVICE' | 'REDEEMABLE';
  value: string;
  cycle:
    | 'DAILY'
    | 'WEEKLY'
    | 'MONTHLY'
    | 'QUARTERLY'
    | 'ANNUALLY'
    | 'ONE_TIME'
    | 'NONE';
  is_taxable: boolean;
  tax_cap: string;
  rate: string;
  salary_cap: string;
  max_amount: string;
  provider: string;
  expires_at: string | null;
  role_based: boolean;
  is_default: boolean;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
  eligible_roles: any[];
  createdAt: string;
  updatedAt: string;
}

interface BenefitTableProps {
  benefits: Benefit[];
  onViewBenefit: (id: string) => void;
  onEditBenefit: (id: string) => void;
  onDeleteBenefit: (id: string) => void;
  onRowClick: (benefit: Benefit) => void;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const BenefitTable: React.FC<BenefitTableProps> = ({
  benefits,
  onViewBenefit,
  onEditBenefit,
  onDeleteBenefit,
  onRowClick,
  totalPages,
  pageSize,
  onPageChange,
  isLoading = false,
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', text: 'Active' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      EXPIRED: { color: 'bg-red-100 text-red-800', text: 'Expired' },
      SUSPENDED: { color: 'bg-gray-100 text-gray-800', text: 'Suspended' },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getBenefitTypeIcon = (type: string) => {
    switch (type) {
      case 'FINANCIAL':
        return <i className="ri-money-dollar-circle-line text-green-600"></i>;
      case 'SERVICE':
        return <i className="ri-service-line text-blue-600"></i>;
      case 'REDEEMABLE':
        return <i className="ri-gift-line text-purple-600"></i>;
      default:
        return <i className="ri-gift-line text-gray-600"></i>;
    }
  };

  const formatCurrency = (value: string) => {
    return formatCurrencyWithoutDecimals(value);
  };

  const formatCycle = (cycle: string) => {
    const cycleMap = {
      DAILY: 'Daily',
      WEEKLY: 'Weekly',
      MONTHLY: 'Monthly',
      QUARTERLY: 'Quarterly',
      ANNUALLY: 'Annually',
      ONE_TIME: 'One Time',
      NONE: 'None',
    };
    return cycleMap[cycle as keyof typeof cycleMap] || cycle;
  };

  const columns = [
    {
      name: 'Benefit',
      selector: (row: Benefit) => row.name,
      sortable: true,
      width: '250px',
      cell: (row: Benefit) => (
        <div className="flex items-center py-2">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
            {getBenefitTypeIcon(row.type)}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{row.name}</div>
            <div
              className="text-xs text-gray-500 truncate max-w-[180px]"
              title={row.description}
            >
              {row.description || 'No description'}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: 'Type & Category',
      selector: (row: Benefit) => row.type,
      sortable: true,
      cell: (row: Benefit) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.type.charAt(0) + row.type.slice(1).toLowerCase()}
          </div>
          <div className="text-xs text-gray-500">{formatCycle(row.cycle)}</div>
        </div>
      ),
    },
    {
      name: 'Value & Rate',
      selector: (row: Benefit) => row.value,
      sortable: true,
      cell: (row: Benefit) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {formatCurrency(row.value)}
          </div>
          <div className="text-xs text-gray-500">
            Rate: {formatPercentageWithoutDecimals(parseFloat(row.rate))}
          </div>
        </div>
      ),
    },
    {
      name: 'Salary Cap',
      selector: (row: Benefit) => row.salary_cap,
      sortable: true,
      cell: (row: Benefit) => (
        <div className="text-sm text-gray-900">
          {formatCurrency(row.salary_cap)}
        </div>
      ),
    },
    {
      name: 'Tax Info',
      selector: (row: Benefit) => row.is_taxable.toString(),
      sortable: true,
      cell: (row: Benefit) => (
        <div>
          <div className="text-sm text-gray-900">
            {row.is_taxable ? 'Taxable' : 'Tax-free'}
          </div>
          {row.is_taxable && row.tax_cap && (
            <div className="text-xs text-gray-500">
              Cap: {formatCurrency(row.tax_cap)}
            </div>
          )}
        </div>
      ),
    },
    {
      name: 'Provider',
      selector: (row: Benefit) => row.provider || '',
      sortable: true,
      cell: (row: Benefit) => (
        <div className="text-sm text-gray-900">
          {row.provider || 'Internal'}
        </div>
      ),
    },
    {
      name: 'Expires',
      selector: (row: Benefit) => row.expires_at || '',
      sortable: true,
      cell: (row: Benefit) => (
        <div className="text-sm text-gray-900">
          {row.expires_at
            ? moment(row.expires_at).format('MMM DD, YYYY')
            : 'No expiry'}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: (row: Benefit) => row.status,
      sortable: true,
      cell: (row: Benefit) => getStatusBadge(row.status),
    },
    {
      name: 'Actions',
      selector: (row: Benefit) => '',
      cell: (row: Benefit) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <i className="ri-more-2-fill text-xl text-gray-600"></i>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onViewBenefit(row.uuid)}>
              <i className="ri-eye-line mr-2"></i> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditBenefit(row.uuid)}>
              <i className="ri-edit-line mr-2"></i> Edit
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={() => onDeleteBenefit(row.uuid)}
              className="text-red-600"
            >
              <i className="ri-delete-bin-line mr-2"></i> Delete
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <MyTable
        columns={columns}
        data={benefits}
        ExpandableComponent={null}
        expanded={false}
        pagination={benefits.length > 9}
        paginationTotalRows={totalPages * pageSize}
        onChangePage={onPageChange}
        onRowClicked={onRowClick}
        pointerOnHover={true}
        progressPending={isLoading}
      />
    </div>
  );
};

export default BenefitTable;
export type { Benefit, BenefitTableProps };
