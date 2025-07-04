'use client';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import TimesheetTable from './table';
import Button from '@potta/components/button';
import axios from '@/config/axios.config';
import CustomLoader from '@potta/components/loader';
import Search from '@potta/components/search';

interface TimesheetViewProps {
  dateRange: { start: Date; end: Date };
  buttonClick: () => void;
  setSelectedEmployeeId?: (id: string) => void; // New prop to set the selected employee ID
}

const TimesheetView: React.FC<TimesheetViewProps> = ({
  dateRange,
  buttonClick,
  setSelectedEmployeeId,
}) => {
  const queryClient = useQueryClient();

  // Fetch timesheets with date range filter
  const { data: timesheetsData, isLoading: isLoadingTimesheets } = useQuery({
    queryKey: [
      'timesheets',
      format(dateRange.start, 'yyyy-MM-dd'),
      format(dateRange.end, 'yyyy-MM-dd'),
    ],
    queryFn: async () => {
      try {
        const response = await axios.post('/timesheets/filter', {
          limit: 100,
          sortBy: ['date:DESC'],
          filter: {
            date: {
              $gte: format(dateRange.start, 'yyyy-MM-dd'),
              $lte: format(dateRange.end, 'yyyy-MM-dd'),
            },
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching timesheets:', error);
        return { data: [] };
      }
    },
  });

  // Format time for display (e.g., "08:00")
  const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString) return '';
    try {
      const date = new Date(timeString);
      return format(date, 'HH:mm');
    } catch (error) {
      return timeString;
    }
  };

  // Calculate regular hours (assuming 8-hour workday)
  const calculateRegularHours = (totalHours: number | string): number => {
    const hours = parseFloat(totalHours as string);
    return isNaN(hours) ? 0 : hours > 8 ? 8 : hours;
  };

  // Calculate overtime hours
  const calculateOvertime = (totalHours) => {
    const hours = parseFloat(totalHours);
    return isNaN(hours) ? 0 : hours > 8 ? (hours - 8).toFixed(1) : 0;
  };

  // Handle timesheet status change
  const handleTimesheetStatusChange = (timesheetId, newStatus) => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries(['timesheets']);
    queryClient.invalidateQueries(['timesheets-summary']);
  };

  // Handle adding hours for a specific employee
  const handleAddHours = (userId) => {
    // Set the selected employee ID in the parent component
    if (setSelectedEmployeeId) {
      setSelectedEmployeeId(userId);
    }
    // The modal is opened by the buttonClick function called in the table component
  };

  // Process timesheet data for the table
  const processedData = React.useMemo(() => {
    if (!timesheetsData?.data) return [];

    // Create table rows for each timesheet
    return timesheetsData.data.map((timesheet) => {
      // Calculate total hours for this timesheet
      let totalHours = 0;
      const checkInTime = timesheet.check_in_time || '';
      const checkOutTime = timesheet.check_out_time || '';

      // Get employee data
      const employee = timesheet.employee || {};

      // Calculate hours if available
      if (timesheet.total_hours && parseFloat(timesheet.total_hours) > 0) {
        totalHours = parseFloat(timesheet.total_hours);
      } else if (timesheet.check_in_time && timesheet.check_out_time) {
        const checkIn = new Date(timesheet.check_in_time);
        const checkOut = new Date(timesheet.check_out_time);
        const diffMs = checkOut.getTime() - checkIn.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // Subtract break minutes if available
        const breakHours = timesheet.break_minutes
          ? timesheet.break_minutes / 60
          : 0;
        totalHours = diffHours - breakHours;
      }

      return {
        id: employee.uuid, // Employee ID
        timesheetId: timesheet.uuid, // Timesheet ID for approval/rejection
        employee: `${employee.firstName || ''} ${employee.lastName || ''}`,
        totalHours: totalHours.toFixed(1),
        breakDown: `${formatTime(checkInTime)} - ${formatTime(checkOutTime)}`,
        regularHours: calculateRegularHours(totalHours),
        overTime: calculateOvertime(totalHours),
        status: timesheet.status || 'Pending',
      };
    });
  }, [timesheetsData]);

  return (
    <div className="mt-10">
      {/* Search and action buttons - always visible */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-96">
          <Search placeholder="Search People" />
        </div>
        <div className="flex space-x-2">
          <Button type="button" text="New Time Entry" onClick={buttonClick} />
        </div>
      </div>

      {/* Table or loading/empty states */}
      {isLoadingTimesheets ? (
        <div className="mt-4">
          <CustomLoader />
        </div>
      ) : !timesheetsData?.data || timesheetsData.data.length === 0 ? (
        <div className="text-center py-10  mt-4">
          <p className="text-gray-500">
            No timesheet entries found for this period.
          </p>
        </div>
      ) : (
        <TimesheetTable
          data={processedData}
          onTimesheetStatusChange={handleTimesheetStatusChange}
          showControls={false} // Don't show controls in the table since we already have them above
          buttonClick={buttonClick} // Pass the buttonClick function to open the modal
          onAddHours={handleAddHours} // Pass the handler to set the selected employee ID
        />
      )}
    </div>
  );
};

export default TimesheetView;
