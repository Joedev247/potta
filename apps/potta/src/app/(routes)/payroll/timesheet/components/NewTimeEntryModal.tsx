'use client';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi, timesheetApi } from '../../utils/api';
import { toast } from 'react-hot-toast';
import Button from '@potta/components/button';
import Input from '@potta/components/input';
import { format } from 'date-fns';
import { X, Save, Clock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchableSelect, { Option } from '@potta/components/searchableSelect';

interface NewTimeEntryModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const NewTimeEntryModal: React.FC<NewTimeEntryModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  // State for modal visibility to handle animations
  const [isVisible, setIsVisible] = useState(true);

  const [newTimeEntry, setNewTimeEntry] = useState({
    employeeId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    check_in_time: '09:00',
    check_out_time: '17:00',
    break_minutes: 30,
  });

  // Fetch employees
  const { data: employeesResponse, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        const response = await employeeApi.filterEmployees({
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

  // Create employee options for dropdown
  const employeeOptions = React.useMemo(() => {
    if (!employeesResponse?.data) return [];

    return employeesResponse.data.map((employee) => ({
      value: employee.uuid,
      label: `${employee.firstName || ''} ${employee.lastName || ''}`,
    }));
  }, [employeesResponse]);

  // Create timesheet mutation
  const createTimesheetMutation = useMutation({
    mutationFn: async (data) => {
      return await timesheetApi.createTimesheet(data);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['timesheets']);

      // Handle success with animation
      toast.success('Time entry created successfully');
      setIsVisible(false);
      setTimeout(() => {
        onSuccess();
      }, 300);
    },
    onError: (error) => {
      console.error('Error creating timesheet:', error);
      toast.error('Failed to create time entry');
    },
  });

  // Handle smooth closing
  const handleClose = () => {
    setIsVisible(false);
    // Delay actual closing to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 300); // Match this with the exit animation duration
  };

  // Handle time entry form changes
  const handleTimeEntryChange = (field, value) => {
    setNewTimeEntry((prev) => ({ ...prev, [field]: value }));
  };

  // Create a new time entry
  const createTimeEntry = async () => {
    // Validate form
    if (
      !newTimeEntry.employeeId ||
      !newTimeEntry.date ||
      !newTimeEntry.check_in_time ||
      !newTimeEntry.check_out_time
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Format the payload according to the requirements
      const payload = {
        employeeId: newTimeEntry.employeeId,
        date: newTimeEntry.date,
        check_in_time: `${newTimeEntry.date}T${newTimeEntry.check_in_time}:00Z`,
        check_out_time: `${newTimeEntry.date}T${newTimeEntry.check_out_time}:00Z`,
        break_minutes: parseInt(newTimeEntry.break_minutes),
      };

      createTimesheetMutation.mutate(payload);
    } catch (error) {
      console.error('Error creating time entry:', error);
      toast.error('Failed to create time entry');
    }
  };

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && !createTimesheetMutation.isLoading) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [createTimesheetMutation.isLoading]);

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
            className="bg-white h-full w-full max-w-md shadow-xl overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">New Time Entry</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                disabled={createTimesheetMutation.isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form content */}
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <SearchableSelect
                    options={employeeOptions}
                    selectedValue={newTimeEntry.employeeId}
                    onChange={(value) =>
                      handleTimeEntryChange('employeeId', value)
                    }
                    placeholder={
                      isLoadingEmployees
                        ? 'Loading employees...'
                        : 'Select employee'
                    }
                    isDisabled={
                      isLoadingEmployees || createTimesheetMutation.isLoading
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={newTimeEntry.date}
                    onchange={(e) =>
                      handleTimeEntryChange('date', e.target.value)
                    }
                    disabled={createTimesheetMutation.isLoading}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Check In <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="time"
                      value={newTimeEntry.check_in_time}
                      onchange={(e) =>
                        handleTimeEntryChange('check_in_time', e.target.value)
                      }
                      disabled={createTimesheetMutation.isLoading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Check Out <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="time"
                      value={newTimeEntry.check_out_time}
                      onchange={(e) =>
                        handleTimeEntryChange('check_out_time', e.target.value)
                      }
                      disabled={createTimesheetMutation.isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Break (minutes)
                  </label>
                  <Input
                    type="number"
                    value={newTimeEntry.break_minutes.toString()}
                    onchange={(e) =>
                      handleTimeEntryChange(
                        'break_minutes',
                        parseInt(e.target.value)
                      )
                    }
                    disabled={createTimesheetMutation.isLoading}
                    min="0"
                    max="120"
                  />
                </div>

                {/* Optional notes field */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Notes
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Add any additional notes about this time entry"
                    disabled={createTimesheetMutation.isLoading}
                  ></textarea>
                </div>
              </div>

              {/* Action buttons - fixed at bottom */}
              <div className="mt-8 pt-4 border-t sticky bottom-0 bg-white">
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    text={
                      createTimesheetMutation.isLoading
                        ? 'Creating...'
                        : 'Create Entry'
                    }
                    onClick={createTimeEntry}
                    disabled={createTimesheetMutation.isLoading}
                    icon={<Save className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewTimeEntryModal;
