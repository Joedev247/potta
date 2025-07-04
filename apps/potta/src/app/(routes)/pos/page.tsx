'use client';
import React, { useContext } from 'react';
import SaleInvoiceTable from './component/saleInvoiceTable';
import SaleInvoiceCard from './component/saleInvoiceCard';

import { ContextData } from '@potta/components/context';
import Print from './component/print/page';
import RootLayout from '../layout';
import { Toaster } from 'sonner';
import HeldOrders from './component/footer';

const POS = () => {
  const context = useContext(ContextData);
  return (
    <RootLayout>
      <Toaster />
      <div className="pl-8 ">
        <div className="h-[92vh] flex  w-full">
          <div className="w-[60%]">
            <SaleInvoiceCard />
          </div>
          <div className="w-[40%]">
            <SaleInvoiceTable />
          </div>
        </div>
        <div className=" w-full h-[7vh] bg-[#005D1F] z-30 fixed bottom-0 ">
          <div className="">
            <HeldOrders />
          </div>
        </div>
      </div>
    </RootLayout>
  );
};
export default POS;
