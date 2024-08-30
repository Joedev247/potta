import React, { useState } from 'react'
import Select, { SingleValue } from 'react-select';

import { Input } from '@instanvi/ui-components';
import CustomInputSelect from '../../../inputs/customInput/selectInputText';

const methods = [
  { value: 'bank', label: 'Bank or Card' },
  { value: 'mobile', label: 'Mobile Payment' },
]

const banks = [
  { value: 'standard', label: 'Standard Bank' },
  { value: 'albaraka', label: 'Albaraka Bank' },
  { value: 'cib', label: 'CIB Bank' },
]

const BankPayment = () => {
  const [selectedMothod, setSeletedMethod] = useState("")

  const onPaymentChange = (event: SingleValue<{ value: string; label: string; }>) => {
    if (event?.value) setSeletedMethod(event?.value)
  }

  return (
    <div className='px-10 grid gap-5 mt-5'>
      <div>
        <label htmlFor="" className="capitalize font-semibold text-[0.75rem] mb-1">Select Payment Method</label>
        <Select options={methods} onChange={onPaymentChange} />
      </div>
      <div>
        <label htmlFor="" className="capitalize font-semibold text-[0.75rem] mb-1">Recharge Amount</label>
        <CustomInputSelect onchange={() => { console.log("first") }} text={''} value={''} placeholder={'3000'} icon={''} />
      </div>
      {
        selectedMothod === "mobile" ?
          <div>
            <Input name='phone' label='Enter Telephone' placeholder='672345556' />
          </div> : selectedMothod === "bank" ?
            <>
              <div>
                <label htmlFor="">Select Bank</label>
                <Select options={banks} />
              </div>
            </> : null}
      {selectedMothod !== "" && <div className=' w-full'>
        <table className='w-full '>
          <tr className='w-full'>
            <td>Account Name</td>
            <td className='flex justify-end'>
              <h4>INSTANVI LTD</h4>
            </td>
          </tr>
          <tr>
            <td>Account Number</td>
            <td className='flex justify-end'>
              <h4>02141455647</h4>
            </td>
          </tr>
          <tr>
            <td>SWIFT Code</td>
            <td className='flex justify-end'>
              <h4>0254</h4>
            </td>
          </tr>
        </table>
      </div>
      }
    </div>
  )
}
export default BankPayment