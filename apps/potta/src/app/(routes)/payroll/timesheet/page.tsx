'use client';
import React, { useState } from 'react';
import RootLayout from '../../layout';
import Boxes from './components/boxes';
import TimesheetTable from './components/table';

const Timesheet = () => {
  const [cycleTab, setCycleTab] = useState('Daily');
  const [selectedDate, setSelectedDate] = useState(11);

  const cycleTabs = [
    'Daily',
    'Weekly',
    'Monthly',
    'Quarterly',
    'Yearly',
    'Custom',
  ];
  const dates = Array.from({ length: 17 }, (_, i) => i + 1);

  return (
    <RootLayout>
      <div className="px-14 pt-10">
        <h1 className="text-2xl font-medium mb-6">Time sheet</h1>

        <div className="flex justify-between mb-8">
          {/* Cycle tabs */}
          <div className="bg-green-50 rounded-md flex">
            {cycleTabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setCycleTab(tab)}
                className={`px-6 py-3 cursor-pointer transition-all ${
                  cycleTab === tab
                    ? 'text-green-600 border-b-2 border-green-500 font-medium'
                    : 'text-gray-600'
                }`}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Date selector */}
          <div className="bg-green-50 rounded-md flex">
            {dates.map((date) => {
              const formattedDate = date < 10 ? `0${date}` : date;
              return (
                <div
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-all ${
                    selectedDate === date
                      ? 'bg-green-600 text-white rounded-full'
                      : 'text-gray-600'
                  }`}
                >
                  {formattedDate}
                </div>
              );
            })}
          </div>
        </div>

        <Boxes />
        <TimesheetTable />
      </div>
    </RootLayout>
  );
};

export default Timesheet;
