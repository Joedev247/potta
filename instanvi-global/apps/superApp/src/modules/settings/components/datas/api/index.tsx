

import CustomButton from '../../button/customButton'
import CustomInput from '../../inputs/customInput'
import React from 'react'

const API = () => {
    return (
        <div className='w-[60%] md:px-16 mt-10 relative'>
            <div className='mt-5'>
                <label htmlFor="">Base Url</label>
                <CustomInput onchange={() => { }} text={'password'} value={''} placeholder={'https://baseurl.com/9876'} icon={'file-copy'} />
            </div>
            <div className='mt-5'>
                <label htmlFor="">API Keys</label>
                <CustomInput onchange={() => { }} text={'password'} value={''} placeholder={'djhghjdf55fklf457445555ffdf'} icon={'file-copy'} />
            </div>

        </div>
    )
}
export default API