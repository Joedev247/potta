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
  showHeight?: boolean;
  containerRef?: React.RefObject<HTMLElement>;
  // Server-side pagination props
  manualPagination?: boolean;
  pageCount?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
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
  showHeight = false,
  manualPagination = false,
  pageCount,
  currentPage,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: IDataGrid<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [availableHeight, setAvailableHeight] = useState<number>(600);
  const internalTableRef = useRef<HTMLDivElement>(null);

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

      // Use containerRef if provided, otherwise use internal table ref
      const elementRef = containerRef?.current || internalTableRef.current;

      if (elementRef) {
        // Calculate height based on element's actual position on the page
        const elementRect = elementRef.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementTop = elementRect.top;
        const padding = 15; // Minimal padding for bottom space
        const calculatedHeight = viewportHeight - elementTop - padding;
        const finalHeight = Math.max(calculatedHeight, 400);
        setAvailableHeight(finalHeight);
      } else {
        // Final fallback - use a safe default
        setAvailableHeight(600);
      }
    };

    calculateHeight();

    // Use ResizeObserver for more responsive height calculation
    let resizeObserver: ResizeObserver | null = null;
    const elementRef = containerRef?.current || internalTableRef.current;
    if (elementRef && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(calculateHeight);
      resizeObserver.observe(elementRef);
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
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualPagination: manualPagination,
    pageCount: manualPagination ? pageCount : undefined,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
        pageIndex: manualPagination ? (currentPage || 1) - 1 : 0,
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

  const totalRows = manualPagination
    ? totalItems || 0
    : table.getFilteredRowModel().rows.length;
  const currentPageValue = manualPagination
    ? currentPage || 1
    : (table.getState().pagination?.pageIndex ?? 0) + 1;
  const totalPages = manualPagination ? pageCount || 1 : table.getPageCount();
  const pageSizeValue = manualPagination
    ? pageSize
    : table.getState().pagination?.pageSize ?? pageSize;

  return (
    <div
      ref={internalTableRef}
      className="flex flex-col"
      style={{
        height: showHeight ? '100%' : maxHeight || `${availableHeight}px`,
        maxHeight: showHeight ? '100%' : maxHeight || `${availableHeight}px`,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Combined Table with Scrollable Body */}
      <div
        className="flex-1 border border-gray-200 overflow-auto bg-white"
        style={{ minHeight: 0 }}
      >
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
                const newSize = Number(e.target.value);
                if (manualPagination && onPageSizeChange) {
                  onPageSizeChange(newSize);
                } else {
                  table.setPageSize(newSize);
                }
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
            Showing {(currentPageValue - 1) * pageSizeValue + 1} to{' '}
            {Math.min(currentPageValue * pageSizeValue, totalRows)} of{' '}
            {totalRows} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (manualPagination && onPageChange) {
                  onPageChange(1);
                } else {
                  table.setPageIndex(0);
                }
              }}
              disabled={
                manualPagination
                  ? currentPageValue === 1
                  : !table.getCanPreviousPage()
              }
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => {
                if (manualPagination && onPageChange) {
                  onPageChange(currentPageValue - 1);
                } else {
                  table.previousPage();
                }
              }}
              disabled={
                manualPagination
                  ? currentPageValue === 1
                  : !table.getCanPreviousPage()
              }
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                const isCurrentPage = pageNumber === currentPageValue;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      if (manualPagination && onPageChange) {
                        onPageChange(pageNumber);
                      } else {
                        table.setPageIndex(pageNumber - 1);
                      }
                    }}
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
              onClick={() => {
                if (manualPagination && onPageChange) {
                  onPageChange(currentPageValue + 1);
                } else {
                  table.nextPage();
                }
              }}
              disabled={
                manualPagination
                  ? currentPageValue === totalPages
                  : !table.getCanNextPage()
              }
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => {
                if (manualPagination && onPageChange) {
                  onPageChange(totalPages);
                } else {
                  table.setPageIndex(table.getPageCount() - 1);
                }
              }}
              disabled={
                manualPagination
                  ? currentPageValue === totalPages
                  : !table.getCanNextPage()
              }
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
