'use client';
import React, { FC, ChangeEvent } from 'react';
import { useState, useContext } from 'react';
import Link from 'next/link';
import NewBudget from './component/modal';
import FilterComponent from './component/filterComponent';
import RootLayout from '../../layout';
import { ContextData } from '@potta/components/context';

interface Payout {
  id: number;
  budget_name: string;
  currency: string;
  budget_goal: number;
  amount_spent: number;
  amount_allocated: number;
  amount_available: number;
}

const Budgets: FC = () => {
  const context = useContext(ContextData);

  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>(
    context?.payouts
  );

  const handleSearchPayoutChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filteredResults = context?.payouts.filter((payout: Payout) =>
      payout.budget_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredPayouts(filteredResults);
  };

  const [dataIsSorted, setDataIsSorted] = useState<boolean>(false);

  const handleSortData = (isSorted: boolean) => {
    setDataIsSorted(isSorted);
    setFilteredPayouts(filteredPayouts.reverse());
  };

  return (
    <RootLayout>
      <div
        className={`${
          context?.layoutMode === 'sidebar' ? 'pl-16 !mt-4' : 'pl-5 !mt-4'
        } pr-5 mt-10`}
      >
        <div className="flex justify-between mt-10">
          <FilterComponent
            includeSearch={true}
            handleSearchChange={handleSearchPayoutChange}
            includeSort={true}
            activeSort={handleSortData}
            includeDatePicker={true}
            placeholder={''}
            includePopover={false}
            children={undefined}
          />

          <NewBudget />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8 gap-4">
          {filteredPayouts.map((payout: Payout) => (
            <Link
              key={payout.id}
              href={`/dashboard/payouts/budgetDetail/${payout.id}`}
            >
              <div className="flex flex-col border  py-4 px-4 cursor-pointer">
                <div className="flex justify-between px-3">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-semibold">
                      {payout.budget_name}
                    </h1>
                    <p className="text-xs">
                      Budget goal:{' '}
                      <span className="font-semibold">
                        {' '}
                        {payout.currency} {payout.budget_goal}
                      </span>
                    </p>
                  </div>
                  <div className="flex relative">
                    <div className="flex w-8 h-8 rounded-full border border-white bg-gray-200 absolute items-center justify-evenly text-sm font-semibold right-10"></div>
                    <div className="flex w-8 h-8 rounded-full border border-white bg-gray-200 absolute items-center justify-evenly text-sm font-semibold right-5"></div>
                    <div className="flex w-8 h-8 rounded-full border border-white bg-gray-200 absolute items-center justify-evenly text-sm font-semibold right-0">
                      +2
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-between bg-orange-500 h-2 rounded-full mt-5">
                  <div className="flex bg-orange-500"></div>
                  <div className="flex bg-[brown]"></div>
                  <div className="flex bg-green-300"></div>
                </div>
                <div className="flex justify-between px-3 mt-5">
                  <div className="flex gap-3 w-1/3">
                    <div className="flex w-3 h-3 mt-1.5 bg-orange-500 rounded-full"></div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-balse">Spent</p>
                      <p className="text-sm ">
                        {payout.currency} {payout.amount_spent}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 w-1/3">
                    <div className="flex w-3 h-3 mt-1.5 bg-green-300 rounded-full"></div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-balse">Allocated</p>
                      <p className="text-sm ">
                        {payout.currency} {payout.amount_allocated}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 w-1/3">
                    <div className="flex w-3 h-3 mt-1.5 bg-[brown] rounded-full"></div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-balse">Available</p>
                      <p className="text-sm ">
                        {payout.currency} {payout.amount_available}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div
          className={`p-4 w-full mt-8 flex justify-evenly items-center ${
            filteredPayouts.length < 1 ? '' : 'hidden'
          }`}
        >
          <h1 className="font-medium text-xl">Sorry, No data</h1>
        </div>
      </div>
    </RootLayout>
  );
};

export default Budgets;
