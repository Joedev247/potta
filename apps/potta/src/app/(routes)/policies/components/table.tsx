'use client';
import React, { useState } from 'react';
import MyTable from '@potta/components/table';


import TableActionPopover from '@potta/components/tableActionsPopover';
import { MoreVertical } from 'lucide-react';
import { useGetPolicies } from '../hooks/policyHooks';
import Search from '@potta/components/search';

import Button from '@potta/components/button';

import { Icon } from '@iconify/react';
import { IFilter, IOption } from '../utils/types';
import CustomSelect from '@potta/components/react-select';
import Link from 'next/link';

// Define types based on the API response
interface MileageRequirements {
  requireBeforeAfterScreenshots: boolean;
  requireGpsCoordinates: boolean;
  businessPurpose: boolean;
}

interface Condition {
  id: string;
  criterionType: string;
  comparisonOperator: string;
  value: number;
}

interface Action {
  id: string;
  type: string;
  parameters: {
    originalActionType: string;
    approverType: string;
    selectedUserIds: string[];
    approvalMode: string;
  };
}

interface Rule {
  id: string;
  conditionOperator: string;
  conditions: Condition[];
  actions: Action[];
}

interface Policy {
  id: string;
  name: string;
  documentUrl: string | null;
  requireReceipt: boolean;
  requireMemo: boolean;
  requireScreenshots: boolean;
  requireNetSuiteCustomerJob: boolean;
  additionalRequirements: string | null;
  transactionType: string;
  type: string;
  mileageRequirements: MileageRequirements | null;
  branchId: string;
  rules: Rule[];
}

interface ApiResponse {
  data: Policy[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
}

const PolicyTable = () => {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const filter: IFilter = {
    limit,
    page,
    sortOrder: 'DESC',
    sortBy: 'createdAt',
  };

  const { data, isLoading, error } = useGetPolicies(filter);



  const getRequirementsText = (policy: Policy) => {
    const requirements = [];
    if (policy.requireReceipt) requirements.push('Receipt');
    if (policy.requireMemo) requirements.push('Memo');
    if (policy.requireScreenshots) requirements.push('Screenshots');
    if (policy.requireNetSuiteCustomerJob) requirements.push('NetSuite Customer/Job');
    
    return requirements.join(', ') || 'None';
  };

  const getRulesSummary = (rules: Rule[]) => {
    if (!rules || rules.length === 0) return 'No rules';
    
    return `${rules.length} rule${rules.length > 1 ? 's' : ''}`;
  };

  const options: IOption[] = [
    { value: 'all', label: 'All Types' },
    { value: 'mileage', label: 'Mileage' },
    { value: 'out-of-pocket', label: 'Out-of-Pocket' },
  ];

  const transactionOptions: IOption[] = [
    { value: 'all', label: 'All Transactions' },
    { value: 'expenses', label: 'Expenses' },
    { value: 'invoices', label: 'Invoices' },
  ];
  
  const columns = [
    {
      name: 'Policy Name',
      selector: (row: Policy) => (
        <div className="text-sm font-medium">
          {row.name}
        </div>
      ),
    },
   
    
    {
      name: 'Requirements',
      selector: (row: Policy) => (
        <div className="text-sm text-gray-500">
          {getRequirementsText(row)}
        </div>
      ),
    },
    {
      name: 'Rules',
      selector: (row: Policy) => (
        <div className="text-sm">
          {getRulesSummary(row.rules)}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: (row: Policy) => {
        const status = 'Active';
        return (
          <div className="border-r pr-4 flex justify-center">
            <div className="flex items-center gap-3 w-full px-3 py-2 border border-green-500 bg-green-50 text-green-700">
              <div className="flex items-center justify-center text-white bg-green-700 rounded-full size-4">
                <Icon icon="material-symbols:check" width="20" height="20" />
              </div>
              {status}
            </div>
          </div>
        );
      },
      hasBorderLeft: true,
      headerBorderLeft: true,
      width: "150px"
    },
    {
      name: '',
      selector: (row: Policy) => (
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
        An Error Occurred
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


        </div>
        <div className="w-[50%] flex justify-end">
          <div className="flex mt-10 space-x-2">
            <div>
              <Button
                text={'Export'}
                icon={<i className="ri-upload-2-line"></i>}
                theme="lightBlue"
                type={'button'}
                color={true}
              />
            </div>
            <div>
              <Link href="/policy">
              
              <Button
                text={'Create Rule'}
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
        paginationTotalRows={data?.length ?? 0}
        onChangePage={setPage}
        onChangeRowsPerPage={setLimit}
      />
      
    </div>
  );
};

export default PolicyTable;
