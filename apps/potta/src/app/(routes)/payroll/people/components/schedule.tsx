'use client';
import React, { useState, useEffect } from 'react';
import { SchedulePayload } from '../utils/types';
import Button from '@potta/components/button';
import { toast } from 'react-hot-toast';
import { peopleApi } from '../utils/api';
import CustomDatePicker from '@potta/components/customDatePicker';
import {
  CalendarDate,
  today,
  getLocalTimeZone,
  parseDate,
} from '@internationalized/date';

interface ScheduleProps {
  onChange?: (data: SchedulePayload) => void;
  initialData?: SchedulePayload | null;
  personId?: string;
  onComplete?: () => void;
}

// Define the pay schedule enum options
const PAY_SCHEDULE_OPTIONS = [
  'Weekly',
  'Biweekly',
  'Monthly',
  'Bimonthly',
  'Annually',
  'Quarterly',
  'Daily',
  'Hourly',
];

const Schedule: React.FC<ScheduleProps> = ({
  onChange,
  initialData,
  personId,
  onComplete,
}) => {
  const [formData, setFormData] = useState({
    firstPayDate: initialData?.firstPayDate || '',
    endPayDate: initialData?.endPayDate || '',
    payCycleName: initialData?.payCycleName || '',
  });

  // State for CalendarDate objects used by CustomDatePicker
  const [firstPayCalendarDate, setFirstPayCalendarDate] =
    useState<CalendarDate | null>(null);
  const [endPayCalendarDate, setEndPayCalendarDate] =
    useState<CalendarDate | null>(null);

  const [personData, setPersonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch person data when component mounts
  useEffect(() => {
    if (personId) {
      fetchPersonData();
    } else {
      setIsLoading(false); // If no personId, don't show loading state
    }
  }, [personId]);

  // Convert string date to CalendarDate
  const stringToCalendarDate = (dateString: string): CalendarDate | null => {
    if (!dateString) return null;
    try {
      return parseDate(dateString);
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return null;
    }
  };

  // Convert CalendarDate to string format
  const calendarDateToString = (date: CalendarDate | null): string => {
    if (!date) return '';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(
      date.day
    ).padStart(2, '0')}`;
  };

  // Calculate next pay date based on schedule and current date
  const calculateNextPayDate = (
    baseDate: Date,
    schedule: string,
    iteration: number = 0
  ): Date => {
    const nextDate = new Date(baseDate);

    switch (schedule) {
      case 'Weekly':
        nextDate.setDate(baseDate.getDate() + 7 * (iteration + 1));
        break;
      case 'Biweekly':
        nextDate.setDate(baseDate.getDate() + 14 * (iteration + 1));
        break;
      case 'Monthly':
        nextDate.setMonth(baseDate.getMonth() + (iteration + 1));
        break;
      case 'Bimonthly':
        // For bimonthly (twice a month), use 1st and 15th
        const currentDay = baseDate.getDate();
        if (currentDay < 15) {
          nextDate.setDate(15);
        } else {
          nextDate.setMonth(baseDate.getMonth() + 1);
          nextDate.setDate(1);
        }
        // Apply additional iterations
        if (iteration > 0) {
          const additionalMonths = Math.floor((iteration + 1) / 2);
          const additionalDays = (iteration + 1) % 2 === 0 ? 0 : 14;
          nextDate.setMonth(nextDate.getMonth() + additionalMonths);
          nextDate.setDate(nextDate.getDate() + additionalDays);
        }
        break;
      case 'Quarterly':
        nextDate.setMonth(baseDate.getMonth() + 3 * (iteration + 1));
        break;
      case 'Annually':
        nextDate.setFullYear(baseDate.getFullYear() + (iteration + 1));
        break;
      case 'Daily':
        nextDate.setDate(baseDate.getDate() + (iteration + 1));
        break;
      case 'Hourly':
        nextDate.setHours(baseDate.getHours() + 24 * (iteration + 1));
        break;
      default:
        // Default to monthly
        nextDate.setMonth(baseDate.getMonth() + (iteration + 1));
    }

    return nextDate;
  };

  // Get first pay date based on employee start date and compensation schedule
  const getInitialPayDate = (startDate: string, schedule: string): string => {
    if (!startDate) return '';

    try {
      const employmentDate = new Date(startDate);
      const currentDate = new Date();

      // If the employment date is in the future, use it as the first pay date
      if (employmentDate > currentDate) {
        return startDate;
      }

      // Calculate the next pay date based on the current date
      let payDate = new Date(currentDate);

      switch (schedule) {
        case 'Weekly':
          // Next Monday
          payDate.setDate(
            currentDate.getDate() + ((8 - currentDate.getDay()) % 7 || 7)
          );
          break;
        case 'Biweekly':
          // Next other Monday
          payDate.setDate(
            currentDate.getDate() + ((8 - currentDate.getDay()) % 7 || 7) + 7
          );
          break;
        case 'Monthly':
          // First day of next month
          payDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            1
          );
          break;
        case 'Bimonthly':
          // Either the 15th of this month or the 1st of next month
          if (currentDate.getDate() < 15) {
            payDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              15
            );
          } else {
            payDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              1
            );
          }
          break;
        case 'Quarterly':
          // First day of next quarter
          const currentQuarter = Math.floor(currentDate.getMonth() / 3);
          payDate = new Date(
            currentDate.getFullYear(),
            (currentQuarter + 1) * 3,
            1
          );
          break;
        case 'Annually':
          // First day of next year
          payDate = new Date(currentDate.getFullYear() + 1, 0, 1);
          break;
        case 'Daily':
          // Tomorrow
          payDate.setDate(currentDate.getDate() + 1);
          break;
        case 'Hourly':
          // Next hour
          payDate.setHours(currentDate.getHours() + 1);
          break;
        default:
          // Default to first of next month
          payDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            1
          );
      }

      return payDate.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error calculating initial pay date:', e);
      return '';
    }
  };

  const fetchPersonData = async () => {
    if (!personId) return;

    setIsLoading(true);
    try {
      const data = await peopleApi.getPerson(personId);
      setPersonData(data);
      console.log('Fetched person data for schedule:', data);

      // Initialize form data from person data if available
      if (data) {
        // Check if we have existing pay schedule data
        let firstPayDate = '';
        let endPayDate = '';

        if (data.pay_schedule && data.pay_schedule.first_pay_date) {
          firstPayDate = data.pay_schedule.first_pay_date;
          endPayDate = data.pay_schedule.end_date || '';
        } else {
          // Calculate first pay date based on start date and compensation schedule
          firstPayDate = getInitialPayDate(
            data.start_date,
            data.compensation_schedule
          );
        }

        setFormData((prev) => ({
          ...prev,
          firstPayDate: firstPayDate,
          endPayDate: endPayDate,
          payCycleName: data.compensation_schedule || prev.payCycleName,
        }));

        // Set calendar date objects
        setFirstPayCalendarDate(stringToCalendarDate(firstPayDate));
        setEndPayCalendarDate(stringToCalendarDate(endPayDate));
      }
    } catch (error) {
      console.error('Error fetching person data:', error);
      toast.error('Failed to load employee data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date changes from CustomDatePicker
  const handleFirstPayDateChange = (date: CalendarDate | null) => {
    const dateString = calendarDateToString(date);
    setFirstPayCalendarDate(date);
    setFormData((prev) => ({
      ...prev,
      firstPayDate: dateString,
    }));
    setHasChanges(true);

    // Notify parent of changes
    if (onChange) {
      onChange({
        ...formData,
        firstPayDate: dateString,
      });
    }
  };

  const handleEndPayDateChange = (date: CalendarDate | null) => {
    const dateString = calendarDateToString(date);
    setEndPayCalendarDate(date);
    setFormData((prev) => ({
      ...prev,
      endPayDate: dateString,
    }));
    setHasChanges(true);

    // Notify parent of changes
    if (onChange) {
      onChange({
        ...formData,
        endPayDate: dateString,
      });
    }
  };

  // Handle proceed button click
  const handleProceed = async () => {
    if (!formData.firstPayDate) {
      toast.error('Please select a first pay date');
      return;
    }

    // If an end date is specified, save the schedule data
    if (formData.endPayDate && hasChanges) {
      await handleSaveSchedule();
    } else {
      // If no end date or no changes, just proceed to the next step
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handleSaveSchedule = async () => {
    if (!personId) {
      toast.error('Cannot save schedule: Employee ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      // Format payload for API - only update the end_date as requested
      const payload = {
        pay_schedule: {
          first_pay_date: formData.firstPayDate,
          end_pay_date: formData.endPayDate,
          name: personData?.compensation_schedule || formData.payCycleName,
        },
      };

      await peopleApi.updatePerson(personId, payload);
      toast.success('Pay schedule saved successfully');
      setHasChanges(false);

      // Call onComplete to move to next step
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving pay schedule:', error);
      toast.error('Failed to save pay schedule');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a pay date has passed and needs to be updated
  const checkAndUpdatePayDates = () => {
    if (!formData.firstPayDate || !personData?.compensation_schedule) return;

    const currentDate = new Date();
    const firstPayDate = new Date(formData.firstPayDate);

    // If the first pay date has passed, calculate the next upcoming pay date
    if (firstPayDate < currentDate) {
      const schedule = personData.compensation_schedule;

      // Find how many pay periods have passed
      let nextPayDate = new Date(firstPayDate);
      let periodsElapsed = 0;

      while (nextPayDate < currentDate && periodsElapsed < 100) {
        // Limit to prevent infinite loops
        periodsElapsed++;
        nextPayDate = calculateNextPayDate(
          firstPayDate,
          schedule,
          periodsElapsed
        );
      }

      // Update the first pay date to the next upcoming pay date
      const updatedFirstPayDate = nextPayDate.toISOString().split('T')[0];

      if (updatedFirstPayDate !== formData.firstPayDate) {
        setFormData((prev) => ({
          ...prev,
          firstPayDate: updatedFirstPayDate,
        }));
        setFirstPayCalendarDate(stringToCalendarDate(updatedFirstPayDate));
        setHasChanges(true);

        console.log(
          `Updated first pay date from ${formData.firstPayDate} to ${updatedFirstPayDate}`
        );
      }
    }
  };

  // Check for passed pay dates when component mounts or when first pay date changes
  useEffect(() => {
    if (personData && formData.firstPayDate) {
      checkAndUpdatePayDates();
    }
  }, [personData, formData.firstPayDate]);

  // Generate sample pay periods based on compensation schedule
  const generatePayPeriods = () => {
    if (!formData.firstPayDate) return [];

    const schedule = personData?.compensation_schedule || formData.payCycleName;
    // Use the first pay date as the base date for calculations
    let baseDate;
    try {
      baseDate = new Date(formData.firstPayDate);
      if (isNaN(baseDate.getTime())) {
        baseDate = new Date(); // Fallback to current date if invalid
      }
    } catch (e) {
      console.error('Error parsing first pay date:', e);
      baseDate = new Date();
    }

    const periods = [];

    // Generate 3 sample pay periods based on the compensation schedule
    for (let i = 0; i < 3; i++) {
      let startDate: Date;
      let endDate: Date;
      let payDate: Date;

      if (i === 0) {
        // First period starts with the base date
        payDate = new Date(baseDate);

        // Calculate the start and end dates for this pay period
        switch (schedule) {
          case 'Weekly':
            startDate = new Date(payDate);
            startDate.setDate(payDate.getDate() - 7);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Biweekly':
            startDate = new Date(payDate);
            startDate.setDate(payDate.getDate() - 14);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Monthly':
            startDate = new Date(payDate);
            startDate.setMonth(payDate.getMonth() - 1);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Bimonthly':
            startDate = new Date(payDate);
            if (payDate.getDate() === 15) {
              startDate.setDate(1); // 1st of the same month
              endDate = new Date(payDate);
              endDate.setDate(14); // 14th of the same month
            } else {
              // Must be the 1st of a month
              startDate.setMonth(startDate.getMonth() - 1);
              startDate.setDate(15); // 15th of previous month
              endDate = new Date(payDate);
              endDate.setDate(payDate.getDate() - 1); // Last day of previous month
            }
            break;
          case 'Quarterly':
            startDate = new Date(payDate);
            startDate.setMonth(payDate.getMonth() - 3);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Annually':
            startDate = new Date(payDate);
            startDate.setFullYear(payDate.getFullYear() - 1);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Daily':
            startDate = new Date(payDate);
            startDate.setDate(payDate.getDate() - 1);
            endDate = startDate; // Same day for daily
            break;
          case 'Hourly':
            startDate = new Date(payDate);
            startDate.setHours(payDate.getHours() - 1);
            endDate = startDate; // Same hour for hourly
            break;
          default:
            // Default to monthly
            startDate = new Date(payDate);
            startDate.setMonth(payDate.getMonth() - 1);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
        }
      } else {
        // For subsequent periods, calculate based on the previous pay date
        const prevPayDate = periods[i - 1].payDateObj;

        payDate = calculateNextPayDate(prevPayDate, schedule);

        // Calculate the start and end dates for this pay period
        switch (schedule) {
          case 'Weekly':
            startDate = new Date(prevPayDate);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Biweekly':
            startDate = new Date(prevPayDate);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Monthly':
            startDate = new Date(prevPayDate);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Bimonthly':
            startDate = new Date(prevPayDate);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Quarterly':
            startDate = new Date(prevPayDate);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Annually':
            startDate = new Date(prevPayDate);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Daily':
            startDate = new Date(prevPayDate);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
            break;
          case 'Hourly':
            startDate = new Date(prevPayDate);
            endDate = new Date(payDate);
            endDate.setHours(payDate.getHours() - 1);
            break;
          default:
            // Default to monthly
            startDate = new Date(prevPayDate);
            endDate = new Date(payDate);
            endDate.setDate(payDate.getDate() - 1);
        }
      }

      // Format dates for display
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      };

      periods.push({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        payDate: formatDate(payDate),
        payDateObj: payDate, // Keep the Date object for calculations
      });
    }

    return periods;
  };

  const payPeriods = generatePayPeriods();

  return (
    <div className="w-full pt-10 px-14">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          <div className="">
            <div className="">
              <CustomDatePicker
                label="First Pay Date"
                placeholder="Select first pay date"
                value={firstPayCalendarDate}
                onChange={handleFirstPayDateChange}
                isRequired={true}
                yearRange={{ start: 2020, end: 2030 }}
              />
              <p className="text-xs text-gray-500 mt-1">
                The date when the employee will receive their next paycheck
              </p>
              {hasChanges && formData.firstPayDate && (
                <p className="text-xs text-blue-500 mt-1">
                  This date will automatically update when pay periods pass
                </p>
              )}
            </div>
            <div className="mt-8">
              <CustomDatePicker
                label="End Pay Date"
                placeholder="Select end pay date (optional)"
                value={endPayCalendarDate}
                onChange={handleEndPayDateChange}
                isRequired={false}
                yearRange={{ start: 2020, end: 2030 }}
              />
              <p className="text-xs text-gray-500 mt-1">
                The date when the employee will receive their last paycheck
                (leave empty if ongoing)
              </p>
            </div>
            <div className="mt-8">
              <div className="block mb-2 font-bold">Pay Cycle Name</div>
              <div className="p-5 py-[22px] border border-gray-300 rounded-[4px] bg-gray-50 text-gray-700">
                {personData?.compensation_schedule || 'Not set'}
              </div>
              {!PAY_SCHEDULE_OPTIONS.includes(
                personData?.compensation_schedule
              ) &&
                personData?.compensation_schedule && <></>}
            </div>

            <div className="mt-8">
              <Button
                text={isLoading ? 'Saving...' : 'Proceed'}
                type="button"
                onClick={handleProceed}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="">
            <h3 className="text-lg font-medium mb-4">Upcoming Pay Periods</h3>
            {payPeriods.length > 0 ? (
              payPeriods.map((period, index) => (
                <div
                  key={index}
                  className={`md:w-[90%] mt-5 first:mt-0 p-5 ${
                    index === 0 ? 'bg-[#F3FBFB] border ' : 'bg-[#F9F9F9]'
                  } flex w-full`}
                >
                  <div className="w-[70%] space-y-2">
                    <h3 className="text-lg font-medium">Pay Period</h3>
                    <p>
                      {period.startDate} - {period.endDate}
                    </p>
                  </div>
                  <div className="w-[30%] space-y-2">
                    <h3 className="text-lg font-medium">Pay Date</h3>
                    <p>{period.payDate}</p>
                    {index === 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        Next payment
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 bg-[#F9F9F9]">
                <p>
                  No pay periods available. Please set a valid first pay date
                  and compensation schedule.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
