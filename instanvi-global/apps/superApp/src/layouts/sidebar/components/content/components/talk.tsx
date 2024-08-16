import Link from 'next/link'
import React from 'react'

const TalkContent = () => {
    return (
        <div className='px-3 space-y-4 mt-5 relative  flex-cols'>
            <div>
                <Link href={''}>Calls</Link>
            </div>
            <div>
                <Link href={''}>Chat</Link>
            </div>
            <div>
                <Link href={''}>Call Flow</Link>
            </div>
            <div>
                <Link href={''}>Report</Link>
            </div>
        </div>
    )
}
export default TalkContent