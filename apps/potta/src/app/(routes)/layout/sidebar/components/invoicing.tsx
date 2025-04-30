import { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { usePathname } from 'next/navigation';
import { ContextData } from '@potta/components/context';
import Icon from '@potta/components/icon_fonts/icon';
import { ChartPie, CircleDollarSign, Inbox, RefreshCw, Users } from 'lucide-react';
const Sidebarsinvoicing = () => {
  const pathname = usePathname();
  const string = pathname;
  const str = string.split('/');
  const context = useContext(ContextData);
  const isActive = (path: any) => {
    return pathname.startsWith(path);
  };
  return (
    <Sidebar
      collapsedWidth="65px"
      width="180px"
      transitionDuration={500}
      collapsed={context?.toggle}
      toggled={true}
      breakPoint="md"
      className=" relative bg-blue-500  h-[100vh] z-30  side "
    >
      <Menu className="relative h-[76vh]" closeOnClick>
      <MenuItem
          className="mt-4 font-thin flex justify-center"
          href="/"
          icon={<img src="/icons/Potta.svg" className="h-16 w-16 mt-2" alt="logo" />}
        >
          {' '}
         
        </MenuItem>
        <MenuItem
          active={str[1] == 'invoice' && str[2] == undefined || str[2] == 'new' ? true : false}
          className="mt-8  font-thin"
          href="/invoice"
          icon={
            <Icon
              icon="file-invoice-dollar"
              size={23}
              color={
                str[1] == 'invoice' && str[2] == undefined || str[1] == undefined || str[1] == '' || str[2] == 'new'
                  ? 'white'
                  : 'black'
              }
            />
          }
        >
          {' '}
          <h3 className="text-lg mt-[2px]">Invoice</h3>{' '}
        </MenuItem>
        <MenuItem
          active={isActive('/invoice/estimates')}
          className='mt-5'
          href='/invoice/estimates'
          icon={<CircleDollarSign className={`h-6 w-6 ${isActive('/invoice/estimates') ? 'text-white' : 'text-gray-900'}`} />}
        >
          <h3 className='text-lg mt-1.5'>Estimates</h3>
        </MenuItem>
        <MenuItem
          active={isActive('/invoice/recurring')}
          className='mt-5'
          href='/invoice/recurring'
          icon={<RefreshCw className={`h-6 w-6 ${isActive('/invoice/recurring') ? 'text-white' : 'text-gray-900'}`} />}
        >
          <h3 className='text-lg mt-1.5'>Reports</h3>
        </MenuItem>
        <MenuItem
          active={isActive('/invoice/reports')}
          className='mt-5'
          href='/invoice/reports'
          icon={<ChartPie className={`h-6 w-6 ${isActive('/invoice/reports') ? 'text-white' : 'text-gray-900'}`} />}
        >
          <h3 className='text-lg mt-1.5'>Reports</h3>
        </MenuItem>
        <MenuItem
          active={isActive('/invoice/customers')}
          className='mt-5'
          href='/invoice/customers'
          icon={<Users className={`h-6 w-6 ${isActive('/invoice/customers') ? 'text-white' : 'text-gray-900'}`} />}
        >
          <h3 className='text-lg mt-1.5'>Customers</h3>
        </MenuItem>

        {/* Inbox */}
        <MenuItem
          active={isActive('/invoice/inbox')}
          className='mt-5'
          href='/invoice/inbox'
          icon={<Inbox className={`h-6 w-6 ${isActive('/invoice/inbox') ? 'text-white' : 'text-gray-900'}`} />}
        >
          <h3 className='text-lg mt-1.5'>Inbox</h3>
        </MenuItem>
        
      </Menu>
      <div className="absolute cursor-pointer mb-10 ml-6 bottom-0">
        <div className="flex-1 space-y-7 flex-col">
          <Icon
            onClick={() => {
              context?.setToggle(!context?.toggle);
            }}
            icon="Menu-1"
            size={23}
          />
          <div className="flex space-x-5">
            <img src="/icons/user.svg" className="h-10 w-10 -ml-2" alt="" />
            <p className="mt-2 text-lg ml-3 font-thin">Jamison</p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};
export default Sidebarsinvoicing;
