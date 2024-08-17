import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2'

import { Button } from "@instanvi/ui-components";
import Layout from "../../../modules/auth/components/layout";

const PhoneNumber = () => {
  const [phone, setPhone] = useState('');

  return (
    <Layout >
      <div className="h-screen w-full items-center flex justify-center">
        <div className="mx-auto max-w-5xl relative   px-4 sm:px-16 lg:px-32 w-full">
          <div className="w-full md:px-3">
            <div className="w-full  text-left">
              <h3 className="text-3xl">Enter Telephone Number</h3>
            </div>

            <div className="my-16 w-full">
              <PhoneInput
                country={'cm'}
                value={phone}
                inputClass=" "
                containerClass=" "
                countryCodeEditable
                onChange={phone => setPhone(phone)}
              />
            </div>
            <div className="w-full mt-8">
              <Button value={"Proceed"} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PhoneNumber