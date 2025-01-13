import Button from '@/components/button'
import Input from '@/components/input'
import React from 'react'

const OtherMethod = () => {
    return (
        <div className='p-10'>
            <h3>Other Payment Methods</h3>
            <div className='h-[50vh] w-full flex items-center'>
                <div className='w-full'>
                    <Input label='Enter Reference' placeholder='514723541' type={'text'} name={''} />
                    <div className='w-full flex justify-end my-10'>
                        <div className='w-96 flex-col'>
                            <div className='w-full flex justify-between'>
                                <span className='font-thin'>Total</span>
                                <p className='font-semibold text-lg'>1200 XAF</p>
                            </div>
                            <div className='w-full mt-5'>
                                <Button width='full' text={'Complete'} type={'button'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default OtherMethod