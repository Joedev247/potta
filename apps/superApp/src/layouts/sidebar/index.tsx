import React, { useState } from 'react'
import ButtonIcon from './components'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/20/solid'

const SideBar = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

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
          <div className='relative' onClick={() => setOpen(!open)}>
            <button className={`flex gap-1 absolute hover:bg-red-50 hover:text-red-500 cursor-pointer left-10 bottom-4 bg-white p-2 border ${!open ? "hidden" : ""}`}>
              <ArrowRightStartOnRectangleIcon width={20} height={20} /> <p>Logout</p>
            </button>
            <div className='w-[30px] h-[30px] 
                         mb-3 border rounded-full m-auto'
              style={{
                background: `url('/img/profile-pic.jpeg')`,
                backgroundSize: 'cover',
                backgroundRepeat: "no-repeat",
                transition: "border 0.3s ease",
                backgroundPosition: 'center center',
              }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SideBar