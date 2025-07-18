import { useContext } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { usePathname } from 'next/navigation';
import Icon from '@potta/components/icon_fonts/icon';
import { ContextData } from '@potta/components/context';
import { svgIcons } from '@potta/components/svg_icons/IconsSvg';
import {
  CreditCard,
  Banknote,
  Ticket,
  ShoppingCart,
  FileText,
  Shield,
  PieChart,
  Wallet,
  Users,
} from 'lucide-react';

const settingsRoutes = [
  { value: 'accounts', label: 'Accounts', icon: Wallet },
  // { value: 'reports', label: 'Reports', icon: PieChart },
  { value: 'payments', label: 'Payments', icon: CreditCard },
  { value: 'expenses', label: 'Expenses', icon: Banknote },
  { value: 'vouchers', label: 'Vouchers', icon: Ticket },
  { value: 'pos', label: 'POS', icon: ShoppingCart },
  { value: 'invoice', label: 'Invoice', icon: FileText },
  // { value: 'taxation', label: 'Taxation', icon: Shield },
  { value: 'payroll', label: 'Payroll', icon: Users },
];

const SidebarsSettings = () => {
  const pathname = usePathname();
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
        {settingsRoutes.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = str[1] === item.value;
          return (
            <MenuItem
              key={item.value}
              active={isActive}
              className={`${index === 0 ? 'mt-10' : 'mt-0'}`}
              href={`/${item.value}`}
              icon={
                <IconComponent size={21} color={isActive ? 'white' : 'black'} />
              }
            >
              <h3 className="text-md mt-[2px]">{item.label}</h3>
            </MenuItem>
          );
        })}
      </Menu>
      <div className="absolute cursor-pointer mb-10 ml-6 bottom-0">
        <div className="flex-1 space-y-7 flex-col">
          <Icon
            onClick={() => {
              context?.setToggle && context?.setToggle(!context?.toggle);
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
export default SidebarsSettings;
