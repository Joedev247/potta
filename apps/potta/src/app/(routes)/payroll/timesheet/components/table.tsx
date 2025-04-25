import React from 'react';
import MyTable from '@potta/components/table';
import { ArrowUpFromLine, Download } from 'lucide-react';
import Search from '@potta/components/search';

const TimesheetTable = () => {
  const columns = [
    {
      name: 'Employee',
      // render: (row: any) => <div className=''>{row.date}</div>,
    },
    {
      name: 'Total Hours ',
      // render: (row: any) => <div className=''>{row.type}</div>,
    },
    {
      name: 'Break Down',
      // render: (row: { amount: any; }) => <div className=''>{row.amount}</div>,
    },
    {
      name: 'Regular Hours',
      // render: (row: { status: any; }) => <div className=''>{row.status}</div>,
    },
    {
      name: 'OverTime',
      // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
    },
    {
      name: 'Status',
      // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
    },
  ];

  const data = [
    {
      id: 'Inv 001',
      date: '10/03/2024 | 00:25',
      amount: '25,000',
      type: '',
      status: 'Paid',
      reference: '10054264',
    },
  ];

  return (
    <div className="mt-10">
      {/* Search and action buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-96">
          <Search placeholder="Search People" />
        </div>

        <div className="flex space-x-2">
          <button className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 ">
            <ArrowUpFromLine className="h-5 w-5" />
            <span>Import time sheet</span>
          </button>
          <button className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 ">
            <Download className="h-5 w-5" />
            <span>Export csv</span>
          </button>
        </div>
      </div>

      <MyTable
        columns={columns}
        data={data}
        ExpandableComponent={null}
        expanded
        pagination={data.length > 9}
      />
    </div>
  );
};

export default TimesheetTable;
