import React from "react"
import Image from "next/image"

type Props = {
  title: string
  image: string
}

const AppCard: React.FC<Props> = ({ image, title }) => {

  return (
    <div className='w-full flex hover:bg-green-100 cursor-pointer mt-20 justify-center primary p-5 '>
      <div>
        <div className='my-10 flex justify-center h-[7vh]'>
          <Image src={image} height={80} width={80} alt="" />
        </div>
        <div className='w-full flex justify-center '>
          <p className='text-lg capitalize'>{title}</p>
        </div>
      </div>
    </div>
  )
}

export default AppCard