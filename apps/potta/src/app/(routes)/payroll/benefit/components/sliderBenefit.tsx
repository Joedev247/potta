'use client'
import React, { useState } from 'react';

import Slider from '@/components/slideover';
import Select from '@/components/select';
import Input from '@/components/input';
import Button from '@/components/button';

const SliderBenefit = () => {

    return (
        <Slider edit={false} title={'New Vendor'} buttonText="vendor">
            <div className=''>
                <p className='my-4'>Benefit Type</p>
                <Select options={[{ label: "Federal", value: "Federal" }]} selectedValue={'Federal'} onChange={undefined} bg={''} />
            </div>
            <div className='mt-6'>
                <p className='my-4'>Category </p>
                <Select options={[{ label: "Retirement Benefit", value: "Retirement Benefit" }]} selectedValue={'Retirement Benefit'} onChange={undefined} bg={''} />
            </div>
            <div className='mt-6'>
                <p className='my-4'>Provider </p>
                <Select options={[{ label: "CNPS", value: "CNPS" }]} selectedValue={'CNPS'} onChange={undefined} bg={''} />
            </div>
            <div className='mt-6 grid grid-cols-3 gap-4'>
                <div className='mt-4'>
                    <p className='my-4'>Rate Type </p>
                    <Select options={[{ label: "Flat Rate", value: "Flat Rate" }]} selectedValue={'Flat Rate'} onChange={undefined} bg={''} />
                </div>
                <div className='mt-4'>
                    <div className='w-full flex '>
                        <div className='w-[60%] mt-6'>
                            <p>Rate</p>
                            <Input type={''} name={''} />
                        </div>
                        <div className='w-[40%] mt-14'>
                            <Select options={[{ label: "Monthly", value: "Monthly" }]} selectedValue={'Monthly'} onChange={undefined} bg={''} />
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <p className='my-4'>Frequency </p>
                    <Select options={[{ label: "Daily", value: "Daily" }]} selectedValue={'Daily'} onChange={undefined} bg={''} />
                </div>
            </div>
            <div className='mt-6 grid grid-cols-2 gap-4'>
                <div className=' '>
                    <Input type={'number'} label='Mximum Amount' name={''} />
                </div>
                <div className=' '>
                    <Input type={'date'} label='Bill As Of' name={''} />
                </div>
            </div>
            <div className='mt-6 '>
                <p>Description</p>
                <textarea className='p-3 w-full border outline-none' rows={7}></textarea>
            </div>
            <div className='mt-4 flex justify-end'>
                <Button text={"Add Benefits"} type={'submit'} />
            </div>
        </Slider>
    );
};

export default SliderBenefit;
