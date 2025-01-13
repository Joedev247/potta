'use client'
import Input from '@/components/input'
import Select from '@/components/select'
import react, { useState } from 'react'

const EmployeeTaxInformation = () => {
    const [state, setState] = useState("")
    return (
        <div className='w-full  pt-10 px-14'>
            <div className='w-full'>
                <Input type={'number'} placeholder={'0000000000'} name={''} label=' Tax Payer Number' />
            </div>
            <div className='w-full mt-5'>
                <Input type={'number'} placeholder={'000'} name={''} label=' Tax Exemption' />
            </div>
            <div className='mt-5 grid grid-cols-2 gap-2'>
                <div >
                    <Input type={'text'} placeholder={'John Doe'} label='Account Holder Name' name={''} />
                </div>
                <div >
                    <Input type={'number'} placeholder={'000000'} label='Routing Number' name={''} />
                </div>
            </div>
            <div className='mt-5 grid grid-cols-2 gap-2'>
                <div >
                    <Input type={'text'} placeholder={'Account Number'} label='Account Holder Name' name={''} />
                </div>
                <div >
                    <Input type={'number'} placeholder={'Confirm Account Number'} label='Routing Number' name={''} />
                </div>
            </div>
        </div>
    )
}
export default EmployeeTaxInformation