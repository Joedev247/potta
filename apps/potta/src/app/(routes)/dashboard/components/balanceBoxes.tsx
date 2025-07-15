import React from "react";


const BalanceBox = () => {
    return (
        <div className="w-full flex space-x-3">
            <div className="w-[50%]  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-4 mt-5">
                <div className="w-full ">
                    <div className="flex flex-col border  px-5 h xs:w-full grow">
                        <div className="flex justify-between mt-2">
                            <p className="  text-[17px]  ">Total Amount</p>
                            <i className="ri-arrow-right-up-line text-green-400"></i>
                        </div>
                        <div className="py-4">
                            <h1 className="text-3xl font-bold">CFA 9.650,00</h1>
                        </div>
                        <div className="flex justify-between">
                            <h1 className="text-md  ">325 Transactions</h1>
                            <h1 className="text-sm text-green-400">+10%</h1>
                        </div>
                    </div>
                </div>
                <div className="w-full">
                    <div className="flex flex-col border  px-5 h- xs:w-full grow">
                        <div className="flex justify-between mt-2">
                            <p className="text-[17px]">Transactions</p>
                            <i className="ri-arrow-left-down-line text-green-400"></i>
                        </div>
                        <div className="py-4">
                            <h1 className="text-3xl font-bold">CFA 9.650,00</h1>
                        </div>
                        <div className="flex justify-between">
                            <h1 className="text-md">325 Transactions</h1>
                            <h1 className="text-sm text-green-400">-2%</h1>
                        </div>
                    </div>
                </div>

            </div>
            <div className="h-[17vh] relative border w-[50%] mt-5">
                <div className="bg-[#F3FBFB] border-b px-5 flex items-center h-[25%] w-full">
                    <p className="font-medium text-lg mb-1">Up comming Payments</p>
                </div>
                <div className="grid grid-cols-3 h-[75%]    gap-0">
                    <div className="flex   justify-center w-full  items-center">
                        <div className="text-center mb-1">
                            <h3 className="text-lg">Overdue</h3>
                            <h1 className="text-[#154406] text-xl">XAF 8.6M</h1>
                            <p className="text-gray-400">29 Invoices</p>
                        </div>
                    </div>
                    <div className="flex border-l border-r   justify-center w-full h-full   items-center">
                        <div className="text-center  ">
                            <h3 className="text-lg">Due in 7 days</h3>
                            <h1 className="text-[#154406] text-xl">XAF 8.6M</h1>
                            <p className="text-gray-400">18 Invoices</p>
                        </div>
                    </div>
                    <div className="flex  justify-center w-full  items-center">
                        <div className="text-center mb-1">
                            <h3 className="text-lg">Overdue</h3>
                            <h1 className="text-[#154406] text-xl">XAF 8.6M</h1>
                            <p className="text-gray-400">29 Invoices</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BalanceBox