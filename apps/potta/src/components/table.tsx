'use client';
import { Props } from 'next/script';
import { Children, FC, ReactNode, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import CustomLoader from './loader';

// Define a type for column with border options
interface ColumnWithBorder {
  name: string | ReactNode;  // Updated to accept both string and ReactNode
  selector: (row: any) => any;
  sortable?: boolean;
  cell?: (row: any, index?: number, column?: any) => ReactNode;
  width?: string;
  // Cell border options
  hasBorder?: boolean;      // General border on all sides
  hasBorderRight?: boolean; // Border only on the right
  hasBorderLeft?: boolean;  // Border only on the left
  borderStyle?: string;     // Custom border style for this column
  // Header border options
  headerBorder?: boolean;   // Border for header cell (all sides)
  headerBorderRight?: boolean; // Border only on the right of header
  headerBorderLeft?: boolean;  // Border only on the left of header
  headerBorderBottom?: boolean; // Border only on the bottom of header
  headerBorderStyle?: string; // Custom border style for header
  [key: string]: any;       // For other column properties
}

interface TableProps {
  columns: ColumnWithBorder[];  // Updated to use our new column type
  data: any;
  expanded?: boolean;
  pagination?: boolean;
  ExpandableComponent?: FC<any> | null;
  size?: boolean;
  color?: boolean;
  minHeight?: string;
  selectable?: boolean;
  paginationServer?: boolean;
  paginationTotalRows?: number;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (perPage: number, page: number) => void;
  defaultBorderStyle?: string;  // Default border style to use
  headerRowBorder?: boolean;    // Border for the entire header row
  headerRowBorderStyle?: string; // Custom border style for header row
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
  minHeight = '400px',
  defaultBorderStyle = '1px solid #e0e0e0',  // Default border style
  headerRowBorder = false,                   // Default no header row border
  headerRowBorderStyle = '1px solid #cccccc', // Default header border style
}) => {
  // Process columns to add cell styling for borders
  const processedColumns = columns.map(column => {
    // Create a new column with appropriate styling
    const newColumn = { ...column };
    
    // Determine border styles
    const headerBorderStyle = column.headerBorderStyle || headerRowBorderStyle;
    const cellBorderStyle = column.borderStyle || defaultBorderStyle;
    
    // Check for header border options
    const hasHeaderLeft = column.headerBorder || column.headerBorderLeft;
    const hasHeaderRight = column.headerBorder || column.headerBorderRight;
    const hasHeaderBottom = column.headerBorder || column.headerBorderBottom || headerRowBorder;
    
    // Check for cell border options
    const hasCellLeft = column.hasBorder || column.hasBorderLeft;
    const hasCellRight = column.hasBorder || column.hasBorderRight;
    
    // Apply header styling if needed
    if (hasHeaderLeft || hasHeaderRight || hasHeaderBottom) {
      // Create a styled header
      const originalName = column.name;
      newColumn.name = (
        <div 
          style={{
            borderLeft: hasHeaderLeft ? headerBorderStyle : 'none',
            borderRight: hasHeaderRight ? headerBorderStyle : 'none',
            borderBottom: hasHeaderBottom ? headerBorderStyle : 'none',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
          }}
        >
          {originalName}
        </div>
      );
    }
    
    // Apply cell styling if needed
    if (hasCellLeft || hasCellRight) {
      // Create a custom cell renderer
      const originalCell = column.cell;
      
      newColumn.cell = (row: any, index?: number, column?: any) => {
        // Get the original cell content
        let cellContent;
        if (originalCell) {
          cellContent = originalCell(row, index, column);
        } else {
          cellContent = column.selector(row);
        }
        
        // Wrap it with our styled div
        return (
          <div 
            style={{
              borderLeft: hasCellLeft ? cellBorderStyle : 'none',
              borderRight: hasCellRight ? cellBorderStyle : 'none',
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px',
            }}
          >
            {cellContent}
          </div>
        );
      };
    }

    return newColumn;
  });

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
        minHeight: size ? '50px' : '58px',
        fontSize: size ? '15px' : '18px',
        color: color ? '#EBF0F0' : '#000',
      },
    },
    rows: {
      style: {
        minHeight: size ? '50px' : '58px',
        fontSize: size ? '14px' : '16px',
      },
    },
    cells: {
      style: {
        paddingLeft: '6px',  // Reduced padding to allow our custom div to handle padding
        paddingRight: '6px', // Reduced padding to allow our custom div to handle padding
      
      },
    },
    table: {
      style: {
        minHeight: minHeight,
      },
    },
  };

  return (
    <div className="border" style={{ minHeight: minHeight }}>
      <DataTable
        customStyles={customStyles}
        columns={processedColumns} // Use processed columns with border styling
        data={data}
        selectableRows={selectable}
        pagination={pagination !== false}
        expandableRows={!expanded}
        expandableRowsComponent={ExpandableComponent || (() => null)}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
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