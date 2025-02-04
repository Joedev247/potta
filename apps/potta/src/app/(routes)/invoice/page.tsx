import react from 'react'
import Box from './components/box'
import FilterComponent from '@/components/filter'
import Select from '@/components/select'
import Search from '@/components/search'
import Button from '@/components/button'
import InvoiceTableComponents from './components/table'

import SliderInvoice from './components/slideNewInvoice'
import Link from 'next/link'


const Invoice = () => {
    return (
        <div className='px-14 pt-10'>
            <Box />
            <div className='w-full flex justify-between'>
                <div className='mt-5 w-[50%] flex space-x-2'>
                    <div className='w-[65%]'>
                        <Search
                        />
                    </div>
                    <div className='w-[17%] mt-4'>
                        <Select options={[{ label: "Filter", value: "Filter" }]} selectedValue={'Filter'} onChange={undefined} bg={''} />
                    </div>
                    <div className='w-[17%] mt-4'>
                        <Select options={[{ label: "Filter", value: "Filter" }]} selectedValue={'Filter'} onChange={undefined} bg={''} />
                    </div>
                </div>
                <div className='w-[50%] flex justify-end'>
                    <div className='flex mt-10 space-x-2'>
                        <div>
                            <Link href={'/invoice/new_invoice'}><Button text={'Export'} icon={<i className="ri-upload-2-line"></i>} theme='lightBlue' type={'button'} /></Link>
                        </div>
                        <div>
                            <SliderInvoice />
                        </div>
                    </div>
                </div>
            </div>


            <div className='mt-5'>
                <InvoiceTableComponents />
            </div>
        </div >
    )
}

export default Invoice