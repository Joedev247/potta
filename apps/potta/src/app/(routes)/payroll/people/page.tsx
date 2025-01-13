'use client'
import Button from '@/components/button'
import React, { useState } from 'react'
import BaseInfo from './components/baseInfo'
import Address from './components/address'
import Compensation from './components/compensation'
import EmployeeTaxInformation from './components/employee_tax_information'
import DepositeAccount from './components/depositeAccount/page'
import Benefit from './components/benefit/page'
import Schedule from './components/schedule'
import RootLayout from '../../layout'

const People = () => {
    const [active, setActive] = useState('')
    return (
        <RootLayout>
            <div className='w-full flex px-14 '>
                <div className='w-[18%] pt-12 pr-10  item-right space-y-7 border-r h-[90vh]'>
                    <div className='' onClick={() => setActive("ebi")} >
                        <p className={`${active == "ebi" && 'text-green-700 font-semibold'} cursor-pointer text-right`}>Employee Base Information</p>
                    </div>
                    <div className='' onClick={() => setActive("el")}>
                        <p className={`${active == "el" && 'text-green-700 font-semibold'} cursor-pointer text-right`}>Employee Location</p>
                    </div>
                    <div className='' onClick={() => setActive("c")}>
                        <p className={`${active == "c" && 'text-green-700 font-semibold'} cursor-pointer text-right`}>Compensation</p>
                    </div>
                    <div className='' onClick={() => setActive("ps")}>
                        <p className={`${active == "ps" && 'text-green-700 font-semibold'} cursor-pointer text-right`}>Payroll Schedule </p>
                    </div>
                    <div className='' onClick={() => setActive("ssa")}>
                        <p className={`${active == "ssa" && 'text-green-700 font-semibold'} cursor-pointer text-right`}>Direct Deposite Account</p>
                    </div>
                    <div className='' onClick={() => setActive("bad")}>
                        <p className={`${active == "bad" && 'text-green-700 font-semibold'} cursor-pointer text-right`}>Benefit and Deduction</p>
                    </div>
                    <div className='' onClick={() => setActive("eti")}>
                        <p className={`${active == "eti" && 'text-green-700 font-semibold'} cursor-pointer text-right`}>Employee Tax Information</p>
                    </div>

                </div>
                <div className='w-[82%] pt-0 px-10 relative '>
                    {/*  */}
                    <div>
                        {active == "ebi" && <BaseInfo />}
                        {active == "el" && <Address />}
                        {active == "c" && <Compensation />}
                        {active == "ps" && <Schedule />}
                        {active == "ssa" && <DepositeAccount />}
                        {active == "bad" && <Benefit />}
                        {active == "eti" && <EmployeeTaxInformation />}
                    </div>
                    {/* <Address /> */}
                    {/* <Compensation /> */}
                    {/* <EmployeeTaxInformation /> */}
                    {/* <DepositeAccount /> */}
                    {/* <Schedule /> */}
                    {/* <Benefit /> */}
                    <div className='absolute bottom-0 right-0 px-4'>
                        <Button text={"Proceed"} type={'submit'} />
                    </div>
                </div>
            </div>
        </RootLayout>
    )
}
export default People 