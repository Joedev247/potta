import React, { useContext, useState } from 'react'
import { ContextData } from 'apps/superApp/src/contexts/verificationContext'

const Tabs = () => {
  const context = useContext(ContextData)
  const [switched, setSwitched] = useState<string>('general')
  return (
    <div className='flex w-full  h-full '>
      <div className='w-full h-full border-r'>
        <div className={`${switched == 'general' ? ' border-r-2 border-[#237804] text-[#237804]' : ''} w-full mt-10`} >
          <p
            onClick={
              () => {
                setSwitched('general');
                context.setToggle?.('general')
              }}
            className='text-left ml-10 cursor-pointer'>
            General
          </p>
        </div>
        <div className={`${switched == 'team' ? ' border-r-2 border-[#237804] text-[#237804]' : ''} w-full mt-3`}>
          <p
            onClick={
              () => {
                setSwitched('team');
                context.setToggle?.('team')
              }}
            className='text-left ml-10 cursor-pointer'>
            Team
          </p>
        </div>
        <div className={`${switched == 'billing' ? ' border-r-2 border-[#237804] text-[#237804]' : ''} w-full mt-3`}>
          <p
            onClick={
              () => {
                setSwitched('billing');
                context.setToggle?.('billing')
              }}
            className='text-left ml-10 cursor-pointer'>
            Billing
          </p>
        </div>
        <div className={`${switched == 'security' ? ' border-r-2 border-[#237804] text-[#237804]' : ''} w-full mt-3`}>
          <p
            onClick={
              () => {
                setSwitched('security');
                context.setToggle?.('security')
              }}
            className='text-left ml-10 cursor-pointer'>
            Security
          </p>
        </div>
        <div className={`${switched == 'API' ? ' border-r-2 border-[#237804] text-[#237804]' : ''} w-full mt-3`}>
          <p
            onClick={
              () => {
                setSwitched('API');
                context.setToggle?.('API')
              }}
            className='text-left ml-10 cursor-pointer'>
            API
          </p>
        </div>
        <div className={`${switched == 'apps' ? ' border-r-2 border-[#237804] text-[#237804]' : ''} w-full mt-3`}>
          <p
            onClick={
              () => {
                setSwitched('apps');
                context.setToggle?.('apps')
              }}
            className='text-left ml-10 cursor-pointer'>
            Apps
          </p>
        </div>
        <div className={`${switched == 'notification' ? ' border-r-2 border-[#237804] text-[#237804]' : ''} w-full mt-3`}>
          <p
            onClick={
              () => {
                setSwitched('notification');
                context.setToggle?.('notification')
              }}
            className='text-left ml-10 cursor-pointer'>
            Notifications
          </p>
        </div>
        <div className={`${switched == 'logs' ? ' border-r-2 border-[#237804] text-[#237804]' : ''} w-full mt-3`}>
          <p
            onClick={
              () => {
                setSwitched('logs');
                context.setToggle?.('logs')
              }}
            className='text-left ml-10 cursor-pointer'>
            Logs
          </p>
        </div>
      </div >
    </div >

  )
}
export default Tabs