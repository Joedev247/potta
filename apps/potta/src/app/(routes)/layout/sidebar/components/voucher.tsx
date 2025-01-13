
import { ContextData } from '@/components/context';
import { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, } from 'react-pro-sidebar';
import Icon from '@/components/icon_fonts/icon';
import { usePathname } from 'next/navigation'
const SidebarsVoucher = () => {

    const pathname = usePathname()
    const string = pathname
    const str = string.split("/")
    const context = useContext(ContextData)

    return (
        <Sidebar collapsedWidth='65px' width='180px' transitionDuration={500} collapsed={context?.toggle} toggled={true} breakPoint="md" className=' relative h-[100vh] z-30  side '>
            <Menu className='relative h-[76vh]' closeOnClick>
                <MenuItem className='mt-4 font-thin' href='/' icon={<img src="/icons/Potta.svg" className='h-10 mt-2' alt="" />} > </MenuItem>
                <MenuItem active={str[1] == 'dashboard' ? true : false} className='mt-8  font-thin' href='/dashboard' icon={<Icon icon="Pie-Chart-2" size={23} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} > <h3 className='text-lg mt-[2px]'>Payments</h3> </MenuItem>
                <MenuItem active={str[1] == 'inbox' ? true : false} className='mt-4 font-thin' href='/inbox' icon={<Icon icon="Open-Mail" size={21} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} ><h3 className='text-lg mt-1.5'>Cancelled</h3></MenuItem>
                <MenuItem active={str[1] == 'inbox' ? true : false} className='mt-4 font-thin' href='/inbox' icon={<Icon icon="Open-Mail" size={21} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} ><h3 className='text-lg mt-1.5'>Failed</h3></MenuItem>
                <MenuItem active={str[1] == 'inbox' ? true : false} className='mt-4 font-thin' href='/inbox' icon={<Icon icon="Open-Mail" size={21} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} ><h3 className='text-lg mt-1.5'>Terminals</h3></MenuItem>
                <MenuItem active={str[1] == 'inbox' ? true : false} className='mt-4 font-thin' href='/inbox' icon={<Icon icon="Open-Mail" size={21} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} ><h3 className='text-lg mt-1.5'>Report</h3></MenuItem>
            </Menu>
            <div className='absolute cursor-pointer mb-10 ml-6 bottom-0'>
                <div className='flex-1 space-y-7 flex-col'>
                    <Icon onClick={() => { context?.setToggle(!context?.toggle) }} icon="Menu-1" size={23} />
                    <div className='flex space-x-5'>
                        <img src="/icons/user.svg" className='h-10 w-10 -ml-2' alt="" />
                        <p className='mt-2 text-lg ml-3 font-thin'>Jamison</p>
                    </div>
                </div>
            </div>
        </Sidebar>
    )
}
export default SidebarsVoucher

