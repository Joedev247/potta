import { useContext } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@potta/components/icon_fonts/icon';
import { ContextData } from '@potta/components/context';
import { SiDatabricks } from 'react-icons/si';
import { svgIcons } from '@potta/components/svg_icons/IconsSvg';
import { LuChartPie } from 'react-icons/lu';
import { PiCubeFocusLight } from 'react-icons/pi';

const SidebarsReports = () => {
  const pathname = usePathname();
  const router = useRouter();
  const str = pathname.split('/');
  const context = useContext(ContextData);

  return (
    <Sidebar
      collapsedWidth="65px"
      width="180px"
      transitionDuration={500}
      collapsed={context?.toggle}
      toggled={true}
      breakPoint="md"
      className="relative bg-blue-500 h-[100vh] z-30 side"
    >
      <Menu className="relative h-[76vh]" closeOnClick>
        <MenuItem
          className="font-thin"
          href="/"
          icon={
            <img src="/icons/Potta.svg" className="h-16 w-16 mt-2" alt="logo" />
          }
        >
          {' '}
        </MenuItem>
        <MenuItem
          active={str[1] === 'reports' && !str[2]}
          className="mt-8"
          href="/reports"
          icon={
            <LuChartPie
              size={21}
              color={str[1] == 'reports' && !str[2] ? 'white' : 'black'}
            />
          }
        >
          <h3 className="text-md mt-[2px]">Reports</h3>
        </MenuItem>
        <MenuItem
          active={str[1] === 'reports' && str[2] === 'models'}
          className=""
          href="/reports/models"
          icon={
            <PiCubeFocusLight
              size={21}
              color={str[1] == 'reports' && str[2] === 'models' ? 'white' : 'black'}
            />
          }
        >
          <h3 className="text-md mt-1.5">Models</h3>
        </MenuItem>
        <MenuItem
          active={str[1] === 'reports' && str[2] === 'data'}
          className=""
          href="/reports/data"
          icon={
            <SiDatabricks
              size={21}
              color={
                str[1] == 'reports' && str[2] == 'data' ? 'white' : 'black'
              }
            />
          }
        >
          <h3 className="text-md mt-1.5">Data Tables</h3>
        </MenuItem>
      </Menu>
      <div className="absolute cursor-pointer mb-10 ml-6 bottom-0">
        <div className="flex-1 space-y-7 flex-col">
          <Icon
            onClick={() => {
              context?.setToggle && context.setToggle(!context.toggle);
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

export default SidebarsReports;
