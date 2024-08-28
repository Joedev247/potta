import React, { useState } from 'react'
import PottaContent from './components/potta'
import TribuContent from './components/tribu'
import AdsContent from './components/ads'
import TalkContent from './components/talk'


type Props = {
    src: string
    text: string
    name: string
    onClick: () => void
}

const Tab: React.FC<Props> = ({ src, text, name, onClick }) => {
    return (
        <div onClick={onClick} className={`w-full h-12 cursor-pointer flex justify-center items-center hover:bg-gray-50 ${name == text.toLowerCase() ? 'primary' : ''}`}>
            <div className='flex space-x-2 px-2' >
                <img src={src} alt="" />
                <div>
                    <p className="capitalize">{text}</p>
                </div>
            </div>
        </div>

    )
}


const ContentSidebar = () => {
    const [name, setName] = useState('talk')
    return (
        <div className='w-full h-full'>
            <div className='w-full border-b flex gap-2 px-1'>

                <Tab name={name}
                    text='talk'
                    src="/icons/talk.svg"
                    onClick={() => setName('talk')}
                />

                <Tab name={name}
                    text='ads'
                    src="/icons/instanvi.svg"
                    onClick={() => setName('ads')}
                />

                <Tab name={name}
                    text='potta'
                    src="/icons/Potta.svg"
                    onClick={() => setName('potta')}
                />

                <Tab name={name}
                    text='tribu'
                    src="/icons/Tribu.svg"
                    onClick={() => setName('tribu')}
                />
            </div>
            <div className='min-h-[20vh] relative'>
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