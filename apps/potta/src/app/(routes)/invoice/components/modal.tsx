'use client'
import React, { FC, useState, useContext, Fragment } from "react";
import { ContextData } from "@/components/context";
import Modal from "@/components/modal";


const ModalInvoice: FC = () => {
    const context = useContext(ContextData);

    const [open, setOpen] = useState<boolean>(false);

    return (
        <Modal icon={<i className="ri-add-line"></i>} title="" text="Add New Budget" button="viewInvoice">
            <div className="px-8 my-5 pb-10">
                <div className="grid grid-cols-2 gap-10  ">
                    <div className="flex space-x-2">
                        <div>
                            <img src="/icons/invoice.svg" className="h-14 w-14" alt="" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Invoice Number:</p>
                            <p className="text-xs text-gray-500">A document issued by a seller to buyer which indicate the quantity and cost of the purchase  </p>
                        </div>
                    </div>
                    <div className="flex space-x-2  ">
                        <div>
                            <img src="/icons/budget.svg" className="h-10 w-10" alt="" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Budget:</p>
                            <p className="text-xs text-gray-500">Plan and allocate finance for future expenses  </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div>
                            <img src="/icons/invoice.svg" className="h-12 w-12" alt="" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Proforma Invoice:</p>
                            <p className="text-xs text-gray-500">A Premilary bill of sale send in advance of shipment or delivery of goods </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div>
                            <img src="/icons/prepaireinvoice.svg" className="h-10 w-10" alt="" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Prepayment invoicement:</p>
                            <p className="text-xs text-gray-500">Record advancement payment </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div>
                            <img src="/icons/purchase.svg" className="h-14 w-14" alt="" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Purchase Order:</p>
                            <p className="text-xs text-gray-500">Create a purchase order for a seller indicating proposed goods an services price and quality </p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <div>
                            <img src="/icons/creditnote.svg" className="h-10 w-10" alt="" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Credit Note:</p>
                            <p className="text-xs text-gray-500">Issue Credit against future purchase </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalInvoice;