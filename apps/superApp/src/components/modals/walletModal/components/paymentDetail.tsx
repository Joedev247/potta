import React from 'react'
import { Select } from "@instanvi/ui-components";
import TextInput from '../../../inputs/text';
import CustomInputSelect from '../../../inputs/customInput/selectInputText';
import { Countries } from '../../../../Arrays/countries';

const PaymentDetail = () => {
    return (
        <div>
            <div className='grid grid-cols-1 gap-3'>
                <div className='mt-5'>
                    <label htmlFor="">Select Payment Method</label>
                    <Select options={Countries} />
                </div>
                <div className='mt-8'>
                    <label htmlFor="">Recharge Amount</label>
                    <CustomInputSelect onchange={() => { console.log("first") }} text={''} value={''} placeholder={''} icon={''} />
                </div>
            </div>
            <div className='mt-8'>
                <label htmlFor="">Enter Telephone</label>
                <TextInput onchange={() => { console.log("first") }} text={'number'} value={''} placeholder={'Enter phone number'} />
            </div>
        </div>
    )
}
export default PaymentDetail