import React from 'react';
import MyTable from '@potta/components/table';

// Define the deduction type
interface Deduction {
  id: string;
  motif?: string;
  Motif?: string;
  type?: string;
  Type?: string;
  rate?: string;
  Rate?: string;
}

interface TaxTableProps {
  deductions?: Deduction[];
  onRemove?: (id: string) => void;
}

const TaxTable: React.FC<TaxTableProps> = ({ deductions = [], onRemove }) => {
  const columns = [
    {
      name: 'Motif',
      selector: (row: Deduction) => row.motif || row.Motif || '',
      sortable: true,
      cell: (row: Deduction) => <div>{row.motif || row.Motif}</div>,
    },
    {
      name: 'Type',
      selector: (row: Deduction) => row.type || row.Type || '',
      sortable: true,
      cell: (row: Deduction) => <div>{row.type || row.Type}</div>,
    },
    {
      name: 'Rate',
      selector: (row: Deduction) => row.rate || row.Rate || '',
      sortable: true,
      cell: (row: Deduction) => <div>{row.rate || row.Rate}</div>,
    },
    {
      name: '',
      selector: (row: Deduction) => '', // Empty selector for action column
      cell: (row: Deduction) => (
        <div
          className="text-red-500 cursor-pointer"
          onClick={() => onRemove && onRemove(row.id)}
        >
          Delete
        </div>
      ),
    },
  ];

  // Use the provided deductions data or fallback to default
  const data =
    deductions.length > 0
      ? deductions
      : [
          {
            id: '1',
            motif: 'Child support',
            type: 'Legal',
            rate: 'XAF 36,000',
          },
          {
            id: '2',
            motif: 'Student Loan',
            type: 'Legal',
            rate: 'XAF 17,000',
          },
        ];

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

export default TaxTable;
