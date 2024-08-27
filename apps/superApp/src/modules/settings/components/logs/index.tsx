import { FC } from 'react'
import { Search } from '@instanvi/ui-components'
import Logs from 'apps/superApp/src/components/tables/Logs/data'
import TeamUserModal from 'apps/superApp/src/components/modals/teamModal'

const Log: FC = () => {
  return (
    <div className='w-full md:px-16   '>
      <div className='flex  justify-between mt-10'>
        <div className='w-1/2'>
          <Search placeholder={'Search for team'} />
        </div>
        <TeamUserModal />
      </div>
      <div className='w-full mt-5'>
        <Logs />
      </div>
    </div>

  )
}
export default Log