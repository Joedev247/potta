'use client';
import React from 'react';
import DeductionFilters from './components/filters';
import DeductionTable from './components/table';
import RootLayout from '../../layout';

const DeductionsPage = () => {
  return (
    <RootLayout>
      <div className="pl-10 pr-5">
        <div className="p-6">
          <DeductionFilters />
          <DeductionTable />
        </div>
      </div>
    </RootLayout>
  );
};

export default DeductionsPage;
