'use client';
import React, { useState, useEffect } from 'react';
import Button from '@potta/components/button';
import Input from '@potta/components/input';
import SearchableSelect from '@potta/components/searchableSelect';
import { toast } from 'react-hot-toast';
import { X, Save, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { peopleApi } from '../../people/utils/api';
import axios from 'config/axios.config';
import CustomDatePicker from '@potta/components/customDatePicker';
import { CalendarDate } from '@internationalized/date';

interface NewShiftModalProps {
  onClose: () => void;
  onSuccess: () => void;
  roles?: { value: string; label: string }[];
  isLoadingRoles?: boolean;
  selectedDate?: any;
}

// Define the shift payload structure to match the API
interface ShiftPayload {
  name: string;
  start_time: string; // Format: "2025-04-20T08:00:00Z"
  end_time: string; // Format: "2025-04-20T16:00:00Z"
  employeeId: string;
  recurrence_pattern: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  break_minutes: number;
  applies_to_roles: string[];
}

const NewShiftModal: React.FC<NewShiftModalProps> = ({
  onClose,
  onSuccess,
  roles = [],
  isLoadingRoles = false,
}) => {
  // State for modal visibility to handle animations
  const [isVisible, setIsVisible] = useState(true);

  // Form state
  const [shiftName, setShiftName] = useState('Morning Shift');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [breakMinutes, setBreakMinutes] = useState('30');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedShift, setSelectedShift] = useState('morning');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedColor, setSelectedColor] = useState('#34A853');
  const [recurrence, setRecurrence] = useState({
    sunday: false,
    monday: true,
    tuesday: false,
    wednesday: false,
    thursday: true,
    friday: false,
    saturday: false,
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Available colors for UI display
  const colorOptions = [
    '#34A853', // Green (default)
    '#4CAF50', // Material Green
    '#8BC34A', // Light Green
    '#009688', // Teal
    '#00BCD4', // Cyan
    '#03A9F4', // Light Blue
    '#2196F3', // Blue
    '#3F51B5', // Indigo
  ];

  // Standard shifts
  const standardShifts = [
    { value: 'morning', label: 'Morning Shift' },
    { value: 'afternoon', label: 'Afternoon Shift ' },
    { value: 'night', label: 'Night Shift' },
    { value: 'unavailable', label: 'Unavailable' },
    { value: 'custom', label: 'Custom Hours' },
  ];

  // Set default roles when roles prop changes
  useEffect(() => {
    if (roles && roles.length > 0) {
      // Select the first role by default
      const defaultRoles = [roles[0].value];
      setSelectedRoles(defaultRoles);
    }
  }, [roles]);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees from API
  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const response = await peopleApi.filterPersons({
        page: 1,
        limit: 100,
        status: 'active',
      });
      if (response && response.data) {
        const employeeOptions = response.data.map((employee: any) => ({
          value: employee.id || employee._id || employee.uuid,
          label:
            `${employee.first_name || employee.firstName || ''} ${
              employee.last_name || employee.lastName || ''
            }`.trim() || 'Employee',
        }));
        setEmployees(employeeOptions);
        // If no employees were found, add a dummy employee for testing
        if (employeeOptions.length === 0) {
          setEmployees([
            {
              value: 'b89a5c1d-3cfb-4f7c-bf27-95a0c8dbca2e',
              label: 'John Doe',
            },
            { value: '2', label: 'Jane Smith' },
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
      // Add fallback employees for testing
      setEmployees([
        { value: 'b89a5c1d-3cfb-4f7c-bf27-95a0c8dbca2e', label: 'John Doe' },
        { value: '2', label: 'Jane Smith' },
      ]);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Handle smooth closing
  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 300); // Match this with the exit animation duration
  };

  // Handle standard shift selection
  const handleStandardShiftSelect = (shiftId: string) => {
    setSelectedShift(shiftId);
    // Set default times based on selected shift
    if (shiftId === 'morning') {
      setStartTime('08:00');
      setEndTime('16:00');
      setShiftName('Morning Shift');
    } else if (shiftId === 'afternoon') {
      setStartTime('14:00');
      setEndTime('22:00');
      setShiftName('Afternoon Shift');
    } else if (shiftId === 'night') {
      setStartTime('22:00');
      setEndTime('06:00');
      setShiftName('Night Shift');
    } else if (shiftId === 'unavailable') {
      setStartTime('00:00');
      setEndTime('00:00');
      setShiftName('Unavailable');
      setBreakMinutes('0');
    }
  };

  // Toggle recurrence day
  const toggleDay = (day: keyof typeof recurrence) => {
    setRecurrence((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Toggle role selection
  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  // Format time to match API format (ISO 8601 with timezone)
  const formatTimeForApi = (timeString: string, dateString: string) => {
    // Combine date and time into ISO format with Z for UTC timezone
    return `${dateString}T${timeString}:00Z`;
  };

  // Handle date change from CustomDatePicker
  const handleDateChange = (value: CalendarDate | null) => {
    if (value) {
      // Format date as YYYY-MM-DD
      const formattedDate = `${value.year}-${String(value.month).padStart(
        2,
        '0'
      )}-${String(value.day).padStart(2, '0')}`;

      setStartDate(formattedDate);
    }
  };

  // Parse string date to CalendarDate object for the DatePicker
  const getShiftDate = () => {
    try {
      if (startDate) {
        const [year, month, day] = startDate.split('-').map(Number);
        return new CalendarDate(year, month, day);
      }
      return null;
    } catch (error) {
      console.error('Invalid date format:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!shiftName.trim()) {
      toast.error('Shift name is required');
      return;
    }
    if (!startTime || !endTime) {
      toast.error('Please fill in all time fields');
      return;
    }
    if (!selectedEmployee && selectedShift !== 'unavailable') {
      toast.error('Please select an employee');
      return;
    }
    // Check if at least one day is selected
    if (!Object.values(recurrence).some((day) => day)) {
      toast.error('Please select at least one day for the shift');
      return;
    }
    // Check if at least one role is selected
    if (selectedRoles.length === 0) {
      toast.error('Please select at least one role');
      return;
    }

    try {
      setIsSubmitting(true);
      // Get the current date in YYYY-MM-DD format
      const currentDate = startDate;
      // Create shift object to match the API format
      const shiftData: ShiftPayload = {
        name: shiftName,
        start_time: formatTimeForApi(startTime, currentDate),
        end_time: formatTimeForApi(endTime, currentDate),
        employeeId: selectedEmployee,
        recurrence_pattern: recurrence,
        break_minutes: parseInt(breakMinutes),
        applies_to_roles: selectedRoles, // Use the roles selected by the user
      };
      // Log the payload
      console.log('Creating shift:', shiftData);
      // Call the API to create the shift
      try {
        await axios.post('/api/shifts', shiftData);
        toast.success('Shift added successfully!');
        setIsVisible(false);
        // Delay actual success callback to allow animation to complete
        setTimeout(() => {
          onSuccess();
        }, 300);
      } catch (apiError) {
        console.error('API error creating shift:', apiError);
        toast.error('Failed to add shift. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error creating shift:', error);
      toast.error('Failed to add shift');
      setIsSubmitting(false);
    }
  };

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSubmitting]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white w-full max-w-md h-screen overflow-y-auto shadow-lg"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the modal
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">Add Shift</h2>
              <button
                onClick={handleClose}
                className="p-2"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Form content */}
            <div className="">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Employee - Not required for Unavailable shifts */}
                {selectedShift !== 'unavailable' && (
                  <div className="px-6 pt-2">
                    <label className="block text-sm font-semibold mb-2">
                      Select Employee
                    </label>
                    <SearchableSelect
                      options={employees}
                      selectedValue={selectedEmployee}
                      onChange={(value) => setSelectedEmployee(value)}
                      placeholder={
                        isLoadingEmployees
                          ? 'Loading employees...'
                          : 'Select employee'
                      }
                      isDisabled={isLoadingEmployees || isSubmitting}
                    />
                  </div>
                )}
                <div className="px-6 pt-2">
                  <label className="block text-sm font-semibold mb-2">
                    Applies To Roles
                  </label>
                  {isLoadingRoles ? (
                    <div className="text-sm text-gray-500">
                      Loading roles...
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {roles.length > 0 ? (
                        roles.map((role) => (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => toggleRole(role.value)}
                            className={`px-3 py-1 text-sm transition-colors ${
                              selectedRoles.includes(role.value)
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                            disabled={isSubmitting}
                          >
                            {role.label}
                          </button>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">
                          No roles available
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Shift Name */}

                <div className="px-6 pt-2">
                  <label className="block text-sm font-semibold mb-2">
                    Shift Name
                  </label>
                  <Input
                    placeholder="Enter shift name"
                    value={shiftName}
                    onChange={(e) => setShiftName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                {/* Standard shifts */}
                <div className="px-6 pt-2">
                  <label className="block text-sm font-semibold mb-2">
                    Shift Type
                  </label>
                  <SearchableSelect
                    options={standardShifts}
                    selectedValue={selectedShift}
                    onChange={(value) => handleStandardShiftSelect(value)}
                    placeholder="Select a shift type"
                    isDisabled={isSubmitting}
                  />
                </div>

                {/* Date Selection - Using CustomDatePicker */}
                <div className="px-6 pt-2">
                  <CustomDatePicker
                    label="Shift Date"
                    placeholder="Select shift date"
                    value={getShiftDate()}
                    onChange={handleDateChange}
                    isRequired
                    isDisabled={isSubmitting}
                  />
                </div>
                <div className="px-6 pt-2">
                  <label className="block text-sm font-semibold mb-2">
                    Repeat on Days
                  </label>
                  <div className="flex justify-between">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                      const dayKey = [
                        'sunday',
                        'monday',
                        'tuesday',
                        'wednesday',
                        'thursday',
                        'friday',
                        'saturday',
                      ][index] as keyof typeof recurrence;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(dayKey)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            recurrence[dayKey]
                              ? 'bg-[#005D1F] text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                          disabled={isSubmitting}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="px-6 pt-2">
                    <label className="block text-sm font-semibold mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded-sm"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      disabled={isSubmitting || selectedShift === 'unavailable'}
                    />
                  </div>
                  <div className="px-6 pt-2">
                    <label className="block text-sm font-semibold mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="w-full p-2 border rounded-sm"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      disabled={isSubmitting || selectedShift === 'unavailable'}
                    />
                  </div>
                </div>
                {/* Break Duration - Not needed for Unavailable shifts */}
                {selectedShift !== 'unavailable' && (
                  <div className="px-6 pt-2">
                    <label className="block text-sm font-semibold mb-2">
                      Break Duration (minutes)
                    </label>
                    <Input
                      type="number"
                      name="break_minutes"
                      value={breakMinutes}
                      onchange={(e) => setBreakMinutes(e.target.value)}
                      min={0}
                      max={120}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                )}
                {/* Color Label (UI only) */}
                <div className="px-6 pt-2">
                  <label className="block text-sm font-semibold mb-2">
                    Shift Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-10 h-10 rounded-sm transition-all ${
                          selectedColor === color
                            ? 'ring-2 ring-offset-2 ring-blue-500'
                            : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        disabled={isSubmitting}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Color is used for display purposes only
                  </p>
                </div>
                {/* Recurrence Pattern */}

                {/* Applies To Roles */}

                {/* Action buttons - fixed at bottom */}
                <div className="pt-2 flex pb-2 justify-end sticky bottom-0 bg-white w-full mt-8">
                  <Button
                    text={isSubmitting ? 'Adding...' : 'Add Shift'}
                    type="submit"
                    disabled={isSubmitting}
                    icon={<Plus className="h-4 w-4" />}
                  />
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewShiftModal;
