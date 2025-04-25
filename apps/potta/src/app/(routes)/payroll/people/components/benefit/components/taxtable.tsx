import React from 'react';
import MyTable from '@potta/components/table';

const TaxTable = () => {
  const columns = [
    {
      name: 'Motif',
      // render: (row: any) => <div className=''>{row.date}</div>,
    },
    {
      name: 'Type ',
      // render: (row: any) => <div className=''>{row.type}</div>,
    },
    {
      name: 'Rate',
      // render: (row: { amount: any; }) => <div className=''>{row.amount}</div>,
    },

    {
      name: '',
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
