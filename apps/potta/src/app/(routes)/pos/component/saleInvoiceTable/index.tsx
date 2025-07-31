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
    <div className="w-full h-[85vh] py-1 ">
      {context?.itemSelected == 'cart' && (
        <div className="h-[77vh] w-full pt-2 px-6 overflow-y-auto border-b ">
          <div className="w-full">
            <div className="h-full w-full  overflow-y-auto">
              <TableOPS />
            </div>
          </div>
        </div>
      )}

      {context?.itemSelected == 'calculate' && (
        <div className="w-full h-[77vh] pt-10 px-3 overflow-y-auto border-b">
          <Calculator />
        </div>
      )}
      {context?.itemSelected == 'other' && (
        <div className="h-[77vh] w-full pt-10 px-3 overflow-y-auto border-b">
          <OtherMethod />
        </div>
      )}
      {context?.itemSelected == 'cash' && (
        <div className="h-[77vh] w-full pt-5 px-3 overflow-y-auto border-b">
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
