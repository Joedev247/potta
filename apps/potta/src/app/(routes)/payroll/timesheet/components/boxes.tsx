'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axios.config';
import PottaLoader from '@potta/components/pottaloader';

const Boxes = () => {
  // Fetch timesheets data
  const { data: timesheetsResponse, isLoading: isLoadingTimesheets } = useQuery(
    {
      queryKey: ['timesheets-summary'],
      queryFn: async () => {
        try {
          const response = await axios.post('/api/timesheets/filter', {
            limit: 100,
            sortBy: ['createdAt:DESC'],
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching timesheets:', error);
          return { data: [] };
        }
      },
    }
  );

  // Fetch employees data
  const { data: employeesResponse, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees-summary'],
    queryFn: async () => {
      try {
        const response = await axios.post('/employees/filter', {
          limit: 100,
          sortBy: ['firstName:ASC'],
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching employees:', error);
        return { data: [] };
      }
    },
  });

  // Calculate total hours
  const calculateTotalHours = () => {
    if (!timesheetsResponse?.data || timesheetsResponse.data.length === 0) {
      return '0';
    }

    const totalHours = timesheetsResponse.data.reduce((total, timesheet) => {
      // If total_hours is available, use it
      if (timesheet.total_hours && parseFloat(timesheet.total_hours) > 0) {
        return total + parseFloat(timesheet.total_hours);
      }

      // Otherwise calculate from check-in and check-out times
      if (timesheet.check_in_time && timesheet.check_out_time) {
        const checkIn = new Date(timesheet.check_in_time);
        const checkOut = new Date(timesheet.check_out_time);
        const diffMs = checkOut.getTime() - checkIn.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // Subtract break minutes if available
        const breakHours = timesheet.break_minutes
          ? timesheet.break_minutes / 60
          : 0;
        return total + (diffHours - breakHours);
      }

      return total;
    }, 0);

    return totalHours.toFixed(1);
  };

  // Calculate total employees
  const calculateTotalEmployees = () => {
    if (!employeesResponse?.data) {
      return '0';
    }

    return employeesResponse.data.length.toString();
  };

  // Calculate average hours per employee
  const calculateAverageHours = () => {
    if (
      !timesheetsResponse?.data ||
      timesheetsResponse.data.length === 0 ||
      !employeesResponse?.data ||
      employeesResponse.data.length === 0
    ) {
      return '0';
    }

    const totalHours = parseFloat(calculateTotalHours());
    const totalEmployees = parseInt(calculateTotalEmployees());

    if (totalEmployees === 0) return '0';

    return (totalHours / totalEmployees).toFixed(1);
  };

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (!timesheetsResponse?.data || timesheetsResponse.data.length === 0) {
      return '0%';
    }

    const approvedTimesheets = timesheetsResponse.data.filter((timesheet) => {
      const status = timesheet.status || '';
      return status.toLowerCase() === 'approved';
    }).length;

    const totalTimesheets = timesheetsResponse.data.length;

    if (totalTimesheets === 0) return '0%';

    const completionRate = (approvedTimesheets / totalTimesheets) * 100;
    return `${completionRate.toFixed(0)}%`;
  };

  const isLoading = isLoadingTimesheets || isLoadingEmployees;

  const data = [
    {
      id: 1,
      title: 'Total Hours',
      amount: isLoading ? (
        <PottaLoader size="sm" />
      ) : (
        `${calculateTotalHours()} hrs`
      ),
      color: '#000',
      percentage: '100%',
    },
    {
      id: 2,
      title: 'Total Employees',
      amount: isLoading ? <PottaLoader size="sm" /> : calculateTotalEmployees(),
      color: '#000',
      percentage: '100%',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5 mt-5">
      {data.map((item) => (
        <div key={item.id} className="border p-4">
          <div className="flex w-full justify-between">
            <p style={{ color: item.color }}>{item.title}</p>
          </div>

          <div className="mb-4 mt-5 text-center text-xl font-semibold">
            {item.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Boxes;
