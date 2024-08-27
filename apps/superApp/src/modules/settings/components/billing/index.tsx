import { ContextData } from '../../../contexts/verificationContext';
import React, { useContext, useState } from 'react'
import Talk from './component/talk';
import Polls from './component/polls';
import Ads from './component/ads';
import Potta from './component/potta';
import Wallet from './component/wallet';

const Billing = () => {
    const [active, setActive] = useState("Wallet")
    return (
        <div className='w-full md:px-16 mt-10'>
            <div className='w-fit flex'>
                <div onClick={() => { setActive('Wallet') }} className={`py-4 primary px-16 cursor-pointer ${active == 'Wallet' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
                    <p>Wallet</p>
                </div>
                <div onClick={() => { setActive('Talk') }} className={`py-4 primary px-16 cursor-pointer ${active == 'Talk' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
                    <p>Talk</p>
                </div>
                <div onClick={() => { setActive('Polls') }} className={`py-4 primary px-16 cursor-pointer ${active == 'Polls' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
                    <p>Polls</p>
                </div>
                <div onClick={() => { setActive('Ads') }} className={`py-4 primary px-16 cursor-pointer ${active == 'Ads' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
                    <p>Ads</p>
                </div>
                <div onClick={() => { setActive('Potta') }} className={`py-4 primary px-16 cursor-pointer ${active == 'Potta' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
                    <p>Potta</p>
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