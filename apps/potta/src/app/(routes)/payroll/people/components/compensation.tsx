'use client'
import Input from '@/components/input'
import Select from '@/components/select'
import react, { useState } from 'react'

const Compensation = () => {
    const [state, setState] = useState("")
    return (
        <div className='w-full pt-10 px-14'>
            <div className='w-full'>
                <Input type={'text'} placeholder={'Monthly'} name={''} label='Compensation Schedule' />
            </div>
            <div className='mt-5 grid grid-cols-2 gap-2'>
                <div>
                    <p>Hourly Rate</p>
                    <div className='flex w-full'>
                        <div className='w-[80%]'>
                            <Input type={'number'} placeholder={'0'} name={''} />
                        </div>
                        <div className=' mt-2 w-[20%]'>
                            <Select options={[{ label: "XAF", value: "XAF" }]} selectedValue={'XAF'} onChange={() => { }} bg={''} />
                        </div>
                    </div>
                </div>
                <div >
                    <Input type={'number'} placeholder={'90,000'} label='Base Pay' name={''} />
                </div>
            </div>
            <div className='my-7 flex space-x-10'>
                <div className='flex space-x-2'>
                    <input type="checkbox" className='text-[18px]' name='tips' id='tips' />
                    <label htmlFor="tips" className='text-[18px]'  >Eligible for Tips</label>
                </div>
                <div className='flex space-x-2'>
                    <input type="checkbox" name='Overtime' className='text-[18px]' id='Overtime' />
                    <label htmlFor="Overtime" className='text-[18px]' >Eligible for Overtime</label>
                </div>
            </div>
            <div className='my-5'>
                <p className='text-xl font-medium'>Paid Time off (PTO)</p>
                <div className="grid mt-5 grid-cols-3 gap-4">
                    <div className=''>
                        <p className='mb-2'>Rate Type</p>
                        <Select options={[{ label: "XAF", value: "XAF" }]} selectedValue={'XAF'} onChange={() => { }} bg={''} />
                    </div>
                    <div>
                        <div className='w-full'>
                            <p>Hourly Rate</p>
                            <div className='flex w-full'>
                                <div className='w-[80%]'>
                                    <Input type={'number'} placeholder={'0'} name={''} />
                                </div>
                                <div className='mt-2 w-[20%]'>
                                    <Select options={[{ label: "XAF", value: "XAF" }]} selectedValue={'XAF'} onChange={() => { }} bg={''} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <p className='mb-2'>Frequency</p>
                        <Select options={[{ label: "Monthly", value: "Monthly" }]} selectedValue={'Monthly'} onChange={() => { }} bg={''} />
                    </div>
                </div>
            </div>
            <div className='mt-10'>
                <p className='text-xl font-medium'>Sick Time off (PTO)</p>
                <div className="grid mt-5 grid-cols-3 gap-4">
                    <div className=''>
                        <p className='mb-2'>Rate Type</p>
                        <Select options={[{ label: "XAF", value: "XAF" }]} selectedValue={'XAF'} onChange={() => { }} bg={''} />
                    </div>
                    <div>
                        <div className='w-full'>
                            <p>Hourly Rate</p>
                            <div className='flex w-full'>
                                <div className='w-[80%]'>
                                    <Input type={'number'} placeholder={'0'} name={''} />
                                </div>
                                <div className='mt-2 w-[20%]'>
                                    <Select options={[{ label: "XAF", value: "XAF" }]} selectedValue={'XAF'} onChange={() => { }} bg={''} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <p className='mb-2'>Frequency</p>
                        <Select options={[{ label: "Monthly", value: "Monthly" }]} selectedValue={'Monthly'} onChange={() => { }} bg={''} />
                    </div>
                </div>
            </div>
            <div className='mt-7'>
                <h4 className='text-xl mb-3 font-medium'>Time Tracking</h4>
                <p>Setup a tracking code for this team member, so they can clock in and out from the potta mobile app. Their time cards
                    submissions are visible form the admin panel</p>
                <div className='flex mt-3 space-x-20'>
                    <p>7</p>
                    <p>7</p>
                    <p>7</p>
                    <p>7</p>
                    <p>7</p>
                    <p className='text-green-500'>Generate Code</p>
                </div>
            </div>
        </div>
    )
}
export default Compensation