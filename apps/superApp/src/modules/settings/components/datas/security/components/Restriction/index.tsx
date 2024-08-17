import TextInput from '../../../components/inputs/text'
import React from 'react'

const Restriction = () => {
    return (
        <div className='w-[60%] relative'>
            <div className=''>
                <label htmlFor="">Maximum weond Login Attemp</label>
                <TextInput onchange={() => { }} text={'number'} value={''} placeholder={'4'} />
            </div>
            <div className='mt-5'>
                <label htmlFor="">Force Password Change after</label>
                <TextInput onchange={() => { }} text={'text'} value={''} placeholder={'10 Days'} />
            </div>
            <div className='mt-5'>
                <label htmlFor="">Force Password Change after</label>
                <TextInput onchange={() => { }} text={'text'} value={''} placeholder={'127.01.25.36'} />
            </div>

            <div className='mt-5'>
                <div className='w-full border-b py-2'>
                    <h3 className='text-2xl '>IP Address</h3>
                </div>
                <div className='w-full flex justify-between border-b py-3 px-3'>
                    <span className='text-gray-600 font-thin'>192.0.66.178</span>
                    <div>
                        <i className="ri-close-circle-fill text-red-700 text-xl"></i>
                    </div>
                </div>
                <div className='w-full flex justify-between border-b py-3 px-3'>
                    <span className='text-gray-600 font-thin'>192.0.66.178</span>
                    <div>
                        <i className="ri-close-circle-fill text-red-700 text-xl"></i>
                    </div>
                </div>
                <div className='w-full flex justify-between border-b py-3 px-3'>
                    <span className='text-gray-600 font-thin'>192.0.66.178</span>
                    <div>
                        <i className="ri-close-circle-fill text-red-700 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Restriction