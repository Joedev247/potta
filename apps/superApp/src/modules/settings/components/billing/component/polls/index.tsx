import { FC } from 'react'
import PublishingCost from 'apps/superApp/src/components/tables/PublishingCost/data'

const Polls: FC = () => {
  return (
    <div className=' '>
      <div className='mt-2'>
        <h3 className='text-2xl mb-2'>Publishing Cost</h3>
        <PublishingCost />
      </div>
    </div>
  )
}
export default Polls