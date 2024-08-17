import { FC } from 'react'
import Ads from 'apps/superApp/src/components/tables/Ads/data'

const Ad: FC = () => {
  return (
    <div className=' '>
      <div className='mt-2'>
        <h3 className='text-2xl mb-2'>Ads</h3>
        <Ads />
      </div>
    </div>
  )
}
export default Ad