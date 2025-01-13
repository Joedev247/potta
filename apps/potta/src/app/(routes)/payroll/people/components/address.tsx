'use client'
import Input from '@/components/input'
import Select from '@/components/select'
import react, { useState } from 'react'

const Address = () => {
    const [state, setState] = useState("")

    return (
        <>
            <div className='w-full pt-10 px-14 '>

                <div className='mt-6'>
                    <Input type={'text'} name={''} label='Address' />
                </div>
                <div className='mt-6 grid grid-cols-2 gap-3'>
                    <Input type={'text'} name={''} label='City' />
                    <div className='mt-1'>
                        <p className='mb-1'>State</p>
                        <Select
                            options={[{ value: "Littoral", label: "Littoral" }]}

                            selectedValue={'Littoral'} onChange={() => { setState("") }} bg={''} />
                    </div>
                </div>
                <div className='mt-6 grid grid-cols-2 gap-3'>
                    <Input type={'number'} name={''} label='Postal Code' />
                    <div className='mt-1'>
                        <p className='mb-1'>Country</p>
                        <Select
                            options={[{ value: "Cameroon", label: "Cameroon" }]}
                            selectedValue={'Cameroon'} onChange={() => { setState("") }} bg={''} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Address