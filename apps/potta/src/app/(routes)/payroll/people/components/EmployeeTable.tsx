import React from 'react';
import moment from 'moment';
import MyTable from '@potta/components/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@potta/components/shadcn/dropdown';
import { Employee } from '../utils/types';

interface EmployeeTableProps {
  employees: Employee[];
  onViewEmployee: (id: string) => void;
  onEditEmployee: (id: string) => void;
  onDeleteEmployee: (id: string) => void;
  onRowClick: (employee: Employee) => void;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onRowClick,
  totalPages,
  pageSize,
  onPageChange,
}) => {
  const columns = [
    {
      name: 'Employee',
      selector: (row: Employee) => `${row.firstName} ${row.lastName}`,
      sortable: true,
      // width: '300px',
      cell: (row: Employee) => (
        <div className="flex items-center py-2">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {row.profilePicture ? (
              <img
                src={row.profilePicture}
                alt={`${row.firstName} ${row.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                alt={`${row.firstName} ${row.lastName}`}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-gray-500">{row.email}</div>
            <div className="text-xs text-gray-400">{row.phone}</div>
          </div>
        </div>
      ),
    },
    {
      name: 'Employee ID',
      selector: (row: Employee) => row.matricule || '',
      sortable: true,
      width: '140px',
      cell: (row: Employee) => (
        <div className="font-mono text-sm font-medium text-gray-700">
          {row.matricule || 'N/A'}
        </div>
      ),
    },
    {
      name: 'Department & Role',
      selector: (row: Employee) => row.employment_type || '',
      sortable: true,
      width: '200px',
      cell: (row: Employee) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.employment_type}
          </div>
          <div className="text-xs text-gray-500">
            {row.compensation_schedule} Pay
          </div>
        </div>
      ),
    },
    {
      name: 'Location',
      selector: (row: Employee) => row.address?.city || '',
      sortable: true,
      width: '150px',
      cell: (row: Employee) => (
        <div>
          <div className="text-sm text-gray-900">
            {row.address?.city || 'N/A'}
          </div>
          <div className="text-xs text-gray-500">
            {row.address?.country || 'N/A'}
          </div>
        </div>
      ),
    },
    {
      name: 'Compensation',
      selector: (row: Employee) => row.base_pay || row.hourly_rate || '',
      sortable: true,
      width: '160px',
      cell: (row: Employee) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {row.base_pay
              ? `${row.currency} ${Number(row.base_pay).toLocaleString()}`
              : row.hourly_rate
              ? `${row.currency} ${row.hourly_rate}/hr`
              : 'N/A'}
          </div>
          <div className="text-xs text-gray-500">
            {row.compensation_schedule}
          </div>
        </div>
      ),
    },
    {
      name: 'Benefits',
      selector: (row: Employee) => row.benefits?.length || 0,
      sortable: true,
      width: '120px',
      cell: (row: Employee) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">
            {row.benefits?.length || 0} Benefits
          </div>
          <div className="text-xs text-gray-500">
            {row.paid_time_off?.length || 0} PTO Plans
          </div>
        </div>
      ),
    },
    {
      name: 'Employment',
      selector: (row: Employee) => row.start_date || '',
      sortable: true,
      width: '140px',
      cell: (row: Employee) => (
        <div>
          <div className="text-sm text-gray-900">
            {row.start_date
              ? moment(row.start_date).format('MMM DD, YYYY')
              : 'N/A'}
          </div>
          <div className="text-xs text-gray-500">Start Date</div>
        </div>
      ),
    },
    {
      name: 'Status',
      selector: (row: Employee) => (row.is_active ? 'Active' : 'Inactive'),
      sortable: true,
      width: '100px',
      cell: (row: Employee) => (
        <div>
          {row.is_active ? (
            <span className="px-2 py-1 inline-flex text-md leading-5 font-semibold rounded-full text-green-800">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 inline-flex text-md leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Inactive
            </span>
          )}
        </div>
      ),
    },
    {
      name: 'Actions',
      selector: (row: Employee) => '',
      width: '100px',
      cell: (row: Employee) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <i className="ri-more-2-fill text-xl text-gray-600"></i>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onViewEmployee(row.uuid)}>
              <i className="ri-eye-line mr-2"></i> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditEmployee(row.uuid)}>
              <i className="ri-edit-line mr-2"></i> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteEmployee(row.uuid)}
              className="text-red-600"
            >
              <i className="ri-delete-bin-line mr-2"></i> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <MyTable
        columns={columns}
        data={employees}
        ExpandableComponent={null}
        expanded
        pagination={employees.length > 9}
        paginationTotalRows={totalPages * pageSize}
        onChangePage={onPageChange}
        onRowClicked={onRowClick}
        pointerOnHover={true}
      />
    </div>
  );
};

export default EmployeeTable;
export type { Employee };
