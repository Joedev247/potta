'use client'
import React, { useContext } from "react";
import SaleInvoiceTable from "./component/saleInvoiceTable";
import SaleInvoiceCard from "./component/saleInvoiceCard";
import POSFooter from "./component/footer";
import { ContextData } from '@/components/context'
import Print from "./component/print/page";
import RootLayout from "../layout";

const POS = () => {

    const context = useContext(ContextData);
    return (
        <RootLayout>
            <div className='pl-16 pr-5 mt-10'>
                <div className="h-[92vh] flex border space-x-2 p-4 w-full">
                    <div className="w-[45%]">
                        <SaleInvoiceCard />
                    </div>
                    <div className="w-[55%]">
                        {context?.toggle ?
                            <SaleInvoiceTable /> : <Print />
                        }

                    </div>
                </div>
                <div className=" w-full h-[8vh] bg-gray-50 z-30  bottom-0">
                    <div className="p-3">

                        <POSFooter />

                    </div>
                </div>
            </div>
        </RootLayout>
    )
}
export default POS 