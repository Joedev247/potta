import React from 'react'
import CustomLink from '../../custom-link'

const TalkContent = () => {
    return (
        <div className='px-1 space-y-2 mt-5 relative flex-cols'>
            <CustomLink href='' label='Calls' />
            <CustomLink href='' label='Chat' />
            <CustomLink href='' label='Call Flow' />
            <CustomLink href='' label='Report' />
        </div>
    )
}
export default TalkContent