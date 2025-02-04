import { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { usePathname } from 'next/navigation';
import { ContextData } from '@potta/components/context';
import Icon from '@potta/components/icon_fonts/icon';
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
      className=" relative bg-blue-500  h-[100vh] z-30  side "
    >
      <Menu className="relative h-[76vh]" closeOnClick>
        <MenuItem
          className="mt-4 font-thin"
          href="/"
          icon={<img src="/icons/Potta.svg" className="h-10 mt-2" alt="" />}
        >
          {' '}
        </MenuItem>
        <MenuItem
          active={str[1] == 'expenses' && str[2] == undefined ? true : false}
          className="mt-8  "
          href="/expenses"
          icon={
            str[1] == 'expenses' && str[2] == undefined ? (
              <img src="/images/sideExpensesIcons/white/1.svg" />
            ) : (
              <img src="/images/sideDashboardIcons/schedule.svg" />
            )
          }
        >
          {' '}
          <h3 className="text-lg mt-[2px]">Dashboard</h3>{' '}
        </MenuItem>
        <MenuItem
          active={str[2] == 'budgets' ? true : false}
          className="mt-5 "
          href="/expenses/budgets"
          icon={
            str[2] == 'budgets' ? (
              <img src="/images/sideExpensesIcons/dash.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/white/8.svg" />
            )
          }
        >
          <h3 className="text-lg mt-1.5">Budget</h3>
        </MenuItem>
        <MenuItem
          active={str[1] == 'inbox' ? true : false}
          className="mt-5 "
          href="/transactions"
          icon={
            str[2] == 'transactions' ? (
              <img src="/images/sideExpensesIcons/white/5.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/transact.svg" />
            )
          }
        >
          <h3 className="text-lg mt-1.5">Transaction</h3>
        </MenuItem>
        <MenuItem
          active={str[1] == 'inbox' ? true : false}
          className="mt-5 "
          href="/terminals"
          icon={
            str[2] == 'terminals' ? (
              <img src="/images/sideExpensesIcons/white/3.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/flow.svg" />
            )
          }
        >
          <h3 className="text-lg mt-1.5">Procurement</h3>
        </MenuItem>
        <MenuItem
          active={str[1] == 'inbox' ? true : false}
          className="mt-5 "
          href="/re-imbursement"
          icon={
            str[2] == 're-imbursement' ? (
              <img src="/images/sideExpensesIcons/white/4.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/retunbook.svg" />
            )
          }
        >
          <h3 className="text-lg mt-1.5">ReImbursement</h3>
        </MenuItem>
        <MenuItem
          active={str[1] == 'inbox' ? true : false}
          className="mt-5 "
          href="/bills"
          icon={
            str[2] == 'bills' ? (
              <img src="/images/sideExpensesIcons/white/6.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/book.svg" />
            )
          }
        >
          <h3 className="text-lg mt-1.5">Cards </h3>
        </MenuItem>
        <MenuItem
          active={str[1] == 'inbox' ? true : false}
          className="mt-5 "
          href="/procurement"
          icon={
            str[2] == 'procurement' ? (
              <img src="/images/sideExpensesIcons/white/7.svg" />
            ) : (
              <img src="/images/sideExpensesIcons/shopping.svg" />
            )
          }
        >
          <h3 className="text-lg mt-1.5">Terminals</h3>
        </MenuItem>
        <MenuItem
          active={str[1] == 'inbox' ? true : false}
          className="mt-5 "
          href="/reports"
          icon={
            str[2] == 'reports' ? (
              <img src="/images/sideExpensesIcons/white/2.svg" />
            ) : (
              <img src="/images/sideDashboardIcons/dahsboard.svg" />
            )
          }
        >
          <h3 className="text-lg mt-1.5">Report</h3>
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
export default SidebarsExpenses;
