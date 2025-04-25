'use client';
import React from 'react';
import RootLayout from '../../layout';
import Search from '@potta/components/search';
import SliderSchedule from './components/sliderSchedule';

const ptoTypes = [
  { title: 'Paid Time off', value: '20hrs' },
  { title: 'Sick time off', value: '20hrs' },
  { title: 'Maternity leave', value: '3 Months' },
  { title: 'Birthday break', value: '20hrs' },
  { title: 'Paid Time off', value: '20hrs' },
  { title: 'Sick time off', value: '20hrs' },
  { title: 'Maternity leave', value: '3 Months' },
  { title: 'Birthday break', value: '20hrs' },
];

const Pto = () => {
  return (
    <RootLayout>
      <div className="px-14 py-8">
        <div className="flex justify-between items-center mb-8">
          {/* Search input */}
          <div className="relative w-96">
            <Search placeholder="Search timeslot name" />
          </div>

          <SliderSchedule />
        </div>

        {/* PTO cards grid */}
        <div className="grid grid-cols-4 gap-6">
          {ptoTypes.map((pto, index) => (
            <div
              key={index}
              className="border h-[200px] border-gray-200 rounded-md p-4 flex flex-col"
            >
              <p className="text-gray-700 mb-4">{pto.title}</p>
              <div className="h-full grid place-content-center">
                <p className="text-2xl font-semibold w-fit mx-auto">
                  {pto.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RootLayout>
  );
};

export default Pto;
