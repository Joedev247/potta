import { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { usePathname } from 'next/navigation';
import { ContextData } from '@potta/components/context';
import SidebarProfile from './SidebarProfile';
import Icon from '@potta/components/icon_fonts/icon';
import { MdPolicy } from 'react-icons/md';
import { FaHandHoldingDollar } from 'react-icons/fa6';
import { TbShoppingCartCog } from 'react-icons/tb';

const SidebarsExpenses = () => {
  const pathname = usePathname();
  const string = pathname;
  const str = string.split('/');
  const context = useContext(ContextData);

  return (
    <Sidebar
      collapsedWidth="65px"
      width="200px"
      transitionDuration={500}
      collapsed={context?.toggle}
      toggled={true}
      breakPoint="md"
      className=" relative  h-[100vh] z-30  side "
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
        <MenuItem
          active={
            str[1] == 'account_payables' && str[2] == undefined ? true : false
          }
          className="mt-8  "
          href="/account_payables"
          icon={
            str[1] == 'account_payables' && str[2] == undefined ? (
              <img src="/images/sideExpensesIcons/white/1.svg" />
            ) : (
              <img src="/images/sideDashboardIcons/schedule.svg" />
            )
          }
        >
          {' '}
          <h3 className="text-md mt-[2px]">Dashboard</h3>{' '}
        </MenuItem>
        <MenuItem
          active={str[2] == 'policies' ? true : false}
          className=" "
          href="/account_payables/policies"
          icon={
            str[2] == 'policies' ? (
              <MdPolicy size={24} className="text-white" />
            ) : (
              <MdPolicy size={24} className="text-gray-600" />
            )
          }
        >
          <h3 className="text-md mt-1.5">Policies</h3>
        </MenuItem>
        <MenuItem
          active={str[2] == 'budgets' ? true : false}
          className=""
          href="/account_payables/budgets"
          icon={
            str[2] == 'budgets' ? (
              <img src="/images/sideExpensesIcons/dash.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/white/8.svg" />
            )
          }
        >
          <h3 className="text-md mt-1.5">Budget</h3>
        </MenuItem>
        <SubMenu
          label={<span className="text-md mt-1.5">Procurement</span>}
          icon={
            <TbShoppingCartCog
              size={24}
              className={
                str[2] === 'spend-program' || str[2] === 'purchase'
                  ? 'text-white'
                  : ''
              }
            />
          }
          className={` ${
            str[2] === 'spend-program' || str[2] === 'purchase'
              ? 'active-parent'
              : ''
          }`}
          defaultOpen={str[2] === 'spend-program' || str[2] === 'purchase'}
        >
          <MenuItem
            active={str[2] == 'spend-program'}
            className=""
            href="/account_payables/spend-program"
            icon={
              <FaHandHoldingDollar
                size={24}
                className={`${str[2] === 'spend-program' && 'text-white'}`}
              />
            }
          >
            <h3 className="text-md mt-1.5">Spend Program</h3>
          </MenuItem>
          <MenuItem
            active={str[2] == 'purchase'}
            className=""
            href="/account_payables/purchase"
            icon={
              <img
                src={
                  str[2] === 'purchase'
                    ? '/images/sideExpensesIcons/white/7.svg'
                    : '/images/sideExpensesIcons/white/8.svg'
                }
              />
            }
          >
            <h3 className="text-md mt-1.5">Purchase</h3>
          </MenuItem>
        </SubMenu>

        <MenuItem
          active={str[2] == 're-imbursements' ? true : false}
          className=" "
          href="/account_payables/re-imbursements"
          icon={
            str[2] == 're-imbursements' ? (
              <img src="/images/sideExpensesIcons/white/3.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/retunbook.svg" />
            )
          }
        >
          <h3 className="text-md mt-1.5">ReImbursement</h3>
        </MenuItem>
        <MenuItem
          active={str[2] == 'bills' ? true : false}
          className=" "
          href="/account_payables/bills"
          icon={
            str[2] == 'bills' ? (
              <img src="/images/sideExpensesIcons/white/6.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/book.svg" />
            )
          }
        >
          <h3 className="text-md mt-1.5">Biils </h3>
        </MenuItem>
        {/* <MenuItem
          active={str[1] == 'inbox' ? true : false}
          className=" "
          href="/terminals"
          icon={
            str[2] == 'terminals' ? (
              <img src="/images/sideExpensesIcons/white/3.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/flow.svg" />
            )
          }
        >
          <h3 className="text-md mt-1.5">Terminals</h3>
        </MenuItem> */}
        <MenuItem
          active={str[1] == 'reports' ? true : false}
          className=" "
          href="/reports"
          icon={
            str[2] == 'reports' ? (
              <img src="/images/sideExpensesIcons/white/2.svg" />
            ) : (
              <img src="/images/sideDashboardIcons/dahsboard.svg" />
            )
          }
        >
          <h3 className="text-md mt-1.5">Report</h3>
        </MenuItem>
      </Menu>
      <SidebarProfile context={context} />
    </Sidebar>
  );
};
export default SidebarsExpenses;
