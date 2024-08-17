import { Input } from '@instanvi/ui-components'
import React from 'react'

const API = () => {
    return (
        <div className='w-[60%] md:px-16 mt-10 relative'>
            <div className='mt-5'>
                <label htmlFor="">Base Url</label>
                <Input
                    value={''}
                    placeholder={'https://baseurl.com/9876'}
                    onChange={() => { console.log("first") }}
                // icon={'file-copy'} 
                />
            </div>
            <div className='mt-5'>
                <label htmlFor="">API Keys</label>
                <Input onChange={() => { console.log("first") }} value={''} placeholder={'djhghjdf55fklf457445555ffdf'} />
            </div>
        </div>
    )
}
export default API