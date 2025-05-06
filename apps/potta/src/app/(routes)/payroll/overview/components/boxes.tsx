'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../../utils/api';
import { format } from 'date-fns';
import PottaLoader from '@potta/components/pottaloader';

const Boxes = () => {
  // Fetch employees with all their details
  const { data: employeesResponse, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        const response = await employeeApi.filterEmployees({
          limit: 100,
          sortBy: ['createdAt:DESC'],
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching employees:', error);
        return { data: [] };
      }
    },
  });

  // Calculate total due payroll from employee data
  const calculateTotalDuePayroll = () => {
    if (!employeesResponse?.data || employeesResponse.data.length === 0) {
      return 'XAF 0'; // Default value
    }

    // Sum up all employee salaries or hourly rates
    const total = employeesResponse.data.reduce((sum, employee) => {
      // Use base_pay if available, otherwise calculate from hourly rate or salary
      const monthlyPay = employee.base_pay
        ? parseFloat(employee.base_pay)
        : employee.salary
        ? parseFloat(employee.salary)
        : employee.hourly_rate
        ? parseFloat(employee.hourly_rate) * 160
        : 0; // Assuming 160 hours per month

      return sum + monthlyPay;
    }, 0);

    // Format as currency
    return `XAF ${total.toLocaleString()}`;
  };

  // Calculate next pay date based on compensation_schedule
  const calculateNextPayDate = () => {
    const today = new Date();
    let nextPayDate;

    // If before 15th, next pay is 15th
    if (today.getDate() < 15) {
      nextPayDate = new Date(today.getFullYear(), today.getMonth(), 15);
    }
    // If after 15th but before end of month, next pay is end of month
    else {
      nextPayDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
    }

    return format(nextPayDate, 'dd MMM yyyy');
  };

  // Calculate days until next pay date
  const calculateDaysUntilPayday = () => {
    const today = new Date();
    let nextPayDate;

    // If before 15th, next pay is 15th
    if (today.getDate() < 15) {
      nextPayDate = new Date(today.getFullYear(), today.getMonth(), 15);
    }
    // If after 15th but before end of month, next pay is end of month
    else {
      nextPayDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    // Calculate difference in days
    const diffTime = nextPayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Calculate active employees count
  const calculateActiveEmployees = () => {
    if (!employeesResponse?.data) return '0';

    const activeCount = employeesResponse.data.filter(
      (emp) => emp.is_active
    ).length;
    return activeCount.toString();
  };

  const data = [
    {
      id: 1,
      title: 'Total Due Payroll',
      amount: isLoading ? <PottaLoader /> : calculateTotalDuePayroll(),
      color: '#000',
      percentage: '37.9',
    },

    {
      id: 2,
      title: 'Active Employees',
      amount: isLoading ? <PottaLoader /> : calculateActiveEmployees(),
      color: '#000',
      percentage: '100%',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5">
      {data.map((item) => (
        <div key={item.id} className="border p-4 h-[166px]">
          <div className="flex w-full justify-between">
            <p style={{ color: item.color }} className="!font-bold">
              {item.title}
            </p>
          </div>

          <div className="mb-4 mt-10 text-left font-semibold text-xl ">
            {item.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Boxes;
