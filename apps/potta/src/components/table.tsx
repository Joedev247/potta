'use client';
import { Props } from 'next/script';
import { Children, FC, ReactNode, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import CustomLoader from './loader';

interface TableProps {
  columns: any;
  data: any;
  expanded?: boolean;
  pagination?: boolean;
  ExpandableComponent?: FC<any> | null;
  size?: boolean;
}

const MyTable: FC<TableProps> = ({
  columns,
  data,
  expanded,
  pagination,
  ExpandableComponent,
  size,
}) => {
  const customStyles = {
    headCells: {
      style: {
        paddingLeft: '6px',
        paddingRight: '6px',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#EBF0F0',
        minHeight: size ? '40px' : '42px',
        fontSize: size ? '15px' : '16px',
      },
    },
    rows: {
      style: {
        minHeight: size ? '40px' : '42px',
        fontSize: size ? '14.3px' : '14px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
  };

  const [pending, setPending] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className="border">
      <DataTable
        customStyles={customStyles}
        columns={columns}
        data={data}
        selectableRows
        // Simplified conditional rendering for pagination
        pagination={pagination !== false}
        expandableRows={!expanded} // Ensure expandableRows is a boolean
        expandableRowsComponent={ExpandableComponent || (() => null)}
        progressPending={pending}
        progressComponent={<CustomLoader />}
      />
    </div>
  );
};

export default MyTable;
