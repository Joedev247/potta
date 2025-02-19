import React, { useContext } from "react";
import { ContextData } from "@potta/components/context";

const HoldOn = () => {
    const context = useContext(ContextData)
    const handleData = () => {

        const data = {
            id: `Client ${(context?.savedItems.length + 1)}`,
            datas: context?.data
        }
        context?.data.length > 0 && context?.setSavedItems((prev: any) => [...prev, data])
        context?.setData([])
    }
    return (
        <div onClick={handleData} className='m-5'>
            <img src="/icons/hold.svg" className='h-8 cursor-pointer w-14' alt="" />
        </div>
    )
}
export default HoldOn
