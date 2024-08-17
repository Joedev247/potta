import React from 'react'
import Select from 'react-select';

import { Countries } from 'apps/superApp/src/Arrays/countries';
import CustomInputSelect from '../../../inputs/customInput/selectInputText';

const BankPayment = () => {
    return (
        <div>
            <div className='grid grid-cols-1 gap-3'>
                <div className='mt-5'>
                    <label htmlFor="">Select Payment Method</label>
                    <Select options={Countries} />
                </div>
                <div className='mt-8'>
                    <label htmlFor="">Recharge Amount</label>
                    <CustomInputSelect onchange={() => { console.log("first") }} text={''} value={''} placeholder={'3000'} icon={''} />
                </div>
            </div>
            <div className='mt-8'>
                <label htmlFor="">Select Bank</label>
                <Select options={Countries} />
            </div>
            <div className='mt-8 w-full'>
                <table className='w-full '>
                    <tr className='w-full'>
                        <td>Account Name</td>
                        <td className='flex justify-end'>INSTANVI LTD</td>
                    </tr>
                    <tr>
                        <td>Account Number</td>
                        <td className='flex justify-end'>02141455647</td>
                    </tr>
                    <tr>
                        <td>SWIFT Code</td>
                        <td className='flex justify-end'>0254</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}
export default BankPayment