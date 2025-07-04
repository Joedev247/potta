'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'config/axios.config';
import { toast } from 'react-hot-toast';
import Search from '@potta/components/search';
import { ArrowUpFromLine, Download, Plus, ChevronRight } from 'lucide-react';
import { peopleApi } from '../../people/utils/api';
import Button from '@potta/components/button';
import {
  differenceInMinutes,
  format,
  startOfWeek,
  addDays,
  parseISO,
  isSameDay,
  isToday,
} from 'date-fns';
import NewShiftModal from './NewShiftModal'; // Import the NewShiftModal component
import PottaLoader from '@potta/components/pottaloader';

interface ShiftRecurrencePattern {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface OvertimePolicy {
  grace_period: number;
  multiplier: number;
}

interface Shift {
  id?: string;
  uuid?: string;
  person_id?: string;
  employeeId?: string;
  name: string;
  start_time: string;
  end_time: string;
  break_minutes: number;
  recurrence_pattern: ShiftRecurrencePattern;
  overtime_policy: OvertimePolicy | null;
  applies_to_roles: string[];
  applies_to_departments: string[] | null;
  role?: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  initials?: string;
}

interface WeekDate {
  day: string;
  date: string;
  fullDate: Date;
  dayIndex: number;
  isoDate: string;
  dayName: keyof ShiftRecurrencePattern;
}

interface Role {
  uuid: string;
  name: string;
}

const ShiftView: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roleNames, setRoleNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState<WeekDate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewShiftModal, setShowNewShiftModal] = useState(false);
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // Get current week dates dynamically
  const getCurrentWeekDates = (): WeekDate[] => {
    const today = new Date();
    // Use startOfWeek with { weekStartsOn: 0 } to ensure week starts on Sunday
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });

    const weekDates: WeekDate[] = [];
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    for (let i = 0; i < 7; i++) {
      const date = addDays(startOfCurrentWeek, i);
      weekDates.push({
        day: format(date, 'EEE'), // Short day name (Sun, Mon, etc.)
        date: format(date, 'd'), // Day of month (1-31)
        fullDate: date,
        dayIndex: i, // 0 = Sunday, 1 = Monday, etc.
        isoDate: format(date, 'yyyy-MM-dd'), // ISO format date part
        dayName: dayNames[i] as keyof ShiftRecurrencePattern,
      });
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();

  // Create a memoized refresh function that can be passed to the modal
  const refreshData = useCallback(() => {
    fetchEmployeesAndShifts();
  }, []);

  useEffect(() => {
    fetchEmployeesAndShifts();
    fetchRoles();
  }, []);

  // Generate initials from name
  const getInitials = (firstName: string): string => {
    const firstInitial =
      firstName && firstName.length > 0 ? firstName[0].toUpperCase() : '';

    return `${firstInitial}`;
  };

  // Fetch roles data
  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    try {
      // Fetch roles from the API
      const rolesResponse = await axios.post('/roles/filter', {
        page: 1,
        limit: 100,
      });

      if (rolesResponse && rolesResponse.data && rolesResponse.data.data) {
        const rolesMap: Record<string, string> = {};
        const rolesForSelect: { value: string; label: string }[] = [];

        // Map each role's UUID to its name
        rolesResponse.data.data.forEach((role: Role) => {
          if (role.uuid && role.name) {
            rolesMap[role.uuid] = role.name;
            rolesForSelect.push({
              value: role.uuid,
              label: role.name,
            });
          }
        });

        console.log('Roles loaded:', rolesMap);
        setRoleNames(rolesMap);
        setRoles(rolesForSelect);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      // Don't set any fallback role names - we'll handle missing roles in getRoleName
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Fetch employees and shifts data
  const fetchEmployeesAndShifts = async () => {
    setLoading(true);
    try {
      // Fetch employees
      const employeesResponse = await axios.post('/employees/filter', {
        page: 1,
        limit: 100,
        status: 'active',
      });

      let employeeData: Employee[] = [];

      if (
        employeesResponse &&
        employeesResponse.data &&
        employeesResponse.data.data &&
        employeesResponse.data.data.length > 0
      ) {
        employeeData = employeesResponse.data.data.map((emp: any) => {
          const firstName = emp.first_name || emp.firstName || '';
          const lastName = emp.last_name || emp.lastName || '';
          const initials = getInitials(firstName);

          return {
            id: emp.uuid || emp.id || emp._id,
            first_name: firstName,
            last_name: lastName,
            avatar: emp.avatar,
            initials: initials,
          };
        });
      }

      setEmployees(employeeData);

      // Fetch shifts
      try {
        const shiftsResponse = await axios.post('/shifts/filter', {
          // You can add filter parameters here if needed
        });

        if (shiftsResponse && shiftsResponse.data && shiftsResponse.data.data) {
          // Create a mapping of shifts to employees
          // For this example, let's assign shifts to employees in a round-robin fashion
          const shiftsData = shiftsResponse.data.data.map(
            (shift: any, index: number) => {
              // Assign shift to an employee (round-robin)
              const employeeIndex = index % employeeData.length;
              const assignedEmployeeId = employeeData[employeeIndex].id;

              return {
                id: shift.uuid || shift.id,
                uuid: shift.uuid,
                person_id: assignedEmployeeId,
                employeeId: assignedEmployeeId,
                name: shift.name,
                start_time: shift.start_time,
                end_time: shift.end_time,
                break_minutes: shift.break_minutes || 30,
                recurrence_pattern: shift.recurrence_pattern || {
                  monday: true,
                  tuesday: false,
                  wednesday: false,
                  thursday: true,
                  friday: false,
                  saturday: false,
                  sunday: true,
                },
                overtime_policy: shift.overtime_policy || {
                  grace_period: 15,
                  multiplier: 1.5,
                },
                applies_to_roles: shift.applies_to_roles || [
                  '931d9297-ae7f-4967-9d4b-da37dbd0f077',
                ],
                applies_to_departments: shift.applies_to_departments || [
                  'service',
                ],
                role: 'Staff', // Default role name
              };
            }
          );

          console.log('Shifts loaded:', shiftsData);
          setShifts(shiftsData);
        } else {
          // Create fallback shifts if API returns empty data
          const sampleShifts = createSampleShifts(employeeData);
          setShifts(sampleShifts);
        }
      } catch (shiftError) {
        console.error('Error fetching shifts:', shiftError);
        // Create fallback shifts if API fails
        const sampleShifts = createSampleShifts(employeeData);
        setShifts(sampleShifts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback data
      const fallbackEmployees = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
          initials: 'JD',
        },
        {
          id: '2',
          first_name: 'Blessed',
          last_name: 'Nur',
          avatar:
            'https://ui-avatars.com/api/?name=Blessed+Nur&background=random',
          initials: 'BN',
        },
      ];

      setEmployees(fallbackEmployees);

      // Create sample shifts based on fallback employees
      const sampleShifts = createSampleShifts(fallbackEmployees);
      setShifts(sampleShifts);
    } finally {
      setLoading(false);
    }
  };
  // Update the toggleNewShiftModal function to accept a date parameter
  const toggleNewShiftModal = (dateInfo?: WeekDate) => {
    if (dateInfo) {
      setSelectedDate(dateInfo);
    } else {
      setSelectedDate(null);
    }
    setShowNewShiftModal(!showNewShiftModal);
  };

  // Handle successful shift creation
  const handleShiftCreated = () => {
    // Close the modal
    setShowNewShiftModal(false);

    // Refresh the data to show the new shift
    refreshData();

    // Show success message
    toast.success('Shift added successfully!');
  };

  // Create sample shifts only if API fails
  const createSampleShifts = (employeeList: Employee[]): Shift[] => {
    if (!employeeList || employeeList.length === 0) return [];

    const sampleShifts = [];

    // Add shifts for first employee
    if (employeeList.length > 0) {
      sampleShifts.push({
        id: '1',
        person_id: employeeList[0].id,
        name: 'Morning Shift',
        start_time: '08:00:00',
        end_time: '16:00:00',
        break_minutes: 30,
        recurrence_pattern: {
          monday: true,
          tuesday: false,
          wednesday: false,
          thursday: true,
          friday: false,
          saturday: false,
          sunday: true,
        },
        overtime_policy: {
          grace_period: 15,
          multiplier: 1.5,
        },
        applies_to_roles: ['931d9297-ae7f-4967-9d4b-da37dbd0f077'],
        applies_to_departments: ['service'],
        role: 'Staff',
      });
    }

    // Add shifts for second employee
    if (employeeList.length > 1) {
      sampleShifts.push({
        id: '2',
        person_id: employeeList[1].id,
        name: 'Morning Shift',
        start_time: '08:00:00',
        end_time: '16:00:00',
        break_minutes: 30,
        recurrence_pattern: {
          monday: true,
          tuesday: true,
          wednesday: false,
          thursday: true,
          friday: false,
          saturday: false,
          sunday: true,
        },
        overtime_policy: {
          grace_period: 15,
          multiplier: 1.5,
        },
        applies_to_roles: ['931d9297-ae7f-4967-9d4b-da37dbd0f077'],
        applies_to_departments: ['service'],
        role: 'Staff',
      });
    }

    return sampleShifts;
  };

  // Format time for display (e.g., "08:00")
  const formatTime = (timeString: string) => {
    if (!timeString) return '';

    try {
      // Handle API format "08:00:00" without date part
      if (timeString.length <= 8 && timeString.includes(':')) {
        return timeString.substring(0, 5); // Just take HH:MM part
      }

      return format(parseISO(timeString), 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '08:00'; // Default fallback
    }
  };

  // Get role name from role ID
  const getRoleName = (roleId: string): string => {
    // If we have a role name for this ID, return it
    if (roleNames[roleId]) {
      return roleNames[roleId];
    }

    // If not, return 'Staff' as a default
    return 'Staff';
  };

  // Calculate hours from shift
  const calculateShiftHours = (shift: Shift): number => {
    // If the shift is marked as "Unavailable", return 0 hours
    if (shift.name === 'Unavailable') return 0;

    if (!shift.start_time || !shift.end_time) return 0;

    try {
      // Handle API format "08:00:00" without date part
      if (
        shift.start_time.length <= 8 &&
        shift.start_time.includes(':') &&
        shift.end_time.length <= 8 &&
        shift.end_time.includes(':')
      ) {
        // Extract hours and minutes
        const [startHours, startMinutes] = shift.start_time
          .split(':')
          .map(Number);
        const [endHours, endMinutes] = shift.end_time.split(':').map(Number);

        // Calculate total minutes
        let totalMinutes =
          endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

        // Handle overnight shifts
        if (totalMinutes < 0) {
          totalMinutes += 24 * 60; // Add 24 hours in minutes
        }

        // Subtract break time
        totalMinutes -= shift.break_minutes || 0;

        // Convert to hours
        return Math.max(0, Math.round((totalMinutes / 60) * 10) / 10);
      }

      const start = parseISO(shift.start_time);
      const end = parseISO(shift.end_time);

      // Calculate minutes between start and end, then subtract break time
      const totalMinutes =
        differenceInMinutes(end, start) - (shift.break_minutes || 0);

      // Convert to hours (if negative or zero, return 0)
      return Math.max(0, Math.round((totalMinutes / 60) * 10) / 10); // Round to 1 decimal place
    } catch (error) {
      console.error('Error calculating shift hours:', error);
      return 0;
    }
  };

  // Check if an employee has a shift on a specific day
  const getEmployeeShiftForDay = (
    employeeId: string,
    dayName: keyof ShiftRecurrencePattern
  ) => {
    // Find shift for this employee that occurs on this day
    return shifts.find(
      (shift) =>
        (shift.person_id === employeeId || shift.employeeId === employeeId) &&
        shift.recurrence_pattern &&
        shift.recurrence_pattern[dayName]
    );
  };

  // Calculate total hours for an employee across all their shifts
  const calculateEmployeeTotalHours = (employeeId: string): number => {
    let totalHours = 0;

    // Check each day of the week
    weekDates.forEach((date) => {
      const shift = getEmployeeShiftForDay(employeeId, date.dayName);
      if (shift && shift.name !== 'Unavailable') {
        totalHours += calculateShiftHours(shift);
      }
    });

    return totalHours;
  };

  // Calculate hours for a specific day for an employee
  const calculateDayHours = (
    employeeId: string,
    dayName: keyof ShiftRecurrencePattern
  ): number => {
    const shift = getEmployeeShiftForDay(employeeId, dayName);
    if (!shift || shift.name === 'Unavailable') return 0;
    return calculateShiftHours(shift);
  };

  // Calculate total hours for all employees on a specific day
  const calculateTotalDayHours = (
    dayName: keyof ShiftRecurrencePattern
  ): number => {
    return filteredEmployees.reduce((total, employee) => {
      return total + calculateDayHours(employee.id, dayName);
    }, 0);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) => {
    const fullName =
      `${employee.first_name} ${employee.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Format hours for display
  const formatHours = (hours: number): string => {
    return hours === 0 ? '0 hrs' : `${hours} hrs`;
  };

  // Get shift color based on shift type
  const getShiftColor = (shift: Shift, isToday: boolean): string => {
    if (shift.name === 'Unavailable') {
      return 'bg-gray-200';
    }

    if (shift.name.includes('Afternoon')) {
      return isToday ? 'bg-blue-600' : 'bg-blue-500';
    }

    if (shift.name.includes('Night')) {
      return isToday ? 'bg-purple-700' : 'bg-purple-600';
    }

    // Default color for Morning shifts
    return isToday ? 'bg-green-600' : 'bg-green-500';
  };

  // Render shift cell content
  const renderShiftCell = (employeeId: string, dateInfo: WeekDate) => {
    const shift = getEmployeeShiftForDay(employeeId, dateInfo.dayName);
    const isTodayCell = isToday(dateInfo.fullDate);

    if (!shift) {
      return (
        <div className="h-full flex items-center justify-center">
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => toggleNewShiftModal(dateInfo)}
          >
            <Plus size={20} />
          </button>
        </div>
      );
    }
    if (shift.name === 'Unavailable') {
      return (
        <div className="bg-gray-200 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="flex flex-col items-center">
              <div className="text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 12 12 22 22 12 12 2z" />
                </svg>
              </div>
              <div className="text-gray-600">Unavailable</div>
            </div>
          </div>
        </div>
      );
    }

    const bgColor = getShiftColor(shift, isTodayCell);

    // Get role name from the shift's applies_to_roles array
    const roleDisplay =
      shift.applies_to_roles && shift.applies_to_roles.length > 0
        ? getRoleName(shift.applies_to_roles[0])
        : 'Staff';

    return (
      <div className={`${bgColor} h-full p-2 text-sm`}>
        <div className="text-white">
          <div>
            {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
          </div>
          <div>{roleDisplay}</div>
        </div>
      </div>
    );
  };

  // Calculate total hours for all employees
  const calculateTotalHours = (): number => {
    return filteredEmployees.reduce((total, employee) => {
      return total + calculateEmployeeTotalHours(employee.id);
    }, 0);
  };

  // Render employee avatar with fallback to initials
  const renderEmployeeAvatar = (employee: Employee) => {
    return (
      <div className="flex-shrink-0 h-10 w-10 relative">
        {employee.avatar ? (
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={employee.avatar}
            alt={`${employee.first_name} ${employee.last_name}`}
            onError={(e) => {
              // When image fails to load, show the initials div
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const initialsDiv = parent.querySelector('.initials-fallback');
                if (initialsDiv) {
                  (initialsDiv as HTMLElement).style.display = 'flex';
                }
              }
            }}
          />
        ) : null}

        {/* Fallback for when image is not available or fails to load */}
        <div
          className="initials-fallback h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium"
          style={{ display: employee.avatar ? 'none' : 'flex' }}
        >
          {employee.initials || employee.first_name.charAt(0)}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search
            placeholder="Search People"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            text="New Shift"
            icon={<Plus size={16} />}
            onClick={toggleNewShiftModal}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <PottaLoader />
        </div>
      ) : (
        <div className="bg-white border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-collapse">
            <thead className="bg-[#F3FBFB]">
              <tr>
                <th scope="col" className="px-6 py-4 w-8 border">
                  <input type="checkbox" className="h-4 w-4 text-blue-600" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider w-48 border"
                >
                  Employee
                </th>
                <th
                  scope="col"
                  className="px-2 pl-6 py-4 text-left text-sm font-medium text-gray-500 tracking-wider w-24 border"
                >
                  Total Hours
                </th>
                {weekDates.map((date) => (
                  <th
                    key={date.dayIndex}
                    scope="col"
                    className={`px-6 py-4 text-left text-sm font-medium ${
                      isToday(date.fullDate)
                        ? 'text-green-600 font-bold'
                        : 'text-gray-500'
                    } tracking-wider w-28 border`}
                  >
                    {date.day} {date.date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap border">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border">
                    <div className="flex items-center">
                      {renderEmployeeAvatar(employee)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border">
                    {formatHours(calculateEmployeeTotalHours(employee.id))}
                  </td>
                  {weekDates.map((date) => (
                    <td
                      key={`${employee.id}-${date.dayIndex}`}
                      className={`px-3 py-4 h-20 ${
                        isToday(date.fullDate) ? 'bg-green-50' : ''
                      } border`}
                    >
                      {renderShiftCell(employee.id, date)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-white">
                <td className="px-6 py-4 whitespace-nowrap border">
                  <div className="flex items-center justify-center">
                    {/* Chevron removed */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap border">
                  <div className="text-sm font-medium text-gray-900">Total</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border">
                  {formatHours(calculateTotalHours())}
                </td>
                {weekDates.map((date) => (
                  <td
                    key={`total-${date.dayIndex}`}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isToday(date.fullDate)
                        ? 'font-bold text-green-600'
                        : 'text-gray-500'
                    } border`}
                  >
                    {formatHours(calculateTotalDayHours(date.dayName))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Render the NewShiftModal when showNewShiftModal is true */}
      {showNewShiftModal && (
        <NewShiftModal
          onClose={toggleNewShiftModal}
          onSuccess={handleShiftCreated}
          roles={roles}
          isLoadingRoles={isLoadingRoles}
        />
      )}
    </div>
  );
};

export default ShiftView;
