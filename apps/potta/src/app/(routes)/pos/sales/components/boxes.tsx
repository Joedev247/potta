import React, { FC } from 'react'

interface Datas {
    name: string,
    price: string;
    percentage: string;
}
const Data: Datas[] = [
    {
        name: "Gross Sale",
        price: "2000",
        percentage: "31%"
    }, {
        name: "Cash",
        price: "3500",
        percentage: "33%"
    }
    , {
        name: "Pending",
        price: "1700",
        percentage: "44%"
    }, {
        name: "Royal Points",
        price: "2500",
        percentage: "60%"
    }
]

const SaleBoxes: FC = () => {


    return (
        <div>
            <div className='grid grid-cols-4 gap-4 w-full'>
                {Data && Data.map((items: Datas, key: number) => {
                    return (
                        <div key={key} className='border w-full h-48 p-5'>
                            <div className='flex justify-between'>
                                <div>
                                    <p>{items.name}</p>
                                </div>
                                <div className='w-10 h-6 flex justify-center items-center bg-green-500 text-white rounded-full'>
                                    <p>{items.percentage}</p>
                                </div>
                            </div>
                            <div className='mt-12 w-full text-center'>
                                <h3 className='text-3xl'>XAF {items.price}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default SaleBoxes