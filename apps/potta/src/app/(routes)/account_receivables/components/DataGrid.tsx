import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '@potta/lib/utils';
import React from 'react';

interface IDataGrid<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  isLoading?: boolean;
  progressComponent?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

const DataGrid = <T,>({
  columns,
  data,
  loading,
  isLoading,
  progressComponent,
  onRowClick,
}: IDataGrid<T>) => {
  // Use either loading or isLoading prop
  const isTableLoading = loading || isLoading;

  const table = useReactTable({
    data: data || [],
    columns: columns || [],
    getCoreRowModel: getCoreRowModel(),
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
                    <div
                      key={colIndex}
                      className="h-4 bg-gray-200 rounded w-full"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Safety check for table initialization
  if (!table || !table.getHeaderGroups) {
    return (
      <div className="mt-10">
        <div className="text-center text-gray-500 py-8">
          Table initialization error.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <table className="min-w-full border-collapse border-gray-300 table-auto">
        <thead className="border">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn('px-4 py-4 text-left border-b bg-[#F3FBFB] !font-semibold')}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onRowClick && onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={cn('px-4 py-4 text-left')}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {table.getFooterGroups && table.getFooterGroups().length > 0 && (
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default DataGrid;
