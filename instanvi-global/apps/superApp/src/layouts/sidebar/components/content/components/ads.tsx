import Link from 'next/link';
import React from 'react';

const AdsContent = () => {
    return (
        <div className='px-3 mt-5 relative flex flex-wrap flex-col items-start h-[20vh]'>
            <div className='w-auto mt-3 text-left'>
                <Link href={''}>Campaign</Link>
            </div>
            <div className='w-auto mt-3 text-left'>
                <Link href={''}>Creative</Link>
            </div>
            <div className='w-auto mt-3 text-left'>
                <Link href={''}>Media Plan</Link>
            </div>
            <div className='w-auto mt-3 text-left'>
                <Link href={''}>Report</Link>
            </div>
            <div className='w-auto mt-3 text-left'>
                <Link href={''}>Persona</Link>
            </div>
        </div>
    );
};

export default AdsContent;