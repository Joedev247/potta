'use client'
import React, { useState } from 'react'
import RootLayout from '../layout'
import Frequent from './components/all_report'
import AllReport from './components/all_report'
import Search from '@potta/components/search'
import FinancialReports from './components/financial_report'


const Report = () => {
    const [tabs, setTabs] = useState<string>('frequent')
    const reports =[
        {title: 'Frequent Reports', component: <Frequent /> },
        { title: 'All Reports', component: <AllReport /> },
        // { title: 'Inventory Reports', component: <InventoryReport />},
        // { title: 'Customer Reports', component: <CustomerReport />},
        // { title: 'Vendor Reports', component: <VendorReport/>},
        // { title: 'Collection Reports', component: <CollectionReport/>},
        // { title: 'Disbursements', component: <DisbursementReport/>},
        // { title: 'Tax Reports', component: <TaxesReport/>},
        { title: 'Financial Reports', component: <FinancialReports/>}
        // { title: 'Expense Reports', component: <ExpenseReport/>}
    ]

    return (
        <RootLayout>
            <div className='px-14 py-5'>
                <div className='flex w-fit bg-[#F3FBFB]  mt-7'>
                    <div onClick={() => setTabs('frequent')} className={`px-4 py-2.5 text-gray-500 duration-500 ease-in-out ${tabs == 'frequent' && 'border-b  border-green-900 text-green-900 font-thin '} cursor-pointer `}>
                        <p>Frequent Reports</p>
                    </div>
                    <div onClick={() => setTabs('all')} className={`px-4 py-2.5 text-gray-500 duration-500 ease-in-out ${tabs == 'all' && 'border-b border-green-900 text-green-900 font-thin '} cursor-pointer `}>
                        <p>All Report</p>
                    </div>
                    <div onClick={() => setTabs('financial')} className={`px-4 text-gray-500 py-2.5 duration-500 ease-in-out ${tabs == 'financial' && 'border-b border-green-900 text-green-900 font-thin '} cursor-pointer `}>
                        <p>Financial</p>
                    </div>
                </div>

                <div className='w-96'>
                    <Search />
                </div>
                <div className='mt-5 duration-500 ease-in-out'>
                    {tabs == "frequent" && <Frequent />}
                    {tabs == "all" && <AllReport />}
                    {tabs == "financial" && <FinancialReports/>}
                    {/* {tabs == "policies" && <Policies />}
                        {tabs == "info" && <Info />} */}
                </div>
            </div>
        </RootLayout>
    )
}
export default Report
