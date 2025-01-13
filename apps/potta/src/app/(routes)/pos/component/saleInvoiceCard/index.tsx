'use client'
import Input from "@/components/input";
import React, { useState, useContext, useEffect } from "react";

import { ContextData } from "@/components/context";
// import { GetCatgerory } from "@/api/category/get";
// import { GetProduct } from "@/api/food/get";
// import { GetAddons } from "@/api/addons/get";




const SaleInvoiceCard = () => {
    const [selected, setSelected] = useState([]);
    const [id, setId] = useState([])

    const [datas, setDatas] = useState()
    const [menus, setMenu] = useState<any>()

    const context = useContext(ContextData)


    const addItem = (itemToAdd: any) => {
        context?.setData((prevData: any) => {
            const existingItem = prevData?.find((item: any) => item.id === itemToAdd.id);
            if (existingItem) {
                // Increment quantity if item already exists
                existingItem.quantity += 1;
                return [...prevData];
            } else {
                if (prevData?.length > 0)
                    return [...prevData, { ...itemToAdd }];
                else
                    return [{ ...itemToAdd }]
            }
        });
    };

    const handleActive = (name: any, id: any) => {
        setId(id)
    }

    return (
        <div className="w-full py-3 ">
            <div className="flex w-full px-3 space-x-2">
                <div className=" w-[50%]  ">
                    <input type={"text"} name={""} className="py-1.5 border w-full pl-2 outline-none" placeholder="Search Items" />
                </div>
                <div className="w-[50%] flex -mt-2">
                    <div className="h-[38px] mt-2 justify-center items-center border-y border-[#E5E7EB] border-l w-12 flex">
                        <i className="ri-barcode-line text-2xl"></i>
                    </div>
                    <Input type={"text"} placeholder="12&h4569k" height={true} name={""} />
                </div>
            </div>
            <div className="w-full my-2 py-2 border-y">
                <div className="flex ">
                    {selected.map((item: any) => {
                        return (
                            <button key={item.id} onClick={() => handleActive(item.name, item.id)} className={`${id == item.id ? 'bg-red-500' : 'bg-gray-500'} border py-1 text-sm  w-full rounded-2xl px-4  text-white mx-2 w-full`}>
                                <div className="w-full">{item.name}</div>
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className="mt-2 w-full ">
                <div className="w-full h-[60vh] p-3 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-3">
                        {selected.map((item: any, i: any) => {
                            if (id == item.id)
                                return (
                                    menus.map((items: any, id: number) => {
                                        if (item.name == items.category)
                                            return (
                                                <div key={id} onClick={() => addItem(items)} className="border cursor-pointer h-36 items-center flex justify-center relative w-full">
                                                    <img src={items.image} alt="" className="h-24 w-auto -mt-5" />
                                                    <p className="absolute bottom-0 mb-2 text-gray-500  font-thin">{items.name}</p>
                                                </div>
                                            )
                                    })
                                )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SaleInvoiceCard