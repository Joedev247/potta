import { ContextData } from '../../../../../components/context';
import { useContext } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import Icon from '../../../../../components/icon_fonts/icon';
import { usePathname } from 'next/navigation';
import { Home, ScrollText, Menu as MenuIcon } from 'lucide-react';

const SidebarsAccounts = () => {
  const pathname = usePathname();
  const string = pathname;
  const pathParts = pathname.split('/');
  const context = useContext(ContextData);
  const isActive = (path: any) => {
    return pathname.startsWith(path);
  };

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
          className="mt-4 font-thin "
          href="/"
          icon={
            <img src="/icons/Potta.svg" className="h-16 w-16 mt-2" alt="logo" />
          }
        >
          {' '}
        </MenuItem>
        {/* Dashboard */}
        <MenuItem
          active={isActive('/accounts') && pathParts.length === 2}
          className="mt-8"
          href="/accounts"
          icon={
            <Home
              className={`h-6 w-6 ${
                isActive('/accounts') && pathParts.length === 2
                  ? 'text-white'
                  : 'text-gray-500'
              }`}
            />
          }
        >
          <h3 className="text-lg mt-[2px]">Accounts</h3>
        </MenuItem>

        {/* Journal */}
        <MenuItem
          active={isActive('/accounts/journals')}
          className="mt-4"
          href="/accounts/journals"
          icon={
            <ScrollText
              className={`h-6 w-6 ${
                isActive('/accounts/journals') ? 'text-white' : 'text-gray-500'
              }`}
            />
          }
        >
          <h3 className="text-lg mt-[2px]">Journals</h3>
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
export default SidebarsAccounts;
