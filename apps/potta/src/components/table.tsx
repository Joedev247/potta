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
  color?: boolean;
  minHeight?: string; // Added minHeight prop
  selectable?: boolean;
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
  selectable,
  color,
  minHeight = '400px', // Default min height of 400px if not specified
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
        backgroundColor: color ? '#237804' : '#F3FBFB',
        minHeight: size ? '40px' : '48px',
        fontSize: size ? '15px' : '18px',
        color: color ? '#EBF0F0' : '#000',
      },
    },
    rows: {
      style: {
        minHeight: size ? '40px' : '48px',
        fontSize: size ? '14px' : '16px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    table: {
      style: {
        minHeight: minHeight, // Apply the minimum height to the table
      },
    },
  };

  return (
    <div className="border" style={{ minHeight: minHeight }}> {/* Also apply minHeight to the container */}
      <DataTable
        customStyles={customStyles}
        columns={columns}
        data={data}
        selectableRows={selectable}
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
        noDataComponent={
          <div style={{ padding: '24px', minHeight: minHeight }}>
            No records to display
          </div>
        }
      />
    </div>
  );
};

export default MyTable;