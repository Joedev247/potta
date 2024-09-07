import React, { useState } from 'react'
import { Select } from "@instanvi/ui-components";

import Ads from './component/ads';
import Talk from './component/talk';
import Potta from './component/potta';
import Polls from './component/polls';
import Wallet from './component/wallet';
import { countryList } from "@instanvi/utilities";


const Billing = () => {
  const [active, setActive] = useState("Wallet");

  return (
    <div className='w-full md:px-16 mt-10'>
      <div className='w-full flex flex-col lg:flex-row justify-between items-center gap-2'>
        <div className='w-full lg:w-1/2 grid grid-cols-5'>
          <div onClick={() => { setActive('Wallet') }} className={`py-4 primary flex justify-center items-center cursor-pointer ${active == 'Wallet' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
            <p>Wallet</p>
          </div>
          <div onClick={() => { setActive('Talk') }} className={`py-4 primary flex justify-center items-center cursor-pointer ${active == 'Talk' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
            <p>Talk</p>
          </div>
          <div onClick={() => { setActive('Polls') }} className={`py-4 primary flex justify-center items-center cursor-pointer ${active == 'Polls' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
            <p>Polls</p>
          </div>
          <div onClick={() => { setActive('Ads') }} className={`py-4 primary flex justify-center items-center cursor-pointer ${active == 'Ads' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
            <p>Ads</p>
          </div>
          <div onClick={() => { setActive('Potta') }} className={`py-4 primary flex justify-center items-center cursor-pointer ${active == 'Potta' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
            <p>Potta</p>
          </div>
        </div>
        <div className='w-full lg:max-w-44'>
          <Select options={[{
            value: "",
            label: "Select Country"
          }, ...countryList]}
          />
        </div>
      </div>

      <div className='mt-10'>
        {
          active == 'Talk' ? <Talk /> : active == 'Polls' ? <Polls /> : active == 'Ads' ? <Ads /> : active == 'Potta' ? <Potta /> : <Wallet />
        }
      </div>
    </div>
  )
}
export default Billing