import { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { usePathname } from 'next/navigation';
import Icon from '@potta/components/icon_fonts/icon';
import { ContextData } from '@potta/components/context';
import { Heart, Clock } from 'lucide-react';
import { svgIcons } from '@potta/components/svg_icons/IconsSvg';

const SidebarsPayroll = () => {
  const pathname = usePathname();
  const string = pathname;
  const str = string.split('/');
  console.log(str[1]);

  const context = useContext(ContextData);

  return (
    <Sidebar
      collapsedWidth="65px"
      width="200px"
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
          active={str[2] == 'overview' ? true : false}
          className="mt-8   font-thin"
          href="/payroll/overview"
          icon={svgIcons.dashboard(str[2] == 'overview' ? 'white' : 'black')}
        >
          {' '}
          <h3 className="text-md mt-[2px]">Dashboard</h3>{' '}
        </MenuItem>
        <MenuItem
          active={str[2] == 'people' ? true : false}
          className="mt-4 font-thin"
          href="/payroll/people"
          icon={svgIcons.users(str[2] == 'people' ? 'white' : 'black')}
        >
          <h3 className="text-md ">People</h3>
        </MenuItem>

        {/* Time Management with submenu */}
        <SubMenu
          label={<h3 className="text-md">Time Management</h3>}
          icon={svgIcons.clock(
            str[2] == 'timesheet' || str[2] == 'shifts' ? 'black' : 'black'
          )}
          className={`mt-4 font-thin ${
            str[2] == 'timesheet' || str[2] == 'shifts' ? 'active-submenu' : ''
          }`}
          defaultOpen={str[2] == 'timesheet' || str[2] == 'shifts'}
        >
          <MenuItem
            active={str[2] == 'timesheet' ? true : false}
            className="pl-6 font-thin"
            href="/payroll/timesheet"
          >
            <h3 className="text-md">Timesheet</h3>
          </MenuItem>
          <MenuItem
            active={str[2] == 'shifts' ? true : false}
            className="pl-6 font-thin"
            href="/payroll/shifts"
          >
            <h3 className="text-md">Shifts</h3>
          </MenuItem>
        </SubMenu>

        <MenuItem
          active={str[2] == 'benefit' ? true : false}
          className="mt-4 font-thin"
          href="/payroll/benefit"
          icon={
            <Heart size={21} color={str[2] == 'benefit' ? 'white' : 'black'} />
          }
        >
          <h3 className="text-md ">Benefit</h3>
        </MenuItem>

        <MenuItem
          active={str[2] == 'pto' ? true : false}
          className="mt-4 font-thin"
          href="/payroll/pto"
          icon={svgIcons.pto(str[2] == 'pto' ? 'white' : 'black')}
        >
          <h3 className="text-md ">PTO</h3>
        </MenuItem>
        <MenuItem
          active={str[2] == 'reports' ? true : false}
          className="mt-4 font-thin"
          href="/payroll/reports"
          icon={svgIcons.piechart(str[2] == 'reports' ? 'white' : 'black')}
        >
          <h3 className="text-md ">Reports</h3>
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
            <p className="mt-2 text-md ml-3 font-thin">Jamison</p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarsPayroll;
