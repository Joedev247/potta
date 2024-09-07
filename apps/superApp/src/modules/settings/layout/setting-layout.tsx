import React, { ReactNode, FC } from 'react'
import Tabs from '../components/tabs'
import Layout from 'apps/superApp/src/layouts'

interface Children {
  children: ReactNode
}

const SettingsLayout: FC<Children> = ({ children }) => {

  return (
    <Layout>
      <div className='flex w-full min-h-[93.5vh] gap-52'>
        <div className='w-[10rem] lg:w-[12%] 2xl:w-[10%] h-screen fixed pt-5 z-10 pl-[8%] md:pl-2 border-r-2 bg-white'>
          <Tabs />
        </div>
        <div className='w-[90%] px-2 md:px-0 ml-44 md:ml-40 xl:ml-44 2xl:ml-52 pt-7'>
          {children}
        </div>
      </div>
    </Layout>
  )
}
export default SettingsLayout