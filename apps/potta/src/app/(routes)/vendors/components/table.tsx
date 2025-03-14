'use client';
import React, { FC, useState } from 'react';
import MyTable from '@potta/components/table';
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import Flag from 'react-world-flags';

import {
  PopoverTrigger,
  PopoverContent,
  Popover,
  Button,
} from '@nextui-org/react';
import Filter from './filters';
import useGetAllVendors from '../hooks/useGetAllVendors';
import ViewVendorSlider from './viewVendorSlider.tsx';
import CustomPopover from '@potta/components/popover';
import EditVendor from './updateVendorSlider';
import DeleteModal from './deleteModal';
import { VendorFilter } from '../utils/types';
import { log } from 'console';

export const PhoneFlag = ({ phoneNumber }: { phoneNumber: string  }) => {
  
  const phoneNumberObj = parsePhoneNumberFromString(phoneNumber);
  const countryCode = phoneNumberObj?.country;
  const number = phoneNumberObj?.number;
  return countryCode ? (
    <div className="flex items-center">
      <div className=''>

      <img
        src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
        alt={countryCode}
        
      />
      </div>
      {number}
    </div>
  ) : (
    <p>Invalid Number</p>
  );
};
const TableComponents = () => {
 
  const columns = [
    {
      name: 'Vendor/ Company Name',
      selector: (row: any) => <div className="">{row.name}</div>,
    },
    {
      name: 'Telephone ',
      selector: (row: any) => <PhoneFlag phoneNumber={row.phone} />,
    },
    {
      name: 'Email',
      selector: (row: any) => <div className="">{row.email}</div>,
    },
    {
      name: 'Balance',
      selector: (row: any) => (
        <div>
          {row.openingBalance !== null ? row.currency : ''}
          {row.openingBalance !== null ? row.openingBalance : 'N/A'}
        </div>
      ),
    },
    {
      name: 'Actions',
      selector: (row: any) => (
        <CustomPopover>
          <div className="p-1 bg-white shadow-md flex  gap-2">
            <div className="text-xs cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]">
              <ViewVendorSlider vendorId={row.uuid} />
            </div>
            <div className="text-xs cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]">
              <EditVendor vendor={row} vendorId={row.uuid} />
            </div>

            <div className="text-xs cursor-pointer hover:bg-red-200 py text-red-600 py-0.5 px-2 rounded-[2px]">
              <DeleteModal vendorID={row.uuid} />
            </div>
          </div>
        </CustomPopover>
      ),
    },
  ];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filter: VendorFilter = { page, limit, };
  const { data: vendor, isLoading, error} = useGetAllVendors(filter);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    
  };

  const handlePerRowsChange = (newLimit: number, newPage: number) => {
    setLimit(newLimit);
    setPage(newPage); // Reset page when changing rows per page
    
  };
  if (error)
    return (
      <p className="text-red-600">Error fetching vendors: {error.message}</p>
    );
    
  return (
    <div className="mt-10">
      <Filter />
      <MyTable
        columns={columns}
        data={vendor?.data || []}
        ExpandableComponent={null}
        expanded
        pagination
        pending={isLoading}
        paginationServer
        paginationTotalRows={vendor?.meta?.totalItems ?? 0}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
      />
    </div>
  );
};

export default TableComponents;
