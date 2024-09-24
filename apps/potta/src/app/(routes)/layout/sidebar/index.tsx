import { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, } from 'react-pro-sidebar';

import { usePathname } from 'next/navigation'
import Icon from 'apps/potta/src/components/icon_fonts/icon';
import { ContextData } from 'apps/potta/src/components/context';

const Sidebars = () => {

    const pathname = usePathname()
    const string = pathname
    const str = string.split("/")
    const context = useContext(ContextData)

    return (
        <Sidebar collapsedWidth='75px' width='190px' transitionDuration={500} collapsed={context?.toggle} toggled={true} breakPoint="md" className=' relative bg-blue-500  h-[100vh] z-30  side '>
            <Menu className='relative h-[76vh]' closeOnClick>
                <MenuItem className='mt-4 font-thin' href='/' icon={<img src="/icons/Potta.svg" className='h-10 mt-2' alt="" />} > </MenuItem>
                <MenuItem active={str[1] == 'dashboard' ? true : false} className='mt-8  font-thin' href='/dashboard' icon={<Icon icon="Pie-Chart-2" size={23} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} > <h3 className='text-lg mt-[2px]'>Dashboard</h3> </MenuItem>
                <MenuItem active={str[1] == 'inbox' ? true : false} className='mt-4 font-thin' href='/inbox' icon={<Icon icon="Open-Mail" size={21} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} ><h3 className='text-lg mt-1.5'>Inbox</h3></MenuItem>
                <SubMenu label="Payables" active={str[1] == 'payables' ? true : false} className='mt-4 font-thin' icon={<Icon icon="Banknote" size={23} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} >
                    <MenuItem href='/connections'>
                        <div className='w-full flex space-x-2'>
                            {/* <ConnectionIcon height={'20'} width={'20'} color={""} /> */}
                            <p className=''>Approval</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/payables/budgets'>
                        <div className='w-full flex space-x-2'>
                            {/* <DatasetIcon height={'20'} width={'20'} color={"black"} /> */}
                            <p className=' '>Budgets</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/payables/cards'>
                        <div className='w-full flex space-x-2'>
                            {/* <QuestionIcon height={'14'} width={'14'} color={""} /> */}
                            <p className='-mt-1'>Cards</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/questions'>
                        <div className='w-full flex space-x-2'>
                            {/* <QuestionIcon height={'14'} width={'14'} color={""} /> */}
                            <p className='-mt-1'>Vendors</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/questions'>
                        <div className='w-full flex space-x-2'>
                            {/* <QuestionIcon height={'14'} width={'14'} color={""} /> */}
                            <p className='-mt-1'>Purchace Orders</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/questions'>
                        <div className='w-full flex space-x-2'>
                            {/* <QuestionIcon height={'14'} width={'14'} color={""} /> */}
                            <p className='-mt-1'>Disbursement</p>
                        </div>
                    </MenuItem>
                </SubMenu>
                <SubMenu label="Receivables" className='mt-4 font-thin' icon={<Icon icon="Giving-Gift" size={23} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} >
                    <MenuItem href='/tags'>
                        <div className='w-full flex space-x-2'>
                            {/* <ProjectIcon height={'14'} width={'14'} color={"#154406"} /> */}
                            <p className='-mt-1'>Invoices</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/segments'>
                        <div className='w-full flex space-x-2'>
                            {/* <ProjectIcon height={'14'} width={'14'} color={"#154406"} /> */}
                            <p className='-mt-1'>Vouchers</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/broadcast'>
                        <div className='w-full flex space-x-2'>
                            {/* <ProjectIcon height={'14'} width={'14'} color={"#154406"} /> */}
                            <p className='-mt-1'>Customers</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/broadcast'>
                        <div className='w-full flex space-x-2'>
                            {/* <ProjectIcon height={'14'} width={'14'} color={"#154406"} /> */}
                            <p className='-mt-1'>Collection</p>
                        </div>
                    </MenuItem>

                </SubMenu>
                <MenuItem className='mt-4 font-thin' href='/audience' icon={<Icon icon="Microphone-2" size={23} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} ><h3 className='text-lg'>Inventory</h3></MenuItem>
                <MenuItem className='mt-4' href='/audience' icon={<Icon icon="Note-Book" size={23} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} ><h3 className='text-lg font-thin'>Report</h3></MenuItem>
                <SubMenu label="Settings" className='mt-4 font-thin' icon={<Icon icon="Preferences-1" size={23} color={str[1] == "analytics" || str[1] == undefined || str[1] == "" ? "white" : "black"} />} >
                    <MenuItem href='/connections'>
                        <div className='w-full flex space-x-2'>
                            {/* <ConnectionIcon height={'20'} width={'20'} color={""} /> */}
                            <p className=''>Policies</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/dataset'>
                        <div className='w-full flex space-x-2'>
                            {/* <DatasetIcon height={'20'} width={'20'} color={"black"} /> */}
                            <p className=' '>Branches</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/questions'>
                        <div className='w-full flex space-x-2'>
                            {/* <QuestionIcon height={'14'} width={'14'} color={""} /> */}
                            <p className='-mt-1'>Account</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/questions'>
                        <div className='w-full flex space-x-2'>
                            {/* <QuestionIcon height={'14'} width={'14'} color={""} /> */}
                            <p className='-mt-1'>General Settings</p>
                        </div>
                    </MenuItem>
                    <MenuItem href='/questions'>
                        <div className='w-full flex space-x-2'>
                            {/* <QuestionIcon height={'14'} width={'14'} color={""} /> */}
                            <p className='-mt-1'>Teams</p>
                        </div>
                    </MenuItem>
                </SubMenu>
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
export default Sidebars

