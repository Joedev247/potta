'use client';
import MyTable from '@potta/components/table';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeApi, roleApi } from '../../utils/api';
import CustomLoader from '@potta/components/loader';
import axios from '@/config/axios.config';

const PayrollTable = () => {
  // Fetch employees
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

  // Fetch roles to map role IDs to names
  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      try {
        // Use axios directly to ensure we're using the correct endpoint
        const response = await axios.post('/api/potta/roles/filter', {
          limit: 100,
          sortBy: ['name:ASC'],
        });
        console.log('Roles data fetched:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching roles:', error);
        return { data: [] };
      }
    },
  });

  // Create a map of role IDs to role names
  const roleMap = React.useMemo(() => {
    const map = new Map();
    if (rolesData?.data) {
      rolesData.data.forEach((role) => {
        map.set(role.uuid, role.name);
      });
    }
    return map;
  }, [rolesData]);

  // Debug logs to check data
  useEffect(() => {
    if (employeesResponse?.data && rolesData?.data) {
      console.log('Role map:', Array.from(roleMap.entries()));

      // Log employee role IDs to check if they match any role UUIDs
      const roleIds = employeesResponse.data.map((emp) => emp.role_id);
      console.log('Employee role IDs:', roleIds);

      // Check if role IDs exist in the role map
      roleIds.forEach((roleId) => {
        console.log(
          `Role ID ${roleId} exists in map: ${roleMap.has(
            roleId
          )}, value: ${roleMap.get(roleId)}`
        );
      });
    }
  }, [employeesResponse, rolesData, roleMap]);

  // Helper function to calculate hours from shift
  const calculateHoursFromShift = (shift) => {
    if (!shift.start_time || !shift.end_time) return 8; // Default to 8 hours

    // Parse hours from time strings (format: "HH:MM:SS")
    const startParts = shift.start_time.split(':');
    const endParts = shift.end_time.split(':');

    const startHour = parseInt(startParts[0]);
    const startMinute = parseInt(startParts[1]);
    const endHour = parseInt(endParts[0]);
    const endMinute = parseInt(endParts[1]);

    // Calculate total hours
    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;

    // Adjust for minutes
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }

    // Subtract break time if available
    const breakHours = shift.break_minutes ? shift.break_minutes / 60 : 0;

    return hours + minutes / 60 - breakHours;
  };

  // Process employee data for the table
  const processedData = React.useMemo(() => {
    if (!employeesResponse?.data || employeesResponse.data.length === 0) {
      return [];
    }

    return employeesResponse.data.map((employee) => {
      // Calculate today's pay based on hourly rate or base pay
      const hourlyRate = parseFloat(employee.hourly_rate || '0');
      const basePay = parseFloat(employee.base_pay || '0');
      const monthlySalary = parseFloat(employee.salary || '0');

      // Calculate daily rate based on available values
      let dailyRate = 0;
      if (hourlyRate > 0) {
        dailyRate = hourlyRate * 8; // 8 hours per day
      } else if (basePay > 0) {
        dailyRate = basePay / 22; // Assuming 22 working days per month
      } else if (monthlySalary > 0) {
        dailyRate = monthlySalary / 22;
      }

      const todayPay = dailyRate;

      // Get bank account info
      const bankAccount =
        employee.bank_accounts && employee.bank_accounts.length > 0
          ? employee.bank_accounts.find((acc) => acc.is_primary) ||
            employee.bank_accounts[0]
          : null;

      // Calculate regular hours - UPDATED to show most common shift duration
      let regularHours = 0;
      let weeklyWorkdays = 0;
      let weeklyHours = 0;
      let shiftTimeInfo = 'No shifts';

      if (employee.shifts && employee.shifts.length > 0) {
        // Track shift durations and count occurrences
        const shiftDurations = {};

        // Calculate hours for each shift and find the most common duration
        employee.shifts.forEach((shift) => {
          if (shift.start_time && shift.end_time) {
            const duration = calculateHoursFromShift(shift);
            const durationKey = duration.toFixed(1);

            if (!shiftDurations[durationKey]) {
              shiftDurations[durationKey] = {
                count: 0,
                timeInfo: `${shift.start_time.substring(
                  0,
                  5
                )} - ${shift.end_time.substring(0, 5)}`,
                duration: duration,
              };
            }

            shiftDurations[durationKey].count++;
          }
        });

        // Find the most common shift duration
        let maxCount = 0;
        let mostCommonDuration = null;

        for (const [durationKey, info] of Object.entries(shiftDurations)) {
          if (info.count > maxCount) {
            maxCount = info.count;
            mostCommonDuration = info;
            regularHours = parseFloat(durationKey);
            shiftTimeInfo = info.timeInfo;
          }
        }

        // If we found a common duration, use it
        if (mostCommonDuration) {
          // Count workdays per week to calculate weekly hours
          const primaryShift = employee.shifts[0]; // Use first shift for workday counting

          if (primaryShift.recurrence_pattern) {
            if (primaryShift.recurrence_pattern.monday) weeklyWorkdays++;
            if (primaryShift.recurrence_pattern.tuesday) weeklyWorkdays++;
            if (primaryShift.recurrence_pattern.wednesday) weeklyWorkdays++;
            if (primaryShift.recurrence_pattern.thursday) weeklyWorkdays++;
            if (primaryShift.recurrence_pattern.friday) weeklyWorkdays++;
            if (primaryShift.recurrence_pattern.saturday) weeklyWorkdays++;
            if (primaryShift.recurrence_pattern.sunday) weeklyWorkdays++;
          }

          weeklyHours = regularHours * weeklyWorkdays;
        } else {
          // Fallback if no shifts with duration found
          regularHours = 8; // Default
          weeklyHours = 40; // Default
        }
      } else {
        // Default if no shifts defined
        regularHours = 8; // Default to 8 hours per day
        weeklyHours = 40; // Default to 40 hours per week
      }

      // Calculate overtime hours based on shifts
      let overtimeHours = 0;

      if (
        employee.eligible_for_overtime &&
        employee.shifts &&
        employee.shifts.length > 0
      ) {
        employee.shifts.forEach((shift) => {
          const hoursPerShift = calculateHoursFromShift(shift);
          const overtimePerShift = Math.max(0, hoursPerShift - 8);

          // Count workdays for this shift
          let shiftWorkdays = 0;
          if (shift.recurrence_pattern) {
            if (shift.recurrence_pattern.monday) shiftWorkdays++;
            if (shift.recurrence_pattern.tuesday) shiftWorkdays++;
            if (shift.recurrence_pattern.wednesday) shiftWorkdays++;
            if (shift.recurrence_pattern.thursday) shiftWorkdays++;
            if (shift.recurrence_pattern.friday) shiftWorkdays++;
            if (shift.recurrence_pattern.saturday) shiftWorkdays++;
            if (shift.recurrence_pattern.sunday) shiftWorkdays++;
          }

          overtimeHours += overtimePerShift * shiftWorkdays;
        });
      }

      // Calculate PTO hours
      let ptoHours = 0;

      if (employee.paid_time_off && employee.paid_time_off.length > 0) {
        employee.paid_time_off.forEach((pto) => {
          if (pto.days_used) {
            ptoHours += parseFloat(pto.days_used) * 8; // 8 hours per day
          }
        });
      }

      // Calculate benefits value
      let benefitsValue = 0;

      if (employee.benefits && employee.benefits.length > 0) {
        employee.benefits.forEach((benefit) => {
          if (benefit.value && parseFloat(benefit.value) > 0) {
            benefitsValue += parseFloat(benefit.value);
          } else if (benefit.rate && basePay > 0) {
            // Calculate benefit based on rate and base pay
            const rate = parseFloat(benefit.rate);
            benefitsValue += basePay * rate;
          }
        });
      }

      // Determine pay rate display
      let rateDisplay = '';
      if (hourlyRate > 0) {
        rateDisplay = `XAF ${hourlyRate.toLocaleString()}/hr`;
      } else if (basePay > 0) {
        rateDisplay = `XAF ${basePay.toLocaleString()}/mo`;
      } else if (monthlySalary > 0) {
        rateDisplay = `XAF ${monthlySalary.toLocaleString()}/mo`;
      } else {
        rateDisplay = 'Not set';
      }

      // Get role name from the role map
      const roleId = employee.role_id;
      console.log(
        `Employee ${employee.firstName} ${employee.lastName} has role ID: ${roleId}`
      );
      const roleName = roleMap.get(roleId) || 'Staff';
      console.log(`Role name for ${roleId}: ${roleName}`);

      return {
        id: employee.uuid,
        employee: {
          name: `${employee.firstName} ${employee.lastName}`,
          avatar: `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=random`,
        },
        todayPay: `XAF ${todayPay.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`,
        rate: rateDisplay,
        regularHours: regularHours.toFixed(1),
        shiftTimeInfo: shiftTimeInfo,
        weeklyHours: weeklyHours.toFixed(1),
        weeklyWorkdays: weeklyWorkdays,
        overtime: overtimeHours.toFixed(1),
        ptoHours: ptoHours.toFixed(1),
        benefits: `XAF ${benefitsValue.toLocaleString()}`,
        paymentMethod: bankAccount
          ? `${bankAccount.bank_name} (${bankAccount.account_number.slice(
              -4
            )}...)`
          : 'Not set',
        role: roleName,
        roleId: roleId, // Add the role ID to the data for debugging
      };
    });
  }, [employeesResponse, roleMap]);

  const columns = [
    {
      name: 'Employee',
      selector: (row) => row.employee.name,
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.employee.avatar}
            alt={row.employee.name}
            className="h-8 w-8 rounded-full"
          />
          <p>{row.employee.name}</p>
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Today Pay',
      selector: (row) => row.todayPay,
      cell: (row) => <div>{row.todayPay}</div>,
      sortable: true,
    },
    {
      name: 'Rate',
      selector: (row) => row.rate,
      cell: (row) => <div>{row.rate}</div>,
      sortable: true,
    },
    {
      name: 'Regular hrs',
      selector: (row) => row.regularHours,
      cell: (row) => (
        <div
          title={`${row.shiftTimeInfo} | ${row.weeklyHours} hrs/week (${row.weeklyWorkdays} days)`}
        >
          {row.regularHours}
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Overtime',
      selector: (row) => row.overtime,
      cell: (row) => <div>{row.overtime}</div>,
      sortable: true,
    },
    {
      name: 'PTO hrs',
      selector: (row) => row.ptoHours,
      cell: (row) => <div>{row.ptoHours}</div>,
      sortable: true,
    },
    {
      name: 'Benefits',
      selector: (row) => row.benefits,
      cell: (row) => <div>{row.benefits}</div>,
      sortable: true,
    },
    {
      name: 'Payment Method',
      selector: (row) => row.paymentMethod,
      cell: (row) => <div>{row.paymentMethod}</div>,
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row) => row.role,
      cell: (row) => <div title={`Role ID: ${row.roleId}`}>{row.role}</div>,
      sortable: true,
    },
  ];

  const isLoading = isLoadingEmployees || isLoadingRoles;

  return (
    <div className="mt-10">
      {isLoading ? (
        <CustomLoader />
      ) : (
        <MyTable columns={columns} data={processedData} />
      )}
    </div>
  );
};

export default PayrollTable;
