import Search from '../../../components/inputs/search/normalSearch'

import Link from 'next/link'
import Select from 'react-select'
import React from 'react'
import { Industry } from '../../../Arrays/Business'
import TableTransaction from '../../../components/tables/Transactions/data'
import WalletModal from '../../../components/modals/walletModal'

const Wallet = () => {
    return (
        <div className=' '>
            <div className='w-fit flex '>
                <div className='w-auto h-auto py-5 px-20 border'>
                    <div className='text-center font-medium'>
                        <p className='font-semibold'>Wallet Balance</p>
                    </div>
                    <center>
                        <div className='flex space-x-4'>
                            <div><p className='text-[#479c2b] font-semibold text-3xl '>XAF 3,500,000</p></div>
                            <WalletModal />
                        </div>
                    </center>
                    <div className='text-center mt-2'><Link href={''} className='text-center'>View Transaction</Link></div>
                </div>
                <div className='w-auto h-auto py-4  px-24 border'>
                    <div className='text-center'>
                        <h3 className='text-3xl'>Potta Finances</h3>
                    </div>
                    <div className='flex justify-center'>
                        <div className='flex space-x-2 mt-3'>
                            <button className='py-0 px-4 text-white bg-green-700 text-2l'>Starter</button>
                            <p>18 days left</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-16'>
                <h2>Transaction</h2>
                <div className='flex justify-between'>
                    <div className='flex space-x-3 w-1/3'>
                        <div className='w-2/3'>
                            <Search onchange={() => { }} text={''} value={''} placeholder={''} />
                        </div>
                        <div className='w-1/3'>
                            <Select options={Industry} />
                        </div>
                    </div>
                    <button className='text-[#2280FF] bg-blue-100 flex space-x-1 px-4 py-2.5 '>Download report <img src="/icons/download.svg" className='h-6 w-6' alt="" /></button>
                </div>
                <div className='mt-8'>
                    <TableTransaction />
                </div>
            </div>
        </div>
    )
}
export default Wallet