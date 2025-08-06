'use client';
import React, { useContext } from 'react';
import RootLayout from '../layout';
import { ContextData } from '@potta/components/context';
import DashboardCollection from '../dashboard/components/collection';

const AccountReceivablesDashboard = () => {
  const context = useContext(ContextData);
  return (
    <RootLayout>
      {/* <CustomerContent /> */}
      <div
        className={`${
          context?.layoutMode === 'sidebar' ? 'pl-12' : 'pl-5'
        } pr-5`}
      >
        <DashboardCollection />
      </div>
    </RootLayout>
  );
};
export default AccountReceivablesDashboard;
