import React, { useState } from 'react'

import FA from './components/2FA'
import Restriction from './components/Restriction'
import UpdatePasword from './components/UpdatePassword'

const Security = () => {
  const [active, setActive] = useState("password")

  return (
    <div className='w-full lg:w-[65%] xl:w-[70%] 2xl:w-[50%] md:px-16 mt-5'>
      <div className='w-fit flex'>
        <div onClick={() => { setActive('password') }} className={`py-4 primary px-16 cursor-pointer ${active == 'password' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
          <p>Update Password</p>
        </div>
        <div onClick={() => { setActive('2fa') }} className={`py-4 primary px-16 cursor-pointer ${active == '2fa' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
          <p>2FA</p>
        </div>
        <div onClick={() => { setActive('restriction') }} className={`py-4 primary px-16 cursor-pointer ${active == 'restriction' ? 'border-b-2 border-green-400 text-green-400' : ''}`}>
          <p>Restriction</p>
        </div>
      </div>

      <div className='mt-10 mb-20 w-[90%]'>
        {
          active == '2fa' ? <FA />
            :
            active == 'restriction' ? <Restriction />
              :
              <UpdatePasword />
        }
      </div>
    </div>
  )
}
export default Security