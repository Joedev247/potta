import React from 'react'
import { useRouter } from 'next/router'

type Props = {
  name: string
  uppercase?: boolean
}

const Tabs = () => {
  const { push, pathname } = useRouter()

  const MenuItem: React.FC<Props> = ({ name, uppercase }) => {
    return (
      <div className={`${pathname === `/settings/${name}` ? 'font-bold border-r-[3px] border-[#237804]  text-[#237804]' : ''} w-full flex items-center h-8 hover:text-[#237804]`}>
        <p
          onClick={() => push(`/settings/${name}`)}
          className={`text-left ml-1 md:ml-10 cursor-pointer ${uppercase ? "uppercase" : "capitalize"}`}>
          {name}
        </p>
      </div>
    )
  }

  //============ Component =================

  return (
    <div className='flex w-full h-full'>
      <div className='w-full h-full'>
        <MenuItem name='general' />
        <MenuItem name='team' />
        <MenuItem name='billing' />
        <MenuItem name='security' />
        <MenuItem name='api' uppercase />
        <MenuItem name='apps' />
        <MenuItem name='notification' />
        <MenuItem name='logs' />
      </div >
    </div >

  )
}
export default Tabs