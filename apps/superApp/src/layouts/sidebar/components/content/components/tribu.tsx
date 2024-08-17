import Link from 'next/link'
import React from 'react'

const TribuContent = () => {
    return (
        <div className='px-3 space-y-4 mt-5 relative  flex-cols'>
        <div>
            <Link href={''}>Campaign</Link>
        </div>
        <div>
            <Link href={''}>Creative</Link>
        </div>
        <div>
            <Link href={''}>Media Plan</Link>
        </div>
        <div>
            <Link href={''}>Report</Link>
        </div>
        <div>
            <Link href={''}>Persona</Link>
        </div>

    </div>
    )
}
export default TribuContent