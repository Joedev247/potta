'use client';
import React from 'react';
import RootLayout from '../../../layout';
import BudgetTable from './components/table';
import Filter from '../../components/filters';
import SingleBudget from './components/data';

const BudgetDetailsPage = () => {
  return (
    <RootLayout>
      <div className="pl-16 pr-5 mt-10">
        <SingleBudget />
        {/* filter */}
        <Filter />
        {/*  Table */}
        <BudgetTable />
      </div>
    </RootLayout>
  );
};

export default BudgetDetailsPage;
