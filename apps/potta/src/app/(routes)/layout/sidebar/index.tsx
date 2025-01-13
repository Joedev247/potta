
import { ContextData } from '@/components/context';
import { useContext, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, } from 'react-pro-sidebar';
import Icon from '@/components/icon_fonts/icon';
import { usePathname } from 'next/navigation'
import SidebarsPayment from './components/payments';
import SidebarsExpenses from './components/expenses';
import Sidebarsinvoicing from './components/invoicing';
import SidebarsPOS from './components/POS';
import SidebarsTaxation from './components/taxation';
import SidebarsVoucher from './components/voucher';
import SidebarsPayroll from './components/payroll';
const Sidebars = () => {

    const pathname = usePathname()
    const string = pathname
    const str = string.split("/")
    const context = useContext(ContextData)
    console.log(str[1])
    return (
        <>
            {str[1] == undefined && <SidebarsPayment />}
            {str[1] == "payments" && <SidebarsPayment />}
            {str[1] == "expenses" && <SidebarsExpenses />}
            {str[1] == "invoicing" && <Sidebarsinvoicing />}
            {str[1] == "POS" || str[1] == "pos" && <SidebarsPOS />}
            {str[1] == "taxation" && <SidebarsTaxation />}
            {str[1] == "voucher" && <SidebarsVoucher />}
            {str[1] == "vendors" && <SidebarsVoucher />}
            {str[1] == "payroll" && <SidebarsPayroll />}
            {str[1] == "Account" && <SidebarsVoucher />}
        </>
    )
}
export default Sidebars

