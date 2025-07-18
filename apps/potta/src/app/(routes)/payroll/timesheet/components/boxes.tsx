'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@potta/components/shadcn/skeleton';
import { useTimesheets } from '../hooks/useTimesheets';
import { Timesheet } from '../../people/utils/types';

interface BoxesProps {
  dateRange: { start: Date; end: Date };
}

// Box skeleton loader component (simplified for classic look)
const BoxSkeleton = () => (
  <div className="border p-4 bg-white">
    <div className="flex w-full justify-between items-center mb-4">
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="text-center">
      <Skeleton className="h-8 w-20 mx-auto mb-2" />
      <Skeleton className="h-3 w-16 mx-auto" />
    </div>
  </div>
);

const Boxes: React.FC<BoxesProps> = ({ dateRange }) => {
  // Use the custom hook for timesheets
  const { data: filteredTimesheets, isLoading: isLoadingTimesheets } =
    useTimesheets(dateRange);

  // Fetch employees data (we'll filter this based on timesheet data)
  const { data: employeesResponse, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees-summary'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/employees/filter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            limit: 100,
            sortBy: ['firstName:ASC'],
          }),
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching employees:', error);
        return { data: [] };
      }
    },
  });

  // Calculate total hours
  const calculateTotalHours = () => {
    if (!filteredTimesheets || filteredTimesheets.length === 0) {
      return '0';
    }
    const totalHours = filteredTimesheets.reduce(
      (total: number, timesheet: Timesheet) => {
        if (timesheet.total_hours && parseFloat(timesheet.total_hours) > 0) {
          return total + parseFloat(timesheet.total_hours);
        }
        if (timesheet.check_in_time && timesheet.check_out_time) {
          const checkIn = new Date(timesheet.check_in_time);
          const checkOut = new Date(timesheet.check_out_time);
          const diffMs = checkOut.getTime() - checkIn.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          const breakHours = timesheet.break_minutes
            ? timesheet.break_minutes / 60
            : 0;
          return total + (diffHours - breakHours);
        }
        return total;
      },
      0
    );
    return totalHours.toFixed(1);
  };

  // Calculate total employees who have timesheets in the selected date range
  const calculateTotalEmployees = () => {
    if (!filteredTimesheets || !employeesResponse?.data) {
      return '0';
    }
    const employeeIdsWithTimesheets = new Set(
      filteredTimesheets
        .filter((timesheet: Timesheet) => timesheet.employee?.uuid)
        .map((timesheet: Timesheet) => timesheet.employee.uuid)
    );
    return employeeIdsWithTimesheets.size.toString();
  };

  // Calculate average hours per employee who has timesheets in the selected date range
  const calculateAverageHours = () => {
    if (!filteredTimesheets || filteredTimesheets.length === 0) {
      return '0';
    }
    const totalHours = parseFloat(calculateTotalHours());
    const totalEmployees = parseInt(calculateTotalEmployees());
    if (totalEmployees === 0) return '0';
    return (totalHours / totalEmployees).toFixed(1);
  };

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (!filteredTimesheets || filteredTimesheets.length === 0) {
      return '0%';
    }
    const approvedTimesheets = filteredTimesheets.filter(
      (timesheet: Timesheet) => {
        const status = timesheet.status || '';
        return status.toLowerCase() === 'approved';
      }
    ).length;
    const totalTimesheets = filteredTimesheets.length;
    if (totalTimesheets === 0) return '0%';
    const completionRate = (approvedTimesheets / totalTimesheets) * 100;
    return `${completionRate.toFixed(0)}%`;
  };

  const isLoading = isLoadingTimesheets || isLoadingEmployees;

  // Classic data structure without icons and modern styling
  const data = [
    {
      id: 1,
      title: 'Total Hours',
      value: `${calculateTotalHours()} hrs`,
      color: '#000',
    },
    {
      id: 2,
      title: 'Total Employees',
      value: calculateTotalEmployees(),
      color: '#000',
    },
    {
      id: 3,
      title: 'Average Hours',
      value: `${calculateAverageHours()} hrs`,
      color: '#000',
    },
    {
      id: 4,
      title: 'Completion Rate',
      value: calculateCompletionRate(),
      color: '#000',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5 mt-5">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <BoxSkeleton key={index} />
          ))
        : data.map((item) => (
            <div key={item.id} className="border p-4 bg-white">
              <div className="flex w-full justify-between">
                <p
                  style={{ color: item.color }}
                  className="text-sm font-medium"
                >
                  {item.title}
                </p>
              </div>
              <div className="mb-4 mt-5 text-center text-xl font-semibold">
                {item.value}
              </div>
            </div>
          ))}
    </div>
  );
};

export default Boxes;
