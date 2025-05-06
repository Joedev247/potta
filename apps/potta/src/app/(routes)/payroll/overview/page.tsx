'use client';
import React from 'react';
import Boxes from './components/boxes';
import PayBreakDown from './components/payBreakdown';
import PayrollTable from './components/table';
import RootLayout from '../../layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const Overview = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <div className="px-14">
          <div className="mt-5 flex space-x-8">
            <div className="w-[50%]">
              <Boxes />
            </div>
            <div className="w-[50%]">
              <PayBreakDown />
            </div>
          </div>
          {/* search here  */}

          <PayrollTable />
        </div>
      </RootLayout>
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  );
};

export default Overview;
