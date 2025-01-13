'use client'
import React, { useState } from 'react';
import Input from '@/components/input';
import CustomSelect from '@/components/react-select';
import Slider from '@/components/slideover';
import { SingleValue } from 'react-select';
import Select from '@/components/select';

import Button from '@/components/button';
import Address from './address';

interface Cat {
    value: string;
    label: string;
}

const category: Cat[] = [
    {
        value: 'Office Stationary',
        label: 'Office Stationary',
    },
    {
        value: 'Travel Expenses',
        label: 'Travel Expenses',
    },
];

const SliderVendor = () => {
    const [selectedCategory, setSelectedCategory] = useState<Cat[] | null | any>(null);
    const [tabs, setTabs] = useState<string>('Address')

    const handleCategoryChange = (selected: SingleValue<Cat> | Cat[]) => {
        // If multi is true, the selected value is an array
        setSelectedCategory(selected as Cat[]);
    };

    return (
        <Slider edit={false} title={'New Vendor'} buttonText="vendor">
            <div className='relative h-[97%] w-full'>
                <div className='w-full grid grid-cols-2 gap-3'>
                    <div>
                        <Input type={'text'} label={'First Name'} name={'vendor_name'} />
                    </div>
                    <div>
                        <Input type={'text'} label={'Last Name'} name={'vendor_name'} />
                    </div>
                </div>
                <div className='w-full grid my-5 grid-cols-2 gap-3'>
                    <div>
                        <Input type={'text'} label={'Company Name'} name={'vendor_name'} />
                    </div>
                    <div>
                        <Input type={'text'} label={'Display Name'} name={'vendor_name'} />
                    </div>
                </div>
                <hr />
                <div className='mt-2'>
                    <h1>Contact Information </h1>
                    <div className='w-full grid mt-7 grid-cols-2 gap-3'>
                        <div>
                            <Input type={'number'} label={'Telephone Number'} name={'vendor_name'} />
                        </div>
                        <div>
                            <Input type={'text'} label={'Email'} name={'vendor_name'} />
                        </div>
                    </div>
                    <div className='w-full grid mt-4 grid-cols-2 gap-3'>
                        <div>
                            <Input type={'number'} label={'Mobile '} name={'vendor_name'} />
                        </div>
                        <div>
                            <Input type={'text'} label={'Fax'} name={'vendor_name'} />
                        </div>
                    </div>
                    <div className='w-full grid mt-4 grid-cols-1 space-y-4'>
                        <div>
                            <Input type={'text'} label={'Website'} name={'vendor_name'} />
                        </div>
                    </div>
                    <div className='w-full grid mt-4 grid-cols-2 gap-3'>
                        <div>
                            <Input type={'number'} label={'Opening Balance '} placeholder='00' name={''} />
                        </div>
                        <div>
                            <Input type={'text'} label={'As Of'} name={'vendor_name'} />
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <div className='flex w-fit bg-green-100  mt-7'>
                        <div onClick={() => setTabs('Address')} className={`px-4 py-2.5 duration-500 ease-out ease-in ${tabs == 'Address' && 'border-b  border-green-500 text-green-500 font-thin '} cursor-pointer `}>
                            <p>Address</p>
                        </div>
                        <div onClick={() => setTabs('Notes')} className={`px-4 py-2.5 duration-500 ease-out ease-in ${tabs == 'Notes' && 'border-b border-green-500 text-green-500 font-thin '} cursor-pointer `}>
                            <p>Notes</p>
                        </div>
                        <div onClick={() => setTabs('Attachment')} className={`px-4 py-2.5 duration-500 ease-out ease-in ${tabs == 'Attachment' && 'border-b border-green-500 text-green-500 font-thin '} cursor-pointer `}>
                            <p>Attachment </p>
                        </div>
                        <div onClick={() => setTabs('Tax')} className={`px-4 py-2.5 duration-500 ease-out ease-in ${tabs == 'Tax' && 'border-b border-green-500 text-green-500 font-thin '} cursor-pointer `}>
                            <p>Tax ID</p>
                        </div>
                    </div>
                    <div className='mt-5 duration-500 ease-in ease-out'>
                        {tabs == "Address" && <Address />}
                        {/* {tabs == "policies" && <Policies />}
                        {tabs == "info" && <Info />} */}
                    </div>
                </div>
                <div className='absolute bottom-0 right-0 m-5'>
                    <Button text={'Save Vendor'} type={'button'} />
                </div>
            </div>
        </Slider>
    );
};

export default SliderVendor;
