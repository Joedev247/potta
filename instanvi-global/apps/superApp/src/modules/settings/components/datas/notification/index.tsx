import SWITCH from '../../switch'
import React from 'react'
import { Orders } from '../../../Arrays/notifications'
import { Shipping } from '../../../Arrays/notifications'
import { Delivery } from '../../../Arrays/notifications'

const Notification = () => {
    return (
        <div className='mx-auto max-w-4xl  p-6 lg:px-8'>
            <div>
                <h3 className='text-xl mt-8 mb-3'>Orders</h3>
            </div>
            <div>
                {Orders.map((item: any, id: any) => {
                    return (
                        <div className='mt-4'>
                            <SWITCH
                                key={id}
                                label={item?.Label}
                                description={item?.description}
                                name={''}
                                value={''} />
                        </div>
                    )
                })}

            </div>

            <div>
                <h3 className='text-xl mt-10 mb-5'>Shipping</h3>
            </div>
            <div>
                {Shipping.map((item: any, id: any) => {
                    return (
                        <div className='mt-4'>
                            <SWITCH
                                key={id}
                                label={item?.Label}
                                description={item?.description}
                                name={''}
                                value={''} />
                        </div>
                    )
                })}

            </div>
            <div>
                <h3 className='text-xl mt-10 mb-5'>Local Delivery</h3>
            </div>
            <div>
                {Delivery.map((item: any, id: any) => {
                    return (
                        <div className='mt-4'>
                            <SWITCH
                                key={id}
                                label={item?.Label}
                                description={item?.description}
                                name={''}
                                value={''} />
                        </div>
                    )
                })}

            </div>

        </div>
    )
}
export default Notification