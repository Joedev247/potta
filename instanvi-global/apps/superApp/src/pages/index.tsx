import React from 'react'
import Image from 'next/image'
import Layout from '../layouts/index'

const HomeApp = () => {
  return (
    <Layout>
      <div className='mx-auto flex max-w-7xl items-center justify-between p-8 lg:px-8'>
        <div className='grid grid-cols-5  gap-5 w-full'>
          <div className='w-full flex cursor-pointer mt-20 justify-center primary   p-5 '>
            <div className='w-full'>
              <div className='my-10 flex justify-center h-[7vh]'>
                <Image src="/icons/talk.svg" height={80} width={80} alt="" />
              </div>
              <div className='w-full flex justify-center '>
                <p className='text-lg'>Talk</p>
              </div>
            </div>
          </div>
          <div className='w-full flex cursor-pointer mt-20 justify-center primary   p-5 '>
            <div className='w-full'>
              <div className='my-10 flex justify-center h-[7vh]'>
                <Image src="/icons/Tribu.svg" height={80} width={80} alt="" />
              </div>
              <div className='w-full flex justify-center '>
                <p className='text-lg'>Tribu</p>
              </div>
            </div>
          </div>
          <div className='w-full flex cursor-pointer mt-20 justify-center primary   p-5 '>
            <div className='w-full'>
              <div className='my-10 flex justify-center h-[7vh]'>
                <Image src="/icons/instanvi.svg" height={80} width={80} alt="" />
              </div>
              <div className='w-full flex justify-center '>
                <p className='text-lg'>Instanvi</p>
              </div>
            </div>
          </div>
          <div className='w-full flex cursor-pointer mt-20 justify-center primary   p-5 '>
            <div className='w-full'>
              <div className='my-10 flex justify-center h-[7vh]'>
                <Image src="/icons/Potta.svg" height={80} width={80} alt="" />
              </div>
              <div className='w-full flex justify-center '>
                <p className='text-lg'>Potta</p>
              </div>
            </div>
          </div>
          <div className='w-full flex cursor-pointer mt-20 justify-center primary   p-5 '>
            <div className='w-full'>
              <div className='my-10 flex justify-center h-[7vh]'>
                <Image src="/icons/talk.svg" height={80} width={80} alt="" />
              </div>
              <div className='w-full flex justify-center '>
                <p className='text-lg'>Talk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomeApp
