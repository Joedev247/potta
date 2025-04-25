'use client'
import React, { useState } from 'react'
import Frequent from './components/all_report'
import AllReport from './components/all_report'
import RootLayout from '../../layout'
import Search from '@potta/components/search'


const report = () => {
    const [tabs, setTabs] = useState<string>('frequent')
    return (
        <RootLayout>
            <div className='px-14 py-5'>
                <div className='flex w-fit bg-green-100  mt-7'>
                    <div onClick={() => setTabs('frequent')} className={`px-4 py-2.5 duration-500 ease-out ease-in ${tabs == 'frequent' && 'border-b  border-green-500 text-green-500 font-thin '} cursor-pointer `}>
                        <p>Frequent Reports</p>
                    </div>
                    <div onClick={() => setTabs('all')} className={`px-4 py-2.5 duration-500 ease-out ease-in ${tabs == 'all' && 'border-b border-green-500 text-green-500 font-thin '} cursor-pointer `}>
                        <p>All Report</p>
                    </div>

                </div>

                <div className='w-96'>
                    <Search />
                </div>
                <div className='mt-5 duration-500 ease-in ease-out'>
                    {tabs == "frequent" && <Frequent />}
                    {tabs == "all" && <AllReport />}
                    {/* {tabs == "policies" && <Policies />}
                        {tabs == "info" && <Info />} */}
                </div>
            </div>
        </RootLayout>
    )
}
export default report 