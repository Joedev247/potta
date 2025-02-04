import React, { FC, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { ContextData } from '@potta/components/context';
import SideMenu from '@potta/app/(routes)/dashboard/menu/sideMenu';
import DetailMenu from '@potta/app/(routes)/dashboard/menu/detailMenu';

interface Terminal {
  id: number;
  // Add other properties as needed
}

const PayoutBudgetDetails: FC = () => {
  const context = useContext(ContextData);
  const router = useRouter();
  const { asPath } = router;
  const [data, setData] = useState<Terminal | null>(null);
  const { id } = router.query;

  useEffect(() => {
    const str: string = asPath;
    const res: string[] = str.split('/');
    console.log('res', res);
    context?.setLinks(res[2]);
    console.log('id', id);
    if (id) {
      const terminal: Terminal | undefined = context?.terminals.find(
        (terminal: any) => terminal.id === parseInt(id as string)
      );
      if (terminal) {
        setData(terminal);
      }
    }
  }, [id, context?.terminals]);

  const [heights, setHeights] = useState<number>(0);
  const [dashTopHeight, setDashTopHeight] = useState<string>('');

  useEffect(() => {
    setHeights(window.innerHeight);
    setDashTopHeight(localStorage.getItem('dashTopHeight') || '');
  }, []);

  return (
    <div>
      <SideMenu />

      <DetailMenu
        title={`Payouts Details`}
        backLink={'/dashboard/payouts/'}
        id={''}
      >
        <div
          style={{ height: heights - parseInt(dashTopHeight) - 20 }}
          className="flex flex-col py-5"
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex flex-col border rounded-lg py-4 px-4 cursor-pointer w-full md:w-2/4">
              <div className="flex justify-between px-3">
                <div className="flex flex-col gap-2">
                  <h1 className="text-lg font-semibold">
                    Back to school budget allocation
                  </h1>
                  <p className="text-xs">
                    Budget goal:{' '}
                    <span className="font-semibold"> XAF 1,000,000</span>
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
                    <p className="text-sm ">XAF 1,000,000</p>
                  </div>
                </div>
                <div className="flex gap-3 w-1/3">
                  <div className="flex w-3 h-3 mt-1.5 bg-green-300 rounded-full"></div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-balse">Allocated</p>
                    <p className="text-sm ">XAF 1,000,000</p>
                  </div>
                </div>
                <div className="flex gap-3 w-1/3">
                  <div className="flex w-3 h-3 mt-1.5 bg-[brown] rounded-full"></div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-balse">Available</p>
                    <p className="text-sm ">XAF 1,000,000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 justify-between w-full md:w-2/4">
              <div className="flex border rounded-lg flex-col w-full h-full py-2.5 px-6">
                <div className="flex justify-between">
                  <h1>Cards</h1>
                  <i className="ri-add-circle-fill text-2xl text-green-800 cursor-pointer"></i>
                </div>
                <div className="flex grow justify-center items-center">
                  <h1 className="font-semibold text-5xl">9</h1>
                </div>
              </div>

              <div className="flex border rounded-lg flex-col w-full h-full py-2.5 px-6">
                <div className="flex justify-between">
                  <h1>Team</h1>
                  <i className="ri-add-circle-fill text-2xl text-green-800 cursor-pointer"></i>
                </div>
                <div className="flex flex-col grow gap-2">
                  <div className="flex gap-2 items-center">
                    <div className="w-5 h-5 rounded-full bg-gray-400"></div>
                    <h1 className="">Akoh paul</h1>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-5 h-5 rounded-full bg-gray-400"></div>
                    <h1 className="">Akoh paul</h1>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-5 h-5 rounded-full bg-gray-400"></div>
                    <h1 className="">Akoh paul</h1>
                  </div>
                </div>
                <div className="flex">
                  <span className="rounded-full px-4 items-center bg-gray-300">
                    +3 More
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <BudgetDetailTable /> */}
        </div>
      </DetailMenu>
    </div>
  );
};

export default PayoutBudgetDetails;
