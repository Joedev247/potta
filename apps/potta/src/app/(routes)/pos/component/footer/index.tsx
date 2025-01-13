'use client'
import React, { useContext } from 'react'
import { ContextData } from '@/components/context'

const POSFooter = () => {
    const context = useContext(ContextData)
    const handleData = (data: any) => {
        context?.setData(data)
    }
    return (
        <div className='w-full flex  z-30 space-x-6 '>
            <div className='-mt-1.5'>
                <i className="ri-menu-line text-2xl text-gray-500"></i>
            </div>
            <div className='w-full flex space-x-4 '>
                {/* {context?.savedItems.map((items: any, id: number) => {
                    return (
                        <div key={id} onClick={() => handleData(items.datas)} className='h-6 flex relative cursor-pointer justify-center items-center border border-green-300 text-green-500 px-4'>
                            <p>{items.id}</p>
                            <div className='absolute z-30  right-0 top-0 -m-2 text-red-500'>
                                <i className="ri-close-circle-fill"></i>
                            </div>
                        </div>
                    )
                })} */}
            </div>
        </div>
    )
}
export default POSFooter