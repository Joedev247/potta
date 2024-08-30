import React from 'react'
import toast from 'react-hot-toast'
import CopyIcon from 'apps/superApp/src/components/icons/copyIcon'

const API = () => {
  const message = (info: string) => {
    toast.success(info)
  }

  return (
    <div className='w-full lg:w-[60%] 2xl:w-[40%] md:px-16 mt-10 relative'>
      <div className='mt-5'>
        <label htmlFor="">Base Url</label>
        <div className="relative rounded-md shadow-sm mt-1">
          <input
            id=""
            value=""
            disabled
            placeholder={'https://baseurl.com/9876'}
            className={`w-full py-2.5 border outline-none pl-3 ui-input`}
          />
          <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => message("Base Url copied")}>
            <CopyIcon width='24px' height='24px' className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className='mt-5'>
        <label htmlFor="">API Keys</label>
        <div className="relative rounded-md shadow-sm mt-1">
          <input
            id=""
            value=""
            disabled
            placeholder={'gasdfuejeooisiefjsdg'}
            className={`w-full py-2.5 border outline-none pl-3 ui-input`}
          />
          <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => message("Api key copied")}>
            <CopyIcon width='24px' height='24px' className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default API