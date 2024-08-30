import React, { useState } from 'react'
import Channels from './components/channels'
import { Button } from '@instanvi/ui-components'
import BasicInformation from './components/basicInformation'

const NewApp = () => {
  const [channel, setChannel] = useState(false)
  return (
    <div className='w-full flex min-h-screen relative'>
      <div className='w-[45%] primary flex-1 hidden md:block' />

      <div className='w-full md:w-[55%]'>
        <div className='p-14 flex space-x-16'>
          <div className='flex '>
            <div className={`h-8 w-8 flex justify-center items-center bg-blue-500 text-white rounded-full`}>
              <p>1</p>
            </div>
            <p className={`${channel ? '' : ''} mt-1.5  ml-2`}>Basic Information</p>
          </div>
          <div className='flex '>
            <div className={`h-8 w-8 flex justify-center items-center   rounded-full ${channel ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
              <p>2</p>
            </div>
            <p className={`${!channel ? 'text-gray-400 ' : ''} mt-1.5  ml-2`}>Channels</p>
          </div>
        </div>
        <div className='px-[5%] md:px-20'>
          {!channel ? <BasicInformation /> : <Channels />}
          <div className='flex justify-end absolute bottom-3 right-0 px-[5%] md:px-20'>
            <Button value={'Proceed'} onClick={() => { setChannel(!channel) }} icon={'arrow-right'} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default NewApp