import CustomButton from '../../components/button/customButton'
import React, { useState } from 'react'
import BasicInformation from './components/basicInformation'
import Channels from './components/channels'

const NewApp = () => {
    const [channel, setChannel] = useState(false)
    return (
        <div className='w-full flex h-screen'>
            <div className='w-[45%] primary h-full'>

            </div>
            <div className='w-[55%] relative'>
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
                {!channel ? <BasicInformation /> : <Channels />}
                <div className='absolute bottom-0 right-0 m-5'>
                    <CustomButton value={'Proceed'} onclick={() => { setChannel(!channel) }} icon={'arrow-right'} />
                </div>
            </div>
        </div>
    )
}
export default NewApp