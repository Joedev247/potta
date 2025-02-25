'use client'
import React, { useContext, useState } from "react";
import SaleInvoiceButons from "./components/buttonSales";
import TableOPS from "./components/table";
import { ContextData } from "@potta/components/context";
// import Calculator from "@/app/(routes)/calculator/page";
import OtherMethod from "./components/otherPayment";
import CashPayment from "./components/cashPayment";
import ModalPrint from "../print/page";
const SaleInvoiceTable = () => {
    const context = useContext(ContextData)
    const [selected, setSelected] = useState([]);
    return (
        <div className="w-full border-l  h-[92.3vh] -mt-5">
            {context?.itemSelected == 'cart' && <div className="h-[81.1vh] w-full pt-2 px-3 overflow-y-auto border-b">
                <div className="w-full pt-2 mt-1 px-3 flex space-x-5 ">
                    <input type={"text"} name={""} className="py-1.5 border w-full pl-2 outline-none" placeholder="Search Items" />
                </div>
                <div className="w-full">
                    <div className="h-full w-full px-3 overflow-y-auto">
                        <TableOPS />
                    </div>

                    <div className="w-full mb-3 mt-3 px-3 flex justify-between">
                        <div className="flex space-x-3 ">
                            <input type="checkbox" className="h-5 w-5" />
                            <p className="font-thin -mt-1 text-md">Send SMS to Customers</p>
                        </div>
                        <div className="w-[30%] flex space-x-2">
                            <p className="">Other&nbsp;charges </p>
                            <input type="text" className="border pl-3 py-0.5 relative outline-none w-full" placeholder="0.00 XAF" />
                        </div>
                    </div>
                </div>
            </div>
            }

            {
                context?.itemSelected == "calculate" && <div className="h-[81.1vh] w-full pt-28 px-3 overflow-y-auto border-b">
                    {/* <Calculator /> */}
                </div>
            }
            {
                context?.itemSelected == "other" && <div className="h-[81.1vh] w-full pt-10 px-3 overflow-y-auto border-b"><OtherMethod /></div>
            }
            {
                context?.itemSelected == "cash" && <div className="h-[81.1vh] w-full pt-5 px-3 overflow-y-auto border-b"><CashPayment /></div>
            }
            <div className="mt-5">
                <SaleInvoiceButons />
            </div>
        </div>
    )
}
export default SaleInvoiceTable
