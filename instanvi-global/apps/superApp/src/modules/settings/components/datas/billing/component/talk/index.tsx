import Airtime from '../../../components/tables/Airtime/data'
import Conversations from '../../../components/tables/Converstions/data'
import Email from '../../../components/tables/Email/data'
import Incomming_sms from '../../../components/tables/Incomming_sms/data'
import OutgoingSMS from '../../../components/tables/OutgoingSMS/data'
import USSD from '../../../components/tables/USSD/data'
import Voice from '../../../components/tables/Voice/data'
import Whatsapp from '../../../components/tables/Whatsapp/data'
import React from 'react'

const Talk = () => {
    return (
        <div className=' '>
            <div className='mt-2'>
                <h3 className='text-2xl mb-2'>Incoming SMS</h3>
                <Incomming_sms />
            </div>
            <div className='mt-16'>
                <h3 className='text-2xl mb-2'>Outgoing SMS</h3>
                <OutgoingSMS />
            </div>
            <div className='mt-16'>
                <h3 className='text-2xl mb-2'>Whatsapp</h3>
                <Whatsapp />
            </div>
            <div className='mt-16'>
                <h3 className='text-2xl mb-2'>Conversation</h3>
                <Conversations />
            </div>
            <div className='mt-16'>
                <h3 className='text-2xl mb-2'>Voice</h3>
                <Voice />
            </div>
            <div className='mt-16'>
                <h3 className='text-2xl mb-2'>USSD</h3>
                <USSD />
            </div>
            <div className='mt-16'>
                <h3 className='text-2xl mb-2'>Email</h3>
                <Email />
            </div>
            <div className='my-16'>
                <h3 className='text-2xl mb-2'>Airtime</h3>
                <Airtime />
            </div>
            <div className='mt-16'>
                &nbsp;
            </div>
        </div>
    )
}
export default Talk