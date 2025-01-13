'use client'
import Input from '@/components/input'
import React, { useState } from 'react'
import { Switch } from '@headlessui/react'

const BaseInfo = () => {
    const [enabled, setEnabled] = useState(false)
    return (
        <div className='w-full pt-10 px-14 '>
            <div>
                <Input type={'text'} name={''} label='Employment Type' />
            </div>
            <div className='mt-6'>
                <Input type={'text'} name={''} label='Job Title' />
            </div>
            <div className='mt-6 grid grid-cols-2 gap-3'>
                <Input type={'text'} name={''} label='First Name' />
                <Input type={'text'} name={''} label='Last Name' />
            </div>
            <div>
                <div className='mt-6 grid grid-cols-2 gap-3'>
                    <div>
                        <div className='flex justify-between'>
                            <div>
                                <p>Telephone Number</p>
                            </div>
                            <div className='flex space-x-2'>
                                <p>Whatsapp No ? </p>
                                <Switch
                                    checked={enabled}
                                    onChange={setEnabled}
                                    className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
                                >
                                    <span className="sr-only">Use setting</span>
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                                    />
                                </Switch>
                            </div>
                        </div>
                        <Input type={'text'} name={''} label=' ' />
                    </div>

                    <div>
                        <Input type={'text'} name={''} label='Email Address' />
                    </div>
                </div>
            </div>
            <div className='w-1/2 mt-6'>
                <Input type={'date'} name={''} label='Birth Day' />
            </div>
            <div className='mt-6'>
                <Input type={'text'} name={''} label='National Identification Number' />
            </div>
            <div className='mt-6 grid grid-cols-2 gap-3'>
                <Input type={'text'} name={''} label='Employee ID' />
                <Input type={'text'} name={''} label='Employment Date' />
            </div>
        </div>
    )
}
export default BaseInfo 