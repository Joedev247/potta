// apps/potta/src/app/(routes)/payroll/people/components/benefit/components/benefitTable.tsx

import MyTable from '@potta/components/table';
import React from 'react';

// Define the benefit type to match the parent component
interface Benefit {
  uuid?: string;
  id?: string;
  name?: string;
  Benefit?: string;
  type?: string;
  Type?: string;
  rate?: string;
  Rate?: string;
  provider?: string;
  Provider?: string;
}

interface BenefitTableProps {
  benefits?: Benefit[];
  onRemove?: (id: string) => void;
}

const BenefitTable: React.FC<BenefitTableProps> = ({
  benefits = [],
  onRemove,
}) => {
  const columns = [
    {
      name: 'Benefit',
      selector: (row: Benefit) => row.name || row.Benefit || '',
      sortable: true,
      cell: (row: Benefit) => <div>{row.name || row.Benefit}</div>,
    },
    {
      name: 'Type',
      selector: (row: Benefit) => row.type || row.Type || '',
      sortable: true,
      cell: (row: Benefit) => <div>{row.type || row.Type}</div>,
    },
    {
      name: 'Rate',
      selector: (row: Benefit) => row.rate || row.Rate || '',
      sortable: true,
      cell: (row: Benefit) => <div>{row.rate || row.Rate}</div>,
    },
    {
      name: 'Provider',
      selector: (row: Benefit) => row.provider || row.Provider || '',
      sortable: true,
      cell: (row: Benefit) => <div>{row.provider || row.Provider}</div>,
    },
    {
      name: '',
      selector: (row: Benefit) => '', // Empty selector for action column
      cell: (row: Benefit) => (
        <div
          className="text-red-500 cursor-pointer"
          onClick={() => onRemove && onRemove(row.uuid || row.id || '')}
        >
          Delete
        </div>
      ),
    },
  ];

  // FIX: Always ensure we pass an array to the MyTable component
  const data = benefits && benefits.length > 0 ? benefits : [];

  return (
    <div className="mt-10">
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

export default BenefitTable;
