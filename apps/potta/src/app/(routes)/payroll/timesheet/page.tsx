import react from 'react'
import RootLayout from '../../layout'
import Boxes from './components/boxes'
import TimesheetTable from './components/table'

const Timesheet = () => {
    return (
        <RootLayout>
            <div className='px-14 pt-10'>
                <Boxes />
                <TimesheetTable />
            </div>

        </RootLayout>
    )
}
export default Timesheet