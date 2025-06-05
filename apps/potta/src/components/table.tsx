'use client';

import { FC, ReactNode, useEffect, useRef } from 'react';
import DataTable, { TableStyles } from 'react-data-table-component';
import CustomLoader from './loader';

// Define a type for column with border options
interface ColumnWithBorder {
  name: string | ReactNode; // Updated to accept both string and ReactNode
  selector: (row: any) => any;
  sortable?: boolean;
  cell?: (row: any, index?: number, column?: any) => ReactNode;
  width?: string;
  // Cell border options
  hasBorder?: boolean; // General border on all sides
  hasBorderRight?: boolean; // Border only on the right
  hasBorderLeft?: boolean; // Border only on the left
  borderStyle?: string; // Custom border style for this column
  // Header border options
  headerBorder?: boolean; // Border for header cell (all sides)
  headerBorderRight?: boolean; // Border only on the right of header
  headerBorderLeft?: boolean; // Border only on the left of header
  headerBorderBottom?: boolean; // Border only on the bottom of header
  headerBorderStyle?: string; // Custom border style for header
  [key: string]: any; // For other column properties
}

interface TableProps {
  columns: ColumnWithBorder[]; // Updated to use our new column type
  data: any;
  expanded?: boolean;
  pagination?: boolean;
  ExpandableComponent?: FC<any> | null;
  size?: boolean;
  color?: boolean;
  minHeight?: string;
  maxHeight?: string;
  selectable?: boolean;
  paginationServer?: boolean;
  paginationTotalRows?: number;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (perPage: number, page: number) => void;
  defaultBorderStyle?: string; // Default border style to use
  headerRowBorder?: boolean; // Border for the entire header row
  headerRowBorderStyle?: string; // Custom border style for header row
  onRowClicked?: (row: any) => void; // Add row click handler
  pointerOnHover?: boolean; // Control cursor style on hover
  hoverBackgroundColor?: string; // Custom hover background color
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
  maxHeight = '400px', // Default maxHeight if not provided
  defaultBorderStyle = '1px solid #e0e0e0', // Default border style
  headerRowBorder = false, // Default no header row border
  headerRowBorderStyle = '1px solid #cccccc', // Default header border style
  onRowClicked, // Row click handler
  pointerOnHover = false, // Default no pointer cursor
  hoverBackgroundColor = '#f5f5f5', // Default hover background color
}) => {
  // Reference to the table container
  const tableRef = useRef<HTMLDivElement>(null);

  // Effect to apply scrollbar styles directly to the table body element
  useEffect(() => {
    if (tableRef.current) {
      // Find the table body element
      const tableBody = tableRef.current.querySelector('.rdt_TableBody');
      if (tableBody) {
        // Apply styles directly
        Object.assign((tableBody as HTMLElement).style, {
          scrollbarWidth: 'thin', // For Firefox
          msOverflowStyle: 'none', // For IE and Edge
        });
      }
    }
  }, []);

  // Process columns to add cell styling for borders
  const processedColumns = columns.map((column) => {
    // Create a new column with appropriate styling
    const newColumn = { ...column };

    // Determine border styles
    const headerBorderStyle = column.headerBorderStyle || headerRowBorderStyle;
    const cellBorderStyle = column.borderStyle || defaultBorderStyle;

    // Check for header border options
    const hasHeaderLeft = column.headerBorder || column.headerBorderLeft;
    const hasHeaderRight = column.headerBorder || column.headerBorderRight;
    const hasHeaderBottom =
      column.headerBorder || column.headerBorderBottom || headerRowBorder;

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

  // Global CSS for thin scrollbars
  const globalScrollbarStyles = `
    /* Webkit browsers like Chrome/Safari/Edge */
    ::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
    
    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: #c1c1c1 #f1f1f1;
    }

    /* Target the specific table body class */
    .rdt_TableBody::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    .rdt_TableBody::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .rdt_TableBody::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    .rdt_TableBody {
      scrollbar-width: thin !important;
      scrollbar-color: #c1c1c1 #f1f1f1 !important;
    }
    
    /* Row hover style */
    .custom-data-table .rdt_TableRow:hover {
      background-color: ${hoverBackgroundColor} !important;
      transition: background-color 0.2s ease;
    }
  `;

  const customStyles: TableStyles = {
    headCells: {
      style: {
        paddingLeft: '7px',
        paddingRight: '6px',
        fontWeight: 'bold',
      },
    },
    headRow: {
      style: {
        backgroundColor: color ? '#237804' : '#F3FBFB',
        minHeight: size ? '50px' : '58px',
        fontSize: size ? '15px' : '18px',
        color: color ? '#EBF0F0' : '#000',
        border: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      },
    },
    rows: {
      style: {
        minHeight: size ? '50px' : '58px',
        fontSize: size ? '14px' : '16px',
        cursor: pointerOnHover || onRowClicked ? 'pointer' : 'default',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'transparent',
      },
      highlightOnHoverStyle: {
        backgroundColor: hoverBackgroundColor,
        transitionDuration: '0.15s',
        transitionProperty: 'background-color',
        borderBottomColor: '#e0e0e0',
        outlineStyle: 'none',
        outlineWidth: '0',
      },
    },
    cells: {
      style: {
        paddingLeft: '6px',
        paddingRight: '6px',
      },
    },
    table: {
      style: {
        minHeight: minHeight,
        backgroundColor: 'transparent',
      },
    },
    tableWrapper: {
      style: {
        overflowY: 'auto',
      },
    },
  };

  return (
    <div style={{ minHeight: minHeight }} ref={tableRef}>
      {/* Add global style for scrollbars */}
      <style>{globalScrollbarStyles}</style>

      <DataTable
        customStyles={customStyles}
        columns={processedColumns}
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
          <div
            style={{
              padding: '24px',
              minHeight: minHeight,
              maxHeight: maxHeight,
            }}
          >
            No records to display
          </div>
        }
        pointerOnHover={pointerOnHover || !!onRowClicked}
        onRowClicked={onRowClicked}
        fixedHeader={true}
        fixedHeaderScrollHeight={maxHeight}
        className="custom-data-table"
        highlightOnHover={true} // Enable row highlighting on hover
      />
    </div>
  );
};

export default MyTable;
