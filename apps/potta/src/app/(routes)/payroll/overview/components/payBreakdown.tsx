'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../../utils/api';
import PayBreakdownSkeleton from './PayBreakdownSkeleton';
import axios from 'config/axios.config';

const PayBreakDown = () => {
  // Fetch employees with all details
  const { data: employeesResponse, isLoading: isLoadingEmployees } = useQuery({
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

  // Fetch timesheet data for current month to get actual hours worked
  const { data: timesheetData, isLoading: isLoadingTimesheets } = useQuery({
    queryKey: ['timesheets-current-month'],
    queryFn: async () => {
      try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const response = await axios.post('/timesheets/filter', {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString(),
          limit: 1000,
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching timesheets:', error);
        return { data: [] };
      }
    },
  });

  // Helper function to calculate regular hours (8 hours max per day)
  const calculateRegularHours = (totalHours: number): number => {
    return totalHours > 8 ? 8 : totalHours;
  };

  // Helper function to calculate overtime hours
  const calculateOvertime = (totalHours: number): number => {
    return totalHours > 8 ? totalHours - 8 : 0;
  };

  // Show skeleton loader while loading
  if (isLoadingEmployees || isLoadingTimesheets) {
    return <PayBreakdownSkeleton />;
  }

  const calculateTotalHoursWorked = () => {
    if (!employeesResponse?.data || employeesResponse.data.length === 0) {
      return { hours: 0, count: 0 };
    }

    const uniqueEmployees = new Set();
    let totalHoursWorked = 0;

    employeesResponse.data.forEach((employee) => {
      let employeeTotalHours = 0;
      let hasTimesheetData = false;

      // Calculate actual hours from timesheet data
      if (timesheetData?.data) {
        const employeeTimesheets = timesheetData.data.filter(
          (timesheet) => timesheet.employee?.uuid === employee.uuid
        );

        employeeTimesheets.forEach((timesheet) => {
          let totalHours = 0;

          if (timesheet.total_hours && parseFloat(timesheet.total_hours) > 0) {
            totalHours = parseFloat(timesheet.total_hours);
          } else if (timesheet.check_in_time && timesheet.check_out_time) {
            const checkIn = new Date(timesheet.check_in_time);
            const checkOut = new Date(timesheet.check_out_time);
            const diffMs = checkOut.getTime() - checkIn.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            const breakHours = timesheet.break_minutes
              ? timesheet.break_minutes / 60
              : 0;
            totalHours = diffHours - breakHours;
          }

          employeeTotalHours += totalHours;
          hasTimesheetData = true;
        });
      }

      // Fallback to shift-based calculations if no timesheet data
      if (!hasTimesheetData && employee.shifts && employee.shifts.length > 0) {
        // Get current date
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const employeeStartDate = new Date(employee.start_date);
        const effectiveStartDate =
          employeeStartDate > startOfMonth ? employeeStartDate : startOfMonth;
        const daysActive = Math.min(
          Math.floor((today - effectiveStartDate) / (1000 * 60 * 60 * 24)),
          today.getDate() - 1
        );
        const completedWeeks = Math.floor(daysActive / 7);
        const remainingDays = daysActive % 7;
        const startDayOfWeek = effectiveStartDate.getDay();

        employee.shifts.forEach((shift) => {
          if (shift.start_time && shift.end_time) {
            const startParts = shift.start_time.split(':');
            const endParts = shift.end_time.split(':');
            const startHour = parseInt(startParts[0]);
            const startMinute = parseInt(startParts[1]);
            const endHour = parseInt(endParts[0]);
            const endMinute = parseInt(endParts[1]);

            let hours = endHour - startHour;
            let minutes = endMinute - startMinute;
            if (minutes < 0) {
              hours--;
              minutes += 60;
            }

            const breakHours = shift.break_minutes
              ? shift.break_minutes / 60
              : 0;
            const hoursPerShift = hours + minutes / 60 - breakHours;

            let completedShifts = 0;
            if (shift.recurrence_pattern) {
              const weeklyShifts =
                (shift.recurrence_pattern.sunday ? 1 : 0) +
                (shift.recurrence_pattern.monday ? 1 : 0) +
                (shift.recurrence_pattern.tuesday ? 1 : 0) +
                (shift.recurrence_pattern.wednesday ? 1 : 0) +
                (shift.recurrence_pattern.thursday ? 1 : 0) +
                (shift.recurrence_pattern.friday ? 1 : 0) +
                (shift.recurrence_pattern.saturday ? 1 : 0);

              completedShifts = weeklyShifts * completedWeeks;

              for (let i = 0; i < remainingDays; i++) {
                const dayOfWeek = (startDayOfWeek + i) % 7;
                const dayName = [
                  'sunday',
                  'monday',
                  'tuesday',
                  'wednesday',
                  'thursday',
                  'friday',
                  'saturday',
                ][dayOfWeek];

                if (shift.recurrence_pattern[dayName]) {
                  completedShifts++;
                }
              }
            }

            employeeTotalHours += hoursPerShift * completedShifts;
          }
        });
      }

      if (employeeTotalHours > 0) {
        totalHoursWorked += employeeTotalHours;
        uniqueEmployees.add(employee.uuid);
      }
    });

    return {
      hours: totalHoursWorked,
      count: uniqueEmployees.size,
    };
  };

  // Calculate total overtime hours
  const calculateTotalOvertime = () => {
    if (!employeesResponse?.data || employeesResponse.data.length === 0) {
      return { hours: 0, count: 0 };
    }

    const uniqueEmployees = new Set();
    let totalOvertimeHours = 0;

    employeesResponse.data.forEach((employee) => {
      let employeeOvertimeHours = 0;
      let hasTimesheetData = false;

      // Calculate overtime from timesheet data
      if (timesheetData?.data) {
        const employeeTimesheets = timesheetData.data.filter(
          (timesheet) => timesheet.employee?.uuid === employee.uuid
        );

        employeeTimesheets.forEach((timesheet) => {
          let totalHours = 0;

          if (timesheet.total_hours && parseFloat(timesheet.total_hours) > 0) {
            totalHours = parseFloat(timesheet.total_hours);
          } else if (timesheet.check_in_time && timesheet.check_out_time) {
            const checkIn = new Date(timesheet.check_in_time);
            const checkOut = new Date(timesheet.check_out_time);
            const diffMs = checkOut.getTime() - checkIn.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            const breakHours = timesheet.break_minutes
              ? timesheet.break_minutes / 60
              : 0;
            totalHours = diffHours - breakHours;
          }

          employeeOvertimeHours += calculateOvertime(totalHours);
          hasTimesheetData = true;
        });
      }

      // Fallback to shift-based calculations if no timesheet data
      if (
        !hasTimesheetData &&
        employee.eligible_for_overtime &&
        employee.shifts &&
        employee.shifts.length > 0
      ) {
        employee.shifts.forEach((shift) => {
          if (shift.start_time && shift.end_time) {
            const startParts = shift.start_time.split(':');
            const endParts = shift.end_time.split(':');
            const startHour = parseInt(startParts[0]);
            const startMinute = parseInt(startParts[1]);
            const endHour = parseInt(endParts[0]);
            const endMinute = parseInt(endParts[1]);

            let hours = endHour - startHour;
            let minutes = endMinute - startMinute;
            if (minutes < 0) {
              hours--;
              minutes += 60;
            }

            const breakHours = shift.break_minutes
              ? shift.break_minutes / 60
              : 0;
            const hoursPerShift = hours + minutes / 60 - breakHours;
            const overtimePerShift = Math.max(0, hoursPerShift - 8);

            let workdaysPerWeek = 0;
            if (shift.recurrence_pattern) {
              if (shift.recurrence_pattern.monday) workdaysPerWeek++;
              if (shift.recurrence_pattern.tuesday) workdaysPerWeek++;
              if (shift.recurrence_pattern.wednesday) workdaysPerWeek++;
              if (shift.recurrence_pattern.thursday) workdaysPerWeek++;
              if (shift.recurrence_pattern.friday) workdaysPerWeek++;
              if (shift.recurrence_pattern.saturday) workdaysPerWeek++;
              if (shift.recurrence_pattern.sunday) workdaysPerWeek++;
            }

            employeeOvertimeHours += overtimePerShift * workdaysPerWeek * 4; // 4 weeks per month
          }
        });
      }

      if (employeeOvertimeHours > 0) {
        totalOvertimeHours += employeeOvertimeHours;
        uniqueEmployees.add(employee.uuid);
      }
    });

    return {
      hours: totalOvertimeHours,
      count: uniqueEmployees.size,
    };
  };

  // Calculate total off hours (PTO)
  const calculateTotalOffHours = () => {
    if (!employeesResponse?.data || employeesResponse.data.length === 0) {
      return { hours: 0, count: 0 };
    }

    // Count unique employees with PTO
    const uniqueEmployees = new Set();

    // Sum up all PTO days used (convert to hours assuming 8 hours per day)
    let totalPTOHours = 0;

    employeesResponse.data.forEach((employee) => {
      if (employee.paid_time_off && employee.paid_time_off.length > 0) {
        employee.paid_time_off.forEach((pto) => {
          if (pto.days_used) {
            const hoursUsed = parseFloat(pto.days_used) * 8;
            totalPTOHours += hoursUsed;

            // Add employee to unique set
            uniqueEmployees.add(employee.uuid);
          }
        });
      }
    });

    return {
      hours: totalPTOHours,
      count: uniqueEmployees.size,
    };
  };

  // Calculate total benefits
  const calculateTotalBenefits = () => {
    if (!employeesResponse?.data || employeesResponse.data.length === 0) {
      return { amount: 0, count: 0 };
    }

    // Count unique employees with benefits
    const uniqueEmployees = new Set();

    // Sum up all benefit values
    let totalBenefitValue = 0;

    employeesResponse.data.forEach((employee) => {
      if (employee.benefits && employee.benefits.length > 0) {
        let employeeBenefitValue = 0;

        employee.benefits.forEach((benefit) => {
          if (benefit.value && parseFloat(benefit.value) > 0) {
            employeeBenefitValue += parseFloat(benefit.value);
          } else if (benefit.rate && employee.base_pay) {
            // Calculate benefit based on rate and base pay
            const rate = parseFloat(benefit.rate);
            const basePay = parseFloat(employee.base_pay);
            employeeBenefitValue += basePay * rate;
          }
        });

        totalBenefitValue += employeeBenefitValue;

        // Add employee to unique set if they have benefits
        if (employeeBenefitValue > 0) {
          uniqueEmployees.add(employee.uuid);
        }
      }
    });

    return {
      amount: totalBenefitValue,
      count: uniqueEmployees.size,
    };
  };

  // Get calculated values
  const hoursWorked = calculateTotalHoursWorked();
  const overtime = calculateTotalOvertime();
  const offHours = calculateTotalOffHours();
  const benefits = calculateTotalBenefits();

  // Format hours with appropriate unit
  const formatHours = (hours) => {
    if (hours >= 1000) {
      return `${(hours / 1000).toFixed(1)}k hrs`;
    }
    return `${hours.toFixed(0)} hrs`;
  };

  // Format monetary value with currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `XAF ${(amount / 1000000).toFixed(2)}M`;
    }
    return `XAF ${amount.toLocaleString()}`;
  };

  // Helper function to display "person" or "people" based on count
  const personOrPeople = (count) => {
    return count === 1 ? 'person' : 'people';
  };

  return (
    <div className="">
      <div className="w-full border-r border-l  bg-[#F3FBFB] border-t font-bold px-4 py-2 ">
        <p>Pay Breakdown</p>
      </div>
      <div className="w-full text-center grid grid-cols-4 border max-h-[126px] min-h-[126px]">
        <div className="h-full w-full py-5 flex justify-center">
          <div className="pl-4 border-r pr-3 w-full">
            <p className="font-semibold">Total Off hours</p>
            <h3 className="mt-1 text-green-700 text-xl">
              {formatHours(offHours.hours)}
            </h3>
            <p className="mt-2 text-sm ">
              {offHours.count} {personOrPeople(offHours.count)}
            </p>
          </div>
        </div>
        <div className="h-full w-full py-5 flex justify-center">
          <div className="pl-4 border-r pr-3 w-full">
            <p className="font-semibold whitespace-nowrap">Total hours worked</p>
            <h3 className="mt-1 text-green-700 text-xl">
              {formatHours(hoursWorked.hours)}
            </h3>
            <p className="mt-2 text-sm">
              {hoursWorked.count} {personOrPeople(hoursWorked.count)}
            </p>
          </div>
        </div>
        <div className="h-full w-full py-5 flex justify-center">
          <div className="pl-4 border-r pr-3 w-full">
            <p className="font-semibold">Total Overtime</p>
            <h3 className="mt-1 text-green-700 text-xl">
              {formatHours(overtime.hours)}
            </h3>
            <p className="mt-2 text-sm">
              {overtime.count} {personOrPeople(overtime.count)}
            </p>
          </div>
        </div>
        <div className="h-full w-full py-5 flex justify-center">
          <div className="pl-4 pr-3 w-full">
            <p className="font-semibold">Total Benefits</p>
            <h3 className="mt-1 text-green-700 text-xl">
              {formatCurrency(benefits.amount)}
            </h3>
            <p className="mt-2 text-sm">
              {benefits.count} {personOrPeople(benefits.count)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayBreakDown;
