import React from 'react'
import ButtonIcon from './components'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const SideBar = () => {
  const router = useRouter()
  return (
    <div className='h-screen flex flex-col justify-between items-center primary p-2 w-full'>
      <div className='mt-2'>
        <div className="flex place-content-center rounded-md border-2 border-green-300 hover:bg-green-100 p-2"
          onClick={() => router.push("/")}
        >
          <Image src="/icons/dashboard.svg" width={20} height={20} alt="" />
        </div>
        <div className='mt-10 flex place-content-center rounded-md hover:bg-green-100 p-2'>
          <ButtonIcon />
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='flex space-y-3 flex-col'>
          <div className=' hover:bg-gray-200 rounded-full p-1.5' onClick={() => router.push("/settings")}>
            <Image src="/icons/settings-outline.svg" height={24} width={24} alt="" />
          </div>
          <div>
            <div className='w-[30px] h-[30px] 
                         mb-3 border rounded-full m-auto'
              style={{
                background: `url('/img/profile-pic.jpeg')`,
                backgroundPosition: 'center center',
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover'
              }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SideBar