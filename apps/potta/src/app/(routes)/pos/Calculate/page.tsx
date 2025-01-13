import React from "react";
import SaleInvoiceTable from "../component/saleInvoiceTable";
import SaleInvoiceCard from "../component/saleInvoiceCard";
import POSFooter from "../component/footer";

const POS = () => {
    return (
        <div className=" ">
            <div className="h-[92vh] flex border space-x-2 p-4 w-full">
                <div className="w-[53%]">
                    <SaleInvoiceCard />
                </div>
                <div className="w-[47%]">
                    <SaleInvoiceTable />
                </div>
            </div>
            <div className=" w-full h-[8vh] bg-gray-50 z-30  bottom-0">
                <div className="p-3">
                    <POSFooter />
                </div>
            </div>
        </div>
    )
}
export default POS 