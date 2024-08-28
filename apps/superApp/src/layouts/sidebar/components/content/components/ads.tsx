import React from 'react';
import CustomLink from '../../custom-link';

const AdsContent = () => {
    return (
        <div className='px-1 mt-5 relative grid items-start'>
            <CustomLink href='' label='Campaign' />
            <CustomLink href='' label='Creative' />
            <CustomLink href='' label='Media Plan' />
            <CustomLink href='' label='Report' />
            <CustomLink href='' label='Persona' />
        </div>
    );
};

export default AdsContent;