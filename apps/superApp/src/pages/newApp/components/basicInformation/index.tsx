import React from 'react'
import { Input } from '@instanvi/ui-components';

const BasicInformation = () => {
  return (
    <div className='mt-[20%] flex items-center justify-center'>
      <Input label='Channel Name' name='channel' placeholder={'Instagram Account'} />
    </div>
  )
}
export default BasicInformation
