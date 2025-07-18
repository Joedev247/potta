'use client';
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import RootLayout from '../../layout';
import Boxes from './components/boxes';
import TimesheetTable from './components/table';
import TimesheetView from './components/TimesheetView';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { toast } from 'react-hot-toast';
import Button from '@potta/components/button';
import DateNavigation from './components/DateNavigation';
import NewTimeEntryModal from './components/NewTimeEntryModal';
import { ContextData } from '@potta/components/context';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const Timesheet = () => {
  const context = React.useContext(ContextData);
  // State for filters
  const [cycleTab, setCycleTab] = useState('Daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  // State for modal forms
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  // Handle date range changes based on cycle tab
  useEffect(() => {
    const today = new Date(selectedDate);

    switch (cycleTab) {
      case 'Daily':
        setDateRange({ start: today, end: today });
        break;
      case 'Weekly':
        setDateRange({
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 }),
        });
        break;
      case 'Monthly':
        setDateRange({
          start: startOfMonth(today),
          end: endOfMonth(today),
        });
        break;
      case 'Quarterly':
        setDateRange({
          start: startOfQuarter(today),
          end: endOfQuarter(today),
        });
        break;
      case 'Yearly':
        setDateRange({
          start: startOfYear(today),
          end: endOfYear(today),
        });
        break;
    }
  }, [cycleTab, selectedDate]);

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <div className={`${context?.layoutMode === 'sidebar' ? 'px-14' : 'px-5'} pt-2`}>
          {/* Time cycle tabs and date navigation */}
          <DateNavigation
            cycleTab={cycleTab}
            setCycleTab={setCycleTab}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          {/* Summary boxes */}
          <Boxes dateRange={dateRange} />
          {/* Timesheet content */}
          <TimesheetView
            dateRange={dateRange}
            buttonClick={() => setShowNewEntryModal(true)}
          />
        </div>

        {/* Modal with smooth animation */}
        {showNewEntryModal && (
          <NewTimeEntryModal
            onClose={() => setShowNewEntryModal(false)}
            onSuccess={() => {
              setShowNewEntryModal(false);
            }}
          />
        )}
      </RootLayout>
    </QueryClientProvider>
  );
};

export default Timesheet;
