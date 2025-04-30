'use client';

import React, { useState } from 'react';
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
  const { register, watch, setValue } = useFormContext();
  const programNeverEnds = watch('programNeverEnds') || false;
  const validDuringSpecificDays = watch('validDuringSpecificDays') || false;
  const [selectedDays, setSelectedDays] = useState<DaySchedule[]>([
    { day: 'Fridays', startTime: '11:50 AM', endTime: '05:30', allDay: false },
    { day: 'Saturdays', startTime: '11:50 AM', endTime: '10:30', allDay: true }
  ]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  
  // Date state for date pickers
  const startDate = watch('programStartsDatetime') || undefined;
  const endDate = watch('programEndsDatetime') || undefined;

  const addDaySchedule = () => {
    if (!selectedDay || selectedDays.some(schedule => schedule.day === selectedDay)) return;
    
    setSelectedDays([
      ...selectedDays,
      { day: selectedDay, startTime: '09:00 AM', endTime: '05:00 PM', allDay: false }
    ]);
    setSelectedDay('');
  };

  const removeDaySchedule = (day: string) => {
    setSelectedDays(selectedDays.filter(schedule => schedule.day !== day));
  };

  const updateDaySchedule = (index: number, field: keyof DaySchedule, value: string | boolean) => {
    const updatedSchedules = [...selectedDays];
    updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };
    setSelectedDays(updatedSchedules);
  };

  const toggleAllDay = (index: number) => {
    const updatedSchedules = [...selectedDays];
    updatedSchedules[index] = { 
      ...updatedSchedules[index], 
      allDay: !updatedSchedules[index].allDay 
    };
    setSelectedDays(updatedSchedules);
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
                  {startDate ? format(startDate, "PPP") : "1- 15 - 2025"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => setValue('programStartsDatetime', date)}
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
                    {endDate && !programNeverEnds ? format(endDate, "PPP") : "never"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => setValue('programEndsDatetime', date)}
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
                onClick={() => setValue('programNeverEnds', !programNeverEnds)}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${programNeverEnds ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </div>
              <input
                type="checkbox"
                {...register('programNeverEnds')}
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
              onClick={() => setValue('validDuringSpecificDays', !validDuringSpecificDays)}
            >
              {validDuringSpecificDays && <Check className="h-4 w-4 text-white" />}
            </div>
            <input
              type="checkbox"
              {...register('validDuringSpecificDays')}
              className="hidden"
            />
            <label className="ml-2 text-sm text-gray-700 cursor-pointer" onClick={() => setValue('validDuringSpecificDays', !validDuringSpecificDays)}>
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