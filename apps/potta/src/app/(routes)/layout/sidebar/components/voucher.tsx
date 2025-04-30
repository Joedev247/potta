import { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { usePathname } from 'next/navigation';
import Icon from '@potta/components/icon_fonts/icon';
import { ContextData } from '@potta/components/context';
import { BadgePercent, ChartPie, Coins, Gift, Tickets, Users } from 'lucide-react';
const SidebarsVoucher = () => {
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
      className=" relative h-[100vh] z-30  side "
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
          active={str[1] == 'vouchers' ? true : false}
          className="mt-8  font-thin"
          href="/vouchers"
          icon={
          
          <BadgePercent className={`h-6 w-6 ${str[1] == 'vouchers'  ? 'text-white' : 'text-black'}`} />
          }
        >
          {' '}
          <h3 className="text-lg mt-[2px]">Vouchers</h3>{' '}
        </MenuItem>
        <MenuItem
          active={str[1] == 'inbox' ? true : false}
          className="mt-4 font-thin"
          href="/vouchers/tickets"
          icon={
            <Tickets className={`h-6 w-6 ${isActive('/vouchers/tickets') ? 'text-white' : 'text-black'}`} />
          }
        >
          <h3 className="text-lg mt-1.5">Tickets</h3>
        </MenuItem>
        <MenuItem
          active={str[1] == 'inbox' ? true : false}
          className="mt-4 font-thin"
          href="/vouchers/royalty"
          icon={
            <Coins className={`h-6 w-6 ${str[1] == 'vouchers' && str[2] == 'coupons' ? 'text-white' : 'text-black'}`} />
          }
        >
          <h3 className="text-lg mt-1.5">Royalty Points</h3>
        </MenuItem>
        <MenuItem
          active={isActive('/pos/customers')}
          className='mt-5'
          href='/vouchers/customers'
          icon={<Users className={`h-6 w-6 ${isActive('/vouchers/customers') ? 'text-white' : 'text-black'}`} />}
        >
          <h3 className='text-lg mt-1.5'>Customers</h3>
        </MenuItem>
        <MenuItem
          active={isActive('/invoice/reports')}
          className='mt-5'
          href='/vouchers/reports'
          icon={<ChartPie className={`h-6 w-6 ${isActive('/vouchers/reports') ? 'text-white' : 'text-black'}`} />}
        >
          <h3 className='text-lg mt-1.5'>Reports</h3>
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
export default SidebarsVoucher;
