import React, { useState } from 'react';
import MyTable from '@potta/components/table';
import { ArrowUpFromLine, CirclePlus, Download, Plus } from 'lucide-react';
import Search from '@potta/components/search';
import Button from '@potta/components/button';
import { toast } from 'react-hot-toast';
import axios from '@/config/axios.config';

interface TableProps {
  data: any[];
  buttonClick?: () => void;
  onTimesheetStatusChange?: (timesheetId: string, status: string) => void;
  loadingTimeSheet?: boolean;
  showControls?: boolean;
  onAddHours?: (userId: string) => void; // New prop for handling add hours modal
}

const TimesheetTable = ({
  data = [],
  buttonClick,
  onTimesheetStatusChange,
  loadingTimeSheet,
  showControls = true, // Default to showing controls
  onAddHours,
}: TableProps) => {
  const [loading, setLoading] = useState({});

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase();
  };

  // Handle timesheet approval
  const handleApprove = async (row) => {
    // Get the timesheet ID from the row
    const timesheetId = row.timesheetId;

    if (!timesheetId) {
      toast.error('No timesheet ID found for this entry');
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [timesheetId]: 'approving' }));

      // Send the timesheet ID in the request body
      const response = await axios.put(
        `/api/timesheets/approve/${timesheetId}`,
        {
          id: timesheetId,
        }
      );

      setLoading((prev) => ({ ...prev, [timesheetId]: false }));
      toast.success('Timesheet approved successfully');

      // Notify parent component that status has changed
      if (onTimesheetStatusChange) {
        onTimesheetStatusChange(timesheetId, 'APPROVED');
      }
    } catch (error) {
      console.error('Error approving timesheet:', error);
      toast.error('Failed to approve timesheet');
      setLoading((prev) => ({ ...prev, [timesheetId]: false }));
    }
  };

  // Handle timesheet rejection
  const handleReject = async (row) => {
    // Get the timesheet ID from the row
    const timesheetId = row.timesheetId;

    if (!timesheetId) {
      toast.error('No timesheet ID found for this entry');
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [timesheetId]: 'rejecting' }));

      // Send the timesheet ID in the request body
      const response = await axios.put(
        `/api/timesheets/reject/${timesheetId}`,
        {
          id: timesheetId,
        }
      );

      setLoading((prev) => ({ ...prev, [timesheetId]: false }));
      toast.success('Timesheet rejected successfully');

      // Notify parent component that status has changed
      if (onTimesheetStatusChange) {
        onTimesheetStatusChange(timesheetId, 'REJECTED');
      }
    } catch (error) {
      console.error('Error rejecting timesheet:', error);
      toast.error('Failed to reject timesheet');
      setLoading((prev) => ({ ...prev, [timesheetId]: false }));
    }
  };

  // Function to handle adding hours - now passes userId to parent component
  const handleAddHours = (e, row) => {
    e.stopPropagation();

    // Check if we have a userId in the row
    const userId = row.userId || row.id;

    if (!userId) {
      toast.error('No user ID found for this entry');
      return;
    }

    // First call the parent component's buttonClick to open the modal
    if (buttonClick) {
      buttonClick();
    }

    // Then call the onAddHours function to pass the user ID
    if (onAddHours) {
      onAddHours(userId);
    } else {
      console.log('Add hours for user:', userId);
      // Fallback behavior if no handler is provided
    }
  };

  const columns = [
    {
      name: 'Employee',
      selector: (row) => row.employee,
      cell: (row) => {
        // For the total row, show bold text
        if (row.isTotal) {
          return <div className="font-bold text-lg">{row.employee}</div>;
        }

        return (
          <div className="flex items-center">
            {row.avatar ? (
              <img
                src={row.avatar}
                alt={row.employee}
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 text-black flex items-center justify-center mr-2">
                {getInitials(row.employee)}
              </div>
            )}
            <div>{row.employee}</div>
          </div>
        );
      },
    },
    {
      name: 'Total Hours',
      selector: (row) => row.totalHours,
      cell: (row) => (
        <div className={row.isTotal ? 'font-bold text-lg' : ''}>
          {row.totalHours}
        </div>
      ),
    },
    {
      name: 'Break down',
      selector: (row) => row.breakDown,
      cell: (row) => {
        if (row.isTotal) {
          return null;
        }

        // Parse the breakdown data
        let timeRanges = [];

        // If we have timeRanges array, use it directly
        if (row.timeRanges && row.timeRanges.length > 0) {
          timeRanges = row.timeRanges;
        }
        // If we have a string with format "XX:XX - YY:YY", parse it
        else if (
          typeof row.breakDown === 'string' &&
          row.breakDown.includes('-')
        ) {
          const times = row.breakDown.split('-').map((t) => t.trim());
          if (times.length === 2) {
            timeRanges = [{ from: times[0], to: times[1] }];
          }
        }

        // If we have time ranges to display
        if (timeRanges.length > 0) {
          return (
            <div className="flex flex-col">
              {timeRanges.map((range, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-1">
                  <span className="text-sm text-gray-500 w-fit">From</span>
                  <span className="text-sm w-fit bg-[#F3FBFB] p-1">
                    {range.from}
                  </span>
                  <span className="text-sm text-gray-500 w-fit">to</span>
                  <span className="text-sm w-fit bg-[#F3FBFB] p-1">
                    {range.to}
                  </span>
                </div>
              ))}
              <button
                onClick={(e) => handleAddHours(e, row)}
                className="flex items-center mx-auto w-fit text-green-600 text-sm"
              >
                <CirclePlus size={16} className="mr-1" />
                Add hours
              </button>
            </div>
          );
        }

        // Default case for empty data
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-500 w-fit">From</span>
              <span className="text-sm w-fit bg-[#F3FBFB] p-1">00:00</span>
              <span className="text-sm text-gray-500 w-fit">to</span>
              <span className="text-sm w-fit bg-[#F3FBFB] p-1">00:00</span>
            </div>
            <button
              onClick={(e) => handleAddHours(e, row)}
              className="flex items-center mx-auto w-fit text-green-600 text-sm"
            >
              <CirclePlus size={16} className="mr-1" />
              Add hours
            </button>
          </div>
        );
      },
    },
    {
      name: 'Regular Hrs',
      selector: (row) => row.regularHours,
      cell: (row) => (
        <div className={row.isTotal ? 'font-bold text-lg' : ''}>
          {row.regularHours}
        </div>
      ),
    },
    {
      name: 'Overtime',
      selector: (row) => row.overTime,
      cell: (row) => (
        <div className={row.isTotal ? 'font-bold text-lg' : ''}>
          {row.overTime}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      cell: (row) => {
        if (row.isTotal) {
          return null;
        }

        let statusClass = '';
        if (row.status === 'Approved' || row.status === 'APPROVED') {
          statusClass = 'text-green-600';
        } else if (row.status === 'Rejected' || row.status === 'REJECTED') {
          statusClass = 'text-red-600';
        } else {
          statusClass = 'text-blue-600';
        }

        return (
          <span className={statusClass}>
            {row.status === 'APPROVED'
              ? 'Approved'
              : row.status === 'REJECTED'
              ? 'Rejected'
              : row.status === 'PENDING'
              ? 'pending'
              : row.status}
          </span>
        );
      },
    },
    {
      name: 'Actions',
      selector: (row) => row.timesheetId || 'No ID',
      cell: (row) => {
        // Don't show actions for the total row
        if (row.isTotal) {
          return null;
        }

        // Check if we have a timesheet ID
        if (!row.timesheetId) {
          return <div className="text-gray-400">No actions available</div>;
        }

        return (
          <div className="flex space-x-2">
            <button
              className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                row.status === 'Approved' ||
                row.status === 'APPROVED' ||
                loading[row.timesheetId] === 'approving' ||
                loading[row.timesheetId] === 'rejecting'
              }
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(row);
              }}
            >
              {loading[row.timesheetId] === 'approving'
                ? 'Processing...'
                : 'Approve'}
            </button>
            <button
              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                row.status === 'Rejected' ||
                row.status === 'REJECTED' ||
                loading[row.timesheetId] === 'approving' ||
                loading[row.timesheetId] === 'rejecting'
              }
              onClick={(e) => {
                e.stopPropagation();
                handleReject(row);
              }}
            >
              {loading[row.timesheetId] === 'rejecting'
                ? 'Processing...'
                : 'Reject'}
            </button>
          </div>
        );
      },
    },
  ];

  // Add total row to the data
  const calculateTotals = () => {
    if (!data || data.length === 0) return [];

    // Calculate totals
    const totalHours = data.reduce((sum, row) => {
      const hours = parseFloat(row.totalHours) || 0;
      return sum + hours;
    }, 0);

    const totalRegularHours = data.reduce((sum, row) => {
      const hours = parseFloat(row.regularHours) || 0;
      return sum + hours;
    }, 0);

    const totalOverTime = data.reduce((sum, row) => {
      const hours = parseFloat(row.overTime) || 0;
      return sum + hours;
    }, 0);

    // Create a new array with the original data plus the total row
    return [
      ...data,
      {
        employee: 'Total',
        totalHours: `${totalHours} hrs`,
        regularHours: `${totalRegularHours} hrs`,
        overTime: `${totalOverTime} hrs`,
        isTotal: true, // Flag to identify this as the total row
      },
    ];
  };

  const dataWithTotals = calculateTotals();

  return (
    <div>
      {/* Search and action buttons - only show if showControls is true */}
      {showControls && buttonClick && (
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-96">
            <Search placeholder="Search People" />
          </div>
          <div className="flex space-x-2">
            <Button type="button" text="New Time Entry" onClick={buttonClick} />
          </div>
        </div>
      )}

      <MyTable
        columns={columns}
        data={dataWithTotals}
        ExpandableComponent={null}
        expanded
        pagination={data.length > 9}
        selectableRows
      />
    </div>
  );
};

export default TimesheetTable;
