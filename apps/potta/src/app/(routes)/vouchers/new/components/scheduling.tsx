'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Check, X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@potta/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@potta/components/shadcn/popover";
import { Button } from "@potta/components/shadcn/button";
import { cn } from "@potta/lib/utils";

interface SchedulingProps {
  // Add any props if needed
}

type DaySchedule = {
  day: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
};

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const Scheduling: React.FC<SchedulingProps> = () => {
  const { register, watch, setValue, getValues } = useFormContext();
  const programNeverEnds = watch('scheduling.neverEnds') || false;
  const validDuringSpecificDays = watch('scheduling.specificDaysOnly') || false;
  
  // Initialize selectedDays from form data or with default empty array
  const [selectedDays, setSelectedDays] = useState<DaySchedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  
  // Date state for date pickers
  const startDate = watch('scheduling.programStartDate') || undefined;
  const endDate = watch('scheduling.programEndDate') || undefined;

  // Initialize selectedDays from form data on component mount
  useEffect(() => {
    const formValidDays = getValues('scheduling.validDays') || [];
    if (formValidDays.length > 0) {
      setSelectedDays(formValidDays);
    }
  }, [getValues]);

  // Update form data whenever selectedDays changes
  useEffect(() => {
    setValue('scheduling.validDays', selectedDays);
  }, [selectedDays, setValue]);

  const addDaySchedule = () => {
    if (!selectedDay || selectedDays.some(schedule => schedule.day === selectedDay)) return;
    
    const newSchedule = { 
      day: selectedDay, 
      startTime: '09:00 AM', 
      endTime: '05:00 PM', 
      allDay: false 
    };
    
    // Update local state
    setSelectedDays([...selectedDays, newSchedule]);
    
    // Update form data
    const currentValidDays = getValues('scheduling.validDays') || [];
    setValue('scheduling.validDays', [...currentValidDays, newSchedule]);
    
    setSelectedDay('');
  };

  const removeDaySchedule = (day: string) => {
    const updatedDays = selectedDays.filter(schedule => schedule.day !== day);
    
    // Update local state
    setSelectedDays(updatedDays);
    
    // Update form data
    setValue('scheduling.validDays', updatedDays);
  };

  const updateDaySchedule = (index: number, field: keyof DaySchedule, value: string | boolean) => {
    const updatedSchedules = [...selectedDays];
    updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };
    
    // Update local state
    setSelectedDays(updatedSchedules);
    
    // Update form data
    setValue('scheduling.validDays', updatedSchedules);
  };

  const toggleAllDay = (index: number) => {
    const updatedSchedules = [...selectedDays];
    updatedSchedules[index] = { 
      ...updatedSchedules[index], 
      allDay: !updatedSchedules[index].allDay 
    };
    
    // Update local state
    setSelectedDays(updatedSchedules);
    
    // Update form data
    setValue('scheduling.validDays', updatedSchedules);
  };

  // Handle toggle for program never ends
  const handleProgramNeverEndsToggle = () => {
    const newValue = !programNeverEnds;
    setValue('scheduling.neverEnds', newValue);
    
    // If program never ends is true, clear the end date
    if (newValue) {
      setValue('scheduling.programEndDate', null);
    }
  };

  // Handle toggle for valid during specific days
  const handleValidDuringSpecificDaysToggle = () => {
    const newValue = !validDuringSpecificDays;
    setValue('scheduling.specificDaysOnly', newValue);
    
    // If specific days is false, clear the valid days
    if (!newValue) {
      setValue('scheduling.validDays', []);
      setSelectedDays([]);
    }
  };

  return (
    <div className="bg-white p-6">
      <h3 className="text-xl font-medium mb-8">Scheduling Settings</h3>

      <div className="space-y-8 w-3/5">
        {/* Program Start and End Date */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Starts Datetime
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border border-gray-300",
                    !startDate && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(new Date(startDate), "PPP") : "1- 15 - 2025"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate ? new Date(startDate) : undefined}
                  onSelect={(date) => setValue('scheduling.programStartDate', date ? date.toISOString() : null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Ends Datetime
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border border-gray-300",
                      !endDate && "text-gray-500",
                      programNeverEnds && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={programNeverEnds}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate && !programNeverEnds ? format(new Date(endDate), "PPP") : "never"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate ? new Date(endDate) : undefined}
                    onSelect={(date) => setValue('scheduling.programEndDate', date ? date.toISOString() : null)}
                    initialFocus
                    disabled={programNeverEnds}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center mt-8">
              <label className="mr-2 text-sm text-gray-700">Program Never ends</label>
              <div 
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${programNeverEnds ? 'bg-green-500' : 'bg-gray-200'}`}
                onClick={handleProgramNeverEndsToggle}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${programNeverEnds ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </div>
              <input
                type="checkbox"
                {...register('scheduling.neverEnds')}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Valid during specific days */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div 
              className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${validDuringSpecificDays ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
              onClick={handleValidDuringSpecificDaysToggle}
            >
              {validDuringSpecificDays && <Check className="h-4 w-4 text-white" />}
            </div>
            <input
              type="checkbox"
              {...register('scheduling.specificDaysOnly')}
              className="hidden"
            />
            <label className="ml-2 text-sm text-gray-700 cursor-pointer" onClick={handleValidDuringSpecificDaysToggle}>
              Valid during specific days
            </label>
          </div>

          {validDuringSpecificDays && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="flex-1 border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">select day</option>
                  {daysOfWeek.filter(day => 
                    !selectedDays.some(schedule => schedule.day === day)
                  ).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addDaySchedule}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>

              {selectedDays.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-4 gap-4 py-2 border-b border-gray-200 font-medium">
                    <div>Day</div>
                    <div>Start Time</div>
                    <div>Ends</div>
                    <div>All Day</div>
                  </div>
                  
                  {selectedDays.map((schedule, index) => (
                    <div key={schedule.day} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 items-center">
                      <div>{schedule.day}</div>
                      <div>
                        <input
                          type="text"
                          value={schedule.startTime}
                          onChange={(e) => updateDaySchedule(index, 'startTime', e.target.value)}
                          disabled={schedule.allDay}
                          className={`w-full border border-gray-300 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${schedule.allDay ? 'bg-gray-100' : ''}`}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={schedule.endTime}
                          onChange={(e) => updateDaySchedule(index, 'endTime', e.target.value)}
                          disabled={schedule.allDay}
                          className={`w-full border border-gray-300 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${schedule.allDay ? 'bg-gray-100' : ''}`}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">All Day</span>
                          <div 
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${schedule.allDay ? 'bg-green-500' : 'bg-gray-200'}`}
                            onClick={() => toggleAllDay(index)}
                          >
                            <span 
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${schedule.allDay ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDaySchedule(schedule.day)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
