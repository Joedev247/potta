import React from 'react'
import { Channel } from 'apps/superApp/src/Arrays/SocialChannels'


const Channels = () => {

  return (
    <div className='h-[80vh] w-full px-12  '>
      <div className='w-full '>
        {Channel.map((item, id) => {
          return (
            <div key={id} className='w-full flex py-2.5 px-12 justify-between p-2 border'>
              <div className='flex space-x-3'>
                <div className='h-16 w-16 rounded-full items-center flex justify-center bg-gray-100'>
                  <img src={`/icons/${item.img}`} height={40} width={40} alt="" />
                </div>
              </div>
              <div className='flex space-x-3'>
                <div className='mt-4 '>
                  {item.connect ? <i className="ri-close-circle-fill text-red-700 text-xl cursor-pointer"></i> : ''}
                </div>
                <div className='mt-3'>
                  {!item.connect ? <button className={`flex bg-black px-4 py-1 space-x-2 text-white`}><i className="ri-link-unlink  "></i><p className='mt-0.5'>Connect</p></button> :
                    <button className={`flex bg-green-500 px-4 py-1 space-x-2 text-white`}><i className="ri-checkbox-circle-fill  "></i><p className='mt-0.5'>Connected</p></button>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default Channels