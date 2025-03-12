'use client';
import React, { useContext, useState } from 'react';
import SaleInvoiceButons from './components/buttonSales';
import TableOPS from './components/table';
import { ContextData } from '@potta/components/context';
// import Calculator from "@/app/(routes)/calculator/page";
import OtherMethod from './components/otherPayment';

import ModalPrint from '../print/page';
import CashPayment from './components/cashPayment';
import Calculator from './components/calculator';
const SaleInvoiceTable = () => {
  const context = useContext(ContextData);
  const [selected, setSelected] = useState([]);
  return (
    <div className="w-full  h-[92.3vh] py-1 ">
      {context?.itemSelected == 'cart' && (
        <div className="h-[82vh] w-full pt-2 px-6 overflow-y-auto border-b">
         <div className=" flex -mt-2">
          <div className="bg-white mt-2 justify-center items-center border-y border-[#E5E7EB] border-l w-12 flex ">
            <i className="ri-search-line text-2xl"></i>
          </div>
          <input
            id="search-input"
            name="search"
            type="text"
            placeholder="Search Items"

            className={`w-full py-2 px-4 border border-gray-200 rounded-[2px] outline-none mt-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>
          <div className="w-full">
            <div className="h-full w-full  overflow-y-auto">
              <TableOPS />
            </div>
          </div>
        </div>
      )}

      {context?.itemSelected == 'calculate' && (
        <div className=" w-full h-[82vh] pt-10 px-3 overflow-y-auto border-b">
          <Calculator />
        </div>
      )}
      {context?.itemSelected == 'other' && (
        <div className="h-[82vh] w-full pt-10 px-3 overflow-y-auto border-b">
          <OtherMethod />
        </div>
      )}
      {context?.itemSelected == 'cash' && (
        <div className="h-[82vh] w-full pt-5 px-3 overflow-y-auto border-b">
          <CashPayment />
        </div>
      )}
      <div className="mt-2">
        <SaleInvoiceButons />
      </div>
    </div>
  );
};
export default SaleInvoiceTable;
