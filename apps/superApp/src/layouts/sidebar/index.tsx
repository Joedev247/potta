import React from 'react'
import ButtonIcon from './components'
import { useRouter } from 'next/navigation'

const SideBar = () => {
    const router = useRouter()
    return (
        <div className='h-screen primary p-2 relative w-full'>
            <div className='mt-2 ml-1'>
                <img src="/icons/dashboard-boxes.svg" alt="" />
            </div>
            <div className='mt-10 ml-0.5'>
                <ButtonIcon />
            </div>
            <div className='absolute bottom-0 flex justify-center'>
                <div className='flex space-y-3 flex-col'>
                    <div className='ml-0.5' onClick={() => router.push("/settings")}>
                        <img src="/icons/settings-outline.svg" height={24} width={24} alt="" />
                    </div>
                    <div>
                        <div className='h-7  w-7 bg-gray-600 mb-3 border rounded-full'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SideBar