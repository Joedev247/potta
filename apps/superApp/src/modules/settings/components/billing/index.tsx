import React, { useState } from 'react'
import Select from 'react-select';
import CountryList from 'country-list-with-dial-code-and-flag'
import { CountryInterface } from 'country-list-with-dial-code-and-flag/dist/types';

import Ads from './component/ads';
import Talk from './component/talk';
import Potta from './component/potta';
import Polls from './component/polls';
import Wallet from './component/wallet';

const Billing = () => {
    const [active, setActive] = useState("Wallet");

    const countries: CountryInterface[] = CountryList.getAll()

    const countryOption = countries?.map(country => {
        return { value: country.name, label: `${country.flag} ${country.name}` }
    })

    return (
        <div className='w-full md:px-16 mt-10'>
            <div className='w-full flex justify-between items-center'>
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
                <div className='w-full max-w-44 '>
                    <Select styles={{
                        control: () => ({
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            padding: "0.2rem .5rem",
                            // border: "1px solid #E5E7EB",
                            backgroundColor: "#F3FBFB",
                            transition: "border 0.3s ease",
                            "&:hover": {
                                // border: "1px solid #237804"
                            },
                            "&:focus": {
                                border: "1px solid #237804"
                            },
                        })
                    }} options={[{
                        value: "",
                        label: "Select Country"
                    }, ...countryOption]} />
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