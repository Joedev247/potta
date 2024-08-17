import { useState } from 'react'
import { Description, Field, Label, Switch } from '@headlessui/react'
import SWITCH from '../../../components/switch'


const FA = () => {

    return (
        <div className='w-[60%] relative'>


            <SWITCH label={'Enable 2FA'} description={'Enable two factor authentication'} name={''} value={''} />
        </div>
    )
}
export default FA


