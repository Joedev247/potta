import React, { useState } from 'react'
import Link from 'next/link'
import Select from 'react-select'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { Button, Input, Search } from '@instanvi/ui-components'
import WalletModal from 'apps/superApp/src/components/modals/walletModal'
import TableTransaction from 'apps/superApp/src/components/tables/Transactions/data'


const Wallet = () => {
  const [openFilter, setOpenFilter] = useState(false)

  return (
    <div className=''>
      <div className='w-full lg:w-[70%] flex flex-col md:flex-row '>
        <div className='w-full h-auto py-5 px-2 border flex flex-col justify-center items-center'>
          <h6 className='text-xl'>Wallet Balance</h6>
          <center className='mt-2'>
            <div className='flex items-center space-x-4'>
              <p className='text-[#479c2b] font-semibold text-md xl:text-3xl'>XAF 3,500,000</p>
              <WalletModal />
            </div>
          </center>
          <div className='text-center mt-2'>
            <Link href={''} className='text-center text-[#479C2B] underline'>{"view transactions >"} </Link>
          </div>
        </div>
        <div className='w-full h-auto py-5 border text-center'>
          <h6 className='text-xl'>Potta Finances</h6>

          <div className='flex justify-center'>
            <div className='flex space-x-2 mt-3'>
              <button className='py-0 px-4 text-white bg-green-700 '>Starter</button>
              <p>18 days left</p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-16 mb-48'>
        <h2>Transaction</h2>
        <div className='flex justify-between'>
          <div className='w-1/2 grid grid-cols-1 md:grid-cols-3 gap-1'>
            <div className="col-span-2">
              <Search placeholder={'Search for team'} />
            </div>
            <div className='z-10 relative'>
              <button className={`border px-3 py-2 flex items-center justify-between hover:bg-gray-100 ${openFilter ? " text-green-500 font-semibold" : ""}`} onClick={() => setOpenFilter(!openFilter)}>
                <p>Filter</p> <ChevronDownIcon color='#ccc' width={20} height={20} />
              </button>
              <div className={`bg-white shadow-md absolute w-72 p-3 ${!openFilter ? "hidden" : ""}`}>
                <h5 className='text-center'>Filter Transactions</h5>
                <div className='grid gap-2 mt-2'>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type='date' name='from' label='From' />
                    <Input type='date' name='to' label='To' />
                  </div>
                  <div>
                    <label htmlFor="" className="capitalize font-semibold text-[0.75rem]">
                      Transaction Type
                    </label>
                    <Select className="select-input" options={[{ value: "payment", label: "Payment" }]} />
                  </div>
                  <div>
                    <label htmlFor="" className="capitalize font-semibold text-[0.75rem]">
                      Service
                    </label>
                    <Select className="select-input" options={[{ value: "billboard", label: "Billboard" }]} />
                  </div>
                  <div>
                    <label htmlFor="" className="capitalize font-semibold text-[0.75rem]">
                      Currency
                    </label>
                    <Select className="select-input" options={[{ value: "fcfa", label: "FCFA" }]} />
                  </div>
                  <Button value='Apply' />
                </div>
              </div>
            </div>
          </div>
          <button className='text-[#2280FF] bg-blue-100 flex space-x-1 px-4 py-2.5'>
            Download report
            <img src="/icons/download.svg" className='h-6 w-6' alt="" />
          </button>
        </div>
        <div className='mt-8'>
          <TableTransaction />
        </div>
      </div>
    </div>
  )
}
export default Wallet