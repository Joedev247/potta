
import Search from '../../inputs/search/normalSearch'
import TeamUserModal from '../../modals/teamModal'
import Logs from '../../tables/Logs/data'
import React from 'react'

const Log = () => {
    return (
        <div className='w-full md:px-16   '>
            <div className='flex  justify-between mt-10'>
                <div className='w-1/2'>
                    <Search onchange={() => { }} text={''} value={''} placeholder={'Search for team'} />
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