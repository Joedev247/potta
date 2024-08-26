/* eslint-disable @nx/enforce-module-boundaries */
import { FC } from 'react'
import * as yup from "yup"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Email from 'apps/superApp/src/components/inputs/email'
import USSD from 'apps/superApp/src/components/tables/USSD/data'
import Voice from 'apps/superApp/src/components/tables/Voice/data'
import Airtime from 'apps/superApp/src/components/tables/Airtime/data'
import Whatsapp from 'apps/superApp/src/components/tables/Whatsapp/data'
import OutgoingSMS from 'apps/superApp/src/components/tables/OutgoingSMS/data'
import Conversations from 'apps/superApp/src/components/tables/Converstions/data'
import IncommingSms from 'apps/superApp/src/components/tables/Incomming_sms/data'


const Talk: FC = () => {
    const emailSchema = yup.object({
        email: yup.string().email().required()
    })
    const methods = useForm<{ email: string }>({
        mode: "onChange",
        resolver: yupResolver(emailSchema),
    });

    const { register, reset, setValue, handleSubmit } = methods;
    const { errors } = methods.formState;

    return (
        <div className=' '>
            <div className='mt-2'>
                <h3 className='text-2xl mb-2'>Incoming SMS</h3>
                <IncommingSms />
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
                <Email register={register} errors={errors?.email} />
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