import React, { useState } from 'react'
import PottaContent from './components/potta'
import TribuContent from './components/tribu'
import AdsContent from './components/ads'
import TalkContent from './components/talk'

const ContentSidebar = () => {
    const [name, setName] = useState('talk')
    return (
        <div className='w-full min-w-[50vh]   my-5'>
            <div className='w-full border-b flex'>
                <div onClick={() => setName('talk')} className={`w-full h-14 cursor-pointer flex justify-center items-center ${name == 'talk' ? 'primary' : ''}`}>
                    <div className='flex space-x-3'>
                        <img src="/icons/talk.svg" alt="" />
                        <div>
                            <p>Talk</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => setName('ads')} className={`w-full h-14 cursor-pointer flex justify-center items-center ${name == 'ads' ? 'primary' : ''}`}>
                    <div className='flex space-x-3'>
                        <img src="/icons/instanvi.svg" alt="" />
                        <div>
                            <p>Ads</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => setName('potta')} className={`w-full h-14 cursor-pointer flex justify-center items-center ${name == 'potta' ? 'primary' : ''}`}>
                    <div className='flex space-x-3'>
                        <img src="/icons/potta.svg" alt="" />
                        <div>
                            <p>Potta</p>
                        </div>
                    </div>
                </div>
                <div onClick={() => setName('tribu')} className={`w-full h-14 cursor-pointer flex justify-center items-center ${name == 'tribu' ? 'primary' : ''}`}>
                    <div className='flex space-x-3'>
                        <img src="/icons/tribu.svg" alt="" />
                        <div>
                            <p>Tribu</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-[20vh] relative'>
                {
                    name == 'potta' ? <PottaContent /> :
                        name == 'tribu' ? <TribuContent /> :
                            name == 'ads' ? <AdsContent /> :
                                <TalkContent />
                }
            </div>
        </div>
    )
}
export default ContentSidebar