'use client';
import React, { useEffect, useState } from 'react';
import Chart from './dashboardChart';
import BalanceBox from './balanceBoxes';
import PieChart from '../../../charts/piechart';
interface Data {
  firstname: string;
  lastname: string;
  agentNumber: string;
  accountBalance: string;
  image: string;
}
interface expenses {
  name: string;
  prix: string;
}
const DashboardExpenses = () => {
  const [heights, setHeights] = useState<string>('');
  const [dashTopHeight, setDashTopHeight] = useState<string>('');

  useEffect(() => {
    setHeights(window.innerHeight.toString());
    setDashTopHeight(localStorage.getItem('dashTopHeight') || '');
  }, []);

  const ExpensesData: expenses[] = [
    {
      name: 'salaries',
      prix: '100,000',
    },
    {
      name: 'accomodation',
      prix: '125,000',
    },
    {
      name: 'fuel',
      prix: '310,000',
    },
    {
      name: 'cloud',
      prix: '120,000',
    },
    {
      name: 'stationary',
      prix: '90,000',
    },
  ];

  const datas: Data[] = [
    {
      firstname: 'MTN Mobile Money',
      lastname: 'Dumo',
      agentNumber: '5841',
      accountBalance: '350,200',
      image: '/icons/user.svg',
    },
    {
      firstname: 'Orange Orange Money',
      lastname: 'Dumo',
      agentNumber: '5841',
      accountBalance: '126,250',
      image: '/icons/user.svg',
    },
    {
      firstname: 'MTN Mobile Money',
      lastname: 'Dumo',
      agentNumber: '5841',
      accountBalance: '350,200',
      image: '/icons/user.svg',
    },
    {
      firstname: 'Orange Orange Money',
      lastname: 'Dumo',
      agentNumber: '5841',
      accountBalance: '126,250',
      image: '/icons/user.svg',
    },
    {
      firstname: 'MTN Mobile Money',
      lastname: 'Dumo',
      agentNumber: '5841',
      accountBalance: '350,200',
      image: '/icons/user.svg',
    },
    {
      firstname: 'Orange Orange Money',
      lastname: 'Dumo',
      agentNumber: '5841',
      accountBalance: '126,250',
      image: '/icons/user.svg',
    },
    {
      firstname: 'MTN Mobile Money',
      lastname: 'Dumo',
      agentNumber: '5841',
      accountBalance: '350,200',
      image: '/icons/user.svg',
    },
    //  More data...
  ];

  return (
    <div className="">
      <div
        style={{ height: parseInt(heights) - parseInt(dashTopHeight) - 20 }}
        className="pt-3"
      >
        <div className="flex flex-col grow h-full">
          <div>
            <BalanceBox />
          </div>
          <div className="w-full flex space-x-5">
            <div className="mt-5 w-[50%] w-full  py-2">
              <Chart />
            </div>
            <div className="w-[50%] mt-2">
              <div className="grid grid-cols-1 md:grid-cols-1 justify-between gap-4 mt-5 pb-5 grow">
                <div className="flex flex-col  border grow">
                  <div className="flex border-b items-center p-4">
                    <h1 className="text-[18px]">Total Expenses by person</h1>
                  </div>
                  <div className="flex flex-col px-4 gap-2 my-4">
                    {datas.map((data, index) => (
                      <div
                        key={index}
                        className="flex w-full border-b py-2 justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <img src={data.image} className="h-10 w-10" alt="" />
                          <div className="ml-4">
                            <div className="font-thin text-gray-900">
                              {data.firstname}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 mt-2">
                          <div className="  text-gray-900 flex justify-end">
                            CFA {data.accountBalance}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex space-x-5">
          <div className="w-[50%] border">
            <div className="w-full border-b py-3 bg-[#F3FBFB]">
              <h3>Expenses by Category</h3>
            </div>
            <div className="flex space-x-5 w-full px-2">
              <div className="my-5 w-[50%]">
                <PieChart />
              </div>
              <div className="w-[50%]">
                <div className="flex-1 flex-col w-full justify-between">
                  {ExpensesData.map((items, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-4 border-b w-full gap-2"
                    >
                      <div>{items.name}</div>
                      <div>{items.prix}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-[50%] border">
            <div className="w-full border-b py-3 bg-[#F3FBFB]">
              <h3>Expenses by Category</h3>
            </div>
            <div className="flex space-x-5 w-full px-2">
              <div className="my-5 w-[50%]">
                <PieChart />
              </div>
              <div className="w-[50%]">
                <div className="flex-1 flex-col w-full justify-between">
                  {ExpensesData.map((items, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-4 border-b w-full gap-2"
                    >
                      <div>{items.name}</div>
                      <div>{items.prix}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardExpenses;
