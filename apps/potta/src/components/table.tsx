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
 
  paginationServer?: boolean;
  paginationTotalRows?: number;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (perPage: number, page: number) => void;


}

const MyTable: FC<TableProps & { pending?: boolean }> = ({
  columns,
  data,
  expanded,
  pagination,
  ExpandableComponent,
  size,
  pending,
  paginationServer = false,
  paginationTotalRows,
  onChangePage,
  onChangeRowsPerPage,
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


  return (
    <div className="border ">
      <DataTable
        customStyles={customStyles}
        columns={columns}
        data={data}
        selectableRows
        // Simplified conditional rendering for pagination
        pagination={pagination !== false}
        expandableRows={!expanded} // Ensure expandableRows is a boolean
        expandableRowsComponent={ExpandableComponent || (() => null)}
        paginationServer={paginationServer} // Enable server-side pagination
        paginationTotalRows={paginationTotalRows} // Total rows from backend
        onChangePage={onChangePage} // Handle page change
        onChangeRowsPerPage={onChangeRowsPerPage} // Handle per-page change
        progressPending={pending}
        progressComponent={<CustomLoader />}
      />
    </div>
  );
};

export default MyTable;
