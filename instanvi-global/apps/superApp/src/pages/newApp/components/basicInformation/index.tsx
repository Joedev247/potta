import React from 'react'
import TextInput from '../../../../components/inputs/text';

const BasicInformation = () => {
    return (
        <div className='h-[80vh] w-full flex items-center'>
            <div className='w-full md:px-20 '>
                <div className='w-full'>
                    <label htmlFor="">Channel Name</label>
                    <TextInput onchange={() => { console.log("value") }} text={'text'} value={''} placeholder={'Instagram Account'} />
                </div>
            </div>
        </div>
    )
}
export default BasicInformation
