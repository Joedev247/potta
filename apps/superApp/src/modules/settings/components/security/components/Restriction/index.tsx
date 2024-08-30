import React from 'react'
import { Input } from '@instanvi/ui-components'

const Restriction = () => {
    return (
        <div className='grid gap-4'>
            <Input
                name="max"
                placeholder="e.g 10"
                label="Maximum weond Login Attemp"
            />
            <Input
                name="max"
                placeholder="10 Days"
                label="Force Password Change after"
            />
            <div>
                <div className='w-full border-b py-2'>
                    <h3>IP Address</h3>
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