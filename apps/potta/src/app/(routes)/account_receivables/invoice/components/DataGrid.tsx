import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { cn } from '@potta/lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface IDataGrid<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  isLoading?: boolean;
  progressComponent?: React.ReactNode;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  maxHeight?: string;
  containerRef?: React.RefObject<HTMLElement>;
}

const DataGrid = <T,>({
  columns,
  data,
  loading,
  isLoading,
  progressComponent,
  onRowClick,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showPagination = true,
  maxHeight,
  containerRef,
}: IDataGrid<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [availableHeight, setAvailableHeight] = useState<number>(600);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const calculateHeight = () => {
      if (maxHeight) {
        // If maxHeight is provided, use it directly
        return;
      }

      if (containerRef?.current) {
        // Calculate height based on container position
        const containerRect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const containerTop = containerRect.top;
        const padding = 100; // Account for bottom padding and pagination
        const calculatedHeight = viewportHeight - containerTop - padding;
        setAvailableHeight(Math.max(calculatedHeight, 400));
      } else {
        // Fallback to viewport-based calculation with better offset
        const viewportHeight = window.innerHeight;
        const offset = 200; // Reduced offset for better calculation
        const calculatedHeight = viewportHeight - offset;
        setAvailableHeight(Math.max(calculatedHeight, 400));
      }
    };

    calculateHeight();

    // Use ResizeObserver for more responsive height calculation
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef?.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(calculateHeight);
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [maxHeight, containerRef]);

  const isTableLoading = loading || isLoading;

  const table = useReactTable({
    data: data || [],
    columns: columns || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  if (isTableLoading) {
    return (
      <div className="mt-5">
        {progressComponent || (
          <div className="animate-pulse">
            <div className="h-[40px] w-full border-b bg-gray-100" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4 p-4">
                  {columns?.map((_, colIndex) => (
                    <div key={colIndex} className="h-4 bg-gray-200  w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!table || !table.getHeaderGroups) {
    return (
      <div className="mt-10">
        <div className="text-center text-gray-500 py-8">
          Table initialization error.
        </div>
      </div>
    );
  }

  const totalRows = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSizeValue = table.getState().pagination.pageSize;

  return (
    <div
      className="flex flex-col h-full"
      style={{ height: maxHeight || `${availableHeight}px` }}
    >
      {/* Combined Table with Scrollable Body */}
      <div className="flex-1 border border-gray-200 overflow-auto bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-white sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-4 text-left bg-[#F3FBFB] font-semibold text-gray-700 border-b border-gray-200',
                      header.column.getCanSort() && 'cursor-pointer select-none'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns?.length || 1}
                  className="text-center text-gray-500 py-8"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 text-left">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalRows > 0 && (
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 ">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              value={pageSizeValue}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border border-gray-300  px-2 py-1 text-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * pageSizeValue + 1} to{' '}
            {Math.min(currentPage * pageSizeValue, totalRows)} of {totalRows}{' '}
            entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                const isCurrentPage = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => table.setPageIndex(pageNumber - 1)}
                    className={cn(
                      'px-3 py-1 text-sm ',
                      isCurrentPage
                        ? 'bg-green-700 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGrid;
